/* ============================================================================
 * build_deck.js — 《誓与密码共存亡》 v2
 * 13 slides, one distinct layout device per slide; no two content pages share
 * the same skeleton. Anti-AI rules enforced:
 *   - no underline/accent rule beneath titles
 *   - no single-side color bar on cards
 *   - no full-width header color band
 * Run: node build_deck.js   -> out/range.pptx
 * ==========================================================================*/
const pptxgen = require("pptxgenjs");
const path = require("path");

const ROOT = __dirname;
const IMG = p => path.join(ROOT, "images", p);
const AST = p => path.join(ROOT, "assets", p);

/* palette ------------------------------------------------------------------ */
const XUAN = "EDE7DA", XUAN_D = "E2D9C6", XUAN_L = "F2EDE2";
const INK = "2B2F33", INK_M = "555A5F", INK_L = "8A8F94";
const ZHU = "B4452F", ZHU_D = "963522", GOLD = "D9A441";
const DARK = "22313B", PW = "F4EFE4";
const F_SERIF = "Noto Serif SC", F_SANS = "Noto Sans SC";

/* icon color keys -> hex suffix on file names ------------------------------ */
const IC = { INK: "2B2F33", ZHU: "B4452F", PW: "F4EFE4", GOLD: "D9A441",
             LIGHT: "8A8F94" };

const p = new pptxgen();
p.defineLayout({ name: "W", width: 13.333, height: 7.5 });
p.layout = "W";
p.author = "思政课";
p.title = "誓与密码共存亡 —— 董健民";
const CW = 13.333, CH = 7.5;

/* shared shadow factories (fresh object every call) ------------------------ */
const softShadow = (o = 0.28, b = 7, off = 4, a = 45) =>
  ({ type: "outer", color: "1C1A16", opacity: o, blur: b, offset: off,
     angle: a, rotateWithShape: true });

/* helpers ------------------------------------------------------------------ */
function xuanGround(s) {
  s.addImage({ path: IMG("tex-xuanzhi.png"), x: 0, y: 0, w: CW, h: CH });
}
function tint(s, color, transparency) {
  s.addShape("rect", { x: 0, y: 0, w: CW, h: CH,
    fill: { color, transparency }, line: { type: "none" } });
}
function ico(s, name, ck, x, y, w) {
  s.addImage({ path: AST(`ico-${name}-${IC[ck]}.png`), x, y,
    w, h: w });
}
function txt(s, t, x, y, w, h, opt = {}) {
  s.addText(t, Object.assign({ x, y, w, h, margin: 0,
    fontFace: opt.fontFace || F_SERIF, fontSize: opt.fontSize || 14,
    color: opt.color || INK, bold: !!opt.bold, italic: !!opt.italic,
    align: opt.align || "left", valign: opt.valign || "top",
    charSpacing: opt.charSpacing, lineSpacing: opt.lineSpacing,
    paraSpaceAfter: opt.paraSpaceAfter, rotate: opt.rotate,
    breakLine: opt.breakLine, fit: opt.fit }, opt.extra || {}));
}
/* "archive paper" card: soft fill, hairline frame, shadow — never an edge bar */
function paperCard(s, x, y, w, h, fillc = PW, frame = INK_L) {
  s.addShape("roundRect", { x, y, w, h, rectRadius: 0.05,
    fill: { color: fillc }, line: { color: frame, width: 0.75 },
    shadow: softShadow(0.2, 6, 3) });
}

const MORSE = [
  "2580 1129 0086 4403", "0472 1163 0730 7296", "1939 0800 0002 0001",
  "0123 4567 8901 2345", "1939 1940 1942 1946", "0086 0231 0411 0730",
  "1932 1940 1941 2025", "1942 0472 1163 0001", "1946 1107 1700 0000",
  "0001 0000 0000 0000", "1981 1983 1988 2025", "2025 0415 0009 0001",
  "1946 2026 0047 0000",
];
function footer(s, n) {
  const dark = s._darkFooter;
  const c = dark ? XUAN_L : INK_L;
  s.addShape("line", { x: 0.7, y: 7.02, w: 11.93, h: 0,
    line: { color: dark ? "3C4A54" : "C9C2B6", width: 0.75 } });
  txt(s, "誓与密码共存亡 · 董健民（1923—1946）", 0.7, 7.12, 4.6, 0.3,
    { fontFace: F_SERIF, fontSize: 9, color: c });
  txt(s, MORSE[n - 1], 4.6, 7.12, 4.1, 0.3,
    { fontFace: F_SANS, fontSize: 9, color: c, align: "center",
      charSpacing: 2 });
  txt(s, `密 · ${String(n).padStart(2, "0")}`, 11.63, 7.12, 1.0, 0.3,
    { fontFace: F_SANS, fontSize: 9, color: c, align: "right" });
}
/* chapter kicker + title for content pages (no rule beneath) --------------- */
function head(s, kicker, title, kickerColor = ZHU) {
  txt(s, kicker, 0.7, 0.5, 6.0, 0.3,
    { fontFace: F_SANS, fontSize: 11.5, color: kickerColor,
      charSpacing: 4, bold: true });
  txt(s, title, 0.7, 0.82, 11.9, 0.7,
    { fontFace: F_SERIF, fontSize: 29, color: INK, bold: true });
}

/* ==========================================================================
 * P1 — 封面：落日孤船（保留原图）
 * ==========================================================================*/
