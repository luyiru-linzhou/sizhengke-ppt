# -*- coding: utf-8 -*-
"""scan_ext.py — flag shape extents that are zero/negative (DrawingML requires
positive cx/cy; pptxgenjs emits them verbatim and PowerPoint rejects the file)."""
import zipfile, re

z = zipfile.ZipFile(r"C:\Users\29264\Desktop\思政课ppt\素材-v2\out"
                    "\\誓与密码共存亡-v2.pptx")
for n in range(1, 14):
    x = z.read("ppt/slides/slide%d.xml" % n).decode()
    for m in re.finditer(r'<a:ext cx="(-?\d+)" cy="(-?\d+)"', x):
        cx, cy = int(m.group(1)), int(m.group(2))
        if cx <= 200 or cy <= 200:
            print("slide%2d  cx=%d cy=%d" % (n, cx, cy))
