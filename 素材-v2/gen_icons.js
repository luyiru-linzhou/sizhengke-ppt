/* gen_icons.js — render react-icons (Feather/Lucide) to single-color PNGs.
 * Output: assets/ico-<name>-<color>.png   (256x256, transparent ground)
 * Re-run: node gen_icons.js
 */
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const Fi = require("react-icons/fi");
const Lu = require("react-icons/lu");

const OUT = path.join(__dirname, "assets");
fs.mkdirSync(OUT, { recursive: true });

const INK = "2B2F33", ZHU = "B4452F", PW = "F4EFE4", GOLD = "D9A441",
      LIGHT = "8A8F94", XUAN = "C9C2B6";

// [file name, icon component, colors]
const SPECS = [
  // navigation / chapters
  ["users", Fi.FiUsers, [INK, ZHU, PW]],
  ["target", Lu.LuTarget, [INK, ZHU]],
  ["radio", Fi.FiRadio, [INK, ZHU, PW]],
  ["heart", Fi.FiHeart, [INK, ZHU, PW]],
  ["lock", Fi.FiLock, [INK, ZHU, PW, GOLD]],
  ["shield", Lu.LuShieldCheck, [INK, ZHU, PW]],
  ["folder", Fi.FiFolder, [INK]],
  // P5 map
  ["mountain", Lu.LuMountain, [INK, LIGHT]],
  ["footprints", Lu.LuFootprints, [INK, ZHU]],
  ["x", Fi.FiX, [ZHU, PW]],
  ["pin", Fi.FiMapPin, [INK, ZHU]],
  ["flag", Fi.FiFlag, [INK, ZHU]],
  // P6 post
  ["headphones", Fi.FiHeadphones, [INK, ZHU, PW]],
  ["tag", Fi.FiTag, [INK, ZHU]],
  ["zap", Fi.FiZap, [INK, GOLD, PW]],
  // P7 rules
  ["file", Fi.FiFileText, [INK, ZHU]],
  ["arrow-right", Fi.FiArrowRight, [INK, ZHU]],
  ["key", Fi.FiKey, [INK, ZHU]],
  // P10 survivor
  ["package", Lu.LuPackage, [INK, ZHU, PW]],
  ["lifebuoy", Lu.LuLifeBuoy, [INK, ZHU, PW]],
  ["ship", Lu.LuShip, [INK, ZHU, PW]],
  ["waves", Lu.LuWaves, [INK, LIGHT, PW]],
  ["anchor", Lu.LuAnchor, [INK, ZHU]],
  // P12 new era — 1946 side
  ["crosshair", Fi.FiCrosshair, [PW, GOLD]],
  ["arrow-up", Fi.FiArrowUpRight, [PW]],
  // P12 — 2025 side
  ["message", Fi.FiMessageCircle, [INK, ZHU]],
  ["send", Fi.FiSend, [INK]],
  ["briefcase", Fi.FiBriefcase, [INK, ZHU]],
  ["money", Fi.FiDollarSign, [INK, ZHU]],
  ["signature", Fi.FiEdit, [INK, ZHU]],
  ["eye", Fi.FiEye, [INK]],
  // P12 — today's ciphers
  ["drive", Fi.FiHardDrive, [INK, ZHU]],
  ["cpu", Fi.FiCpu, [INK, ZHU]],
  ["database", Fi.FiDatabase, [INK]],
  ["ruler", Lu.LuPencilRuler, [INK]],
  // P12 — laws
  ["scale", Lu.LuScale, [INK, ZHU]],
  ["calendar", Fi.FiCalendar, [INK, ZHU]],
  ["book", Fi.FiBookOpen, [INK, ZHU]],
  ["alert", Fi.FiAlertTriangle, [ZHU, INK]],
];

function svgFor(Icon, hex) {
  let s = ReactDOMServer.renderToStaticMarkup(React.createElement(Icon));
  s = s.replace(/width="1em"/g, 'width="256"').replace(/height="1em"/g, 'height="256"');
  s = s.replace(/currentColor/g, "#" + hex);
  return Buffer.from(s);
}

(async () => {
  let n = 0;
  for (const [name, Icon, colors] of SPECS) {
    for (const c of colors) {
      const buf = await sharp(svgFor(Icon, c), { density: 384 })
        .resize(220, 220, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .extend({ top: 18, bottom: 18, left: 18, right: 18,
          background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png().toBuffer();
      const fp = path.join(OUT, `ico-${name}-${c}.png`);
      fs.writeFileSync(fp, buf);
      n++;
    }
  }
  console.log("WROTE " + n + " icons to " + OUT);
})();