function s1() {
  const s = p.addSlide();
  s.addImage({ path: IMG("bg-p1-luori.jpeg"), x: 0, y: 0, w: CW, h: CH });
  // legibility veil, center-low
  s.addImage({ path: IMG("plate-ink.png"), x: 2.4, y: 3.05, w: 8.5, h: 2.5,
    transparency: 30 });
  txt(s, "思政课 · 我来讲 ｜ 红色名言解读", 0.7, 0.62, 6.0, 0.35,
    { fontFace: F_SANS, fontSize: 13, color: PW, charSpacing: 3,
      extra: { fill: { color: INK, transparency: 55 }, line: { type: "none" } } });
  txt(s, "誓与密码共存亡", 1.4, 3.55, 10.5, 1.25,
    { fontFace: F_SERIF, fontSize: 60, bold: true, color: PW,
      align: "center", charSpacing: 10 });
  txt(s, "—— 中共中央社会部机要科译电员　董健民（1923—1946）", 1.4, 4.95,
    10.5, 0.45, { fontFace: F_SERIF, fontSize: 17, color: PW,
      align: "center" });
  txt(s, "汇报人：XXX　｜　2026 年 10 月", 0.7, 6.62, 11.93, 0.35,
    { fontFace: F_SANS, fontSize: 12, color: XUAN_L, align: "center" });
}

/* ==========================================================================
 * P2 — 倒叙：船舷（保留原图）
 * ==========================================================================*/
function s2() {
  const s = p.addSlide();
  s._darkFooter = true;
  s.addImage({ path: IMG("bg-p2-chuanxian.jpeg"), x: 0, y: 0, w: CW, h: CH });
  s.addImage({ path: IMG("scrim-bottom.png"), x: 0, y: 4.35, w: CW, h: 3.15 });
  txt(s, "1946 年 11 月 7 日　·　渤海湾", 0.7, 4.62, 8.0, 0.35,
    { fontFace: F_SANS, fontSize: 13, color: GOLD, charSpacing: 3, bold: true });
  const lines = [
    "一艘从烟台开往大连的木帆船，在渤海湾被国民党军舰截停。",
    "船上有中共中央社会部的一对年轻夫妇、一个两岁的孩子，和一批绝密密码。",
    "军警要登船。",
    "他们把密件紧抱在胸前，转身跃入大海。",
  ];
  lines.forEach((l, i) =>
    txt(s, l, 0.7, 5.05 + i * 0.42, 11.0, 0.4,
      { fontFace: F_SERIF, fontSize: 15.5, color: PW,
        lineSpacing: 1.05 }));
  txt(s, "一家三口，无一生还；密件，一页未失。", 0.7, 6.78, 11.9, 0.35,
    { fontFace: F_SERIF, fontSize: 14, color: GOLD, bold: true });
}

/* ==========================================================================
 * P3 — 方法目录：四卷宗（只点亮章四）
 * ==========================================================================*/
function s3() {
  const s = p.addSlide();
  xuanGround(s);
  head(s, "READING METHOD · 阅读方法", "怎么读这 47 个字");

  // left: the four lines, only the last lit
  txt(s, "这是她 1942 年写下的结婚誓词 ——", 0.7, 1.85, 5.6, 0.35,
    { fontFace: F_SERIF, fontSize: 13.5, color: INK_M, italic: true });
  const four = [
    ["为了千百万人能够得到解放", false],
    ["为了实现共产主义理想", false],
    ["宁可牺牲自己的性命，也绝不泄露党的机密", false],
    ["誓与密码共存亡", true],
  ];
  four.forEach(([l, hot], i) =>
    txt(s, l, 0.7, 2.35 + i * 0.62, 5.7, 0.5,
      { fontFace: F_SERIF, fontSize: hot ? 20 : 15.5, bold: hot,
        color: hot ? ZHU : INK_L, lineSpacing: 1.05 }));
  txt(s, "今天，我们从最后一句话讲起。", 0.7, 4.95, 5.7, 0.4,
    { fontFace: F_SERIF, fontSize: 13.5, color: INK_M });

  // right: four dossier folders
  const doss = [
    ["章 一", "千百万人", "users", false],
    ["章 二", "实　现", "target", false],
    ["章 三", "宁可……也绝不", "heart", false],
    ["章 四", "共存亡", "lock", true],
  ];
  const dx0 = 6.85, dw = 5.55, dh = 0.92, gy = 0.16, dy0 = 1.85;
  doss.forEach(([cn, nm, ic, hot], i) => {
    const x = dx0 + (hot ? -0.12 : 0), y = dy0 + i * (dh + gy);
    // folder tab
    s.addShape("roundRect", { x: x + 0.28, y: y - 0.02, w: 1.35, h: 0.3,
      rectRadius: 0.04,
      fill: { color: hot ? ZHU_D : XUAN_D }, line: { type: "none" } });
    // folder body
    s.addShape("roundRect", { x, y: y + 0.2, w: dw, h: dh - 0.2,
      rectRadius: 0.06,
      fill: { color: hot ? ZHU : XUAN_D },
      line: { color: hot ? ZHU_D : "C9C2B6", width: 0.75 },
      shadow: softShadow(hot ? 0.34 : 0.18, 7, hot ? 5 : 3),
      rotate: hot ? -1 : 0 });
    txt(s, cn, x + 0.32, y + 0.34, 1.2, 0.4,
      { fontFace: F_SANS, fontSize: 11, bold: true, charSpacing: 2,
        color: hot ? XUAN_L : INK_L });
    txt(s, nm, x + 1.35, y + 0.31, 2.9, 0.5,
      { fontFace: F_SERIF, fontSize: 18, bold: true,
        color: hot ? PW : INK_M });
    ico(s, ic, hot ? "PW" : "ZHU", x + dw - 0.72, y + 0.3, 0.55);
  });
  txt(s, "一词一证 —— 每章只挑一个词，用真实事迹把它坐实。", 0.7, 6.45,
    11.9, 0.4, { fontFace: F_SERIF, fontSize: 14, color: INK, bold: true });
  footer(s, 3);
}

