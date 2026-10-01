/* 誓与密码共存亡 · v1 deck builder (rev.2 — fixes the visual-QA findings)
 * 13 slides, 13.333 x 7.5 in.  Re-run:  node build_deck.js
 *
 * rev.2 changes, each traceable to a measured defect:
 *  - text plates: white-on-art measured 1.47:1, vermilion-on-art 1.15:1 -> add scrim plates
 *  - "dimmed" quote lines were alpha-based (1.55:1) -> use an ink shade, not transparency
 *  - vermilion is now restricted to light grounds; on dark art emphasis uses 暖金 D9A441
 *  - footer: morse band was 1.86" left of centre -> centred; seal was 0.27" touching the
 *    bottom edge -> 0.42" raised above the mount band (a painting's 落款印, not a dot)
 *  - one left margin (0.62), one rule width (12.1), one card treatment, across all pages
 *  - orphans from bad line breaks: boxes widened / lines shortened / text re-broken by hand
 */
const pptxgen = require("pptxgenjs");
const IMG = "C:/Users/29264/Desktop/思政课ppt/素材-v1/images/";
const OUT = "C:/Users/29264/Desktop/思政课ppt/素材-v1/out/誓与密码共存亡-v1.pptx";

const XUAN = "EDE7DA", XUAN_D = "E2D9C6", INK = "2B2F33", INK_L = "8A8F94",
      INK_M = "5A6066", INK_DIM = "6E6A62", ZHU = "B4452F", GOLD = "D9A441",
      PW = "F4EFE4";
const SERIF = "Noto Serif SC", SANS = "Noto Sans SC";
const W = 13.333, H = 7.5, BAND = 0.36, BY = H - BAND, ML = 0.62, CW = 12.1;
const MORSE = "· — · · —   · · — ·   — · · —   · — — ·   — · — —";

let pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "思政课「我来讲」";
pres.title = "誓与密码共存亡";

/* ---------------- shared chrome ---------------- */
function chrome(s, n, sealChar, src) {
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: BY, w: W, h: BAND,
    fill: { color: XUAN_D }, line: { color: XUAN_D, width: 0 } });
  s.addShape(pres.shapes.LINE, { x: 0, y: BY, w: W, h: 0, line: { color: INK_L, width: 0.75 } });
  s.addText("小董 · " + String(n).padStart(2, "0"), { x: ML, y: BY + 0.03, w: 1.5, h: BAND - 0.06,
    fontSize: 8.5, fontFace: SANS, color: INK_L, align: "left", valign: "middle", margin: 0 });
  s.addText(MORSE, { x: (W - 5.6) / 2, y: BY + 0.03, w: 5.6, h: BAND - 0.06, fontSize: 7.5,
    fontFace: SANS, color: INK_L, align: "center", valign: "middle", charSpacing: 1.2, margin: 0 });
  if (src) s.addText(src, { x: 7.5, y: BY + 0.03, w: 4.2, h: BAND - 0.06, fontSize: 7.5,
    fontFace: SERIF, color: INK_L, align: "right", valign: "middle", margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: W - ML - 0.42, y: BY - 0.50, w: 0.42, h: 0.42,
    fill: { color: ZHU }, line: { color: ZHU, width: 0 } });
  s.addText(sealChar, { x: W - ML - 0.42, y: BY - 0.50, w: 0.42, h: 0.42, fontSize: 18, bold: true,
    fontFace: SERIF, color: PW, align: "center", valign: "middle", margin: 0 });
}
function paper(s) { s.background = { path: IMG + "tex-xuanzhi.png" }; }
function full(s, f) { s.background = { path: IMG + f }; }
function plate(s, kind, x, y, w, h) {
  s.addImage({ path: IMG + (kind === "ink" ? "plate-ink.png" : "plate-xuan.png"), x, y, w, h });
}
function kicker(s, txt, o) {
  s.addText(txt, Object.assign({ x: ML, y: 0.46, w: 9.0, h: 0.3, fontSize: 11.5, fontFace: SERIF,
    color: INK_M, charSpacing: 2, align: "left", valign: "middle", margin: 0 }, o || {}));
}
function clause(s, txt, o) {
  s.addText(txt, Object.assign({ x: ML, y: 0.80, w: CW, h: 0.8, fontSize: 29, bold: true,
    fontFace: SERIF, color: INK, align: "left", valign: "middle", margin: 0 }, o || {}));
}
function rule(s, y) {
  s.addShape(pres.shapes.LINE, { x: ML, y: y, w: CW, h: 0, line: { color: INK_L, width: 0.75 } });
}
function card(s, x, y, w, h) {          // solid mount card, no hairline-only look
  s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: XUAN_D },
    line: { color: XUAN_D, width: 0 } });
  s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.055, h, fill: { color: ZHU },
    line: { color: ZHU, width: 0 } });
}

