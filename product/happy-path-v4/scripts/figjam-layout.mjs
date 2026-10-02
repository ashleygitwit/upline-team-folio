// Lays out the captures (captures/manifest.json, from capture.mjs) as the
// FigJam feedback board, and writes the Figma Plugin API code that draws it,
// one file per stop, into the folder given as the first argument. The code is
// run in the board through the Figma MCP's use_figma tool (which is why it's
// written out rather than run here), and each file returns the id of every
// image frame it made, keyed by slug, so upload_assets can drop the PNG into
// it. The board is: a header, then one row per stop of the walk, the stop's
// own screen first and, beneath it, everything that can be opened from it,
// up to three across. Every screen sits in its own section with a caption
// above it and an empty notes zone to its right, holding one blank sticky to
// duplicate, so feedback has somewhere to land.
//
//   node scripts/figjam-layout.mjs /path/to/out
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = process.argv[2];
if (!outDir) throw new Error("Give a folder to write the plugin code into.");
mkdirSync(outDir, { recursive: true });

const manifest = JSON.parse(readFileSync(join(root, "captures/manifest.json"), "utf8"));

// The stops' names and days, read off src/walk.ts so the rows say what the
// presenter bar says.
const screens = [...readFileSync(join(root, "src/walk.ts"), "utf8").matchAll(/label: "([^"]+)",\s*where: "([^"]+)"/g)].map(
  ([, label, where]) => ({ label, where }),
);
if (screens.length !== 19) throw new Error(`Read ${screens.length} stops from walk.ts, expected 19.`);

// The board's measurements.
const ORIGIN = { x: 80, y: 80 };
const PAD = 32; // inside a section
const NOTES_W = 600; // the sticky zone beside each screen
const NOTES_GAP = 48;
const GAP = 120; // between sections
const ROW_GAP = 320; // between stops
const COLS = 4; // branch states across
const CAPTION_GAP = 16;
const CARD_SCALE = 0.5; // the slate cards are one sentence, so they sit at half width

const isCard = (m) => /^(01|03|06|09|11|13|15)-/.test(m.slug);
const isMain = (m) => /^\d\d-/.test(m.slug);

// Text heights, worked out from Inter's line height at each size, so the
// layout can be computed here without measuring on the board.
const line = (size) => Math.round(size * 1.21);

/** One screen's section: where its parts go, relative to the section. */
function screenBlock(m) {
  const scale = isCard(m) ? CARD_SCALE : 1;
  const w = Math.round(m.width * scale);
  const h = Math.round(m.height * scale);
  const captionH = line(24) + (m.via ? 8 + line(16) : 0);
  const imageTop = PAD + captionH + CAPTION_GAP;
  return {
    slug: m.slug,
    name: m.title,
    via: m.via ? `Opened from: ${m.via}` : null,
    w,
    h,
    imageTop,
    sectionW: PAD + w + NOTES_GAP + NOTES_W + PAD,
    sectionH: imageTop + h + PAD,
    notesX: PAD + w + NOTES_GAP,
    main: isMain(m),
  };
}

const stops = [];
let y = ORIGIN.y;

// The header.
const header = { x: ORIGIN.x, y, titleSize: 64, bodySize: 24, bodyW: 1800 };
y += line(64) + 24 + line(24) * 3 + ROW_GAP / 2;

for (let n = 1; n <= screens.length; n++) {
  const items = manifest.filter((m) => m.stop === n);
  if (!items.length) continue;
  const s = screens[n - 1];
  const stop = { n, label: s.label, where: s.where, titleY: y, sections: [] };
  y += line(40) + 8 + line(24) + 40;

  const [main, ...branches] = items.map(screenBlock);
  main.x = ORIGIN.x;
  main.y = y;
  main.fill = "white";
  stop.sections.push(main);
  y += main.sectionH + GAP;

  // The branches, up to three across, each row as tall as its tallest.
  for (let i = 0; i < branches.length; i += COLS) {
    const row = branches.slice(i, i + COLS);
    let x = ORIGIN.x;
    for (const b of row) {
      b.x = x;
      b.y = y;
      b.fill = "gray";
      stop.sections.push(b);
      x += b.sectionW + GAP;
    }
    y += Math.max(...row.map((b) => b.sectionH)) + GAP;
  }
  y += ROW_GAP - GAP;
  stops.push(stop);
}

