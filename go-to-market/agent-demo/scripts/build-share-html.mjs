import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, ".share-tmp");
const dest = join(root, "upline-coverage-review-demo.html");

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

execSync("npx vite build --config vite.share.config.ts", {
  cwd: root,
  stdio: "inherit",
});

let html = readFileSync(join(outDir, "index.html"), "utf8");
const logo = readFileSync(join(root, "public/upline-logo.png")).toString("base64");
const logoUri = `data:image/png;base64,${logo}`;

html = html
  .replaceAll("/upline-logo.png", logoUri)
  .replaceAll("./upline-logo.png", logoUri)
  .replace(/<link rel="icon"[^>]*>\s*/i, "")
  .replace(
    "<title>Upline — Coverage Review (Demo)</title>",
    `<title>Upline — Coverage Review demo (designer reference)</title>
    <!-- Clickable reference of the agent-demo. Arrow keys or the pills at the bottom move through 9 scenes. Not production UI. -->`,
  );

writeFileSync(dest, html);
rmSync(outDir, { recursive: true, force: true });

const kb = Math.round(html.length / 1024);
console.log(`Wrote ${dest} (${kb} KB)`);
