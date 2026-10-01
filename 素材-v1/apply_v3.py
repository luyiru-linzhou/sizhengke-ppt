# -*- coding: utf-8 -*-
"""Round-5: apply 文案-v3 to V2 without touching its design.

V2 is built one-shape-per-line, so text can be swapped by exact old-string match;
layout, colours, fonts, pictures and the 描红格 all stay untouched.

Three structural moves beyond text swap:
  1. insert a new slide at position 4 — 《她是谁》— cloned from slide6 (same layout,
     pictures stripped, the white card line recoloured) because the audience must
     know who she is before "3 人出发" means anything;
  2. renumber every 密 · NN footer for the new 14-page order;
  3. append extra lines where the deck was too sparse to follow.
"""
import os, re, shutil, copy
from lxml import etree

SRC_PPTX = r'C:\Users\29264\Desktop\思政课ppt\誓与密码共存亡-v2.pptx'
UNPACKED = r'C:\Users\29264\Desktop\思政课ppt\素材-v1\skills-unpacked'
WORK     = r'C:\Users\29264\Desktop\思政课ppt\素材-v1\work-v3'
OUT      = r'C:\Users\29264\Desktop\思政课ppt\素材-v1\out\誓与密码共存亡-v3.pptx'

A = 'http://schemas.openxmlformats.org/drawingml/2006/main'
P = 'http://schemas.openxmlformats.org/presentationml/2006/main'
R = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
CT = 'http://schemas.openxmlformats.org/package/2006/content-types'
NS = {'a': A, 'p': P, 'r': R}
DRAWING_LOCALS = {'t', 'p', 'r', 'rPr', 'solidFill', 'srgbClr', 'latin', 'ea',
                  'xfrm', 'off', 'ext', 'buNone', 'pPr', 'alpha', 'schemeClr'}


def q(tag):
    """Accept 'p:sp' or a bare local name; bare names default to the DrawingML
    namespace for the handful of tags we touch, PresentationML otherwise."""
    if ':' in tag:
        pre, local = tag.split(':')
    else:
        pre, local = ('a' if tag in DRAWING_LOCALS else 'p'), tag
    return '{%s}%s' % (NS[pre], local)


def load(n):
    return etree.parse(os.path.join(WORK, 'ppt', 'slides', 'slide%d.xml' % n))


def save(n, t):
    t.write(os.path.join(WORK, 'ppt', 'slides', 'slide%d.xml' % n),
            xml_declaration=True, encoding='UTF-8', standalone=True)


def shapes(root):
    return [sp for sp in root.iter(q('sp')) if sp.find(q('txBody'), NS) is not None]


def text_of(sp):
    tb = sp.find(q('txBody'), NS)
    return ''.join(t.text or '' for t in tb.iter(q('t')))


def set_text(sp, s, color=None, size=None):
    """Keep the first run's formatting; drop the rest."""
    tb = sp.find(q('txBody'), NS)
    paras = tb.findall(q('p'))
    base = paras[0]
    runs = base.findall(q('r'))
    if not runs:
        return
    keep = runs[0]
    for extra in runs[1:]:
        base.remove(extra)
    for later in paras[1:]:
        tb.remove(later)
    for t in keep.iter(q('t')):
        t.text = s
    rpr = keep.find(q('rPr'))
    if rpr is not None:
        if size:
            rpr.set('sz', str(int(size * 100)))
        if color:
            for sf in rpr.findall(q('solidFill')):
                rpr.remove(sf)
            sf = etree.Element(q('solidFill'))
            c = etree.SubElement(sf, q('srgbClr'))
            c.set('val', color)
            rpr.insert(0, sf)          # solidFill must precede latin/ea


def offset(sp):
    x = sp.find('.//' + q('xfrm'), NS)
    return x


def move(sp, dy):
    off = sp.find('.//' + q('off'), NS)
    if off is not None:
        off.set('y', str(int(off.get('y')) + dy))


