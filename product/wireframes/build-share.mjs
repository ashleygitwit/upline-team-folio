/**
 * Bundles business-dashboard.html into one self-contained file that opens by
 * double-click and can be emailed or dropped in Figma/Slack as-is.
 *
 * The working copy keeps the logo as a sibling PNG so it stays easy to edit;
 * this inlines it. Fonts still come from Google Fonts, so the recipient needs
 * a connection the first time they open it.
 *
 *   node product/wireframes/build-share.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const SOURCE = join(here, 'business-dashboard.html');
const LOGO = join(here, 'upline-logo.png');
const OUT = join(here, 'upline-business-intelligence.html');

const logoUri = 'data:image/png;base64,' + readFileSync(LOGO).toString('base64');

const HANDOFF_NOTE = `<!--
  Upline — Business Intelligence (owner dashboard)
  Wireframe handoff. One self-contained file: no server, no build, no assets.
  Double-click to open in any browser, or drop it into your editor and edit
  directly. All markup, styles, data and behaviour are in this file.

  Where things live:
    STYLE   brand tokens at the top (:root), then chrome, sections, funnel,
            activity rows, and the Ask Upline drawer, in that order.
    SCRIPT  BOOK / BIZ_VALUE / BIZ_GROWTH / RETENTION / FEED hold every number
            on the page. ANSWERS + BRIEF hold the Ask Upline content.
            drawFunnel() and drawRetention() build the two SVG charts.

  Tokens, type (DM Sans / Fraunces / DM Mono) and the indigo topbar are lifted
  from the Upline Coverage Review demo so the two screens match.

  Interactions worth clicking:
    · "Showing" filter on the funnel — week / month / year / custom
    · "Ask Upline anything" — opens a drawer on a morning brief, and the pills
      return built responses with bars and stat cells
    · Recent activity — search and date range; rows will open the household's
      customer profile, which is not designed yet

  All data is invented. Fonts load from Google Fonts on first open.
-->`;

let html = readFileSync(SOURCE, 'utf8');

// Inline the logo so the file carries no sibling assets.
html = html.replaceAll('src="upline-logo.png"', () => `src="${logoUri}"`);

// The producer board and the insured proposal page are separate files and are
// not part of this handoff.
html = html.replace('href="week-board.html"', 'href="#"');
html = html.replace('href="insured-proposal.html"', 'href="#"');

// Swap the working-copy comment for handoff instructions.
html = html.replace(/<!--[\s\S]*?-->/, () => HANDOFF_NOTE);

writeFileSync(OUT, html);
console.log(`Wrote ${OUT} (${(Buffer.byteLength(html) / 1024).toFixed(0)} KB)`);