/* ================= P1 封面 ================= */
let s = pres.addSlide();
full(s, "bg-p1-luori.jpeg");
s.addText("红色名言解读 · 思政课「我来讲」", { x: ML, y: 1.24, w: 6.2, h: 0.3, fontSize: 12,
  fontFace: SERIF, color: INK_M, charSpacing: 1.5, align: "left", valign: "middle", margin: 0 });
s.addText("誓与密码共存亡", { x: ML - 0.04, y: 1.60, w: 6.9, h: 1.2, fontSize: 52, bold: true,
  fontFace: SERIF, color: INK, charSpacing: 4, align: "left", valign: "middle", margin: 0 });
rule(s, 3.02);
s.addText([
  { text: "一句 47 字的话 · 一个 23 岁的人 · 一片渤海", options: { breakLine: true, fontSize: 16, color: INK_M } },
  { text: "董健民（1923—1946）  中共中央社会部机要科 · 译电员", options: { fontSize: 13, color: INK } }
], { x: ML, y: 3.20, w: 7.4, h: 0.96, fontFace: SERIF, align: "left", valign: "top",
   paraSpaceAfter: 9, margin: 0 });
chrome(s, 1, "忠");

/* ================= P2 倒叙 ================= */
s = pres.addSlide();
full(s, "bg-p2-chuanxian.jpeg");
plate(s, "ink", 0.0, 4.30, 13.333, 3.20);
s.addText("1946 年 11 月 7 日 · 渤海", { x: ML, y: 4.62, w: 6.0, h: 0.32, fontSize: 13,
  fontFace: SERIF, color: "C9C2B6", charSpacing: 1.5, align: "left", valign: "middle", margin: 0 });
s.addText([
  { text: "一艘由烟台开往大连的船，被国民党军舰截停。", options: { breakLine: true } },
  { text: "炮弹击中甲板，两岁的孩子头部中了弹片。", options: { breakLine: true } },
  { text: "她把党的密件紧贴胸口，和丈夫、孩子抱在一起，翻过船舷。", options: { breakLine: true } },
  { text: "三个人，都没有再上来。", options: {} }
], { x: ML, y: 5.02, w: 11.4, h: 1.42, fontSize: 17.5, fontFace: SERIF, color: PW,
   align: "left", valign: "top", lineSpacing: 27, margin: 0 });
chrome(s, 2, "忠", "据天津日报、今晚报、解放军报");

/* ================= P3 方法 · 目录 ================= */
s = pres.addSlide(); paper(s);
kicker(s, "本课方法 · 不按年份讲，按这句话讲");
s.addText([
  { text: "为了千百万人能够得到解放，", options: { breakLine: true, color: INK_DIM } },
  { text: "为了实现共产主义理想，", options: { breakLine: true, color: INK_DIM } },
  { text: "宁可牺牲自己的性命，也绝不泄露党的机密，", options: { breakLine: true, color: INK_DIM } },
  { text: "誓与密码共存亡！", options: { color: ZHU, bold: true } }
], { x: ML, y: 1.00, w: 11.9, h: 2.42, fontSize: 32, fontFace: SERIF, align: "left",
   valign: "top", lineSpacing: 50, margin: 0 });