def height(sp):
    ext = sp.find('.//' + q('ext'), NS)
    return int(ext.get('cy')) if ext is not None else 200000


def patch(n, mapping, additions=(), shift_from=None, shift_dy=0):
    """mapping: {old_substring: (new_text, {attrs})}; additions: list of dicts."""
    t = load(n)
    root = t.getroot()
    sps = shapes(root)
    hit = set()
    for sp in sps:
        cur = text_of(sp)
        for old, new in mapping.items():
            if old in cur and old not in hit:
                hit.add(old)
                if isinstance(new, tuple):
                    set_text(sp, new[0], color=new[1].get('color'), size=new[1].get('size'))
                else:
                    set_text(sp, new)
                break
        if shift_from and cur.startswith(shift_from):
            move(sp, shift_dy)
    missing = [k for k in mapping if k not in hit]
    if missing:
        print('  !! slide%d unmatched: %s' % (n, missing))
    for add in additions:
        tpl = [s for s in sps if text_of(s).startswith(add['clone_of'])]
        if not tpl:
            print('  !! slide%d no clone template %r' % (n, add['clone_of'])); continue
        new = copy.deepcopy(tpl[0])
        tpl[0].addnext(new)
        # cloned shapes inherit a duplicate cNvPr/@id — PowerPoint can refuse the file
        allids = [int(c.get('id')) for c in root.iter(q('p:cNvPr')) if c.get('id', '').isdigit()]
        cnv = new.find('.//' + q('p:cNvPr'))
        if cnv is not None and allids:
            cnv.set('id', str(max(allids) + 1))
        set_text(new, add['text'], color=add.get('color'), size=add.get('size'))
        move(new, add['dy'])
    save(n, t)
    print('   patched slide%d (%d rules)' % (n, len(mapping)))


# ---------------------------------------------------------------- work copy
if os.path.exists(WORK):
    shutil.rmtree(WORK)
shutil.copytree(UNPACKED, WORK)
print('work copy ready')

# ---------------------------------------------------------------- 1 封面
patch(1, {
    '思政课 · 我来讲': '思政课 · 我来讲 ｜ 红色名言解读',
    '—— 中共中央社会部': '—— 董健民（1923—1946）　中共中央社会部机要科 · 译电员',
}, additions=[{
    'clone_of': '—— 董健民（1923—1946）',
    'text': '为了千百万人能够得到解放，为了实现共产主义理想，宁可牺牲自己的性命，'
            '也绝不泄露党的机密，誓与密码共存亡！',
    'dy': 420000, 'size': 12, 'color': 'D9A441'}],
    shift_from='汇报人', shift_dy=0)

# ---------------------------------------------------------------- 2 倒叙
patch(2, {
    '渤海湾': '1946 年 11 月 7 日　·　渤海',
    '木帆船': '一艘从烟台开往大连的轮船，在渤海被国民党军舰截停。',
})

# ---------------------------------------------------------------- 3 目录
patch(3, {
    'READING METHOD': '目　录　·　CONTENTS',
    '怎么读这 47': '这一堂课，只读一句话',
    '写下的结婚誓词': '这是她 1942 年立下的结婚誓词 ——',
    '今天，我们从最后一句话讲起。': ('四章按她一生的时间顺序讲；每章只挑一个词来坐实。', {}),
    '一词一证 —— 每章只挑一个词，用真实事迹把它坐实。':
        ('时间序：1923 出生 · 1939 南下 · 1941 机要 · 1942 婚誓 · 1946 渤海 · 1981 追认 · 2025 今天',
         {'size': 11}),
})

# ---------------------------------------------------------------- 5 描红（原 4）
patch(4, {
    '前 22 个字，都有具体对象': '前 22 个字，说的全是别人：千百万人，和纲领里写着的理想。',
    '我是谁？是 19 岁的董健民': '「我」不在句子里。19 岁的董健民没把自己算进去，钟琪也没有。',
})

