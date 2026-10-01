# -*- coding: utf-8 -*-
"""Round-4 asset prep: canonicalize AI images + procedurally build the xuan-paper texture.
Re-run after dropping new images into vibe_images/ (they win by newest timestamp)."""
import os, glob, shutil, random
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

ROOT = os.path.dirname(os.path.abspath(__file__))
DST = os.path.join(ROOT, 'images')
VIBE = os.path.join(os.path.dirname(ROOT), 'vibe_images')
os.makedirs(DST, exist_ok=True)
random.seed(7)

CANON = ['ill-01-nanxia', 'ill-02-yaodong', 'ill-03-hunli', 'ill-04-bohai', 'ill-05-konghe']
for name in CANON:
    hits = sorted(glob.glob(os.path.join(VIBE, name + '_*.png')), key=os.path.getmtime)
    if not hits:
        print('SKIP  %s (no source)' % name); continue
    shutil.copy(hits[-1], os.path.join(DST, name + '.png'))
    print('OK    %s.png  <- %s' % (name, os.path.basename(hits[-1])))

W, H = 1792, 1024
img = Image.new('RGB', (W, H), (237, 231, 218))
d = ImageDraw.Draw(img, 'RGBA')
for _ in range(9000):
    x, y = random.randrange(W), random.randrange(H)
    ln = random.randint(6, 42)
    if random.random() < 0.55:
        d.line([(x, y), (x + ln, y + random.randint(-1, 1))],
               fill=(226, 219, 203, random.randint(18, 46)), width=1)
    else:
        d.line([(x, y), (x + random.randint(-1, 1), y + ln)],
               fill=(246, 242, 232, random.randint(14, 34)), width=1)
for _ in range(70):
    x, y, r = random.randrange(W), random.randrange(H), random.randint(3, 13)
    d.ellipse([x - r, y - r, x + r, y + r], fill=(206, 193, 168, random.randint(10, 26)))
img = img.filter(ImageFilter.GaussianBlur(0.7))

vig = Image.new('L', (W, H), 255)
va = 1.0 - (np.asarray(vig.filter(ImageFilter.GaussianBlur(180)), dtype=np.float32) / 255.0) * 0.0
va = np.ones((H, W), dtype=np.float32)
edge = np.zeros((H, W), dtype=np.float32)
yy, xx = np.mgrid[0:H, 0:W]
cx, cy = W / 2.0, H / 2.0
r_norm = np.sqrt(((xx - cx) / (W * 0.5)) ** 2 + ((yy - cy) / (H * 0.5)) ** 2) / np.sqrt(2)
va = 1.0 - np.clip(r_norm, 0, 1) ** 2.4 * 0.13
img = Image.fromarray((np.asarray(img, dtype=np.float32) * va[..., None]).astype('uint8'))

grain = Image.effect_noise((W, H), 7).convert('L')
soft = img.filter(ImageFilter.GaussianBlur(0.3))
mask = Image.eval(grain, lambda v: int(v * 0.20))
img = Image.composite(soft, img, mask)
img.save(os.path.join(DST, 'tex-xuanzhi.png'))
print('OK    tex-xuanzhi.png')

for f in CANON + ['tex-xuanzhi']:
    p = os.path.join(DST, f + '.png')
    if os.path.exists(p):
        print('   %-22s %s' % (f + '.png', Image.open(p).size))