rule(s, 3.62);
s.addText("这句话还有四十字。今天分四章读回来——每章只挑一个词，让她的一生来解释它。",
  { x: ML, y: 3.78, w: CW, h: 0.4, fontSize: 15, fontFace: SERIF, color: INK_M,
   align: "left", valign: "middle", margin: 0 });
const toc = [["一", "千百万人", "1923 — 1939  南下延安", INK],
             ["二", "实现", "1940 — 1941  机要科", INK],
             ["三", "宁可…也绝不", "1942 婚誓 · 1946 渤海", INK],
             ["四", "共存亡", "1981 — 2025  与今天", INK]];
toc.forEach((r, i) => {
  const x = ML + i * 3.06, w = 2.86;
  s.addShape(pres.shapes.RECTANGLE, { x, y: 4.44, w, h: 1.66,
    fill: { color: XUAN_D }, line: { color: XUAN_D, width: 0 } });
  s.addShape(pres.shapes.RECTANGLE, { x, y: 4.44, w, h: 0.05,
    fill: { color: i === 2 ? ZHU : INK_L }, line: { color: i === 2 ? ZHU : INK_L, width: 0 } });
  s.addText("章 " + r[0], { x: x + 0.2, y: 4.62, w: w - 0.4, h: 0.26, fontSize: 10.5,
    fontFace: SERIF, color: INK_L, margin: 0 });
  s.addText(r[1], { x: x + 0.2, y: 4.92, w: w - 0.4, h: 0.48, fontSize: r[1].length > 4 ? 16 : 21,
    bold: true, fontFace: SERIF, color: r[3], margin: 0 });
  s.addText(r[2], { x: x + 0.2, y: 5.50, w: w - 0.4, h: 0.4, fontSize: 10.5,
    fontFace: SANS, color: INK_M, margin: 0 });
});
chrome(s, 3, "忠");

/* ================= P4 章一 · 章首 ================= */
s = pres.addSlide(); paper(s);
kicker(s, "第一章 · 命中一个词：千百万人");
clause(s, "为了千百万人能够得到解放");
rule(s, 1.72);
s.addText([
  { text: "把这句话数一遍。", options: { breakLine: true, fontSize: 21, color: INK } },
  { text: "47 个字里，没有一个「我」。", options: { breakLine: true, fontSize: 21, color: ZHU, bold: true } },
  { text: "前 22 个字里，只有「别人」——", options: { breakLine: true, fontSize: 21, color: INK } },
  { text: "千百万人，和一个理想。", options: { fontSize: 21, color: INK } }
], { x: ML, y: 2.02, w: 11.9, h: 2.1, fontFace: SERIF, align: "left", valign: "top",
   lineSpacing: 39, margin: 0 });
card(s, ML, 4.42, 11.9, 1.62);
s.addText([
  { text: "先问一句", options: { breakLine: true, fontSize: 12, color: INK_L } },
  { text: "「千百万人」是谁？她见过吗？", options: { breakLine: true, fontSize: 20, color: INK, bold: true } },
  { text: "下一页，她要遇见的第一件事，是自己家的人没有走到延安。", options: { fontSize: 13, color: INK_M } }
], { x: ML + 0.36, y: 4.66, w: 11.2, h: 1.2, fontFace: SERIF, align: "left", valign: "top",
   lineSpacing: 27, margin: 0 });
chrome(s, 4, "众", "光明日报 2019-04-16 · 共产党员网转载");

/* ================= P5 章一 · 事迹 ================= */
s = pres.addSlide(); paper(s);
s.addImage({ path: IMG + "ill-01-nanxia.png", x: 7.1, y: 0, w: 6.233, h: 7.14,
  sizing: { type: "cover", w: 6.233, h: 7.14 } });