/* ==========================================================================
 * P4 — 章一：47 字活字盘 + 第 48 格描红「我」
 * ==========================================================================*/
function s4() {
  const s = p.addSlide();
  xuanGround(s);
  head(s, "章 一　·　CH.1", "千百万人");
  txt(s, "「为了千百万人能够得到解放」", 0.7, 1.42, 7.0, 0.4,
    { fontFace: F_SERIF, fontSize: 15, color: INK_M, italic: true });

  // movable-type tray
  const rows = [
    "为了千百万人能够得到解放".split(""),       // 12
    "为了实现共产主义理想".split(""),           // 10
    "宁可牺牲自己的性命也绝不泄露党的机密".split(""), // 18
    "誓与密码共存亡".split(""),                 // 7
  ];
  const g = 0.58, gap = 0.0;
  const y0 = 2.15, rh = 0.64;
  rows.forEach((row, r) => {
    const w = row.length * g;
    const x = (CW - w) / 2;
    const y = y0 + r * rh;
    row.forEach((ch, i) => {
      s.addShape("rect", { x: x + i * g, y, w: g - gap, h: g - gap,
        fill: { color: XUAN_L, transparency: 55 },
        line: { color: "B9B2A4", width: 0.5 } });
      txt(s, ch, x + i * g, y + 0.06, g - gap, g - gap,
        { fontFace: F_SERIF, fontSize: 17, color: INK_M, align: "center",
          valign: "middle" });
    });
    // 48th tracing-red "我" cell, appended after the final row
    if (r === 3) {
      const mx = x + row.length * g + 0.35, my = y;
      s.addShape("rect", { x: mx, y: my, w: g, h: g,
        fill: { color: XUAN, transparency: 30 },
        line: { color: ZHU, width: 1.5, dashType: "dash" } });
      txt(s, "我", mx, my + 0.05, g, g,
        { fontFace: F_SERIF, fontSize: 18, bold: true, color: ZHU,
          align: "center", valign: "middle",
          extra: { transparency: 35 } });
      txt(s, "← 描红格", mx + g + 0.12, my + 0.16, 1.2, 0.35,
        { fontFace: F_SANS, fontSize: 11, color: ZHU });
    }
  });

  // reading
  txt(s, "前 22 个字，都有具体对象：「千百万人」是四万万同胞，「共产主义」是写在纲领里的理想。",
    0.7, 5.05, 11.9, 0.4, { fontFace: F_SERIF, fontSize: 13.5, color: INK });
  txt(s, "唯独「我」，不在这 47 个字里 —— 它要读的人，自己填。",
    0.7, 5.5, 11.9, 0.45, { fontFace: F_SERIF, fontSize: 17, bold: true,
      color: ZHU });
  txt(s, "我是谁？是 19 岁的董健民，是钟琪，是明明，是每一个普通党员 —— 也是今天的你我。",
    0.7, 6.1, 11.9, 0.4, { fontFace: F_SERIF, fontSize: 13, color: INK_M });
  footer(s, 4);
}

/* ==========================================================================
 * P5 — 章一事迹：行进地图长卷（ill-01 与地图融合）
 * ==========================================================================*/
function s5() {
  const s = p.addSlide();
  xuanGround(s);
  tint(s, ZHU, 94); // warm
  head(s, "章 一　·　千百万人", "她走了两万里，去救她不认识的人");

  // stat strip
  const stats = [["8", "个月"], ["约 2 万", "里路"], ["800", "里末程"],
                 ["3 → 2", "人到延安"]];
  stats.forEach(([a, b], i) => {
    const x = 0.7 + i * 2.0;
    txt(s, a, x, 1.62, 1.9, 0.45, { fontFace: F_SANS, fontSize: 24,
      bold: true, color: ZHU });
    txt(s, b, x, 2.12, 1.9, 0.3, { fontFace: F_SERIF, fontSize: 11.5,
      color: INK_M });
  });

  // route nodes [name, x, y, label offset]
  const nodes = [
    ["天津·静海", 1.3, 4.35, "1939 春 · 3 人出发"],
    ["香港", 3.3, 4.75, ""],
    ["广西凭祥", 5.3, 3.95, "大姐病逝于此"],
    ["贵阳", 7.1, 4.45, ""],
    ["西安", 9.1, 3.45, ""],
    ["延安", 11.3, 2.55, "1939 秋 · 2 人到达"],
  ];
  for (let i = 0; i < nodes.length - 1; i++) {
    const [, x1, y1] = nodes[i], [, x2, y2] = nodes[i + 1];
    // break the segment into/after 凭祥 (index 2)
    if (i === 2) {
      // dashed faint continuation (the route paused)
      s.addShape("line", { x: x1 + 0.25, y: y1, w: (x2 - x1) - 0.4,
        h: (nodes[3][2] - y1),
        line: { color: INK_L, width: 1, dashType: "dash" } });
    } else {
      s.addShape("line", { x: x1 + 0.14, y: y1, w: (x2 - x1) - 0.28,
        h: y2 - y1, line: { color: ZHU, width: 1.75, beginArrowType: "none",
          endArrowType: i === 4 ? "triangle" : "none" } });
    }
  }
  nodes.forEach(([nm, x, y, lab], i) => {
    const hot = i === 0 || i === 5;
    s.addShape("ellipse", { x: x - 0.1, y: y - 0.1, w: 0.2, h: 0.2,
      fill: { color: hot ? ZHU : INK }, line: { color: PW, width: 1 } });
    txt(s, nm, x - 0.9, y - 0.52, 1.8, 0.3, { fontFace: F_SERIF,
      fontSize: 12.5, bold: hot, color: INK, align: "center" });
    if (lab) txt(s, lab, x - 1.1, y + 0.18, 2.2, 0.3,
      { fontFace: F_SANS, fontSize: 10.5, color: hot ? ZHU : INK_M,
        align: "center" });
    if (i === 2) {
      ico(s, "x", "ZHU", x - 0.13, y - 0.55, 0.27);
    }
    if (i === 5) txt(s, "★", x - 0.13, y - 0.62, 0.3, 0.35,
      { fontFace: F_SERIF, fontSize: 18, color: GOLD, align: "center" });
  });

  // long-scroll band: ill-01 road, pre-cropped to exact ratio
  s.addImage({ path: IMG("ill-01-band.png"), x: 0, y: 5.35, w: CW, h: 1.6 });
  // soft blend veil over the band top edge
  s.addShape("rect", { x: 0, y: 5.35, w: CW, h: 0.28,
    fill: { color: XUAN, transparency: 35 }, line: { type: "none" } });
  footer(s, 5);
}

