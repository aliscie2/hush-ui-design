const fs = require("fs");
const path = require("path");

const outDir = __dirname;
const svgPath = path.join(outDir, "Hush_Elegant_Product_Design_V2_editable.svg");
const htmlPath = path.join(outDir, "Hush_Elegant_Product_Design_V2_generated_preview.html");

const C = {
  canvas: "#101010",
  phone: "#F8F8F6",
  sheet: "#FBFBFA",
  sheet2: "#F0F0ED",
  warm: "#F7F6F3",
  warm2: "#ECEBE7",
  ink: "#171716",
  muted: "#6E6D68",
  faint: "#A7A7A0",
  subtle: "#A7A7A0",
  line: "#DEDED8",
  warmLine: "#D4CFBE",
  onDark: "#F8F8F6",
  darkMuted: "#A7A7A0",
  darkLine: "#3B3B3B",
  teal: "#0A6358",
  tealInk: "#073F38",
  tealSoft: "#DDEDEA",
  blue: "#08507A",
  blueSoft: "#DDEBF1",
  green: "#0F7A4D",
  greenSoft: "#E0F5EA",
  amber: "#7A3F08",
  amberMid: "#D9730D",
  amberSoft: "#F5E9D7",
  red: "#9F1F1F",
  redSoft: "#F7E4E3",
  brandRed: "#8B0E11",
  ai: "#6940A5",
  aiSoft: "#EFE8F7",
  keyboard: "#D3D1CB",
  keyboardDark: "#A7A7A0",
  black: "#0F0F0F"
};

const W = 390;
const H = 844;
const gapX = 56;
const gapY = 96;
const baseX = 120;
const baseY = 120;
const screenCount = 36;
const appCols = 3;
const keyboardCols = 3;
const sectionGapX = 160;
const screenStartY = baseY + 400;
const sectionHeaderOffset = 58;

// App UI stays on the left: setup, management, storage, diagnostics, recovery, and support.
const appOrder = [
  0, 1, 18,
  2, 35, 25,
  17, 27, 28,
  29, 10, 11,
  12, 30, 13,
  31, 14, 20,
  15, 21, 32,
  19, 22, 23,
  33, 34, 24
];

// Keyboard UI stays on the right: fast dictation, input, live transcript, retry, and fresh result.
const keyboardOrder = [3, 4, 5, 6, 26, 7, 8, 9, 16];

const appSectionRows = Math.ceil(appOrder.length / appCols);
const keyboardSectionRows = Math.ceil(keyboardOrder.length / keyboardCols);
const appBoardW = W * appCols + gapX * (appCols - 1);
const keyboardBoardW = W * keyboardCols + gapX * (keyboardCols - 1);
const boardW = appBoardW + sectionGapX + keyboardBoardW;
const canvasW = baseX * 2 + boardW;
const canvasH = screenStartY + Math.max(appSectionRows, keyboardSectionRows) * H + (Math.max(appSectionRows, keyboardSectionRows) - 1) * gapY + 140;
const appSectionX = baseX;
const keyboardSectionX = baseX + appBoardW + sectionGapX;

let out = [];

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function attr(obj) {
  return Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null && v !== false)
    .map(([k, v]) => `${k}="${esc(v)}"`)
    .join(" ");
}

function rect(x, y, w, h, fill = C.sheet, rx = 8, stroke = null, extra = {}) {
  out.push(`<rect ${attr({ x, y, width: w, height: h, rx, fill, stroke, "stroke-width": stroke ? 1 : undefined, ...extra })}/>`);
}

function circle(cx, cy, r, fill = C.teal, stroke = null, extra = {}) {
  out.push(`<circle ${attr({ cx, cy, r, fill, stroke, "stroke-width": stroke ? 1 : undefined, ...extra })}/>`);
}

function line(x, y, w, h = 1, fill = C.line) {
  rect(x, y, w, h, fill, Math.min(h / 2, 1));
}

function pathEl(d, fill = "none", stroke = null, extra = {}) {
  out.push(`<path ${attr({ d, fill, stroke, "stroke-width": stroke ? 1 : undefined, ...extra })}/>`);
}