kicker(s, "第一章 · 千百万人");
clause(s, "出发时三个人，到延安两个", { fontSize: 25, w: 6.2 });
s.addText([
  { text: "1923", options: { color: ZHU, bold: true } },
  { text: "  生于河北静海刘祥庄村，贫苦农家，排行第三，家贫辍学", options: { breakLine: true } },
  { text: "1939 年春", options: { color: ZHU, bold: true, breakLine: true } },
  { text: "  三姐妹扮成村姑离家，渡海南下", options: { breakLine: true } },
  { text: "  天津 → 香港 → 凭祥 → 贵阳 → 西安 → 徒步 800 里", options: { breakLine: true, fontSize: 13.5, color: INK_M } },
  { text: "  历时约 8 个月，辗转两万里。", options: { breakLine: true } },
  { text: "  大姐董清民，死在了路上。", options: { breakLine: true, bold: true } },
  { text: "1939 年 11 月", options: { color: ZHU, bold: true } },
  { text: "  到延安，入陕北公学", options: {} }
], { x: ML, y: 1.92, w: 6.2, h: 3.4, fontSize: 15, fontFace: SERIF, color: INK,
   align: "left", valign: "top", lineSpacing: 25, margin: 0 });
s.addText("她说的「千百万人」不是抽象的多数：她家就是这四万万人里的一户。",
  { x: ML, y: 5.52, w: 6.2, h: 0.78, fontSize: 14.5, fontFace: SERIF, color: ZHU,
   align: "left", valign: "top", lineSpacing: 23, margin: 0 });
chrome(s, 5, "众", "据人民网党史、天津日报、湖南日报");

/* ================= P6 章二 · 岗位 ================= */
s = pres.addSlide(); paper(s);
s.addImage({ path: IMG + "ill-02-yaodong.png", x: 7.1, y: 0, w: 6.233, h: 7.14,
  sizing: { type: "cover", w: 6.233, h: 7.14 } });
kicker(s, "第二章 · 命中一个词：实现");
clause(s, "理想落到手上，才叫实现", { fontSize: 25, w: 6.2 });
s.addText([
  { text: "1940 年秋", options: { color: ZHU, bold: true, breakLine: true } },
  { text: "  在延安入党", options: { breakLine: true } },
  { text: "1941 年", options: { color: ZHU, bold: true, breakLine: true } },
  { text: "  中央社会部机要科 · 译电员 · 18 岁", options: { breakLine: true } },
  { text: "  直接领导李克农；代号「小董」", options: { breakLine: true } },
  { text: "  她一组负责联系重庆方向的秘密电台", options: { breakLine: true } },
  { text: "  周恩来的电报，昼夜不停", options: {} }
], { x: ML, y: 1.92, w: 6.2, h: 3.0, fontSize: 15, fontFace: SERIF, color: INK,
   align: "left", valign: "top", lineSpacing: 25, margin: 0 });
rule(s, 5.06);
s.addText("中共中央社会部职能之四：管理机要部门的工作，保障保密工作的执行。",
  { x: ML, y: 5.18, w: 6.2, h: 0.5, fontSize: 12, fontFace: SERIF, color: INK_M,
   align: "left", valign: "top", lineSpacing: 19, margin: 0 });
s.addText("一个辍学的农家姑娘坐在那台机器前面——她的理想是一段真实的线路。",
  { x: ML, y: 5.80, w: 6.2, h: 0.5, fontSize: 14.5, fontFace: SERIF, color: ZHU,
   align: "left", valign: "top", lineSpacing: 22, margin: 0 });
chrome(s, 6, "愿", "据人民网党史、天津日报、外交部李克农简历");