/* ==========================================================================
 * P6 — 章二岗位：装裱静物画（ill-02 入画框）
 * ==========================================================================*/
function s6() {
  const s = p.addSlide();
  xuanGround(s);
  head(s, "章 二　·　CH.2", "把理想，变成每天的工作");

  // framed still life, right
  const fx = 6.7, fy = 1.6, fw = 5.95, fh = 4.35;
  s.addShape("rect", { x: fx, y: fy, w: fw, h: fh, fill: { color: INK },
    line: { color: "171A1D", width: 1 }, shadow: softShadow(0.4, 12, 7) });
  s.addShape("rect", { x: fx + 0.28, y: fy + 0.28, w: fw - 0.56,
    h: fh - 0.78, fill: { color: PW }, line: { type: "none" } });
  s.addImage({ path: IMG("ill-02-frame.png"), x: fx + 0.42,
    y: fy + 0.42, w: fw - 0.84, h: fh - 1.06 });
  // gallery label
  s.addShape("rect", { x: fx + 0.28, y: fy + fh - 0.46, w: 3.2, h: 0.34,
    fill: { color: XUAN_D }, line: { color: "C9C2B6", width: 0.5 } });
  txt(s, "《延安枣园 · 机要科工作台》", fx + 0.4, fy + fh - 0.43, 3.0, 0.3,
    { fontFace: F_SERIF, fontSize: 11.5, color: INK });

  // left: post details
  txt(s, "岗　位", 0.7, 1.7, 2.0, 0.3, { fontFace: F_SANS, fontSize: 11,
    color: ZHU, charSpacing: 4, bold: true });
  txt(s, "中共中央社会部机要科 · 译电员", 0.7, 2.0, 5.5, 0.45,
    { fontFace: F_SERIF, fontSize: 17, bold: true, color: INK });

  // code-name badge
  s.addShape("roundRect", { x: 0.7, y: 2.62, w: 2.55, h: 0.66,
    rectRadius: 0.06, fill: { color: XUAN_D },
    line: { color: ZHU, width: 1 }, shadow: softShadow(0.18, 5, 2) });
  txt(s, "代号 · 小董", 0.7, 2.72, 2.55, 0.46, { fontFace: F_SERIF,
    fontSize: 16, bold: true, color: ZHU, align: "center" });
  ico(s, "tag", "ZHU", 3.42, 2.72, 0.46);

  txt(s, "把电码四个数字一组，翻回领导同志的名字。", 0.7, 3.6, 5.6, 0.4,
    { fontFace: F_SERIF, fontSize: 14.5, color: INK });
  txt(s, "为周恩来领导的南方局译电 —— 延安 ⇌ 重庆，跨越千山万水。",
    0.7, 4.05, 5.6, 0.5, { fontFace: F_SERIF, fontSize: 14.5, color: INK,
      lineSpacing: 1.1 });
  s.addShape("roundRect", { x: 0.7, y: 4.85, w: 5.55, h: 0.95,
    rectRadius: 0.06, fill: { color: ZHU }, line: { type: "none" },
    shadow: softShadow(0.3, 7, 4) });
  txt(s, "三年（1940—1942），经她手的电报，无一差错。", 0.9, 4.85, 5.2,
    0.95, { fontFace: F_SERIF, fontSize: 15, bold: true, color: PW,
      valign: "middle" });
  ico(s, "headphones", "PW", 0.95, 5.05, 0.5);
  footer(s, 6);
}

/* ==========================================================================
 * P7 — 章二制度：竖轴时间线 + 译电揭示
 * ==========================================================================*/
