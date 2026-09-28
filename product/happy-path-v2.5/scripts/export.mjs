// Builds the prototype into one self-contained HTML file and drops it where
// Through Line serves it: internal-comms/public/prototype-v2-5.html, shown on
// the Amanda_v2.5_sept_27 page. Run after any change: npm run export
import { execSync } from "node:child_process";
import { copyFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dest = join(root, "../../internal-comms/public/prototype-v2-5.html");

execSync("npm run build", { cwd: root, stdio: "inherit" });
copyFileSync(join(root, "dist/index.html"), dest);

const kb = Math.round(statSync(dest).size / 1024);
console.log(`Wrote ${dest} (${kb} KB)`);