/* ================= P7 章二 · 制度 ================= */
s = pres.addSlide(); paper(s);
kicker(s, "第二章 · 补证");
clause(s, "这句话不是她发明的", { fontSize: 27 });
rule(s, 1.66);
const docs = [
  ["1932.7", "朱德、王稼祥、彭德怀《七条无线电通信规则》",
   "密电码本必须交忠实可靠的译电员随身保存——「要看同自己的生命一样重要」"],
  ["1940.12", "毛泽东、朱德致电项英",
   "「密码要带在最可靠的同志身上，并预先研究遇危险时如何处置」"],
  ["1941", "毛泽东为中央军委机要处题词",
   "「保守机密，慎之又慎」"]
];
docs.forEach((d, i) => {
  const y = 1.86 + i * 1.12;
  card(s, ML, y, 8.1, 1.0);
  s.addText(d[0], { x: ML + 0.3, y: y + 0.13, w: 1.2, h: 0.28, fontSize: 13, bold: true,
    fontFace: SANS, color: ZHU, margin: 0 });
  s.addText(d[1], { x: ML + 1.6, y: y + 0.13, w: 6.2, h: 0.28, fontSize: 11.5,
    fontFace: SERIF, color: INK_M, margin: 0 });
  s.addText(d[2], { x: ML + 0.3, y: y + 0.46, w: 7.5, h: 0.44, fontSize: 13.5,
    fontFace: SERIF, color: INK, margin: 0 });
});
s.addText("译电格", { x: 9.1, y: 1.86, w: 3.4, h: 0.28, fontSize: 11.5, fontFace: SERIF,
  color: INK_M, charSpacing: 2, margin: 0 });
const codes = ["0472", "1163", "0913", "2276", "0472", "0198", "1604", "0347", "2276", "0913"];
codes.forEach((c, i) => {
  const x = 9.1 + (i % 2) * 1.78, y = 2.24 + Math.floor(i / 2) * 0.46;
  s.addShape(pres.shapes.RECTANGLE, { x, y, w: 1.68, h: 0.4, fill: { color: XUAN },
    line: { color: INK_L, width: 0.5 } });
  s.addText(c, { x, y, w: 1.68, h: 0.4, fontSize: 14, fontFace: SANS, color: INK_M,
    align: "center", valign: "middle", margin: 0 });
});
s.addShape(pres.shapes.RECTANGLE, { x: 9.1, y: 4.62, w: 3.46, h: 0.56,
  fill: { color: ZHU }, line: { color: ZHU, width: 0 } });
s.addText("生命", { x: 9.1, y: 4.62, w: 3.46, h: 0.56, fontSize: 24, bold: true, fontFace: SERIF,
  color: PW, align: "center", valign: "middle", charSpacing: 10, margin: 0 });
s.addText([
  { text: "1942 年，她把一句纪律，说成了自己的话。", options: { breakLine: true, fontSize: 16, color: INK } },
  { text: "一问：从 1932 年到 2025 年，这些文本共同在做的一件事是什么？", options: { fontSize: 13, color: INK_M } }
], { x: ML, y: 5.36, w: 8.1, h: 1.0, fontFace: SERIF, align: "left", valign: "top",
   lineSpacing: 26, margin: 0 });
chrome(s, 7, "愿", "《中国共产党保密工作史》第八章 · 吉林省国家保密局");

/* ================= P8 章三 · 婚礼 ================= */
s = pres.addSlide(); full(s, "ill-03-hunli.png");
plate(s, "xuan", 0.0, 0.0, 7.6, 6.6);
s.addText("第三章 · 命中一个词：宁可……也绝不", { x: ML, y: 0.5, w: 6.6, h: 0.3, fontSize: 12,
  fontFace: SERIF, color: INK_M, charSpacing: 1.5, margin: 0 });
s.addText([
  { text: "全句第二十三字，「自己」第一次出现。", options: { breakLine: true } },
  { text: "它后面紧跟的词，是「性命」。", options: { breakLine: true } },
  { text: "而说出这句话的那天，是她的婚礼。", options: { bold: true, color: ZHU } }
], { x: ML, y: 0.98, w: 6.7, h: 1.9, fontSize: 21, fontFace: SERIF, color: INK,
   align: "left", valign: "top", lineSpacing: 34, margin: 0 });
s.addShape(pres.shapes.RECTANGLE, { x: ML, y: 3.16, w: 6.0, h: 1.94,
  fill: { color: XUAN }, line: { color: INK_L, width: 0.5 } });