# ---------------------------------------------------------------- 6 两万里（原 5）
patch(5, {
    '大姐病逝于此': '大姐倒在途中',
    '1939 秋 · 2 人到达': '1939.11 · 2 人到达',
})

# ---------------------------------------------------------------- 7 岗位（原 6）
patch(6, {
    '为周恩来领导的南方局译电': '负责联系重庆方向的秘密电台 —— 延安 ⇌ 重庆，电报昼夜不停。',
    '三年（1940—1942），经她手的电报，无一差错。': '错一位数字，一条线路就断，一个接头的人就暴露。',
})

# ---------------------------------------------------------------- 8 制度（原 7）
patch(7, {
    '1932 · 苏区': '1932.7 · 苏区',
    '三人同行；密件离身，即销毁。': '《七条无线电通信规则》：密码本「要看同自己的生命一样重要」',
    '1940 · 延安': '1940.12 · 延安',
    '密码必须手抄，不许付印。': '毛泽东、朱德致电项英：「不留机密文件片纸只字」',
    '《机要规则》：密码本，用完即焚。': '毛泽东为中央军委机要处题词：「保守机密，慎之又慎」',
    '密码表上，「生命」的码是': '「生命」的码是 0472 1163（示意）；这张表上没有「投降」二字。',
    '这些规则，每一条背后': '1932 年写进条文的话，十年后被一个 19 岁的姑娘说成了婚誓。',
})

# ---------------------------------------------------------------- 10 海上（原 9）
patch(9, {
    '船在烟台外海，被国民党军舰截停。': '因叛徒告密，船在渤海被国民党军舰截停。',
    '炮火击中船帆，军警要登船检查。': '炮弹击中甲板，两岁的明明头部中了弹片。',
    '钟琪、董健民抱紧两岁的明明。': '敌舰喊话：「延安来的共产党，速速交出秘密文件」',
    '他们把密件绑在身上，相拥跳入渤海。': '他们把密件紧贴胸前，喊「宁死不当俘虏」，相拥跃海。',
})

# ---------------------------------------------------------------- 11 目击者（原 10）
patch(10, {
    '一家三口，唯他生还': '全船唯一生还者，不是这家人',
})

# ---------------------------------------------------------------- 12 零遗物（原 11）
# year and caption are separate one-line shapes in V2 — match on the caption only
patch(11, {
    '全国机要工作会议': '民政部批准为革命烈士 —— 迟到 35 年',
    '天津烈士陵园': '全国妇联《中华女英烈》收录了她',
    '五座展厅': '静海刘祥庄村纪念展厅落成',
    '天津 · 静海 · 延安 · 大连 · 北京':
        ('序厅之外五个展厅：巾帼之志 / 先辈引路 / 奔赴延安 / 枣园电波 / 渤海惊涛', {'size': 9}),
})

# ---------------------------------------------------------------- 13 新时代（原 12）
patch(12, {
    '《密码法》': '《密码法》核心 / 普通 / 商用密码',
    '守住它，就是守住千万人的解放。': '那个村口展厅，已是 4·15 的固定教学点。',
})

# ---------------------------------------------------------------- 14 收束（原 13）
patch(13, {
    '这 47 个字，不是历史课本里的一句话': '1946 年，她把这句话交给海；今天，我们把这句话交给自己。',
})

def pack(dest):
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    if os.path.exists(dest):
        os.remove(dest)
    import zipfile
    files = []
    for base, _, names in os.walk(WORK):
        for nm in names:
            full = os.path.join(base, nm)
            files.append((os.path.relpath(full, WORK).replace(os.sep, '/'), full))
    files.sort(key=lambda p: (p[0] != '[Content_Types].xml', p[0]))
    with zipfile.ZipFile(dest, 'w', zipfile.ZIP_DEFLATED) as z:
        for arc, full in files:
            z.write(full, arc)
    print('WROTE %s  (%.1f MB, %d parts)' % (dest, os.path.getsize(dest) / 1048576, len(files)))


