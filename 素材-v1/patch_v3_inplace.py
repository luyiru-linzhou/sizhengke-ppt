# -*- coding: utf-8 -*-
"""Patch 誓与密码共存亡-v3.pptx IN PLACE (no new file).

Six complaints, six fixes:
 1. cover must carry the full 47-char quote legibly  -> bigger, gold, repositioned
 2. bottom rule + footer trio on every page          -> deleted everywhere
 3. chapter kicker top-left too small                -> 11.5pt -> 18pt
 4. P3 should be a plain TOC on the left, nothing else -> strip quote column, shift cards left,
                                                          write 章三 out in full, add page refs
 5. P4 came out pure white                           -> the full-bleed paper background was a
                                                        <p:pic>; it got stripped with the art.
                                                        Restore it from slide6 and re-register rel.
 6. pages don't narrate (P6 especially)               -> add explanatory lines
"""
import os, re, shutil, copy, zipfile
from lxml import etree

ROOT = r'C:\Users\29264\Desktop\思政课ppt'
DECK = os.path.join(ROOT, '誓与密码共存亡-v3.pptx')
WORK = os.path.join(ROOT, '素材-v1', 'work-v3p')

A = 'http://schemas.openxmlformats.org/drawingml/2006/main'
P = 'http://schemas.openxmlformats.org/presentationml/2006/main'
RID = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
RELNS = 'http://schemas.openxmlformats.org/package/2006/relationships'
NS = {'a': A, 'p': P, 'r': RID}
DRAWING = {'t', 'p', 'r', 'rPr', 'solidFill', 'srgbClr', 'latin', 'ea', 'cs',
           'xfrm', 'off', 'ext', 'blip', 'pPr', 'buNone'}


def q(tag):
    if ':' in tag:
        pre, local = tag.split(':')
    else:
        pre, local = ('a' if tag in DRAWING else 'p'), tag
    return '{%s}%s' % (NS[pre], local)


def load(n):
    return etree.parse(os.path.join(WORK, 'ppt', 'slides', 'slide%d.xml' % n))


def save(n, t):
    t.write(os.path.join(WORK, 'ppt', 'slides', 'slide%d.xml' % n),
            xml_declaration=True, encoding='UTF-8', standalone=True)


def textshapes(root):
    return [sp for sp in root.iter(q('p:sp')) if sp.find(q('txBody'), NS) is not None]


def text_of(sp):
    return ''.join(t.text or '' for t in sp.find(q('txBody'), NS).iter(q('t')))


def geo(sp):
    off = sp.find('.//' + q('off')); ext = sp.find('.//' + q('ext'))
    return (int(off.get('x')), int(off.get('y')), int(ext.get('cx')), int(ext.get('cy')))


def place(sp, x=None, y=None, w=None):
    off = sp.find('.//' + q('off')); ext = sp.find('.//' + q('ext'))
    if x is not None: off.set('x', str(x))
    if y is not None: off.set('y', str(y))
    if w is not None: ext.set('cx', str(w))
    return sp


def set_text(sp, s, size=None, color=None, bold=None):
    tb = sp.find(q('txBody'), NS)
    paras = tb.findall(q('p'))
    runs = paras[0].findall(q('r'))
    if not runs:
        return sp
    keep = runs[0]
    for extra in runs[1:]:
        paras[0].remove(extra)
    for later in paras[1:]:
        tb.remove(later)
    for t in keep.iter(q('t')):
        t.text = s
    rpr = keep.find(q('rPr'))
    if rpr is None:
        return sp
    if size:
        rpr.set('sz', str(int(size * 100)))
    if bold is not None:
        rpr.set('b', '1' if bold else '0')
    if color:
        for sf in rpr.findall(q('solidFill')):
            rpr.remove(sf)
        sf = etree.Element(q('solidFill'))
        c = etree.SubElement(sf, q('srgbClr'))
        c.set('val', color)
        rpr.insert(0, sf)
    return sp