s.addText([
  { text: "1942 年底 · 延安枣园一间窑洞", options: { breakLine: true, fontSize: 16, bold: true, color: INK } },
  { text: "证婚人：李克农", options: { breakLine: true, fontSize: 14, color: INK_M } },
  { text: "新郎钟琪，同科译电员，比她大两岁，牺牲时 25 岁", options: { breakLine: true, fontSize: 14, color: INK_M } },
  { text: "1943 年，儿子明明出生", options: { fontSize: 14, color: INK_M } }
], { x: ML + 0.28, y: 3.36, w: 5.5, h: 1.6, fontFace: SERIF, align: "left", valign: "top",
   lineSpacing: 26, margin: 0 });
s.addText("别人结婚许的是长久，他们许的是共存亡。",
  { x: ML, y: 5.32, w: 6.2, h: 0.44, fontSize: 19, bold: true, fontFace: SERIF, color: ZHU,
   align: "left", valign: "top", margin: 0 });
s.addText("—— 董健民、钟琪 · 1942 年延安枣园结婚誓词",
  { x: ML, y: 5.86, w: 6.2, h: 0.32, fontSize: 12, fontFace: SERIF, color: INK_M,
   align: "left", valign: "middle", margin: 0 });
chrome(s, 8, "誓", "据人民网党史、光明日报、天津日报");

/* ================= P9 章三 · 海上 ================= */
s = pres.addSlide(); full(s, "ill-04-bohai.png");
plate(s, "ink", 0.0, 0.0, 13.333, 4.1);
s.addText([
  { text: "1946 年 10 月  党中央决定在大连建立秘密电台", options: { breakLine: true, fontSize: 15, color: "C9C2B6" } },
  { text: "李克农指派二人携密电码，由山东乘船走海路", options: { breakLine: true, fontSize: 15, color: "C9C2B6" } },
  { text: "一个月后。因叛徒告密，军舰截停，炮弹中船", options: { breakLine: true } },
  { text: "敌舰叫嚣：「延安来的共产党，速速交出秘密文件」", options: { breakLine: true } },
  { text: "他们把密件紧贴胸前，喊：「宁死不当俘虏，同志们跳海！」", options: { breakLine: true } },
  { text: "一家三口相拥跃入渤海 · 她 23 岁，他 25 岁", options: { breakLine: true } },
  { text: "—— 秘密文件，一页没有落到敌人手里。", options: { bold: true, color: GOLD } }
], { x: ML, y: 0.52, w: 11.9, h: 3.3, fontSize: 17.5, fontFace: SERIF, color: PW,
   align: "left", valign: "top", lineSpacing: 29, margin: 0 });
chrome(s, 9, "誓", "据天津日报、今晚报、解放军报");

/* ================= P10 生还者 ================= */
s = pres.addSlide(); paper(s);
kicker(s, "第三章 · 尾声");
s.addText("1", { x: ML - 0.06, y: 1.34, w: 2.5, h: 3.3, fontSize: 200, bold: true, fontFace: SANS,
  color: ZHU, align: "left", valign: "top", margin: 0 });
s.addText("全船只有一名交通员活着回来", { x: 3.3, y: 1.56, w: 9.4, h: 0.62, fontSize: 26,
  bold: true, fontFace: SERIF, color: INK, align: "left", valign: "middle", margin: 0 });
rule(s, 2.34);
s.addText([
  { text: "他抱着木箱在海里漂流，直到敌人解除封锁，", options: { breakLine: true } },
  { text: "被路过的苏联商船救起——消息才传回延安。", options: { breakLine: true } },
  { text: "1947 年初，李克农、罗青长等在社会部为他们开了追悼会。", options: {} }
], { x: 3.3, y: 2.56, w: 9.4, h: 1.7, fontSize: 16.5, fontFace: SERIF, color: INK,
   align: "left", valign: "top", lineSpacing: 28, margin: 0 });