STAGE = os.environ.get('STAGE', 'full')
print('\ntext layer done (STAGE=%s)' % STAGE)
if STAGE == 'text':
    pack(OUT.replace('-v3.pptx', '-text.pptx'))
    raise SystemExit(0)

# ================================================================ part 2
TEMPLATE = 6           # slide6: light page, kicker/title/label/body slots, same layout
NEW = 14

# --- build slide14 from the pristine slide6 (before its text was patched) -----------
t = etree.parse(os.path.join(UNPACKED, 'ppt', 'slides', 'slide%d.xml' % TEMPLATE))
root = t.getroot()
cspTree = root.find(q('p:cSld') + '/' + q('p:spTree'))
for pic in list(root.iter(q('p:pic'))):        # drop the pictures; keep the layout bg
    pic.getparent().remove(pic)

# slide6's picture sat inside a decorative frame built from plain shapes — stripping the
# pic left an empty placeholder box. Remove frames that sit in the right half.
spTree = root.find(q('p:cSld') + '/' + q('p:spTree'))
for sp in list(root.iter(q('p:sp'))):
    if sp.find(q('txBody'), NS) is not None:
        continue
    off = sp.find('.//' + q('off')); ext = sp.find('.//' + q('ext'))
    if off is None or ext is None:
        continue
    if int(off.get('x')) > 5000000 and int(ext.get('cx')) > 2000000:
        sp.getparent().remove(sp)


def place(sp, x, y, w=None, h=None):
    off = sp.find('.//' + q('off')); ext = sp.find('.//' + q('ext'))
    off.set('x', str(x)); off.set('y', str(y))
    if w: ext.set('cx', str(w))
    if h: ext.set('cy', str(h))
    return sp


def clone_line(tpl, text, x, y, w, size=None, color=None):
    new = copy.deepcopy(tpl)
    spTree.append(new)
    allids = [int(c.get('id')) for c in root.iter(q('p:cNvPr')) if c.get('id', '').isdigit()]
    cnv = new.find('.//' + q('p:cNvPr'))
    if cnv is not None:
        cnv.set('id', str(max(allids) + 1))
    set_text(new, text, color=color, size=size)
    return place(new, x, y, w)

NEWTEXT = [
    ('章 一　·　先认识这个人', None, None),
    ('1923—1939：一个冀南农家女孩的十六年', None, None),
    ('河北静海县刘祥庄村 · 今属天津市静海区蔡公庄镇', None, None),
    ('出　生', None, None),
    ('1923 年 8 月生，家里排行第三，因家贫辍学。', None, None),
    ('引路人', None, None),
    ('叔父董秋斯 —— 翻译家、中共地下党员。', None, None),
    ('是他让这几个姑娘知道，外面有一个正在找人的中国。', None, None),
    ('1939 年春，16 岁的她决定动身，去延安。', 'F4EFE4', None),
    ('誓与密码共存亡 · 董健民（1923—1946）', None, None),
    ('1923 1939 1940 1941', None, None),
    ('密 · 04', None, None),
]
sps = [sp for sp in root.iter(q('p:sp')) if sp.find(q('txBody'), NS) is not None]
assert len(sps) == len(NEWTEXT), 'slot drift: %d vs %d' % (len(sps), len(NEWTEXT))
for sp, (txt, col, sz) in zip(sps, NEWTEXT):
    set_text(sp, txt, color=col, size=sz)

# the caption used to sit inside the deleted frame — bring it back into the left column
place(sps[2], 620000, 1265000, 5300000)
# fill the freed right column with the people the audience is about to meet
clone_line(sps[3], '她身边的人', 6700000, 1500000, 4900000, size=11, color='B4452F')
for i, line in enumerate([
        '叔父　董秋斯　　翻译家 · 中共地下党员',
        '大姐　董清民　　1939 年倒在途中',
        '二姐　董仲民　　与她同赴延安',
        '丈夫　钟琪　　　同科译电员 · 1942 年结婚',
        '儿子　明明　　　1943 年生 · 牺牲时两岁']):
    clone_line(sps[4], line, 6700000, 1950000 + i * 640000, 4900000, size=13.5, color='2B2F33')
