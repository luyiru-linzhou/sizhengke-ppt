# -*- coding: utf-8 -*-
"""gen_tapes.py — procedural telegraph paper tape for the New-Era slide (P12).
Outputs transparent-ground PNGs into assets/:
  tape-long.png    wide teletype printout, sprocket holes along the top edge,
                   torn/frayed bottom edge, scorch marks, fold lines, drop shadow
  tape-short.png   shorter variant for secondary placement
Re-run: python gen_tapes.py
"""
import os, math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops

random.seed(21)
ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "assets")
os.makedirs(OUT, exist_ok=True)

PAPER = (225, 213, 185)      # aged tape body (slightly deeper than xuan ground)
PAPER_HI = (238, 229, 204)
SCORCH = (176, 128, 66)


def jagged_edge(n, base, seg, amp):
    """Piecewise-linear torn edge: random anchor points joined by straight runs."""
    px, py = [0], [base + random.uniform(-amp, amp)]
    x = 0
    while x < n - 1:
        x += random.randrange(seg[0], seg[1])
        px.append(min(x, n - 1))
        py.append(base + random.uniform(-amp, amp))
    return np.interp(np.arange(n), px, py)


def add_fray_tails(mask_draw, edge, prob, len_max, scale):
    for i in range(0, len(edge)):
        if random.random() < prob:
            ln = random.uniform(4, len_max) * scale
            w = random.randrange(1, 3)
            mask_draw.line([i, int(edge[i]), i + random.randrange(-1, 2),
                            int(edge[i] + ln)], fill=255, width=w)


def frayed_edge(n, base, amp, rwalk, fray_prob=0.0, fray_len=0):
    y = np.full(n, float(base))
    v = 0.0
    for i in range(n):
        v = v * 0.82 + random.uniform(-rwalk, rwalk)
        y[i] = base + v + random.uniform(-amp, amp)
    if fray_prob:
        for i in range(n):
            if random.random() < fray_prob:
                y[i] += random.uniform(0, fray_len)
    return y


