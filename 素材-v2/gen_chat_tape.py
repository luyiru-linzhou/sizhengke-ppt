# -*- coding: utf-8 -*-
"""gen_chat_tape.py — composite the three chat lines directly onto the long
paper tape so text and tape are one image (avoids rotated-text misalignment)."""
import os
from PIL import Image, ImageDraw, ImageFont

D = os.path.dirname(os.path.abspath(__file__))
tape = Image.open(os.path.join(D, "assets", "tape-long.png")).convert("RGBA")
W, H = tape.size
draw = ImageDraw.Draw(tape)

font = ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 52)
lines = ["同学  兼职  写材料  吗",
         "报酬  丰厚  好商量",
         "先签  一份  保密  协议"]
x, y0, gap = 120, 42, 86
for i, ln in enumerate(lines):
    draw.text((x, y0 + i * gap), ln, font=font, fill=(43, 47, 51, 255))

out = os.path.join(D, "assets", "tape-chat.png")
tape.save(out)
print("WROTE", out, tape.size)