card(s, 3.3, 4.52, 9.4, 1.16);
s.addText("今天我们能站在这里讲她，是因为当年有个人把话带了回来。",
  { x: 3.66, y: 4.52, w: 8.9, h: 1.16, fontSize: 17, bold: true, fontFace: SERIF, color: ZHU,
   align: "left", valign: "middle", margin: 0 });
chrome(s, 10, "誓", "据天津日报、《文学报》（作家网转载）");

/* ================= P11 章四 · 身后 ================= */
s = pres.addSlide(); full(s, "ill-05-konghe.png");
plate(s, "xuan", 6.3, 0.0, 7.05, 6.4);
s.addText("第四章 · 命中一个词：共存亡", { x: 6.7, y: 0.56, w: 6.0, h: 0.3, fontSize: 12,
  fontFace: SERIF, color: INK_M, charSpacing: 1.5, align: "right", margin: 0 });
s.addText([
  { text: "1981 年 7 月", options: { color: ZHU, bold: true, breakLine: true } },
  { text: "牺牲 35 年后，凭罗青长等老同志证明，", options: { breakLine: true } },
  { text: "民政部批准为革命烈士。", options: { breakLine: true } },
  { text: "1983 年 6 月 20 日", options: { color: ZHU, bold: true, breakLine: true } },
  { text: "中央调查部在北京万安公墓举行遗像安放仪式。", options: { breakLine: true } },
  { text: "没有一件遗物。骨灰盒里，只放了一份悼词。", options: { bold: true, color: ZHU, breakLine: true } },
  { text: "家乡刘祥庄村立的是衣冠冢。", options: { breakLine: true } },
  { text: "2025 年 12 月  村口 2880 平方米纪念展厅落成，", options: { breakLine: true } },
  { text: "序厅铜像后墙，刻着这七个字。", options: {} }
], { x: 6.7, y: 1.02, w: 6.0, h: 4.1, fontSize: 14.5, fontFace: SERIF, color: INK,
   align: "right", valign: "top", lineSpacing: 25, margin: 0 });
s.addShape(pres.shapes.RECTANGLE, { x: 6.7, y: 5.26, w: 6.0, h: 0.86,
  fill: { color: XUAN }, line: { color: INK_L, width: 0.5 } });
s.addText("她的遗物是零，敌人的收获也是零。",
  { x: 6.88, y: 5.26, w: 5.64, h: 0.86, fontSize: 17, bold: true, fontFace: SERIF, color: ZHU,
   align: "right", valign: "middle", margin: 0 });
chrome(s, 11, "存", "据天津日报（引王珺 1983 讲话）、中国新闻网");

/* ================= P12 新时代 ================= */
s = pres.addSlide(); paper(s);
kicker(s, "第四章 · 今天");
clause(s, "敌人不再登船，他发一份兼职", { fontSize: 26 });
rule(s, 1.66);
card(s, ML, 1.86, 7.0, 3.28);
s.addText("国家安全部微信公众号 · 2025 年 11 月 4 日披露",
  { x: ML + 0.3, y: 2.02, w: 6.4, h: 0.28, fontSize: 10.5, fontFace: SANS, color: INK_M, margin: 0 });
s.addText([
  { text: "研究生金某 · 实习期", options: { breakLine: true, bold: true, fontSize: 15, color: INK } },
  { text: "受境外人员 A 勾联", options: { breakLine: true } },
  { text: "以「兼职写材料 · 获取高额报酬」为诱饵", options: { breakLine: true } },
  { text: "向其索要涉密资料，并签署「保密协议」", options: { breakLine: true } },
  { text: "金某渐失警惕，后主动停止违法行为", options: { breakLine: true } },
  { text: "国安机关认定其未造成危害", options: { color: ZHU, bold: true } }
], { x: ML + 0.3, y: 2.40, w: 6.4, h: 2.6, fontSize: 14.5, fontFace: SERIF, color: INK,
   align: "left", valign: "top", lineSpacing: 26, margin: 0 });