function s7() {
  const s = p.addSlide();
  xuanGround(s);
  head(s, "章 二　·　实　现", "制度，是无数人用命换来的");

  // vertical spine
  s.addShape("line", { x: 1.32, y: 2.0, w: 0, h: 4.55,
    line: { color: ZHU, width: 1.75 } });
  const docs = [
    ["1932 · 苏区", "三人同行；密件离身，即销毁。"],
    ["1940 · 延安", "密码必须手抄，不许付印。"],
    ["1941 · 延安", "《机要规则》：密码本，用完即焚。"],
    ["2025 · 现行", "《密码法》《保守国家秘密法》。"],
  ];
  docs.forEach(([yr, body], i) => {
    const y = 1.95 + i * 1.16;
    s.addShape("ellipse", { x: 1.21, y: y + 0.16, w: 0.22, h: 0.22,
      fill: { color: ZHU }, line: { color: PW, width: 1 } });
    paperCard(s, 1.72, y, 4.55, 0.98);
    // staple
    s.addShape("line", { x: 1.95, y: y + 0.12, w: 0.0, h: 0.22,
      line: { color: INK_L, width: 1.5 } });
    txt(s, yr, 2.12, y + 0.12, 2.2, 0.3, { fontFace: F_SANS, fontSize: 12,
      bold: true, color: ZHU });
    txt(s, body, 2.12, y + 0.44, 4.0, 0.45, { fontFace: F_SERIF,
      fontSize: 13, color: INK });
  });

  // decrypt reveal, right
  txt(s, "译 电 · DECRYPT", 7.1, 1.95, 4.0, 0.3, { fontFace: F_SANS,
    fontSize: 11, color: ZHU, charSpacing: 4, bold: true });
  paperCard(s, 7.1, 2.3, 5.3, 2.5);
  txt(s, "0472　　1163", 7.35, 2.6, 4.8, 0.6, { fontFace: F_SANS,
    fontSize: 30, bold: true, color: INK, align: "center" });
  ico(s, "arrow-right", "ZHU", 9.35, 3.28, 0.7);
  txt(s, "生　　命", 7.35, 3.95, 4.8, 0.7, { fontFace: F_SERIF,
    fontSize: 40, bold: true, color: ZHU, align: "center" });
  txt(s, "密码表上，「生命」的码是 0472 1163；这张表上，没有「投降」两个字。",
    7.1, 5.05, 5.4, 0.7, { fontFace: F_SERIF, fontSize: 13, color: INK_M,
      lineSpacing: 1.15 });
  txt(s, "这些规则，每一条背后，都有人付出过生命。", 7.1, 5.95, 5.4, 0.5,
    { fontFace: F_SERIF, fontSize: 15, bold: true, color: ZHU });
  footer(s, 7);
}

/* ==========================================================================
 * P8 — 章三婚礼：喜帖（全篇唯一暖色）
 * ==========================================================================*/
function s8() {
  const s = p.addSlide();
  xuanGround(s);
  tint(s, ZHU, 86);
  head(s, "章 三　·　CH.3", "宁可……也绝不", ZHU_D);

  // left: wedding scene, pre-cropped to exact ratio
  s.addImage({ path: IMG("ill-03-card.png"), x: 0.62, y: 1.75, w: 6.0,
    h: 4.35 });
  s.addShape("rect", { x: 0.62, y: 1.75, w: 6.0, h: 4.35,
    fill: { type: "none" }, line: { color: ZHU, width: 1.25 } });
  s.addShape("rect", { x: 0.74, y: 1.87, w: 5.76, h: 4.11,
    fill: { type: "none" }, line: { color: GOLD, width: 0.75 } });

  // right: invitation card
  const px2 = 6.95, py2 = 1.7, pw2 = 5.7, ph2 = 4.7;
  s.addShape("rect", { x: px2, y: py2, w: pw2, h: ph2, fill: { color: PW },
    line: { color: ZHU, width: 1.5 }, shadow: softShadow(0.32, 9, 5) });
  s.addShape("rect", { x: px2 + 0.12, y: py2 + 0.12, w: pw2 - 0.24,
    h: ph2 - 0.24, fill: { type: "none" }, line: { color: GOLD, width: 0.75 } });
  txt(s, "囍", px2, py2 + 0.2, pw2, 0.95, { fontFace: F_SERIF, fontSize: 48,
    bold: true, color: ZHU, align: "center" });
  const rows8 = [
    "时　一九四二年",
    "地　延安枣园 · 窑洞",
    "新郎 钟琪　｜　新娘 董健民",
    "证婚人　李克农",
  ];
  rows8.forEach((r, i) =>
    txt(s, r, px2 + 0.5, py2 + 1.35 + i * 0.5, pw2 - 1.0, 0.4,
      { fontFace: F_SERIF, fontSize: 15, color: INK, align: "center" }));
  s.addShape("line", { x: px2 + 0.5, y: py2 + 3.42, w: pw2 - 1.0, h: 0,
    line: { color: GOLD, width: 0.75 } });
  txt(s, "结婚誓词，就是那 47 个字。", px2 + 0.3, py2 + 3.55, pw2 - 0.6, 0.4,
    { fontFace: F_SERIF, fontSize: 14.5, bold: true, color: ZHU,
      align: "center" });
  txt(s, "没有鲜花婚床 —— 一盏油灯，一张红绸。", px2 + 0.3, py2 + 4.0,
    pw2 - 0.6, 0.4, { fontFace: F_SERIF, fontSize: 12.5, color: INK_M,
      align: "center" });
  footer(s, 8);
}

/* ==========================================================================
 * P9 — 章三海上：至暗全图
 * ==========================================================================*/