def clone_into(root, tpl, text, x, y, w=None, size=None, color=None, bold=None):
    new = copy.deepcopy(tpl)
    root.find(q('p:cSld') + '/' + q('p:spTree')).append(new)
    ids = [int(c.get('id')) for c in root.iter(q('p:cNvPr')) if c.get('id', '').isdigit()]
    cnv = new.find('.//' + q('p:cNvPr'))
    if cnv is not None and ids:
        cnv.set('id', str(max(ids) + 1))
    set_text(new, text, size=size, color=color, bold=bold)
    return place(new, x=x, y=y, w=w)


# ---------------------------------------------------------------- unpack
if os.path.exists(WORK):
    shutil.rmtree(WORK)
os.makedirs(WORK)
with zipfile.ZipFile(DECK) as z:
    z.extractall(WORK)

ALL = list(range(1, 15))
CODE_RE = re.compile(r'^[0-9 ]{9,}$')

# ---- 2 & 3: strip footers, enlarge kickers --------------------------------------
for n in ALL:
    t = load(n); root = t.getroot()
    removed = 0
    for sp in list(textshapes(root)):
        txt = text_of(sp)
        x, y, w, h = geo(sp)
        if txt.startswith('誓与密码共存亡 · 董健民') or txt.startswith('密 ·') or CODE_RE.match(txt.strip()):
            sp.getparent().remove(sp); removed += 1
            continue
        if y < 950000:                                   # the chapter kicker
            for rpr in sp.find(q('txBody'), NS).iter(q('rPr')):
                if rpr.get('sz') and int(rpr.get('sz')) <= 1400:
                    rpr.set('sz', '1800')
    for sp in list(root.iter(q('p:sp'))):               # the hairline above the footer
        if sp.find(q('txBody'), NS) is not None:
            continue
        try:
            x, y, w, h = geo(sp)
        except AttributeError:
            continue
        if y > 6000000 and h < 120000:
            sp.getparent().remove(sp); removed += 1
    save(n, t)
    if removed:
        print('slide%-2d removed %d footer parts' % (n, removed))

# ---- 1: cover quote --------------------------------------------------------------
t = load(1); root = t.getroot()
sps = textshapes(root)
kicker = [s for s in sps if text_of(s).startswith('思政课')][0]
title = [s for s in sps if text_of(s).strip() == '誓与密码共存亡'][0]
quote = [s for s in sps if text_of(s).startswith('为了千百万人')][0]
person = [s for s in sps if text_of(s).startswith('—— 董健民')][0]
set_text(quote, '为了千百万人能够得到解放，为了实现共产主义理想，宁可牺牲自己的性命，'
                '也绝不泄露党的机密，誓与密码共存亡！', size=16, color='D9A441')
place(quote, x=600000, y=4380000, w=11000000)
set_text(person, '—— 董健民（1923—1946）　中共中央社会部机要科 · 译电员', size=14)
place(person, x=600000, y=5050000, w=11000000)
set_text(kicker, '思政课 · 我来讲 ｜ 红色名言解读', size=18)
save(1, t)
print('cover quote repositioned')

# ---- 4: TOC ----------------------------------------------------------------------
t = load(3); root = t.getroot()
sps = textshapes(root)
TITLE_KEEP = '目'
for sp in list(sps):                                   # drop the quote column on the left
    x, y, w, h = geo(sp)
    if x < 5000000 and y > 1200000:
        sp.getparent().remove(sp)
for sp in list(root.iter(q('p:sp'))):                  # shift cards + icons to the left
    x, y, w, h = geo(sp) if sp.find('.//' + q('off')) is not None else (0, 0, 0, 0)
    if x > 5000000:
        place(sp, x=x - 5400000)
for sp in textshapes(root):
    txt = text_of(sp)
    if txt.startswith('目'):
        set_text(sp, '目　录　·　CONTENTS', size=18)
    elif txt.strip() == '这一堂课，只读一句话':
        set_text(sp, '四章，按她一生的时间顺序', size=20)
    elif txt.replace(' ', '').startswith('章一'):
        set_text(sp, '章 一 · 04')
    elif txt.replace(' ', '').startswith('章二'):
        set_text(sp, '章 二 · 07')
    elif txt.replace(' ', '').startswith('章三'):
        set_text(sp, '章 三 · 09')
    elif txt.replace(' ', '').startswith('章四'):
        set_text(sp, '章 四 · 12')
    elif txt.startswith('宁可'):
        set_text(sp, '宁可牺牲自己的性命，也绝不泄露党的机密', size=12)
