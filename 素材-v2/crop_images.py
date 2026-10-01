# -*- coding: utf-8 -*-
"""crop_images.py — pre-crop EVERY illustration to its exact frame ratio with
Pillow, fully bypassing the broken pptxgenjs sizing (both "cover" and "crop"
emitted <a:srcRect/><a:stretch/> with no fillRect, which PowerPoint rejects).
Outputs into images/:
  ill-01-band.png   P5 bottom road strip        ratio 13.333/1.6
  ill-02-frame.png  P6 framed still life        ratio 5.11/3.29
  ill-03-card.png   P8 wedding scene            ratio 6.0/4.35
  ill-04-cover.png  P9 full-bleed dark sea      ratio 13.333/7.5
  ill-05-frame.png  P11 empty box               ratio 5.9/3.5
"""
import os
from PIL import Image

D = os.path.join(os.path.dirname(os.path.abspath(__file__),), "images")


def crop_to(ratio, src, out, xbias=0.5, ybias=0.5, v_use=1.0, h_shift=0.0):
    im = Image.open(os.path.join(D, src))
    W, H = im.size
    ch = int(round(H * v_use))
    cw = int(round(ch * ratio))
    if cw > W:                       # source not wide enough -> fit by width
        cw = W
        ch = int(round(cw / ratio))
    y0 = int(round((H - ch) * ybias))
    x0 = int(round((W - cw) * xbias)) + int(h_shift * W)
    x0 = max(0, min(x0, W - cw))
    y0 = max(0, min(y0, H - ch))
    c = im.crop((x0, y0, x0 + cw, y0 + ch))
    c.save(os.path.join(D, out))
    print("%-16s %s  ratio %.3f (target %.3f)" %
          (out, c.size, c.size[0] / c.size[1], ratio))


crop_to(13.333 / 1.6, "ill-01-nanxia.png", "ill-01-band.png",
        xbias=0.5, ybias=1.0)                                   # bottom strip
crop_to(5.11 / 3.29, "ill-02-yaodong.png", "ill-02-frame.png",
        xbias=0.62, ybias=1.0)                                 # desk right
crop_to(6.0 / 4.35, "ill-03-hunli.png", "ill-03-card.png",
        xbias=0.31, ybias=0.05)
crop_to(13.333 / 7.5, "ill-04-bohai.png", "ill-04-cover.png",
        xbias=0.5, ybias=0.5)
crop_to(5.9 / 3.5, "ill-05-konghe.png", "ill-05-frame.png",
        xbias=0.18, ybias=0.62)                                # box lower-left