function s9() {
  const s = p.addSlide();
  s._darkFooter = true;
  s.addImage({ path: IMG("ill-04-cover.png"), x: 0, y: 0, w: CW, h: CH });
  s.addImage({ path: IMG("plate-ink.png"), x: 1.6, y: 0.25, w: 10.1, h: 2.7,
    transparency: 20 });

  txt(s, "1946.11.7　·　兑现的日子", 0.7, 0.5, 6.0, 0.35,
    { fontFace: F_SANS, fontSize: 13, color: GOLD, bold: true, charSpacing: 3 });
  // route mini, top-right
  txt(s, "烟台 ────→ 大连 · 建秘密电台", 8.0, 0.52, 4.65, 0.35,
    { fontFace: F_SANS, fontSize: 11, color: XUAN_L, align: "right" });

  const l9 = [
    "船在烟台外海，被国民党军舰截停。",
    "炮火击中船帆，军警要登船检查。",
    "钟琪、董健民抱紧两岁的明明。",
  ];
  l9.forEach((l, i) =>
    txt(s, l, 0.7, 1.05 + i * 0.5, 10.6, 0.45, { fontFace: F_SERIF,
      fontSize: 16.5, color: PW, lineSpacing: 1.05 }));
  txt(s, "他们把密件绑在身上，相拥跳入渤海。", 0.7, 2.6, 10.6, 0.45,
    { fontFace: F_SERIF, fontSize: 17, bold: true, color: GOLD });

  txt(s, "一 页 ， 没 有 。", 6.4, 5.35, 6.3, 0.9,
    { fontFace: F_SERIF, fontSize: 38, bold: true, color: GOLD,
      align: "center" });
  footer(s, 9);
}

/* ==========================================================================
 * P10 — 生还者：漂流图 + 口述笔录
 * ==========================================================================*/
function s10() {
  const s = p.addSlide();
  xuanGround(s);
  head(s, "目击者 · WITNESS", "唯一的生还者");

  // giant watermark 1
  txt(s, "1", 9.7, 1.5, 3.4, 3.2, { fontFace: F_SANS, fontSize: 210,
    bold: true, color: ZHU, align: "center", extra: { transparency: 88 } });

  // drift diagram
  const yD = 2.55;
  ico(s, "anchor", "INK", 1.4, yD, 0.62);
  txt(s, "11.7 船被截停", 1.0, yD + 0.68, 1.6, 0.3, { fontFace: F_SANS,
    fontSize: 10.5, color: INK_M, align: "center" });
  // undulating dashed path
  const seg = [
    [2.15, yD + 0.28, 1.5, 0.35],
    [3.65, yD + 0.6, 1.5, -0.35],
    [5.15, yD + 0.28, 1.5, 0.35],
    [6.65, yD + 0.6, 1.5, -0.35],
    [8.15, yD + 0.3, 1.4, 0.2],
  ];
  seg.forEach(([x, y, w, h]) =>
    s.addShape("line", { x, y, w, h, line: { color: ZHU, width: 1.5,
      dashType: "dash" } }));
  ico(s, "package", "ZHU", 5.25, yD - 0.05, 0.6);
  txt(s, "抱木箱漂流", 4.95, yD + 0.62, 1.3, 0.3, { fontFace: F_SANS,
    fontSize: 10.5, color: ZHU, align: "center" });
  ico(s, "ship", "ZHU", 9.55, yD - 0.05, 0.78);
  txt(s, "苏联商船救起", 9.2, yD + 0.78, 1.6, 0.3, { fontFace: F_SANS,
    fontSize: 10.5, color: ZHU, align: "center" });

  // oral record
  paperCard(s, 1.4, 4.15, 7.6, 2.35);
  txt(s, "交通员 · 口述记录", 1.7, 4.35, 4.0, 0.3, { fontFace: F_SANS,
    fontSize: 11.5, bold: true, color: ZHU, charSpacing: 2 });
  const rec = [
    "同船交通员抱着一个木箱漂流。",
    "木箱里没有密码 —— 密码，在董健民身上。",
    "他被苏联商船救起，成为唯一目击者。",
  ];
  rec.forEach((r, i) => {
    s.addShape("line", { x: 1.7, y: 4.92 + i * 0.48, w: 7.0, h: 0,
      line: { color: "D5CEC0", width: 0.75 } });
    txt(s, r, 1.7, 4.78 + i * 0.48, 7.0, 0.4, { fontFace: F_SERIF,
      fontSize: 13.5, color: INK });
  });

  txt(s, "1", 9.7, 4.35, 2.6, 1.3, { fontFace: F_SANS, fontSize: 96,
    bold: true, color: ZHU, align: "center" });
  txt(s, "一家三口，唯他生还", 9.3, 5.7, 3.3, 0.4, { fontFace: F_SERIF,
    fontSize: 13.5, color: INK_M, align: "center" });
  footer(s, 10);
}

/* ==========================================================================
 * P11 — 章四身后：空盒 + 迟到时间线 + 两笔账
 * ==========================================================================*/
