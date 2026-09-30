import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, ".share-tmp");
const dest = join(root, "upline-happy-path-demo.html");

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
    "<title>Upline — Happy path (v2 draft)</title>",
    `<title>Upline — Happy path (v2 draft) for Amanda</title>
    <!--
      Clickable happy-path product demo. Ashley's v2 wireframe for Amanda.

      Double-click to open. No server, no install. Fonts load from Google Fonts
      the first time, so you need a connection once.

      Jump to (top bar) moves through the 8 screens. Desktop / Mobile only
      shows on the renewal queue (same board for Shopping and Closing).

      Synthetic household: Dana &amp; Mike Callahan. Agent: Stacey Cole at
      Stockton Hill. Not production UI and not real client data.
    -->`,
  );

writeFileSync(dest, html);
rmSync(outDir, { recursive: true, force: true });

const kb = Math.round(html.length / 1024);
console.log(`Wrote ${dest} (${kb} KB)`);
