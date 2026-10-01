# -*- coding: utf-8 -*-
"""Second in-place pass on v3 — fixes what pass 1 missed:
  P3: the chapter icons are <p:pic>, and pass 1 only shifted <p:sp>; they were left behind
      on the far right. Also 章三's full text wrapped and collided with its label.
  P1: the person line sat too close under the quote and crossed the bright wave reflection.
"""
import os, shutil, zipfile
from lxml import etree

ROOT = r'C:\Users\29264\Desktop\思政课ppt'
DECK = os.path.join(ROOT, '誓与密码共存亡-v3.pptx')
WORK = os.path.join(ROOT, '素材-v1', 'work-v3q')

A = 'http://schemas.openxmlformats.org/drawingml/2006/main'
P = 'http://schemas.openxmlformats.org/presentationml/2006/main'
NS = {'a': A, 'p': P}


def q(tag):
    pre, local = tag.split(':')
    return '{%s}%s' % (NS[pre], local)


if os.path.exists(WORK):
    shutil.rmtree(WORK)
os.makedirs(WORK)
with zipfile.ZipFile(DECK) as z:
    z.extractall(WORK)


def load(n):
    return etree.parse(os.path.join(WORK, 'ppt', 'slides', 'slide%d.xml' % n))


def save(n, t):
    t.write(os.path.join(WORK, 'ppt', 'slides', 'slide%d.xml' % n),
            xml_declaration=True, encoding='UTF-8', standalone=True)


# ---------------- P3 : move the icons, fix the long title -------------------------
t = load(3); root = t.getroot()
moved = 0
for pic in root.iter(q('p:pic')):
    off = pic.find('.//' + q('a:off'))
    if off is None:
        continue
    x = int(off.get('x'))
    if x > 5000000:
        off.set('x', str(x - 5400000)); moved += 1
for sp in root.iter(q('p:sp')):
    tb = sp.find(q('p:txBody'), NS)
    if tb is None:
        continue
    txt = ''.join(e.text or '' for e in tb.iter(q('a:t')))
    if txt.startswith('宁可牺牲自己的性命'):
        off = sp.find('.//' + q('a:off')); ext = sp.find('.//' + q('a:ext'))
        ext.set('cx', '3750000')                      # give the full clause room to sit on one line
        off.set('y', str(int(off.get('y')) + 90000))
        for rpr in tb.iter(q('a:rPr')):
            rpr.set('sz', '1100')
        break
save(3, t)
print('P3 icons moved: %d' % moved)

# ---------------- P1 : separate quote from the attribution line -------------------
t = load(1); root = t.getroot()
for sp in root.iter(q('p:sp')):
    tb = sp.find(q('p:txBody'), NS)
    if tb is None:
        continue
    txt = ''.join(e.text or '' for e in tb.iter(q('a:t')))
    off = sp.find('.//' + q('a:off'))
    if txt.startswith('为了千百万人'):
        off.set('y', '5180000')
    elif txt.startswith('—— 董健民'):
        off.set('y', '4430000')
save(1, t)
print('P1 lines re-spaced')

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
print('PATCHED %s' % os.path.basename(DECK))