function s11() {
  const s = p.addSlide();
  xuanGround(s);
  head(s, "章 四　·　CH.4", "零遗物");

  // left: empty box, pre-cropped to exact ratio
  s.addImage({ path: IMG("ill-05-frame.png"), x: 0.62, y: 1.7, w: 5.9,
    h: 3.5 });
  s.addShape("rect", { x: 0.62, y: 1.7, w: 5.9, h: 3.5, fill: { type: "none" },
    line: { color: "C9C2B6", width: 0.75 } });
  txt(s, "1983 · 家人领到的骨灰盒，里面只有一份悼词。", 0.62, 5.3, 6.0, 0.35,
    { fontFace: F_SERIF, fontSize: 12.5, color: INK_M, italic: true });

  // right: "late" timeline
  const late = [
    ["1946", "一家三口，牺牲于渤海"],
    ["1981", "全国机要工作会议 —— 消息迟到 35 年"],
    ["1983", "骨灰盒送回家 —— 里面只有一份悼词"],
    ["1988", "天津烈士陵园 —— 一家三口的名字"],
    ["2025", "五座展厅 —— 他们的名字在最前"],
  ];
  s.addShape("line", { x: 7.0, y: 1.95, w: 0, h: 3.55,
    line: { color: GOLD, width: 1.25, dashType: "sysDash" } });
  late.forEach(([yr, body], i) => {
    const y = 1.85 + i * 0.82;
    s.addShape("ellipse", { x: 6.9, y: y + 0.08, w: 0.2, h: 0.2,
      fill: { color: GOLD }, line: { color: PW, width: 1 } });
    txt(s, yr, 7.3, y, 0.85, 0.35, { fontFace: F_SANS, fontSize: 13,
      bold: true, color: ZHU });
    txt(s, body, 8.15, y + 0.01, 4.5, 0.4, { fontFace: F_SERIF, fontSize: 12.5,
      color: INK });
  });

  // two ledgers
  paperCard(s, 0.62, 5.75, 3.55, 1.15);
  txt(s, "她没带走的", 0.85, 5.88, 2.0, 0.3, { fontFace: F_SANS,
    fontSize: 10.5, color: INK_M });
  txt(s, "0", 0.85, 6.12, 0.9, 0.7, { fontFace: F_SANS, fontSize: 40,
    bold: true, color: INK });
  txt(s, "件遗物", 1.75, 6.42, 1.2, 0.35, { fontFace: F_SERIF, fontSize: 12,
    color: INK_M });
  paperCard(s, 4.35, 5.75, 3.55, 1.15);
  txt(s, "敌人没得到的", 4.58, 5.88, 2.0, 0.3, { fontFace: F_SANS,
    fontSize: 10.5, color: INK_M });
  txt(s, "0", 4.58, 6.12, 0.9, 0.7, { fontFace: F_SANS, fontSize: 40,
    bold: true, color: ZHU });
  txt(s, "页密件", 5.48, 6.42, 1.2, 0.35, { fontFace: F_SERIF, fontSize: 12,
    color: INK_M });

  txt(s, "她守住的，是「一页未落」。", 8.3, 5.95, 4.4, 0.5,
    { fontFace: F_SERIF, fontSize: 16, bold: true, color: ZHU });
  txt(s, "天津 · 静海 · 延安 · 大连 · 北京 —— 五座展厅", 8.3, 6.5, 4.5, 0.35,
    { fontFace: F_SANS, fontSize: 10.5, color: INK_M });
  footer(s, 11);
}

/* ==========================================================================
 * P12 — 新时代（重点）：今昔分屏 + 纸带聊天 + 法律落点
 * ==========================================================================*/
