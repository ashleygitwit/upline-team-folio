// Builds the prototype into one self-contained HTML file and drops it where
// Through Line serves it: internal-comms/public/prototype-v3.html, shown on
// the Amanda_v3_sept_28 page. Run after any change: npm run export
import { execSync } from "node:child_process";
import { copyFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dest = join(root, "../../internal-comms/public/prototype-v3.html");

execSync("npm run build", { cwd: root, stdio: "inherit" });
copyFileSync(join(root, "dist/index.html"), dest);

const kb = Math.round(statSync(dest).size / 1024);
console.log(`Wrote ${dest} (${kb} KB)`);