function splitLines(value, maxChars) {
  const words = String(value).split(/\s+/);
  const lines = [];
  let cur = "";
  for (const word of words) {
    const next = cur ? `${cur} ${word}` : word;
    if (next.length > maxChars && cur) {
      lines.push(cur);
      cur = word;
    } else {
      cur = next;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function text(value, x, y, w, size = 14, weight = 500, fill = C.ink, align = "start", lh = 1.25) {
  const maxChars = Math.max(8, Math.floor(w / (size * 0.54)));
  const lines = splitLines(value, maxChars);
  const anchor = align === "middle" ? "middle" : align === "end" ? "end" : "start";
  const tx = align === "middle" ? x + w / 2 : align === "end" ? x + w : x;
  lines.forEach((lineValue, i) => {
    out.push(`<text ${attr({
      x: tx,
      y: y + i * size * lh,
      fill,
      "font-family": "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Arial, sans-serif",
      "font-size": size,
      "font-weight": weight,
      "text-anchor": anchor,
      "dominant-baseline": "text-before-edge"
    })}>${esc(lineValue)}</text>`);
  });
}

function pill(label, x, y, w, fill, color, stroke = null) {
  rect(x, y, w, 30, fill, 15, stroke);
  text(label, x, y + 8, w, 12, 750, color, "middle", 1.1);
}

function button(label, x, y, w, fill = C.black, color = "#F8F8F6") {
  rect(x, y, w, 50, fill, 12);
  text(label, x, y + 16, w, 15, 760, color, "middle", 1.1);
}

function card(x, y, w, h, title, body, accent = C.teal) {
  rect(x, y, w, h, C.sheet, 8, C.line, { filter: "url(#softShadow)" });
  circle(x + 26, y + 28, 8, accent);
  text(title, x + 46, y + 16, w - 62, 15, 780, C.ink);
  text(body, x + 46, y + 40, w - 62, 12, 500, C.muted, "start", 1.32);
}

function phone(x, y, name, title = "") {
  out.push(`<g id="${esc(name)}">`);
  rect(x, y, W, H, C.phone, 36, C.line, { filter: "url(#phoneShadow)" });
  rect(x, y, W, 54, C.phone, 36);
  text("7:58", x + 28, y + 18, 54, 12, 760, C.ink);
  rect(x + 154, y + 15, 82, 25, C.black, 14);
  rect(x + 310, y + 24, 16, 7, C.ink, 2, null, { opacity: 0.45 });
  rect(x + 333, y + 22, 14, 9, C.ink, 4, null, { opacity: 0.45 });
  rect(x + 353, y + 21, 23, 10, C.ink, 3, null, { opacity: 0.45 });
  if (title) text(title, x + 24, y + 72, 252, 26, 780, C.ink, "start", 1.08);
}

function closePhone() {
  out.push("</g>");
}

function bottomTabs(x, y, active) {
  rect(x, y + 760, W, 84, C.sheet, 0, C.line);
  const tabs = ["Home", "Setup", "History", "Words", "More"];
  const icons = ["○", "▦", "◷", "▣", "•••"];
  const tabW = W / tabs.length;
  tabs.forEach((tab, i) => {
    const tx = x + i * tabW;
    if (tab === active) rect(tx + 12, y + 774, tabW - 24, 34, C.tealSoft, 17);
    text(icons[i], tx, y + 781, tabW, 15, 760, tab === active ? C.teal : C.ink, "middle");
    text(tab, tx, y + 817, tabW, 10, 680, tab === active ? C.teal : C.muted, "middle");
  });
}

function orbGraphic(cx, cy, r = 86, active = false) {
  circle(cx, cy, r, active ? C.tealSoft : C.warm, C.teal);
  circle(cx, cy, r * 0.55, C.teal);
  const bars = [22, 44, 64, 48, 76, 56, 34];
  const bw = 8;
  bars.forEach((h, i) => {
    const x = cx - 42 + i * 14;
    rect(x, cy - h / 2, bw, h, "#FFFFFF", 4);
  });
}

function appMessageArea(x, y, state = "idle") {
  rect(x, y + 54, W, 398, C.warm2, 0);
  rect(x + 74, y + 126, 242, 40, C.sheet, 13);
  text("New Message", x + 74, y + 139, 242, 13, 620, C.muted, "middle");
  rect(x + 64, y + 182, 262, 64, C.warm, 12);
  text("To: Any app input", x + 80, y + 196, 220, 12, 560, C.muted);
  line(x + 80, y + 218, 220, 1, C.warmLine);
  text("From: Hush Keyboard", x + 80, y + 228, 220, 12, 560, C.muted);
  if (state === "inserted") {
    rect(x + 84, y + 288, 224, 62, C.greenSoft, 18, "#BFE8CF");
    text("Test one, two, three. I'm speaking.", x + 104, y + 310, 184, 14, 760, C.green);
  }
  circle(x + 28, y + 403, 18, C.sheet);
  text("+", x + 16, y + 391, 24, 25, 500, C.muted, "middle");
  rect(x + 58, y + 386, 300, 36, C.sheet, 18);
  text(state === "silence" ? "[ Silence ]" : "Message", x + 78, y + 397, 220, 14, 500, state === "silence" ? C.ink : C.subtle);
}

function micGlyph(cx, cy, scale = 1, color = "#FFFFFF", cutout = null) {
  rect(cx - 8 * scale, cy - 26 * scale, 16 * scale, 34 * scale, color, 8 * scale);
  if (cutout) {
    rect(cx - 4.5 * scale, cy - 16 * scale, 9 * scale, 2.2 * scale, cutout, 1.1 * scale);
    rect(cx - 4.5 * scale, cy - 8 * scale, 9 * scale, 2.2 * scale, cutout, 1.1 * scale);
  }
  pathEl(
    `M ${cx - 20 * scale} ${cy - 6 * scale} C ${cx - 20 * scale} ${cy + 18 * scale}, ${cx + 20 * scale} ${cy + 18 * scale}, ${cx + 20 * scale} ${cy - 6 * scale}`,
    "none",
    color,
    { "stroke-width": 4 * scale, "stroke-linecap": "round" }
  );
  rect(cx - 2.4 * scale, cy + 18 * scale, 4.8 * scale, 20 * scale, color, 2.4 * scale);
  rect(cx - 15 * scale, cy + 36 * scale, 30 * scale, 4.5 * scale, color, 2.25 * scale);
}

function micIcon(cx, cy, size = 50, fill = C.teal, halo = false) {
  if (halo) circle(cx, cy, size / 2 + 9, C.tealSoft, C.teal);
  circle(cx, cy, size / 2, fill);
  micGlyph(cx, cy - size * 0.04, size / 82, "#FFFFFF", fill);
}

function keyboardFastBar(x, y, active = "Keys") {
  rect(x, y + 760, W, 84, C.sheet, 0, C.line);
  const tabs = [
    ["Keys", "Aa"],
    ["Mode", "Mode"],
    ["Retry", "Retry"],
    ["Hush", "Hush"]
  ];
  const tabW = W / tabs.length;
  tabs.forEach((tab, i) => {
    const tx = x + i * tabW;
    if (tab[0] === active) rect(tx + 12, y + 774, tabW - 24, 34, C.tealSoft, 17);
    text(tab[1], tx, y + 782, tabW, 11, 800, tab[0] === active ? C.teal : C.ink, "middle");
    text(tab[0], tx, y + 817, tabW, 10, 700, tab[0] === active ? C.teal : C.muted, "middle");
  });
}

function miniKeyboard(x, y, mode = "idle") {
  const ky = y + 452;
  rect(x, ky, W, 392, C.keyboard, 0);
  rect(x, ky, W, 86, C.warm, 0);
  pill("Recent", x + 24, ky + 29, 84, C.sheet, C.ink, C.line);
  pill("Standard", x + 128, ky + 29, 132, C.sheet, C.ink, C.line);
  orbGraphic(x + 302, ky + 44, 30, mode === "recording");
  if (mode === "idle") text("Tap mic to start", x + 86, ky + 68, 218, 11, 700, C.muted, "middle");
  if (mode === "recording") text("LISTENING", x + 86, ky + 68, 218, 11, 800, C.teal, "middle");
  const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
  let yy = ky + 104;
  rows.forEach((row, ri) => {
    const start = ri === 0 ? 10 : ri === 1 ? 27 : 48;
    const keyW = ri === 2 ? 34 : 32;
    for (let i = 0; i < row.length; i++) {
      const kx = x + start + i * (keyW + 4);
      rect(kx, yy, keyW, 42, C.sheet, 7);
      text(row[i], kx, yy + 13, keyW, 13, 720, C.ink, "middle");
    }
    yy += 52;
  });
  rect(x + 56, ky + 260, 56, 42, C.keyboardDark, 7);
  text("123", x + 56, ky + 274, 56, 12, 700, C.ink, "middle");
  rect(x + 126, ky + 260, 164, 42, C.sheet, 7);
  text("Hush", x + 126, ky + 274, 164, 13, 700, C.muted, "middle");
  rect(x + 304, ky + 260, 58, 42, C.keyboardDark, 7);
  text("return", x + 304, ky + 274, 58, 11, 700, C.ink, "middle");
  keyboardFastBar(x, y, "Keys");
}

function keyboardHistoryPicker(x, y) {
  rect(x, y + 452, W, 392, C.keyboard, 0);
  rect(x + 20, y + 484, 350, 250, C.sheet, 14, C.line, { filter: "url(#softShadow)" });
  text("Recent / retry", x + 44, y + 506, 220, 20, 820, C.ink);
  text("Only fresh result and failed audio live here.", x + 44, y + 536, 260, 12, 560, C.muted);
  [
    ["Last 0:10", "Test one, two, three. I'm speaking.", "Reinsert", C.teal, C.tealSoft],
    ["Saved audio", "Transcription failed. Retry locally.", "Retry", C.amber, C.amberSoft]
  ].forEach((item, i) => {
    const yy = y + 586 + i * 68;
    line(x + 44, yy - 10, 302, 1, C.line);
    text(item[0], x + 44, yy, 86, 10, 650, C.faint);
    text(item[1], x + 44, yy + 18, 194, 12, 700, C.ink, "start", 1.2);
    pill(item[2], x + 254, yy + 6, 90, item[4], item[3]);
  });
  rect(x + 44, y + 716, 302, 34, C.warm, 8, C.line);
  text("Full history opens in Hush app.", x + 64, y + 727, 190, 10, 700, C.muted);
  text("HUSH", x + 286, y + 727, 52, 10, 800, C.teal, "middle");
  keyboardFastBar(x, y, "Retry");
}

function keyboardQuickAccess(x, y) {
  rect(x, y + 452, W, 392, C.keyboard, 0);
  rect(x + 20, y + 484, 350, 256, C.sheet, 14, C.line, { filter: "url(#softShadow)" });
  text("Quick access", x + 44, y + 506, 200, 20, 820, C.ink);
  text("No always-on history. Show only the fresh result.", x + 44, y + 536, 270, 12, 560, C.muted);
  [["Fast", C.sheet], ["Standard", C.tealSoft], ["Accurate", C.sheet]].forEach((mode, i) => {
    rect(x + 44 + i * 98, y + 570, 90, 34, mode[1], 8, C.line);
    text(mode[0], x + 44 + i * 98, y + 581, 90, 11, 800, i === 1 ? C.teal : C.ink, "middle");
  });
  rect(x + 44, y + 628, 302, 64, C.greenSoft, 10, "#BFE8CF");
  text("Last result", x + 64, y + 644, 100, 11, 800, C.green);
  text("Visible for 0:10 after speech", x + 64, y + 664, 170, 10, 650, C.muted);
  pill("Reinsert", x + 242, y + 645, 86, C.sheet, C.green, C.line);
  rect(x + 44, y + 714, 142, 34, C.sheet, 8, C.line);
  text("Recent / retry", x + 44, y + 725, 142, 10, 800, C.teal, "middle");
  rect(x + 204, y + 714, 142, 34, C.warm, 8, C.line);
  text("Open Hush", x + 204, y + 725, 142, 10, 800, C.teal, "middle");
  keyboardFastBar(x, y, "Retry");
}

function sectionBackdrop(sectionX, y, sectionCols, rows, label, description, fill, accent, chips = []) {
  const sectionW = W * sectionCols + gapX * (sectionCols - 1);
  const h = sectionHeaderOffset + rows * H + (rows - 1) * gapY + 34;
  rect(sectionX - 24, y, sectionW + 48, h, fill, 24, C.darkLine);
  rect(sectionX + 16, y + 16, 58, 8, accent, 2);
  text(label, sectionX + 16, y + 30, 250, 22, 840, C.onDark);
  const chipStartX = sectionX + sectionW - chips.length * 140 - 16;
  text(description, sectionX + 286, y + 34, Math.max(220, chipStartX - sectionX - 304), 11, 540, C.darkMuted, "start", 1.2);
  chips.forEach((chip, i) => {
    pill(chip[0], chipStartX + i * 140, y + 24, 126, chip[1], chip[2], chip[3]);
  });
}

function pos(i) {
  const keyboardSlot = keyboardOrder.indexOf(i);
  const appSlot = appOrder.indexOf(i);
  const isKeyboard = keyboardSlot >= 0;
  const slot = isKeyboard ? keyboardSlot : appSlot;
  const cols = isKeyboard ? keyboardCols : appCols;
  const sectionX = isKeyboard ? keyboardSectionX : appSectionX;
  const col = slot % cols;
  const row = Math.floor(slot / cols);
  return {
    x: sectionX + col * (W + gapX),
    y: screenStartY + row * (H + gapY)
  };
}

out.push(`<?xml version="1.0" encoding="UTF-8"?>`);
out.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${canvasW}" height="${canvasH}" viewBox="0 0 ${canvasW} ${canvasH}">`);
out.push(`<defs>
  <filter id="phoneShadow" x="-20%" y="-20%" width="140%" height="140%">
    <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#0F0F0F" flood-opacity="0.08"/>
  </filter>
  <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
    <feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#0F0F0F" flood-opacity="0.045"/>
  </filter>
</defs>`);
rect(0, 0, canvasW, canvasH, C.canvas, 0);

rect(baseX, baseY, boardW, 280, C.black, 24, C.darkLine, { filter: "url(#softShadow)" });
rect(baseX + 34, baseY + 42, 58, 10, C.brandRed, 2);
text("Recommended direction", baseX + 34, baseY + 18, 360, 14, 800, C.darkMuted);
text("Hush App UI + Keyboard UI", baseX + 34, baseY + 88, 840, 38, 840, C.onDark, "start", 1.06);
text("The keyboard keeps only immediate actions: type, speak, switch mode, show live words while recording, briefly show the final result, and retry recent saved audio. The app owns setup, settings, full history, words, audio detail, permissions, model states, recovery, privacy, credits, and diagnostics.", baseX + 34, baseY + 154, 860, 17, 500, C.darkMuted, "start", 1.38);
pill("App left", baseX + 34, baseY + 226, 104, "#242424", C.onDark, C.darkLine);
pill("Keyboard right", baseX + 152, baseY + 226, 138, C.teal, C.onDark);
pill("Live transcript", baseX + 304, baseY + 226, 138, C.blue, C.onDark);
pill("Retry failed audio", baseX + 456, baseY + 226, 150, C.amber, C.onDark);
pill("Local only", baseX + 620, baseY + 226, 112, C.brandRed, C.onDark);
pill("Setup in app", baseX + 746, baseY + 226, 126, C.ai, C.onDark);
[
  ["Source", "Google Drive images", C.blueSoft],
  ["Style", "Hush system UI", C.tealSoft],
  ["Priority", "Fast typing flow", C.greenSoft],
  ["Policy", "Fail visibly", C.amberSoft]
].forEach((item, i) => {
  const x = baseX + 980 + i * 132;
  rect(x, baseY + 52, 112, 104, item[2], 8, C.darkLine);
  text(item[0], x + 14, baseY + 76, 84, 12, 800, C.ink, "middle");
  text(item[1], x + 14, baseY + 104, 84, 11, 600, C.muted, "middle", 1.25);
});

sectionBackdrop(
  appSectionX,
  screenStartY - sectionHeaderOffset,
  appCols,
  appSectionRows,
  "Hush App UI",
  "Dedicated app screens for setup, permissions, dictionary, full history, audio detail, settings, diagnostics, recovery, storage, credits, and support.",
  "#181818",
  C.brandRed,
  [
    ["Settings", "#242424", C.onDark, C.darkLine],
    ["Dictionary", C.ai, C.onDark],
    ["Diagnostics", C.amber, C.onDark],
    ["Recovery", C.blue, C.onDark]
  ]
);

sectionBackdrop(
  keyboardSectionX,
  screenStartY - sectionHeaderOffset,
  keyboardCols,
  keyboardSectionRows,
  "Keyboard UI",
  "Fast in-keyboard surfaces for voice, input, recording state, live transcription, final result, and retrying fresh failed audio.",
  "#141414",
  C.teal,
  [
    ["Voice", C.teal, C.onDark],
    ["Input", "#242424", C.onDark, C.darkLine],
    ["Live transcript", C.blue, C.onDark],
    ["Recent / Retry", C.amber, C.onDark]
  ]
);

// 01 Setup welcome
{
  const { x, y } = pos(0);
  phone(x, y, "App - Welcome / Trust", "Hush");
  text("Speak anywhere. Keep every recording.", x + 24, y + 130, 330, 31, 840, C.ink, "start", 1.08);
  text("A keyboard-first dictation app for WhatsApp, Telegram, browser fields, notes, and anywhere iOS accepts text.", x + 24, y + 246, 336, 15, 500, C.muted, "start", 1.4);
  orbGraphic(x + 195, y + 392, 78);
  card(x + 24, y + 516, 342, 72, "Local-first", "The app records before transcription starts.", C.teal);
  card(x + 24, y + 604, 342, 72, "Never lose audio", "Failed transcription creates a retryable internal item.", C.amber);
  button("Set up keyboard", x + 24, y + 710, 342);
  closePhone();
}

// 02 Microphone permission
{
  const { x, y } = pos(1);
  phone(x, y, "App - Microphone Permission", "Permission");
  text("Allow microphone access.", x + 24, y + 128, 336, 30, 840, C.ink, "start", 1.08);
  text("Hush records locally first, then transcribes. If transcription fails, the audio can still be retried from History.", x + 24, y + 208, 336, 15, 520, C.muted, "start", 1.36);
  rect(x + 36, y + 310, 318, 250, C.sheet, 24, C.line, { filter: "url(#softShadow)" });
  circle(x + 86, y + 360, 28, C.amberSoft);
  rect(x + 78, y + 342, 16, 32, C.amber, 8);
  rect(x + 82, y + 374, 8, 18, C.amber, 4);
  text("Hush Would Like to Access the Microphone", x + 74, y + 406, 242, 18, 820, C.ink, "middle", 1.18);
  text("Used only for local dictation recording.", x + 72, y + 470, 246, 13, 520, C.muted, "middle", 1.3);
  line(x + 36, y + 506, 318, 1, C.line);
  text("Don't Allow", x + 36, y + 526, 159, 15, 720, C.red, "middle");
  line(x + 195, y + 506, 1, 54, C.line);
  text("Allow", x + 196, y + 526, 158, 15, 760, C.teal, "middle");
  rect(x + 24, y + 596, 342, 84, C.tealSoft, 8, "#B8E6E3");
  text("Offline model", x + 44, y + 614, 170, 13, 800, C.tealInk);
  text("Ready for local transcription", x + 44, y + 637, 170, 11, 600, C.muted);
  rect(x + 226, y + 628, 110, 8, C.sheet, 4);
  rect(x + 226, y + 628, 96, 8, C.teal, 4);
  text("87%", x + 226, y + 648, 110, 11, 800, C.teal, "middle");
  text("The main Hush app owns the recorder. The keyboard only starts and inserts.", x + 44, y + 662, 292, 10, 650, C.tealInk, "start", 1.2);
  button("Continue", x + 24, y + 720, 342);
  closePhone();
}

// 03 Setup guide
{
  const { x, y } = pos(2);
  phone(x, y, "App - Keyboard Setup", "");
  orbGraphic(x + 70, y + 116, 36);
  text("HUSH KEYBOARD", x + 24, y + 162, 180, 9, 800, C.faint);
  text("Add the keyboard first.", x + 24, y + 188, 328, 28, 820, C.ink, "start", 1.08);
  text("Hush needs the iOS keyboard added and Full Access turned on before dictation can return text to Messages.", x + 24, y + 248, 336, 14, 540, C.muted, "start", 1.35);
  rect(x + 24, y + 330, 342, 300, C.sheet, 8, C.line, { filter: "url(#softShadow)" });
  text("Do this in Settings", x + 44, y + 352, 240, 15, 780, C.ink);
  [
    ["1", "Tap Keyboards", "General > Keyboard > Keyboards"],
    ["2", "Tap Add New Keyboard", "Look under Third-Party Keyboards"],
    ["3", "Choose Hush", "Hush appears after install"],
    ["4", "Tap Hush again", "Open the permission screen"],
    ["5", "Allow Full Access", "Lets Hush insert finished dictation"]
  ].forEach((s, i) => {
    const yy = y + 386 + i * 45;
    rect(x + 44, yy, 302, 36, C.sheet2, 6);
    text(s[0], x + 62, yy + 8, 18, 10, 720, C.faint, "middle");
    text(s[1], x + 88, yy + 6, 210, 12, 760, C.ink);
    text(s[2], x + 88, yy + 22, 220, 10, 500, C.muted);
  });
  rect(x + 24, y + 646, 342, 54, C.amberSoft, 8, "#F7D9A9");
  text("iOS does not let Hush enable Full Access for you. We can only open Settings and show the exact switches.", x + 44, y + 662, 302, 11, 700, C.amber, "start", 1.25);
  button("Open Keyboard Settings", x + 24, y + 716, 342);
  bottomTabs(x, y, "Setup");
  closePhone();
}

// App setup complete / actions
{
  const { x, y } = pos(35);
  phone(x, y, "App - Setup Complete", "Setup");
  text("Confirm Hush is ready.", x + 24, y + 126, 342, 26, 840, C.ink, "start", 1.08);
  text("This mirrors the setup action state from the source screens: open iOS Settings, return, then confirm Full Access is enabled.", x + 24, y + 188, 342, 13, 520, C.muted, "start", 1.34);
  rect(x + 24, y + 252, 342, 270, C.sheet, 12, C.line, { filter: "url(#softShadow)" });
  [
    ["1", "Open Keyboard Settings", "Add Hush and allow Full Access"],
    ["2", "Open Hush Settings", "Verify microphone and storage"],
    ["3", "I added it", "Continue to keyboard demo"]
  ].forEach((row, i) => {
    const yy = y + 284 + i * 76;
    rect(x + 44, yy, 302, 54, i === 2 ? C.tealSoft : C.warm, 8, C.line);
    circle(x + 68, yy + 27, 12, i === 2 ? C.teal : C.sheet, i === 2 ? null : C.line);
    text(row[0], x + 64, yy + 20, 8, 10, 820, i === 2 ? C.onDark : C.muted, "middle");
    text(row[1], x + 94, yy + 11, 192, 13, 820, i === 2 ? C.teal : C.ink);
    text(row[2], x + 94, yy + 32, 210, 10, 550, C.muted);
  });
  rect(x + 24, y + 570, 342, 64, C.greenSoft, 8, "#BFE8CF");
  text("Ready for keyboard dictation", x + 44, y + 590, 250, 14, 800, C.green);
  text("Next, test the real keyboard flow.", x + 44, y + 614, 250, 11, 600, C.muted);
  button("Open keyboard demo", x + 24, y + 690, 342);
  bottomTabs(x, y, "Setup");
  closePhone();
}

// 04 Keyboard idle
{
  const { x, y } = pos(3);
  phone(x, y, "Keyboard - Idle", "");
  appMessageArea(x, y, "idle");
  miniKeyboard(x, y, "idle");
  closePhone();
}

// 05 Mode menu
{
  const { x, y } = pos(4);
  phone(x, y, "Keyboard - Mode", "");
  appMessageArea(x, y, "idle");
  miniKeyboard(x, y, "idle");
  rect(x + 72, y + 510, 246, 234, C.sheet, 12, C.line, { filter: "url(#softShadow)" });
  text("Dictation mode", x + 94, y + 532, 202, 18, 820, C.ink, "middle");
  [
    ["Fast", "Quick drafts"],
    ["Standard", "Balanced local"],
    ["Accurate", "Cleaner text"]
  ].forEach((m, i) => {
    const yy = y + 584 + i * 42;
    rect(x + 94, yy, 202, 32, i === 1 ? C.tealSoft : C.sheet, 8);
    text(m[0], x + 110, yy + 9, 86, 12, 760, i === 1 ? C.teal : C.ink);
    text(m[1], x + 194, yy + 9, 86, 11, 500, C.muted, "end");
  });
  text("Dictionary and advanced accuracy live in Hush.", x + 94, y + 720, 202, 10, 700, C.muted, "middle");
  closePhone();
}

// 06 Keyboard Quick Access
{
  const { x, y } = pos(5);
  phone(x, y, "Keyboard - Quick Access", "");
  appMessageArea(x, y, "idle");
  keyboardQuickAccess(x, y);
  closePhone();
}

// 07 Recording
{
  const { x, y } = pos(6);
  phone(x, y, "Keyboard - Recording", "");
  appMessageArea(x, y, "idle");
  rect(x, y + 452, W, 392, C.keyboard, 0);
  rect(x + 24, y + 486, 342, 206, C.sheet, 14, C.line, { filter: "url(#softShadow)" });
  pill("Recorder active", x + 122, y + 510, 146, C.greenSoft, C.green);
  text("Listening locally", x + 24, y + 558, 342, 28, 840, C.ink, "middle");
  [24, 44, 72, 56, 86, 62, 36, 68, 42].forEach((h, i) => {
    rect(x + 102 + i * 20, y + 626 - h / 2, 10, h, C.teal, 5);
  });
  micIcon(x + 195, y + 712, 64, C.teal, true);
  text("Tap again to stop and insert", x + 24, y + 746, 342, 12, 680, C.muted, "middle");
  keyboardFastBar(x, y, "Keys");
  circle(x + 326, y + 25, 5, C.amber);
  closePhone();
}

// 08 Insert result
{
  const { x, y } = pos(26);
  phone(x, y, "Keyboard - Live Transcript", "");
  appMessageArea(x, y, "idle");
  rect(x, y + 452, W, 392, C.keyboard, 0);
  rect(x + 24, y + 482, 342, 244, C.sheet, 14, C.line, { filter: "url(#softShadow)" });
  pill("Live transcript", x + 122, y + 506, 146, C.blueSoft, C.blue);
  text("Words appear as you speak", x + 44, y + 552, 302, 23, 840, C.ink, "middle");
  rect(x + 44, y + 610, 302, 74, C.greenSoft, 12, "#BFE8CF");
  text("test one, two, three", x + 64, y + 628, 242, 17, 820, C.green);
  text("I'm speaking right now...", x + 64, y + 658, 242, 13, 720, C.green);
  [14, 26, 38, 24, 48, 32, 18].forEach((h, i) => {
    rect(x + 86 + i * 18, y + 708 - h / 2, 8, h, C.teal, 4);
  });
  text("Final text inserts when recording stops", x + 44, y + 742, 302, 11, 700, C.muted, "middle");
  keyboardFastBar(x, y, "Keys");
  circle(x + 326, y + 25, 5, C.amber);
  closePhone();
}

// 09 Insert result
{
  const { x, y } = pos(7);
  phone(x, y, "Keyboard - Inserted", "");
  appMessageArea(x, y, "inserted");
  rect(x, y + 452, W, 392, C.keyboard, 0);
  rect(x + 24, y + 510, 342, 172, C.sheet, 14, C.line);
  pill("Inserted", x + 144, y + 534, 102, C.greenSoft, C.green);
  text("Text added to the input", x + 44, y + 584, 302, 24, 840, C.ink, "middle");
  text("The user stays in the original app. Hush only appears when setup or recovery needs attention.", x + 54, y + 626, 282, 13, 500, C.muted, "middle", 1.34);
  button("Dictate again", x + 52, y + 704, 286);
  keyboardFastBar(x, y, "Keys");
  closePhone();
}

// 10 Failed audio saved
{
  const { x, y } = pos(8);
  phone(x, y, "Keyboard - Failed Saved", "");
  appMessageArea(x, y, "silence");
  rect(x, y + 452, W, 392, C.keyboard, 0);
  rect(x + 24, y + 500, 342, 230, C.sheet, 14, C.line);
  pill("Saved audio", x + 128, y + 526, 134, C.amberSoft, C.amber);
  text("No speech result inserted", x + 42, y + 576, 306, 24, 840, C.ink, "middle");
  text("The audio is saved locally so the user can retry from the app or the fresh retry shortcut.", x + 52, y + 620, 286, 13, 500, C.muted, "middle", 1.34);
  rect(x + 48, y + 700, 132, 46, C.sheet, 10, C.line);
  text("Dismiss", x + 48, y + 714, 132, 13, 760, C.teal, "middle");
  button("Retry", x + 204, y + 700, 138, C.amber);
  keyboardFastBar(x, y, "Retry");
  closePhone();
}

// 11 Keyboard History Picker
{
  const { x, y } = pos(9);
  phone(x, y, "Keyboard - Recent + Failed", "");
  appMessageArea(x, y, "idle");
  keyboardHistoryPicker(x, y);
  closePhone();
}

// 11 App full history
{
  const { x, y } = pos(10);
  phone(x, y, "App - Full History", "History");
  text("History is hidden from the main screen. It lives here for search, retry, self-learning, and future knowledge graph work.", x + 24, y + 126, 342, 14, 500, C.muted, "start", 1.35);
  rect(x + 24, y + 166, 342, 44, C.sheet, 8, C.line);
  text("Search all dictations", x + 44, y + 180, 220, 13, 500, C.faint);
  [
    ["Today, 7:54", "Test one, two, three. I'm speaking.", "Insert", C.teal, C.tealSoft],
    ["Today, 7:49", "Audio saved - transcription failed", "Retry", C.amber, C.amberSoft],
    ["Yesterday", "Keyboard setup notes", "Open", C.blue, C.blueSoft],
    ["May 20", "No speech detected", "Audio", C.red, C.redSoft]
  ].forEach((item, i) => {
    const yy = y + 234 + i * 96;
    rect(x + 24, yy, 342, 82, C.sheet, 8, C.line);
    text(item[0], x + 44, yy + 14, 120, 11, 650, C.faint);
    text(item[1], x + 44, yy + 38, 202, 13, 760, C.ink, "start", 1.24);
    pill(item[2], x + 268, yy + 27, 74, item[4], item[3]);
  });
  button("Open audio detail", x + 24, y + 658, 342);
  bottomTabs(x, y, "History");
  closePhone();
}

// 12 App audio detail
{
  const { x, y } = pos(11);
  phone(x, y, "App - Audio Detail", "Audio Detail");
  pill("Saved audio", x + 24, y + 126, 112, C.amberSoft, C.amber);
  text("Today, 7:49 PM", x + 154, y + 134, 160, 11, 700, C.faint);
  rect(x + 24, y + 176, 342, 156, C.sheet, 10, C.line, { filter: "url(#softShadow)" });
  text("Transcription failed", x + 44, y + 202, 250, 22, 840, C.ink);
  text("The original recording is still saved locally. Retry when the model is ready or play it back before deleting.", x + 44, y + 246, 286, 13, 520, C.muted, "start", 1.34);
  [18, 42, 30, 62, 48, 74, 36, 58, 26, 44].forEach((h, i) => {
    rect(x + 58 + i * 26, y + 374 - h / 2, 12, h, C.amber, 6);
  });
  rect(x + 24, y + 430, 342, 64, C.sheet, 8, C.line);
  text("Playback", x + 44, y + 448, 150, 13, 760, C.ink);
  text("0:17 local m4a", x + 44, y + 470, 150, 10, 520, C.muted);
  pill("Play", x + 284, y + 447, 58, C.tealSoft, C.teal);
  button("Retry transcription", x + 24, y + 548, 342, C.amber);
  rect(x + 24, y + 616, 342, 50, C.sheet, 10, C.line);
  text("Delete recording", x + 44, y + 632, 180, 13, 760, C.red);
  text("DELETE", x + 286, y + 634, 52, 10, 800, C.red, "middle");
  bottomTabs(x, y, "History");
  closePhone();
}

// 13 App settings
{
  const { x, y } = pos(12);
  phone(x, y, "App - Settings", "Settings");
  [
    ["Auto-punctuate", "Periods, commas, capitals", C.teal, "toggle"],
    ["Haptics", "Record and save cues", C.teal, "toggle"],
    ["Sounds", "Start and finish cues", C.teal, "toggle"],
    ["Language & Accuracy", "Detailed defaults", C.blue, "link"],
    ["Keyboard setup", "iOS setup and demo", C.teal, "link"],
    ["Dictionary / Words", "Names and corrections", C.ai, "link"],
    ["Diagnostics", "Recorder, model, logs", C.amber, "link"],
    ["Privacy & Storage", "Local audio recovery", C.red, "link"],
    ["About / Credits", "Version, support, balance", C.blue, "link"]
  ].forEach((row, i) => {
    const yy = y + 118 + i * 58;
    rect(x + 24, yy, 342, 46, C.sheet, 8, C.line);
    circle(x + 50, yy + 23, 6, row[2]);
    text(row[0], x + 72, yy + 8, 194, 12, 760, C.ink);
    text(row[1], x + 72, yy + 27, 214, 9, 500, C.muted);
    if (row[3] === "toggle") {
      rect(x + 304, yy + 11, 42, 24, C.green, 12);
      circle(x + 334, yy + 23, 10, C.sheet);
    } else {
      text(">", x + 330, yy + 15, 20, 14, 760, C.faint, "middle");
    }
  });
  rect(x + 24, y + 662, 342, 48, C.tealSoft, 8, "#B8E6E3");
  text("Slow choices live here so the keyboard can stay fast.", x + 44, y + 678, 302, 11, 720, C.tealInk, "start", 1.25);
  bottomTabs(x, y, "More");
  closePhone();
}

// App more menu
{
  const { x, y } = pos(30);
  phone(x, y, "App - More Menu", "More");
  text("Deep app tools live here.", x + 24, y + 126, 342, 24, 840, C.ink, "start", 1.1);
  text("This replaces the old keyboard More/settings panel. Slow choices belong in the app.", x + 24, y + 176, 342, 13, 520, C.muted, "start", 1.34);
  [
    ["Settings", "Auto-punctuate, haptics, sounds", C.teal],
    ["Language & Accuracy", "Default language and model behavior", C.blue],
    ["Dictionary / Words", "Custom names and corrections", C.ai],
    ["Diagnostics", "Recorder, model, app group, logs", C.amber],
    ["Privacy & Storage", "Local audio recovery and deletion", C.red],
    ["Credits / About", "Version, support, balance", C.blue]
  ].forEach((row, i) => {
    const yy = y + 250 + i * 66;
    rect(x + 24, yy, 342, 52, C.sheet, 8, C.line);
    circle(x + 52, yy + 26, 8, row[2]);
    text(row[0], x + 76, yy + 11, 210, 13, 800, C.ink);
    text(row[1], x + 76, yy + 32, 230, 10, 520, C.muted);
    text(">", x + 326, yy + 16, 20, 15, 760, C.faint, "middle");
  });
  bottomTabs(x, y, "More");
  closePhone();
}

// 14 App language and accuracy
{
  const { x, y } = pos(13);
  phone(x, y, "App - Language + Accuracy", "Language");
  text("Detailed accuracy choices stay in the app. The keyboard keeps only Fast, Standard, Accurate.", x + 24, y + 126, 342, 13, 520, C.muted, "start", 1.34);
  rect(x + 24, y + 194, 342, 64, C.sheet, 8, C.line);
  text("Language", x + 44, y + 210, 180, 14, 760, C.ink);
  text("English (US)", x + 44, y + 234, 180, 11, 500, C.muted);
  text(">", x + 330, y + 216, 20, 16, 760, C.faint, "middle");
  text("Default accuracy", x + 24, y + 302, 240, 18, 820, C.ink);
  [
    ["Fast", "Lowest latency"],
    ["Standard", "Balanced"],
    ["Accurate", "Best cleanup"]
  ].forEach((row, i) => {
    const yy = y + 346 + i * 70;
    rect(x + 24, yy, 342, 54, i === 1 ? C.tealSoft : C.sheet, 8, C.line);
    text(row[0], x + 44, yy + 12, 160, 14, 780, i === 1 ? C.teal : C.ink);
    text(row[1], x + 44, yy + 34, 180, 10, 500, C.muted);
    if (i === 1) pill("Default", x + 274, yy + 14, 70, C.sheet, C.teal, C.line);
  });
  rect(x + 24, y + 610, 342, 70, C.warm, 8, C.line);
  text("The keyboard may temporarily override this for a single dictation.", x + 44, y + 634, 302, 11, 700, C.muted, "start", 1.3);
  bottomTabs(x, y, "More");
  closePhone();
}

// App language picker
{
  const { x, y } = pos(31);
  phone(x, y, "App - Language Picker", "Language");
  text("Choose dictation language.", x + 24, y + 126, 342, 24, 840, C.ink);
  rect(x + 24, y + 178, 342, 44, C.sheet, 8, C.line);
  text("Search languages", x + 44, y + 192, 220, 13, 500, C.faint);
  [
    ["English (US)", "Selected", C.teal, C.tealSoft],
    ["English (UK)", "Available", C.blue, C.blueSoft],
    ["Arabic", "Available", C.blue, C.blueSoft],
    ["Spanish", "Available", C.blue, C.blueSoft],
    ["French", "Available", C.blue, C.blueSoft],
    ["Auto-detect", "Experimental", C.amber, C.amberSoft]
  ].forEach((row, i) => {
    const yy = y + 252 + i * 62;
    rect(x + 24, yy, 342, 48, row[1] === "Selected" ? C.tealSoft : C.sheet, 8, C.line);
    text(row[0], x + 44, yy + 12, 170, 13, 780, row[1] === "Selected" ? C.teal : C.ink);
    pill(row[1], x + 238, yy + 9, 106, row[3], row[2]);
  });
  rect(x + 24, y + 662, 342, 48, C.warm, 8, C.line);
  text("Keyboard keeps compact mode only. Language selection stays in app.", x + 44, y + 678, 302, 11, 700, C.muted, "start", 1.25);
  bottomTabs(x, y, "More");
  closePhone();
}

// 15 App words
{
  const { x, y } = pos(14);
  phone(x, y, "App - Words", "Words");
  text("Names and phrases Hush should recognize exactly.", x + 24, y + 126, 342, 14, 500, C.muted);
  rect(x + 24, y + 166, 342, 46, C.sheet, 8, C.line);
  text("Search or add a phrase", x + 44, y + 181, 220, 13, 500, C.faint);
  [
    ["Ali Husham", "Prefer this spelling"],
    ["GoodTek", "Company name"],
    ["Hush Dictation", "Product phrase"],
    ["one, two, three", "Keep punctuation"]
  ].forEach((item, i) => {
    const yy = y + 242 + i * 82;
    rect(x + 24, yy, 342, 62, C.sheet, 8, C.line);
    text(item[0], x + 44, yy + 15, 216, 15, 760, C.ink);
    text(item[1], x + 44, yy + 38, 216, 11, 500, C.muted);
    pill("Edit", x + 292, yy + 17, 52, C.tealSoft, C.teal);
  });
  button("Add correction", x + 24, y + 646, 342);
  bottomTabs(x, y, "Words");
  closePhone();
}

// 16 App diagnostics
{
  const { x, y } = pos(15);
  phone(x, y, "App - Diagnostics", "Diagnostics");
  [
    ["Keyboard", "Connected", "OK", C.green, C.greenSoft],
    ["App Group", "Readable and writable", "OK", C.green, C.greenSoft],
    ["Recorder", "Ready", "OK", C.green, C.greenSoft],
    ["Speech model", "Initializing", "Wait", C.amber, C.amberSoft],
    ["Last handoff", "Token consumed", "OK", C.green, C.greenSoft],
    ["Failure policy", "Visible error", "OK", C.teal, C.tealSoft]
  ].forEach((row, i) => {
    const yy = y + 132 + i * 74;
    rect(x + 24, yy, 342, 56, C.sheet, 8, C.line);
    circle(x + 52, yy + 28, 8, row[3]);
    text(row[0], x + 76, yy + 12, 150, 13, 760, C.ink);
    text(row[1], x + 76, yy + 33, 200, 11, 500, C.muted);
    pill(row[2], x + 294, yy + 13, 50, row[4], row[3]);
  });
  button("Export logs", x + 24, y + 654, 154);
  rect(x + 202, y + 654, 164, 50, C.sheet, 12, C.line);
  text("Run check", x + 202, y + 670, 164, 15, 760, C.teal, "middle");
  bottomTabs(x, y, "More");
  closePhone();
}

// 17 Keyboard coachmarks
{
  const { x, y } = pos(16);
  phone(x, y, "Keyboard - Coachmarks", "");
  appMessageArea(x, y, "idle");
  miniKeyboard(x, y, "idle");
  rect(x + 20, y + 466, 350, 96, C.sheet, 14, C.line, { filter: "url(#softShadow)" });
  text("1. Switch to Hush", x + 44, y + 488, 170, 17, 820, C.ink);
  text("Use the globe key once, then Hush remembers your keyboard choice.", x + 44, y + 520, 250, 12, 560, C.muted, "start", 1.25);
  pill("Next", x + 292, y + 502, 54, C.tealSoft, C.teal);
  rect(x + 22, y + 664, 138, 64, C.sheet, 12, C.line);
  text("2. Tap mic", x + 40, y + 684, 90, 13, 800, C.ink);
  rect(x + 230, y + 664, 138, 64, C.sheet, 12, C.line);
  text("3. Tap stop", x + 248, y + 684, 90, 13, 800, C.ink);
  text("Insert text", x + 248, y + 706, 90, 10, 650, C.muted);
  closePhone();
}

// 18 App orb test recorder
{
  const { x, y } = pos(17);
  phone(x, y, "App - Test Dictation", "Test Dictation");
  text("Test dictation in Hush before using the keyboard.", x + 24, y + 122, 342, 14, 540, C.muted, "start", 1.3);
  orbGraphic(x + 195, y + 282, 96, true);
  pill("Local recorder ready", x + 118, y + 404, 154, C.greenSoft, C.green);
  text("Push and hold to speak", x + 24, y + 448, 342, 24, 820, C.ink, "middle");
  text("This screen proves the app-owned microphone path works before the keyboard starts using it.", x + 52, y + 492, 286, 13, 520, C.muted, "middle", 1.3);
  micIcon(x + 195, y + 610, 76, C.teal, true);
  rect(x + 24, y + 690, 342, 46, C.warm, 8, C.line);
  text("Model: local  •  Queue: 0  •  Last save: ready", x + 44, y + 706, 302, 10, 700, C.muted, "middle");
  bottomTabs(x, y, "Home");
  closePhone();
}

// App test dictation coachmark
{
  const { x, y } = pos(27);
  phone(x, y, "App - Test Dictation Coachmark", "Test Dictation");
  text("Practice once in the app.", x + 24, y + 122, 342, 24, 840, C.ink, "start", 1.1);
  text("A short coachmark teaches the app-owned recorder before users try the keyboard.", x + 24, y + 178, 342, 13, 520, C.muted, "start", 1.34);
  orbGraphic(x + 195, y + 330, 88);
  rect(x + 34, y + 478, 322, 126, C.sheet, 14, C.line, { filter: "url(#softShadow)" });
  text("Hold the mic to speak", x + 58, y + 502, 220, 17, 820, C.ink);
  text("Release to save the recording and start local transcription.", x + 58, y + 536, 230, 12, 560, C.muted, "start", 1.25);
  pill("Got it", x + 264, y + 526, 62, C.tealSoft, C.teal);
  micIcon(x + 195, y + 690, 72, C.teal, true);
  bottomTabs(x, y, "Home");
  closePhone();
}

// App test dictation listening
{
  const { x, y } = pos(28);
  phone(x, y, "App - Test Dictation Listening", "Listening");
  text("Listening locally", x + 24, y + 132, 342, 28, 840, C.ink, "middle");
  text("Audio is recorded before transcription, so failed model states never lose the spoken audio.", x + 52, y + 186, 286, 13, 520, C.muted, "middle", 1.34);
  orbGraphic(x + 195, y + 338, 100, true);
  [30, 58, 84, 62, 98, 72, 44, 68, 36].forEach((h, i) => {
    rect(x + 88 + i * 24, y + 512 - h / 2, 12, h, C.teal, 6);
  });
  pill("Recording", x + 132, y + 586, 126, C.greenSoft, C.green);
  button("Release to transcribe", x + 24, y + 674, 342);
  bottomTabs(x, y, "Home");
  closePhone();
}

// App test dictation result
{
  const { x, y } = pos(29);
  phone(x, y, "App - Test Dictation Result", "Result");
  pill("Saved locally", x + 24, y + 126, 112, C.greenSoft, C.green);
  rect(x + 24, y + 178, 342, 178, C.sheet, 12, C.line, { filter: "url(#softShadow)" });
  text("Test one, two, three.", x + 48, y + 210, 270, 24, 840, C.ink);
  text("This local test proves the recorder, model, and save path before the keyboard flow starts.", x + 48, y + 266, 282, 13, 520, C.muted, "start", 1.34);
  rect(x + 24, y + 412, 342, 70, C.tealSoft, 8, "#B8E6E3");
  text("Ready for keyboard", x + 44, y + 432, 220, 14, 800, C.tealInk);
  text("Now open any app input and tap Hush.", x + 44, y + 456, 260, 11, 600, C.muted);
  button("Try in keyboard", x + 24, y + 610, 342);
  rect(x + 24, y + 678, 342, 48, C.sheet, 12, C.line);
  text("Record another test", x + 24, y + 694, 342, 15, 760, C.teal, "middle");
  bottomTabs(x, y, "Home");
  closePhone();
}

// 19 App model download
{
  const { x, y } = pos(18);
  phone(x, y, "App - Model Download", "Speech Model");
  text("Hush records audio even while the speech model is still preparing.", x + 24, y + 126, 342, 14, 520, C.muted, "start", 1.35);
  rect(x + 24, y + 190, 342, 184, C.sheet, 12, C.line, { filter: "url(#softShadow)" });
  text("Downloading local model", x + 48, y + 218, 260, 22, 840, C.ink);
  text("Keep Hush open until setup finishes. Dictations are saved locally if transcription cannot start yet.", x + 48, y + 268, 278, 13, 520, C.muted, "start", 1.34);
  rect(x + 48, y + 324, 278, 10, C.warm2, 5);
  rect(x + 48, y + 324, 144, 10, C.teal, 5);
  text("52%", x + 48, y + 346, 278, 12, 800, C.teal, "middle");
  card(x + 24, y + 430, 342, 76, "Fail-safe recording", "If the model is not ready, the audio item appears in History for retry.", C.amber);
  card(x + 24, y + 522, 342, 76, "No internet fallback", "The design keeps local recording explicit and visible.", C.red);
  button("Continue setup", x + 24, y + 674, 342);
  bottomTabs(x, y, "More");
  closePhone();
}

// 20 App permission recovery
{
  const { x, y } = pos(19);
  phone(x, y, "App - Permission Recovery", "Microphone");
  circle(x + 195, y + 210, 76, C.redSoft, C.red);
  micGlyph(x + 195, y + 210, 1.42, C.red, C.redSoft);
  text("Microphone access is off", x + 24, y + 330, 342, 28, 840, C.ink, "middle");
  text("The keyboard cannot start a real recording until Hush is allowed to use the microphone.", x + 54, y + 380, 282, 14, 520, C.muted, "middle", 1.32);
  button("Open microphone settings", x + 24, y + 500, 342, C.red);
  rect(x + 24, y + 568, 342, 50, C.sheet, 12, C.line);
  text("Not now", x + 24, y + 584, 342, 15, 760, C.teal, "middle");
  rect(x + 24, y + 660, 342, 62, C.amberSoft, 8, "#F7D9A9");
  text("Hush should fail visibly here, not show fake listening in the keyboard.", x + 44, y + 680, 302, 11, 760, C.amber, "start", 1.25);
  bottomTabs(x, y, "More");
  closePhone();
}

// 21 App dictionary empty and edit
{
  const { x, y } = pos(20);
  phone(x, y, "App - Dictionary Empty / Edit", "Words");
  text("Teach Hush names, company words, and preferred spellings.", x + 24, y + 126, 342, 14, 520, C.muted, "start", 1.3);
  rect(x + 24, y + 180, 342, 132, C.warm, 12, C.line);
  text("No custom words yet", x + 44, y + 212, 260, 22, 840, C.ink, "middle");
  text("Add words that local transcription should preserve exactly.", x + 62, y + 258, 226, 12, 560, C.muted, "middle", 1.3);
  rect(x + 24, y + 348, 342, 236, C.sheet, 12, C.line, { filter: "url(#softShadow)" });
  text("New correction", x + 44, y + 372, 220, 18, 820, C.ink);
  text("When Hush hears", x + 44, y + 418, 180, 11, 700, C.faint);
  rect(x + 44, y + 438, 302, 42, C.warm, 8, C.line);
  text("good tech", x + 62, y + 452, 220, 13, 650, C.ink);
  text("Replace with", x + 44, y + 500, 180, 11, 700, C.faint);
  rect(x + 44, y + 520, 302, 42, C.warm, 8, C.line);
  text("GoodTek", x + 62, y + 534, 220, 13, 650, C.ink);
  button("Save word", x + 24, y + 650, 342);
  bottomTabs(x, y, "Words");
  closePhone();
}

// 22 App diagnostics detail
{
  const { x, y } = pos(21);
  phone(x, y, "App - Diagnostics Detail", "Diagnostics");
  text("A decisive status page for support and debugging.", x + 24, y + 126, 342, 13, 520, C.muted);
  [
    ["Recorder", "AVAudioEngine route: iPhone mic", "OK", C.green, C.greenSoft],
    ["Keyboard handoff", "Last token consumed in 0.8s", "OK", C.green, C.greenSoft],
    ["Model", "Local queue idle", "OK", C.green, C.greenSoft],
    ["App Group", "History writable", "OK", C.green, C.greenSoft]
  ].forEach((row, i) => {
    const yy = y + 166 + i * 58;
    rect(x + 24, yy, 342, 46, C.sheet, 8, C.line);
    text(row[0], x + 44, yy + 8, 120, 12, 760, C.ink);
    text(row[1], x + 44, yy + 27, 210, 9, 500, C.muted);
    pill(row[2], x + 292, yy + 10, 52, row[4], row[3]);
  });
  rect(x + 24, y + 436, 342, 196, C.black, 10, C.darkLine);
  text("Recent logs", x + 44, y + 458, 160, 13, 800, C.onDark);
  [
    "qwerty.micTap start",
    "handoff.receive token ok",
    "recorder.active orange mic",
    "transcript.insert complete",
    "audio.save fallback ready"
  ].forEach((log, i) => {
    text(log, x + 44, y + 494 + i * 24, 280, 10, 650, C.darkMuted);
  });
  button("Export logs", x + 24, y + 666, 154);
  rect(x + 202, y + 666, 164, 50, C.sheet, 12, C.line);
  text("Refresh", x + 202, y + 682, 164, 15, 760, C.teal, "middle");
  bottomTabs(x, y, "More");
  closePhone();
}

// App diagnostics activity log
{
  const { x, y } = pos(32);
  phone(x, y, "App - Diagnostics Activity Log", "Diagnostics");
  text("Keyboard activity log.", x + 24, y + 126, 342, 24, 840, C.ink);
  text("A support surface for decisive logs, refresh, and clear actions.", x + 24, y + 176, 342, 13, 520, C.muted, "start", 1.34);
  rect(x + 24, y + 238, 342, 334, C.black, 12, C.darkLine);
  [
    "15:24:02 keyboard.mic.tap",
    "15:24:02 handoff.token.created",
    "15:24:03 recorder.active",
    "15:24:05 live.partial updated",
    "15:24:09 transcript.inserted",
    "15:24:16 audio.saved fallback",
    "15:24:17 retry.available"
  ].forEach((log, i) => {
    text(log, x + 44, y + 266 + i * 34, 260, 11, 650, i < 5 ? C.darkMuted : C.amberSoft);
  });
  rect(x + 24, y + 616, 154, 48, C.sheet, 12, C.line);
  text("Refresh", x + 24, y + 632, 154, 14, 760, C.teal, "middle");
  rect(x + 202, y + 616, 164, 48, C.redSoft, 12, "#E7B5B5");
  text("Clear log", x + 202, y + 632, 164, 14, 760, C.red, "middle");
  button("Export support bundle", x + 24, y + 692, 342);
  bottomTabs(x, y, "More");
  closePhone();
}

// 23 App storage error
{
  const { x, y } = pos(22);
  phone(x, y, "App - Storage Error", "Storage");
  circle(x + 195, y + 216, 74, C.amberSoft, C.amber);
  rect(x + 158, y + 196, 74, 46, C.amber, 8);
  rect(x + 174, y + 178, 42, 28, "none", 8, C.amber, { "stroke-width": 8 });
  text("Private storage unavailable", x + 24, y + 330, 342, 26, 840, C.ink, "middle");
  text("Hush cannot guarantee audio recovery until App Group storage is writable again.", x + 54, y + 380, 282, 14, 520, C.muted, "middle", 1.32);
  card(x + 24, y + 478, 342, 80, "Fail loudly", "The keyboard should show an error instead of pretending to listen.", C.red);
  button("Try again", x + 24, y + 632, 160, C.amber);
  rect(x + 206, y + 632, 160, 50, C.sheet, 12, C.line);
  text("View help", x + 206, y + 648, 160, 15, 760, C.teal, "middle");
  bottomTabs(x, y, "More");
  closePhone();
}

// 24 App recovery phrase
{
  const { x, y } = pos(23);
  phone(x, y, "App - Recovery Phrase", "Recovery");
  text("Optional local account recovery for future sync or paid credits.", x + 24, y + 126, 342, 13, 520, C.muted, "start", 1.3);
  rect(x + 24, y + 174, 342, 238, C.sheet, 12, C.line, { filter: "url(#softShadow)" });
  text("Write these words down", x + 44, y + 198, 250, 18, 820, C.ink);
  ["silent", "orbit", "river", "paper", "mint", "local", "glass", "field", "voice", "north", "cedar", "plain"].forEach((word, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const xx = x + 44 + col * 98;
    const yy = y + 240 + row * 38;
    rect(xx, yy, 86, 28, C.warm, 6, C.line);
    text(`${i + 1}. ${word}`, xx + 8, yy + 8, 70, 9, 760, C.ink);
  });
  rect(x + 24, y + 448, 342, 82, C.amberSoft, 8, "#F7D9A9");
  text("Store privately", x + 44, y + 466, 170, 13, 800, C.amber);
  text("Hush cannot restore this phrase if it is lost.", x + 44, y + 490, 278, 11, 650, C.amber, "start", 1.25);
  button("I saved it", x + 24, y + 586, 342);
  rect(x + 24, y + 654, 342, 50, C.sheet, 12, C.line);
  text("Restore with phrase", x + 24, y + 670, 342, 15, 760, C.teal, "middle");
  bottomTabs(x, y, "More");
  closePhone();
}

// App recovery confirm phrase
{
  const { x, y } = pos(33);
  phone(x, y, "App - Recovery Confirm Phrase", "Recovery");
  text("Confirm your recovery phrase.", x + 24, y + 126, 342, 24, 840, C.ink);
  text("Hush checks a few words before the phrase is accepted.", x + 24, y + 176, 342, 13, 520, C.muted, "start", 1.34);
  [
    ["Word 3", "river"],
    ["Word 7", "glass"],
    ["Word 11", ""]
  ].forEach((row, i) => {
    const yy = y + 246 + i * 92;
    text(row[0], x + 24, yy, 160, 12, 700, C.faint);
    rect(x + 24, yy + 24, 342, 48, C.sheet, 8, C.line);
    text(row[1] || "Type word", x + 44, yy + 39, 220, 13, row[1] ? 760 : 500, row[1] ? C.ink : C.faint);
  });
  rect(x + 24, y + 552, 342, 70, C.amberSoft, 8, "#F7D9A9");
  text("No cloud backup", x + 44, y + 570, 180, 13, 800, C.amber);
  text("This phrase is the only recovery path if account recovery ships later.", x + 44, y + 594, 286, 11, 650, C.amber, "start", 1.25);
  button("Confirm phrase", x + 24, y + 690, 342);
  bottomTabs(x, y, "More");
  closePhone();
}

// App restore phrase
{
  const { x, y } = pos(34);
  phone(x, y, "App - Restore With Phrase", "Restore");
  text("Restore with phrase.", x + 24, y + 126, 342, 26, 840, C.ink);
  text("A dedicated restore screen belongs in the app, never in the keyboard.", x + 24, y + 184, 342, 13, 520, C.muted, "start", 1.34);
  rect(x + 24, y + 250, 342, 250, C.sheet, 12, C.line, { filter: "url(#softShadow)" });
  text("Recovery phrase", x + 44, y + 276, 180, 14, 800, C.ink);
  [0, 1, 2, 3].forEach((row) => {
    const yy = y + 320 + row * 42;
    rect(x + 44, yy, 302, 32, C.warm, 6, C.line);
    text(`${row * 3 + 1}  ${row * 3 + 2}  ${row * 3 + 3}`, x + 62, yy + 10, 100, 9, 650, C.faint);
  });
  rect(x + 24, y + 548, 342, 58, C.redSoft, 8, "#E7B5B5");
  text("Restore replaces local account state on this device.", x + 44, y + 568, 290, 11, 700, C.red, "start", 1.25);
  button("Restore account", x + 24, y + 674, 342, C.brandRed);
  bottomTabs(x, y, "More");
  closePhone();
}

// 25 App credits
{
  const { x, y } = pos(24);
  phone(x, y, "App - Credits", "Credits");
  rect(x + 24, y + 126, 342, 104, C.black, 14, C.darkLine);
  text("Balance", x + 48, y + 152, 120, 12, 700, C.darkMuted);
  text("12,400", x + 48, y + 178, 160, 36, 840, C.onDark);
  text("local minutes ready", x + 212, y + 188, 112, 11, 600, C.darkMuted, "end");
  [
    ["Small", "1,000 credits", "$2.99"],
    ["Medium", "5,000 credits", "$9.99"],
    ["Large", "12,000 credits", "$19.99"]
  ].forEach((plan, i) => {
    const yy = y + 272 + i * 98;
    rect(x + 24, yy, 342, 76, i === 1 ? C.tealSoft : C.sheet, 10, C.line);
    text(plan[0], x + 44, yy + 16, 110, 15, 800, i === 1 ? C.teal : C.ink);
    text(plan[1], x + 44, yy + 42, 150, 11, 500, C.muted);
    text(plan[2], x + 266, yy + 24, 70, 15, 820, C.ink, "end");
  });
  rect(x + 24, y + 610, 342, 70, C.warm, 8, C.line);
  text("Credits are an app concern. The keyboard should never sell, configure, or explain billing inline.", x + 44, y + 632, 302, 11, 700, C.muted, "start", 1.3);
  bottomTabs(x, y, "More");
  closePhone();
}

// 26 App keyboard demo
{
  const { x, y } = pos(25);
  phone(x, y, "App - Keyboard Demo", "Keyboard Demo");
  text("A safe place to preview the keyboard flow without opening Messages.", x + 24, y + 126, 342, 13, 520, C.muted, "start", 1.3);
  appMessageArea(x, y + 26, "idle");
  rect(x + 24, y + 506, 342, 168, C.sheet, 14, C.line, { filter: "url(#softShadow)" });
  text("Demo states", x + 44, y + 528, 180, 18, 820, C.ink);
  [
    ["Idle", C.tealSoft, C.teal],
    ["Recording", C.greenSoft, C.green],
    ["Live text", C.blueSoft, C.blue],
    ["Inserted", C.greenSoft, C.green],
    ["Failed saved", C.amberSoft, C.amber]
  ].forEach((state, i) => {
    const xx = x + 44 + (i % 2) * 150;
    const yy = y + 572 + Math.floor(i / 2) * 38;
    pill(state[0], xx, yy, 126, state[1], state[2]);
  });
  button("Open iOS setup", x + 24, y + 706, 342);
  bottomTabs(x, y, "More");
  closePhone();
}

out.push("</svg>");

const svg = out.join("\n");
fs.writeFileSync(svgPath, svg, "utf8");
const buildId = Date.now();
fs.writeFileSync(htmlPath, `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Hush Fast Keyboard / Deep App Design</title>
  <style>
    body { margin: 0; background: #101010; font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #F8F8F6; }
    .bar { position: sticky; top: 0; z-index: 1; padding: 14px 20px; background: rgba(15,15,15,.96); border-bottom: 1px solid #3B3B3B; }
    h1 { margin: 0; font-size: 18px; letter-spacing: 0; }
    p { margin: 4px 0 0; color: #A7A7A0; }
    img { display: block; width: 100%; height: auto; }
  </style>
</head>
<body>
  <div class="bar">
    <h1>Hush Fast Keyboard / Deep App Design</h1>
    <p>App screens stay on the left for setup, settings, full history, recovery, diagnostics, and support. Keyboard screens stay on the right for typing, mic control, live transcript, fresh result, and retrying saved audio.</p>
  </div>
  <img src="${path.basename(svgPath)}?v=${buildId}" alt="Hush Elegant Product Design V2">
</body>
</html>`, "utf8");

console.log(JSON.stringify({ svgPath, htmlPath, canvasW, canvasH, screenCount }, null, 2));