def build_tape(W, H, ytop, ybot, holes=True, scorch_n=2, shadow=True,
               right_tear=True):
    """Return RGBA tape image, canvas W x H, transparent ground."""
    scale = W / 1500.0
    # top: gentle undulation; bottom: torn piecewise edge
    top = jagged_edge(W, ytop, (120, 260), 3.0 * scale)
    bot = jagged_edge(W, ybot, (42, 96), 15 * scale)

    # right-side diagonal tear: body follows one slanted ragged line and closes
    if right_tear:
        x0 = int(W * 0.895)
        y0 = random.uniform(ytop + 18, ybot - 36)
        y1 = y0 + (ybot - y0) * random.uniform(0.55, 0.95)
        for i in range(x0, W):
            k = (i - x0) / max(1, (W - x0))
            ey = y0 + (y1 - y0) * k + random.uniform(-2.5, 2.5)
            half = max(2.0, (ybot - ytop) * 0.34 * (1 - k))
            top[i] = ey - half
            bot[i] = ey + half
    # left end: small missing chip
    c0 = int(16 * scale)
    for i in range(0, c0):
        k = i / max(1, c0)
        top[i] += (1 - k) * 12 * scale
        bot[i] -= (1 - k) * 7 * scale

    # ---- body mask (pre-holes copy kept for the drop shadow)
    def fill_body(t, b, tails=False):
        m = Image.new("L", (W, H), 0)
        md = ImageDraw.Draw(m)
        poly = [(0, t[0])] + [(x, t[x]) for x in range(W)] + \
               [(W - 1, b[W - 1])] + [(x, b[x]) for x in range(W - 1, -1, -1)]
        md.polygon(poly, fill=255)
        if tails:
            add_fray_tails(md, b, 0.022, 18, scale)
        return m

    body_for_shadow = fill_body(top, bot, tails=True)
    body = body_for_shadow.copy()
    bd = ImageDraw.Draw(body)

    # ---- sprocket holes (semicircular notches along the top)
    if holes:
        hr = int(9 * scale)
        step = int(34 * scale)
        x = int(30 * scale)
        while x < W - int(W * 0.12):
            cy = top[x]
            bd.ellipse([x - hr, int(cy) - hr, x + hr, int(cy) + hr + 2], fill=0)
            x += step

    body = body.filter(ImageFilter.GaussianBlur(0.7))
    ba = np.asarray(body).astype(np.float32) / 255.0

    # ---- paper colour with vertical gradient (lighter toward middle-top)
    yy, xx = np.mgrid[0:H, 0:W]
    mid = (ytop + ybot) / 2.0
    g = np.clip(1.0 - np.abs(yy - mid) / (ybot - ytop) * 0.55, 0.55, 1.0)
    col = np.zeros((H, W, 3), dtype=np.float32)
    for c in range(3):
        col[..., c] = PAPER[c] * (0.92 + 0.08 * g)
    col = np.clip(col, 0, 255)

    # ---- fibres & grain
    rng = np.random.default_rng(3)
    grain = rng.normal(0, 6.5, (H, W))
    col += grain[..., None]
    # long fibres
    d = ImageDraw.Draw(Image.new("RGB", (W, H)))
    fib = np.zeros((H, W), dtype=np.float32)
    fdimg = Image.new("L", (W, H), 0)
    fdd = ImageDraw.Draw(fdimg)
    for _ in range(int(260 * scale)):
        x0 = random.randrange(W)
        y0 = random.randrange(int(ytop) - 10, int(ybot) + 10)
        ln = random.randrange(int(30 * scale), int(160 * scale))
        a = random.randrange(8, 22)
        fdd.line([x0, y0, x0 + ln, y0 + random.randrange(-2, 3)], fill=a, width=1)
    fib = np.asarray(fdimg).astype(np.float32) / 255.0
    col += (fib * 14)[..., None]

    # ---- fold lines (very faint)
    for fx in [int(W * 0.34), int(W * 0.71)]:
        col[:, fx:fx + 2] *= 0.95
        col[:, fx + 2:fx + 3] = np.clip(col[:, fx + 2:fx + 3] * 1.04, 0, 255)

    img = np.dstack([col, ba * 255.0]).astype(np.uint8)
    t = Image.fromarray(img, "RGBA")

    # ---- scorch marks
    def scorch(cx, cy, r, strength=0.55):
        nonlocal t
        layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        ld = ImageDraw.Draw(layer)
        for rr, a in [(r, int(70 * strength)), (int(r * 0.55), int(110 * strength))]:
            ld.ellipse([cx - rr, cy - rr, cx + rr, cy + rr],
                       fill=SCORCH + (a,))
        layer = layer.filter(ImageFilter.GaussianBlur(r * 0.32))
        t = Image.alpha_composite(t, layer)
    for _ in range(scorch_n):
        cx = random.randrange(int(W * 0.2), int(W * 0.86))
        cy = random.randrange(int(ytop) + 14, int(ybot) - 8)
        scorch(cx, cy, random.randrange(int(26 * scale), int(52 * scale)),
               random.uniform(0.35, 0.6))

    # ---- drop shadow beneath the body (built from the PRE-holes silhouette so
    #      shadow never fills the sprocket notches)
    if shadow:
        a = body_for_shadow
        solid = Image.new("RGBA", (W, H), (28, 24, 18, 0))
        solid.putalpha(a.point(lambda v: int(v * 0.40)))
        solid = solid.filter(ImageFilter.GaussianBlur(7 * scale))
        canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        canvas = Image.alpha_composite(canvas, solid.transform(
            (W, H), Image.AFFINE, (1, 0, 6 * scale, 0, 1, 10 * scale)))
        canvas = Image.alpha_composite(canvas, t)
        t = canvas
    return t


tape = build_tape(1500, 300, 78, 214, holes=True, scorch_n=3, shadow=False)
tape.save(os.path.join(OUT, "tape-long.png"))
print("WROTE tape-long.png", tape.size)

short = build_tape(820, 240, 62, 168, holes=True, scorch_n=1, right_tear=True,
                   shadow=False)
short.save(os.path.join(OUT, "tape-short.png"))
print("WROTE tape-short.png", short.size)
