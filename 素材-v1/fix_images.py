# -*- coding: utf-8 -*-
"""Round-4 image repair, v2 — driven by the visual-QA findings.

Why the approach changed: v1 tried to inpaint the "Qoder AI 生成" watermark and left a
visible feathered rectangle (QA flagged it as a "cropped signature block" on P5/P6).
The watermark always lives in the bottom ~7% of the frame, so cropping that strip is
both cleaner and artefact-free. Inpainting is now reserved for the two genuine content
defects (the red splotch on ill-01, the malformed 囍 on ill-03).

Also emits the two feathered text plates the deck needs — QA measured white text at
1.47:1 and vermilion at 1.15:1 over full-bleed art, i.e. the load-bearing sentences
were unreadable. Every text block that sits on an image now gets a plate.
"""
import os
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageChops
import numpy as np

D = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'images')
SRC = os.path.join(D, 'src')
os.makedirs(SRC, exist_ok=True)

TARGETS = ['ill-01-nanxia.png', 'ill-02-yaodong.png', 'ill-03-hunli.png',
           'ill-04-bohai.png', 'ill-05-konghe.png']
CROP_BOTTOM = 96          # px; kills the watermark strip outright
W, H = 1792, 1024


def pristine(name):
    p, s = os.path.join(D, name), os.path.join(SRC, name)
    if not os.path.exists(s) and os.path.exists(p):
        Image.open(p).save(s)
    return Image.open(s if os.path.exists(s) else p).convert('RGB')


def kill_red_splotch(im, box, thr=34):
    crop = im.crop(box)
    r, g, b = crop.split()
    heat = ImageChops.subtract(r, ImageChops.lighter(g, b))
    mask = heat.point(lambda v: 255 if v > thr else 0).filter(ImageFilter.GaussianBlur(1.6))
    fill = crop.filter(ImageFilter.MedianFilter(9)).filter(ImageFilter.GaussianBlur(1.6))
    im.paste(Image.composite(fill, crop, mask), box)
    return im


def crush_glyphs(im, box, down=8, blur=3.4):
    crop = im.crop(box)
    cw, ch = crop.size
    tiny = crop.resize((max(1, cw // down), max(1, ch // down)), Image.BOX)
    im.paste(tiny.resize((cw, ch), Image.BICUBIC).filter(ImageFilter.GaussianBlur(blur)), box)
    return im


def unify(im):
    im = ImageEnhance.Color(im).enhance(0.90)
    return ImageEnhance.Contrast(im).enhance(0.97)


for name in TARGETS:
    if not os.path.exists(os.path.join(D, name)):
        print('SKIP  %s' % name); continue
    im = pristine(name)
    if name.startswith('ill-01'):
        kill_red_splotch(im, (372, 826, 540, 930))
    if name.startswith('ill-03'):
        crush_glyphs(im, (1240, 196, 1450, 452))
    im = unify(im).crop((0, 0, W, H - CROP_BOTTOM))
    im.save(os.path.join(D, name))
    print('FIXED %-22s -> %s' % (name, im.size))


def plate(fname, rgb, peak, feather=46, size=(900, 460)):
    """Soft-edged solid plate: alpha ramps 0 -> peak across `feather` px on every side."""
    w, h = size
    a = np.zeros((h, w), dtype='float32')
    yy, xx = np.mgrid[0:h, 0:w]
    d = np.minimum(np.minimum(xx, w - 1 - xx), np.minimum(yy, h - 1 - yy)) / float(feather)
    a = np.clip(d, 0, 1) ** 0.55 * peak * 255.0
    img = Image.new('RGBA', (w, h), rgb + (0,))
    img.putalpha(Image.fromarray(a.astype('uint8'), 'L'))
    img.save(os.path.join(D, fname))
    print('PLATE %s' % fname)


plate('plate-ink.png', (32, 37, 42), 0.72)          # under light text on dark art
plate('plate-xuan.png', (237, 231, 218), 0.90)      # under ink text on busy art
print('\noriginals untouched: bg-p1-luori.jpeg, bg-p2-chuanxian.jpeg (never cropped)')
