# 素材出图清单 v1（交给你 / 你的专业工具）

> **接口约定（重要）**：文件名与尺寸固定，出图后放进 `C:\Users\29264\Desktop\思政课ppt\素材-v1\images\`，**同名覆盖我的占位图**，我重跑一次构建脚本就全部换上，你不用管 PPT。
> 尺寸统一 **1792×1024（16:9）**。若你的工具只支持 1024 的倍数，用 1664×936 也行，别改比例。
> 已有两张不用重做：`bg-p1-luori.jpeg`（封面落日孤船）、`bg-p2-chuanxian.jpeg`（船舷一家三口）——就是你满意的那两张原图，我已取出。

---

## 0. 每条 prompt 前面都要加这段「总风格前缀」

**中文版（即梦 / 可灵 / 通义 / 混元等国内工具）**
```
中国纸本淡彩水墨插画，绢本/宣纸质感，低饱和灰调为主，画面中只允许一处朱红（约 #B4452F）作为唯一强调色，
大面积不对称留白，纸纹颗粒与轻微暗角，安静克制，历史题材，16:9 画幅
```

**英文版（Midjourney / SD / DALL·E / Flux）**
```
traditional Chinese ink-wash painting on aged silk / xuan paper, muted low-saturation grey palette,
exactly one vermilion accent (#B4452F), large asymmetric negative space, visible paper grain and faint vignette,
restrained, somber, historical, 16:9 --ar 16:9
```

**通用负面提示词（每条都加）**
```
文字, 字母, 数字, 汉字, 标语, 水印, logo, 印章上的可辨认字,
写实人脸, 五官细节, 塑料皮肤, 手指错误, 现代服装, 汽车电线杆,
高饱和, HDR, 3D 渲染, 卡通, 动漫, 科技蓝, 渐变背景, 居中对称构图, 元素堆满
```
```
text, letters, numbers, chinese characters, slogan, watermark, logo, legible seal script,
photorealistic face, detailed eyes, plastic skin, extra fingers, modern clothing,
oversaturated, HDR, 3D render, cartoon, anime, tech blue, gradient background, symmetrical composition, cluttered
```

**我的验收标准（四条，不过我就退回）**
1. 画面里没有任何可辨认的文字、数字、字母（含"囍"、标语、门牌）。
2. 没有写实人脸特写；出现人只能是剪影、背影、远景小人或一双手。
3. 除朱红外无第二个高饱和色；整体饱和度低。
4. 指定一侧留白 ≥ 45%（我要压文字），且留白区不能有很碎的笔触。

---

## 1. `tex-xuanzhi.png` — 宣纸底纹（P3/P4/P7/P11/P12/P13 的页面底）

用途：文献页与收束页的背景，不是插画，是**纹理**。
```
无缝拼接的陈年宣纸/绢本底纹，暖米白（#EDE7DA），极淡的桑皮纤维与细碎竹丝纹，零星浅色霉斑，
四角轻微压暗 8%，平整扫描件视角，无任何物体、图案、文字
```
```
seamless aged xuan rice paper / silk texture, warm off-white #EDE7DA, very subtle mulberry fibers and bamboo grid marks,
sparse faint foxing spots, gentle 8% corner darkening, flatbed scan view, no objects, no pattern, no text
```
⚠️ 特别要求：**不许出现任何图案或装饰**，越"空"越好；如果它画出了山水花鸟就是错的。

---

## 2. `ill-01-nanxia.png` — 章一《为了千百万人能够得到解放》（P5）

画面：1939 年冬末，北方土路，三个极小的布衣人影走成一列，背影，向远处山隘；天空压得低、占画面上半。土黄/赭灰。
```
[总前缀] + 主色偏土黄（#8C7A55）。
构图：画面下半是一条向远方延伸的黄土驿路，三个很小的布衣人影走成一列（只有背影与剪影，看不见脸），
朝远处的山隘行进；上半是压得很低的灰白天空，天空区域几乎空，用于放置文字（右上 50% 留白）。
情绪：寒冷、漫长、坚定。人物在画面中占比不超过 5%
```
```
[style prefix] + earthy ochre tint (#8C7A55). Lower half: a long loess road receding to a distant mountain pass,
three tiny barefoot-cloth figures walking single file (back view / silhouettes only, faces not visible);
upper half: low heavy pale sky, nearly empty, reserved as text area (50% negative space upper-right).
Mood: cold, long, resolute. Figures occupy under 5% of the frame
```
禁：旗帜、枪、马匹、现代道路、任何倒下或死亡的动作。

---

## 3. `ill-02-yaodong.png` — 章二《为了实现共产主义理想》（P6）

画面：延安窑洞内的机要工作台。煤油灯暖光、老式电子管收发报机、耳机、散落的纸带与几张表格（**数字必须糊掉**）；窗外雪夜。人物只出现**一双手**或**椅背上搭着的棉衣**。
```
[总前缀] + 主色偏青灰（#5B6B73），唯一暖点是煤油灯焰。
构图：右侧木桌上是老式电子管收发报机（旋钮、表头、天线）、一副耳机、卷曲的电报纸带和几张模糊的表格纸；
桌后木椅上搭一件灰棉军衣，只出现一双手握笔记录，不出现脸；背景窑洞拱顶与木格窗，窗外飘雪夜色。
左侧 50% 留白（墙面与暗部），用于放文字
```
```
[style prefix] + cool grey-blue tint (#5B6B73); the only warm point is the oil-lamp flame.
Right side: wooden desk with a vintage tube radio transmitter/receiver (knobs, meters, antenna), headphones,
curling teleprinter paper tape and a few blurred tally sheets; a grey padded uniform draped over the wooden chair,
only two hands holding a pen visible, no face; cave-dwelling vaulted wall and latticed window behind, snow at night outside.
Left 50% reserved as negative space (wall and shadow) for text
```
⚠️ 关键：**表格上的数字一律糊成不可读笔触**（AI 最爱在这里写乱码，直接进负面词）。

---

## 4. `ill-03-hunli.png` — 章三前半《宁可牺牲自己的性命…》婚礼（P8）

画面：枣园窑洞的新房一角。**空椅子两把**、方桌、两盏油灯、墙上一张红色剪纸团花与一条红绸。无人或只有两个剪影背影。全篇最暖的一页。
```
[总前缀] + 主色朱红（#B4452F）与暖金（#D9A441），暖光。
构图：土墙窑洞内一张方桌、两把空木椅、两盏煤油灯发出暖光，墙上贴一张红色剪纸团花（对称花卉纹样，
绝对不要出现"囍"或任何汉字）、桌角搭一条红绸。右侧或上方 45% 留白用于放文字。
情绪：简陋、喜庆、克制、有一点不祥的庄重
```
```
[style prefix] + vermilion (#B4452F) and warm gold (#D9A441) lighting.
Interior of a Yan'an cave-dwelling: a square wooden table, two empty wooden chairs, two oil lamps glowing warm,
a red paper-cut rosette on the earthen wall (symmetric floral pattern — absolutely NO "囍" and NO chinese characters),
a strip of red silk draped on the table corner. 45% negative space on the right/top for text.
Mood: humble, festive, restrained, faintly solemn
```
🔴 **专门提醒**：不要让模型写"囍"字——AI 十次有八次把"囍"写错（多一横少一口）。**"囍"我会在 PPT 里用文字排出来**，画里只要剪纸团花。

---

## 5. `ill-04-bohai.png` — 章三后半 渤海（P9）

画面：黄昏高浪的海，一家三口相拥的**纯黑剪影**正越过船舷；右侧海平线上一轮将沉的朱红落日（**故意呼应封面那张**）。墨青 + 一线白浪 + 一点朱。
```
[总前缀] + 主色墨青（#22303A），几乎全暗，唯一亮处是白浪花与远处一轮朱红落日。
构图：画面左上是压低的暗云（45% 留白放文字）；左侧是客轮的船舷、栏杆与救生艇轮廓；
中下方一家三口相拥的纯黑剪影（成人、成人、怀抱中的幼儿，只有轮廓，无面部无手指细节）正在越过船舷，
身下是翻卷的白浪；右侧海平线上一轮低垂的朱红落日，海面拖出一条极窄的红色反光。
情绪：悲壮但不血腥，安静，不喊打喊杀
```
```
[style prefix] + deep ink teal (#22303A), nearly monochrome-dark; the only light is white surf and a low vermilion sun.
Upper-left: heavy dark cloud kept empty (45% negative space for text); left side: silhouette of a steamship's hull,
railings and davits; lower-center: a pure black silhouette of three figures locked in an embrace
(adult, adult, a small child held between them — outline only, no faces, no finger detail) going over the ship's rail,
churning white surf below; on the right horizon a low setting vermilion sun with a single narrow red reflection on the water.
Mood: tragic but not violent, quiet, dignified
```
禁：任何血、尸体、挣扎表情、持枪人物、爆炸火光。

---

## 6. `ill-05-konghe.png` — 章四《誓与密码共存亡》身后（P11）

画面：俯拍 30°，一只打开的素色木盒，里面**只有一张对折的纸**；四周大片米白空。几乎无彩。
```
[总前缀] + 素白（#EDE7DA）为主，几乎无色。
构图：俯拍约 30 度，米白布面上放一只打开的素木盒（无花纹、无铭牌），盒内只有一张对折的白纸，
纸角有一点点极小的朱红（像褪色的印泥）；盒子放在画面左下，右上 55% 全部是空白布面用于放文字。
旁边可有一支旧钢笔，不要有花、不要有勋章、不要有照片
```
```
[style prefix] + near-colorless bone white (#EDE7DA).
About 30-degree overhead view: on a plain off-white cloth lies an open undecorated wooden box (no engraving, no plaque);
inside the box only a single folded sheet of white paper, its corner bearing one tiny faded vermilion mark (like old seal paste).
Box placed lower-left; upper-right 55% is empty cloth reserved for text.
At most one old fountain pen beside it. No flowers, no medals, no photographs
```

---

## 7. `ill-06-zhidai.png` — 电码纸带（P3 方法页 / P13 收束页的装饰底）

画面：一条撕边老纸带斜放在宣纸上，上面是**压出来的莫尔斯点划凹痕**（不是文字），局部烧黄。
```
[总前缀] + 低饱和灰。
构图：一条边缘毛糙、局部烧黄的老式电报纸带斜向横贯画面，纸带上只有莫尔斯电码的圆点与短横压痕（凹印，不是墨字），
纸带下方压着几张模糊的稿纸；其余全部留白。整体像一份刚被翻开的旧档案
```
```
[style prefix] + low-saturation grey.
A single torn-edge antique telegraph paper tape running diagonally across the frame, bearing only embossed morse dots and dashes
(debossed marks, not printed characters), with a few blurred manuscript sheets tucked underneath; everything else empty.
Feels like a case file just opened
```

---

## 8. 真实场景照片（P12 新时代页 · 明确不用 AI 生成）

这页要"可指认的真实"，你给我原图或我自己在授权媒体上取，二选一。**要 1–2 张**：

| 优先 | 内容 | 为什么 |
|---|---|---|
| ★★★ | **天津静海刘祥庄村董健民纪念展厅内景实拍**（序厅铜像、墙上"誓与密码共存亡"七字、机要密码箱展陈） | 与"今天"直接挂钩，中新网/北方网 2025-12 报道里有实拍，来源明确可标 |
| ★★ | **"4·15"全民国家安全教育日进校园/社区的现场照**（横幅、展板、学生听讲的远景） | 落在 P12"今天的密码"，且展厅本身就是静海区固定教学点，逻辑闭环 |
| ★ | 老式电报机/密电码本文物照（通信博物馆、革命军事博物馆） | 备用，若前两项找不到清晰图 |

要图请一并给我：**拍摄者/发布机构 + 原文链接**，我会在页脚排 10pt 淡墨来源角标——这既是规范，也是思政课最容易被老师认可的地方。

---

## 9. 不用你做的部分（我这边负责）

- 右下角那枚**朱红印章**（序「忠」→ 章一「众」→ 章二「愿」→ 章三「誓」→ 章四「存」）：我用 PPT 文字 + 色块画，**不要生成在图里**（生成出来必是错字）。所以每张图右下留空即可，别自己加印。
- 页脚电码带、译电格、代号页码、来源角标、全部文字与色卡：我用代码画，保证 13 页像素级一致。
- 统一化滤镜（降饱和 ≤40%、叠纸纹、暗角）：我用 PIL 批处理，**你的原图如果偏艳，我会先压一遍再入册**，不会直接塞进去。