save(3, t)
print('TOC rebuilt on the left')

# ---- 5: restore the paper background on P4 (slide14) -----------------------------
s6 = load(6).getroot()
bg = None
for pic in s6.iter(q('p:pic')):
    ext = pic.find('.//' + q('ext'))
    if ext is not None and int(ext.get('cx')) > 11000000:
        bg = pic; break
if bg is None:
    raise SystemExit('!! no full-bleed background pic found on slide6')
embed = bg.find('.//' + q('a:blip')).get('{%s}embed' % RID)
rels6 = etree.parse(os.path.join(WORK, 'ppt', 'slides', '_rels', 'slide6.xml.rels')).getroot()
target = [r.get('Target') for r in rels6 if r.get('Id') == embed][0]

t = load(14); root = t.getroot()
spTree = root.find(q('p:cSld') + '/' + q('p:spTree'))
newbg = copy.deepcopy(bg)
ids = [int(c.get('id')) for c in root.iter(q('p:cNvPr')) if c.get('id', '').isdigit()]
newbg.find('.//' + q('p:cNvPr')).set('id', str(max(ids) + 1))
newbg.find('.//' + q('a:blip')).set('{%s}embed' % RID, 'rId90')
spTree.insert(2, newbg)          # after <p:nvGrpSpPr> and <p:grpSpPr> — paints under everything

rp = os.path.join(WORK, 'ppt', 'slides', '_rels', 'slide14.xml.rels')
rr = etree.parse(rp).getroot()
e = etree.SubElement(rr, '{%s}Relationship' % RELNS)
e.set('Id', 'rId90'); e.set('Type', RID + '/image'); e.set('Target', target)
etree.ElementTree(rr).write(rp, xml_declaration=True, encoding='UTF-8', standalone=True)
save(14, t)
print('P4 background restored from %s' % target)

# ---- 6: narration on the sparse pages -------------------------------------------
t = load(5); root = t.getroot()                     # P6 两万里
sps = textshapes(root)
tpl = [s for s in sps if text_of(s) == '天津·静海'][0]
for i, line in enumerate([
        '为什么走：1939 年华北已经沦陷，一个农家女孩在村里找不到能做事的活路。',
        '往哪去：延安收留这些逃出家的孩子——给饭、给书、给一个方向。',
        '走到之后：1940 年秋，17 岁的董健民在延安加入中国共产党。']):
    clone_into(root, tpl, line, x=5900000, y=5150000 + i * 420000, w=6100000, size=12.5,
               color='2B2F33')
save(5, t)
print('P6 narration added')

t = load(12); root = t.getroot()                    # P13 新时代
sps = textshapes(root)
tpl = [s for s in sps if '今天的密码' in text_of(s)][0]
clone_into(root, tpl, '—— 国家安全部 2025.11.4 披露：在读研究生金某被以「兼职写材料」勾联。',
           x=8300000, y=3060000, w=3900000, size=11.5, color='555A5F')
clone_into(root, tpl, '他不是叛徒，是差点没守住「绝不」两个字的学生。',
           x=8300000, y=3420000, w=3900000, size=11.5, color='B4452F')
save(12, t)
print('P13 case attribution added')

# ---------------------------------------------------------------- repack in place
tmp = DECK + '.new'
files = []
for base, _, names in os.walk(WORK):
    for nm in names:
        full = os.path.join(base, nm)
        files.append((os.path.relpath(full, WORK).replace(os.sep, '/'), full))
files.sort(key=lambda p: (p[0] != '[Content_Types].xml', p[0]))
with zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED) as z:
    for arc, full in files:
        z.write(full, arc)
os.replace(tmp, DECK)
print('\nPATCHED IN PLACE %s (%.1f MB)' % (DECK, os.path.getsize(DECK) / 1048576))