s.addText([
  { text: "1946 年，敌人要开船、截停、炮击，才拿得到那本密码；", options: { breakLine: true } },
  { text: "今天，一份兼职、一笔报酬、一句「签个保密协议」就够了。", options: { bold: true, color: ZHU } }
], { x: ML, y: 5.34, w: 7.0, h: 0.94, fontSize: 15, fontFace: SERIF, color: INK,
   align: "left", valign: "top", lineSpacing: 25, margin: 0 });
s.addShape(pres.shapes.RECTANGLE, { x: 7.94, y: 1.86, w: 4.76, h: 2.42,
  fill: { color: XUAN_D }, line: { color: INK_L, width: 0.75, dashType: "dash" } });
s.addText("此处放真实照片\n静海展厅实拍 / 4·15 国家安全教育日现场",
  { x: 8.1, y: 2.42, w: 4.44, h: 1.3, fontSize: 13, fontFace: SERIF, color: INK_M,
   align: "center", valign: "middle", lineSpacing: 22, margin: 0 });
s.addShape(pres.shapes.RECTANGLE, { x: 7.94, y: 4.46, w: 4.76, h: 1.82,
  fill: { color: XUAN_D }, line: { color: XUAN_D, width: 0 } });
s.addShape(pres.shapes.RECTANGLE, { x: 7.94, y: 4.46, w: 4.76, h: 0.05,
  fill: { color: ZHU }, line: { color: ZHU, width: 0 } });
s.addText([
  { text: "《保守国家秘密法》2024.5.1 施行", options: { breakLine: true } },
  { text: "第 9 条  保密教育纳入国民教育体系", options: { breakLine: true } },
  { text: "《密码法》2020.1.1 施行  核心/普通/商用", options: { breakLine: true } },
  { text: "每年 4 月 15 日  全民国家安全教育日", options: {} }
], { x: 8.2, y: 4.66, w: 4.3, h: 1.5, fontSize: 12, fontFace: SERIF, color: INK,
   align: "left", valign: "top", lineSpacing: 21, margin: 0 });
chrome(s, 12, "存", "国家安全部 2025-11-04 · 国家保密局");

/* ================= P13 收束 ================= */
s = pres.addSlide(); paper(s);
kicker(s, "整句读回来");
s.addText([
  { text: "为了千百万人能够得到解放，", options: { breakLine: true, color: INK } },
  { text: "为了实现共产主义理想，", options: { breakLine: true, color: INK } },
  { text: "宁可牺牲自己的性命，也绝不泄露党的机密，", options: { breakLine: true, color: INK } },
  { text: "誓与密码共存亡！", options: { color: ZHU, bold: true } }
], { x: ML, y: 0.98, w: 11.9, h: 2.5, fontSize: 30, fontFace: SERIF, align: "left",
   valign: "top", lineSpacing: 48, margin: 0 });
s.addText("董健民、钟琪 · 1942 年延安枣园结婚誓词",
  { x: ML, y: 3.60, w: 11.9, h: 0.34, fontSize: 13, fontFace: SERIF, color: INK_M,
   align: "left", valign: "middle", margin: 0 });
rule(s, 4.16);
s.addText([
  { text: "1946 年，她把这句话交给了海；今天，我们把这句话交给自己。", options: { breakLine: true, fontSize: 19, bold: true, color: INK } },
  { text: "一问：在那艘船上，「把密码交出去」这个选项，是哪一年被关掉的？", options: { fontSize: 14.5, color: ZHU } }
], { x: ML, y: 4.38, w: 11.9, h: 1.2, fontFace: SERIF, align: "left", valign: "top",
   lineSpacing: 30, margin: 0 });
s.addText("谨以此致敬所有隐姓埋名的忠诚卫士",
  { x: ML, y: 5.90, w: 11.9, h: 0.36, fontSize: 14, fontFace: SERIF, color: INK,
   align: "left", valign: "middle", margin: 0 });
chrome(s, 13, "永", "董健民（1923—1946）· 中共中央社会部机要科");

pres.writeFile({ fileName: OUT }).then(() => console.log("WROTE " + OUT));