function s12() {
  const s = p.addSlide();
  // upper split: left dark / right light
  const upH = 4.5;
  s.addShape("rect", { x: 0, y: 0, w: 6.666, h: upH, fill: { color: DARK },
    line: { type: "none" } });
  xuanGround(s);
  // repaint left dark over the texture (texture covered full slide)
  s.addShape("rect", { x: 0, y: 0, w: 6.666, h: upH, fill: { color: DARK },
    line: { type: "none" } });
  // lower zone tint
  s.addShape("rect", { x: 0, y: upH, w: CW, h: CH - upH,
    fill: { color: XUAN_D, transparency: 30 }, line: { type: "none" } });
  s.addShape("line", { x: 0, y: upH, w: CW, h: 0,
    line: { color: GOLD, width: 1 } });

  /* ---- left: 1946 ---- */
  txt(s, "1946 · 渤 海", 0.7, 0.5, 4.0, 0.35, { fontFace: F_SANS,
    fontSize: 13, color: GOLD, bold: true, charSpacing: 4 });
  const old = [
    ["ship", "一艘军舰，截停一条木船"],
    ["crosshair", "炮火，击中船帆"],
    ["arrow-up", "军警，登船抢密码"],
  ];
  old.forEach(([ic, l], i) => {
    const y = 1.25 + i * 0.72;
    s.addShape("ellipse", { x: 0.72, y: y - 0.04, w: 0.62, h: 0.62,
      fill: { color: "2E3E49" }, line: { type: "none" } });
    ico(s, ic, "PW", 0.78, y + 0.02, 0.5);
    txt(s, l, 1.55, y + 0.05, 4.7, 0.45, { fontFace: F_SERIF, fontSize: 15.5,
      color: PW });
  });
  txt(s, "要拿一本密码 ——", 0.7, 3.5, 5.6, 0.4, { fontFace: F_SERIF,
    fontSize: 16, color: PW });
  txt(s, "需要一艘军舰。", 0.7, 3.88, 5.6, 0.5, { fontFace: F_SERIF,
    fontSize: 21, bold: true, color: GOLD });

  /* ---- right: 2025 ---- */
  txt(s, "2025 · 校 园", 7.05, 0.5, 4.0, 0.35, { fontFace: F_SANS,
    fontSize: 13, color: ZHU, bold: true, charSpacing: 4 });
  ico(s, "message", "ZHU", 12.0, 0.42, 0.55);
  // tape, rotated
  s.addImage({ path: AST("tape-long.png"), x: 6.95, y: 1.25, w: 6.1, h: 1.22,
    rotate: -7, shadow: softShadow(0.3, 7, 4) });
  const chat = ["同学 兼职 写材料 吗", "报酬 丰厚 好商量",
                "先签 一份 保密 协议"];
  chat.forEach((l, i) =>
    txt(s, l, 7.35, 1.5 + i * 0.34, 5.3, 0.32, { fontFace: F_SANS,
      fontSize: 13.5, color: INK, rotate: -7, charSpacing: 1 }));
  txt(s, "要拿今天的密码 ——", 7.05, 3.5, 5.7, 0.4, { fontFace: F_SERIF,
    fontSize: 16, color: INK });
  txt(s, "只需要一条消息。", 7.05, 3.88, 5.7, 0.5, { fontFace: F_SERIF,
    fontSize: 21, bold: true, color: ZHU });

  /* ---- center seam + bridge ---- */
  s.addShape("line", { x: 6.666, y: 0.35, w: 0, h: upH - 0.7,
    line: { color: GOLD, width: 1, dashType: "dash" } });
  s.addShape("ellipse", { x: 6.236, y: 1.85, w: 0.86, h: 0.86,
    fill: { color: XUAN }, line: { color: ZHU, width: 1.25 },
    shadow: softShadow(0.3, 6, 3) });
  txt(s, "79 年", 6.236, 2.06, 0.86, 0.4, { fontFace: F_SERIF, fontSize: 14,
    bold: true, color: ZHU, align: "center" });

  /* ---- lower: today's ciphers + laws ---- */
  txt(s, "今天的密码，就在我们身边：", 0.7, upH + 0.22, 4.2, 0.35,
    { fontFace: F_SERIF, fontSize: 14, bold: true, color: INK });
  const today = [["drive", "实验数据"], ["cpu", "核心算法"],
                 ["ruler", "未公开图纸"], ["file", "未刊成果"],
                 ["eye", "个人隐私"]];
  today.forEach(([ic, l], i) => {
    const x = 0.7 + i * 1.18;
    ico(s, ic, i % 2 ? "ZHU" : "INK", x, upH + 0.62, 0.5);
    txt(s, l, x - 0.2, upH + 1.16, 0.9, 0.3, { fontFace: F_SERIF,
      fontSize: 11, color: INK_M, align: "center" });
  });

  txt(s, "守住它，有法可依：", 7.0, upH + 0.22, 4.0, 0.35,
    { fontFace: F_SERIF, fontSize: 14, bold: true, color: INK });
  const laws = [["scale", "《保守国家秘密法》第 9 条"],
                ["book", "《密码法》"],
                ["calendar", "4·15 全民国家安全教育日"]];
  laws.forEach(([ic, l], i) => {
    const y = upH + 0.6 + i * 0.46;
    ico(s, ic, "ZHU", 7.0, y - 0.03, 0.38);
    txt(s, l, 7.5, y, 5.2, 0.35, { fontFace: F_SERIF, fontSize: 13,
      color: INK });
  });

  txt(s, "守住它，就是守住千万人的解放。", 0.7, 6.55, 11.9, 0.4,
    { fontFace: F_SERIF, fontSize: 18, bold: true, color: ZHU,
      align: "center" });
  footer(s, 12);
}

/* ==========================================================================
 * P13 — 收束：整句点亮 + 长方全名印
 * ==========================================================================*/
function s13() {
  const s = p.addSlide();
  xuanGround(s);
  tint(s, ZHU, 95);
  head(s, "收 束 · CODA", "她的誓言，也是我们的");

  const full = [
    ["章一", "为了千百万人能够得到解放", INK],
    ["章二", "为了实现共产主义理想", INK],
    ["章三", "宁可牺牲自己的性命，也绝不泄露党的机密", INK],
    ["章四", "誓与密码共存亡", ZHU],
  ];
  full.forEach(([cn, l, c], i) => {
    const y = 2.0 + i * 0.78;
    txt(s, cn, 2.0, y + 0.06, 0.9, 0.4, { fontFace: F_SANS, fontSize: 11,
      color: INK_L, charSpacing: 2 });
    txt(s, l, 2.9, y, 8.6, 0.55, { fontFace: F_SERIF,
      fontSize: i === 3 ? 23 : 19, bold: i === 3, color: c });
  });

  // long rectangular name seal
  s.addShape("rect", { x: 8.7, y: 5.35, w: 3.9, h: 1.15,
    fill: { color: ZHU }, line: { color: ZHU_D, width: 1 },
    shadow: softShadow(0.32, 8, 4), rotate: -2 });
  txt(s, "誓与密码共存亡", 8.7, 5.35, 3.9, 1.15, { fontFace: F_SERIF,
    fontSize: 23, bold: true, color: PW, align: "center", valign: "middle",
    charSpacing: 4, rotate: -2 });

  txt(s, "1946　→　2026", 0.7, 5.5, 3.6, 0.5, { fontFace: F_SANS,
    fontSize: 22, bold: true, color: INK });
  txt(s, "这 47 个字，不是历史课本里的一句话 —— 是今天每一个人的底线。",
    0.7, 6.15, 11.9, 0.4, { fontFace: F_SERIF, fontSize: 15, color: INK });
  txt(s, "致敬　董健民、钟琪 与明明", 0.7, 6.55, 8.0, 0.35,
    { fontFace: F_SERIF, fontSize: 13, color: INK_M });
  footer(s, 13);
}

/* build -------------------------------------------------------------------- */
[s1, s2, s3, s4, s5].forEach(f => f());
const out = "C:/Users/29264/AppData/Local/Temp/dmrender/range.pptx";
p.writeFile({ fileName: out }).then(() => console.log("WROTE " + out));