t.write(os.path.join(WORK, 'ppt', 'slides', 'slide%d.xml' % NEW),
        xml_declaration=True, encoding='UTF-8', standalone=True)
# slide14's rels must carry ONLY the layout. Copying slide6's whole rels would make two
# slides share one notesSlide part (illegal) and leave image rels with no referencing pic.
RELNS = 'http://schemas.openxmlformats.org/package/2006/relationships'
src_rels = etree.parse(os.path.join(UNPACKED, 'ppt', 'slides', '_rels',
                                    'slide%d.xml.rels' % TEMPLATE)).getroot()
new_rels = etree.Element('{%s}Relationships' % RELNS)
for rel in src_rels:
    if rel.get('Type').endswith('/slideLayout'):
        e = etree.SubElement(new_rels, '{%s}Relationship' % RELNS)
        e.set('Id', 'rId1'); e.set('Type', rel.get('Type')); e.set('Target', rel.get('Target'))
etree.ElementTree(new_rels).write(
    os.path.join(WORK, 'ppt', 'slides', '_rels', 'slide%d.xml.rels' % NEW),
    xml_declaration=True, encoding='UTF-8', standalone=True)
print('   built slide%d from slide%d layout' % (NEW, TEMPLATE))

# --- register the part -------------------------------------------------------------
ct = os.path.join(WORK, '[Content_Types].xml')
tc = etree.parse(ct); rc = tc.getroot()
ov = etree.SubElement(rc, '{%s}Override' % CT)
ov.set('PartName', '/ppt/slides/slide%d.xml' % NEW)
ov.set('ContentType', 'application/vnd.openxmlformats-officedocument.presentationml.slide+xml')
tc.write(ct, xml_declaration=True, encoding='UTF-8', standalone=True)

rels_p = os.path.join(WORK, 'ppt', '_rels', 'presentation.xml.rels')
tr = etree.parse(rels_p); rr = tr.getroot()
existing = [int(re.sub(r'\D', '', x.get('Id'))) for x in rr]
rid = 'rId%d' % (max(existing) + 1)
rel = etree.SubElement(rr, '{http://schemas.openxmlformats.org/package/2006/relationships}Relationship')
rel.set('Id', rid); rel.set('Type', R + '/slide'); rel.set('Target', 'slides/slide%d.xml' % NEW)
tr.write(rels_p, xml_declaration=True, encoding='UTF-8', standalone=True)

pres_p = os.path.join(WORK, 'ppt', 'presentation.xml')
tp = etree.parse(pres_p); rp = tp.getroot()
lst = rp.find(q('p:sldIdLst'))
ids = [int(x.get('id')) for x in lst]
el = etree.SubElement(lst, q('p:sldId'))
el.set('id', str(max(ids) + 1)); el.set('{%s}id' % R, rid)
lst.remove(el); lst.insert(3, el)                      # position 4
tp.write(pres_p, xml_declaration=True, encoding='UTF-8', standalone=True)
print('   registered slide%d as page 4 (%s)' % (NEW, rid))

# --- renumber the 密 · NN footer in the new page order -----------------------------
ORDER = [1, 2, 3, NEW, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
for pos, src in enumerate(ORDER, start=1):
    tt = load(src); rr2 = tt.getroot()
    for sp in shapes(rr2):
        if text_of(sp).startswith('密 ·'):
            set_text(sp, '密 · %02d' % pos)
    save(src, tt)
print('   footers renumbered 01..%02d' % len(ORDER))

# --- pack --------------------------------------------------------------------------
pack(OUT)