/** Plugin code that draws the header. */
const headerCode = `
const page = await figma.getNodeByIdAsync('16:25');
await figma.setCurrentPageAsync(page);
await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
const ink = [{ type: 'SOLID', color: { r: 0x1e/255, g: 0x1e/255, b: 0x1e/255 } }];
const title = figma.createText();
title.characters = 'Amanda v4 · every screen';
title.fontSize = ${header.titleSize};
title.fills = ink;
title.x = ${header.x}; title.y = ${header.y};
const body = figma.createText();
body.characters = ${JSON.stringify(
  "Every screen and state of the Sept 30 prototype, in the order the walk goes. Each stop's own screen comes first; beneath it, everything that can be opened from it. To leave feedback, drop a sticky in the space to the right of any screen. The blank one there is yours to duplicate.",
)};
body.fontSize = ${header.bodySize};
body.fills = ink;
body.textAutoResize = 'HEIGHT';
body.resize(${header.bodyW}, body.height);
body.x = ${header.x}; body.y = ${header.y + line(64) + 24};
return { createdNodeIds: [title.id, body.id] };
`;
writeFileSync(join(outDir, "00-header.js"), headerCode.trim() + "\n");

/** Plugin code that draws one stop: its title and each screen's section. */
for (const stop of stops) {
  const code = `
const page = await figma.getNodeByIdAsync('16:25');
await figma.setCurrentPageAsync(page);
await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
const probe = figma.createSticky();
await figma.loadFontAsync(probe.text.fontName);
probe.remove();
const h = (r, g, b) => ({ r: r / 255, g: g / 255, b: b / 255 });
const ink = [{ type: 'SOLID', color: h(0x1e, 0x1e, 0x1e) }];
const fills = { white: [{ type: 'SOLID', color: h(0xff, 0xff, 0xff) }], gray: [{ type: 'SOLID', color: h(0xf9, 0xf9, 0xf9) }] };
const text = (chars, size, x, y, w) => {
  const t = figma.createText();
  t.characters = chars;
  t.fontSize = size;
  t.fills = ink;
  if (w) { t.textAutoResize = 'HEIGHT'; t.resize(w, t.height); }
  t.x = x; t.y = y;
  return t;
};
const rowTitle = text(${JSON.stringify(`${stop.n}. ${stop.label}`)}, 40, ${ORIGIN.x}, ${stop.titleY});
const rowWhere = text(${JSON.stringify(stop.where)}, 24, ${ORIGIN.x}, ${stop.titleY + line(40) + 8});
const frames = {};
const created = [rowTitle.id, rowWhere.id];
const blocks = ${JSON.stringify(stop.sections)};
for (const b of blocks) {
  const section = figma.createSection();
  section.name = b.name;
  section.fills = fills[b.fill];
  section.x = b.x; section.y = b.y;
  section.resize(b.sectionW, b.sectionH);
  const cap = text(b.name, 24, 0, 0, b.w);
  section.appendChild(cap);
  cap.x = ${PAD}; cap.y = ${PAD};
  if (b.via) {
    const via = text(b.via, 16, 0, 0, b.w);
    section.appendChild(via);
    via.x = ${PAD}; via.y = ${PAD} + cap.height + 8;
  }
  const frame = figma.createFrame();
  frame.name = b.slug;
  frame.resize(b.w, b.h);
  frame.fills = [{ type: 'SOLID', color: h(0xe6, 0xe6, 0xe6) }];
  section.appendChild(frame);
  frame.x = ${PAD}; frame.y = b.imageTop;
  const sticky = figma.createSticky();
  sticky.text.characters = '';
  sticky.authorVisible = false;
  section.appendChild(sticky);
  sticky.x = b.notesX; sticky.y = b.imageTop;
  frames[b.slug] = frame.id;
  created.push(section.id, frame.id, sticky.id, cap.id);
}
return { frames, createdNodeIds: created };
`;
  writeFileSync(join(outDir, `${String(stop.n).padStart(2, "0")}-stop.js`), code.trim() + "\n");
}

const width = Math.max(...stops.flatMap((s) => s.sections.map((b) => b.x + b.sectionW)));
console.log(`${stops.length} stops, ${manifest.length} screens, board ${width} × ${y} px`);
console.log(`Wrote ${stops.length + 1} files to ${outDir}`);
