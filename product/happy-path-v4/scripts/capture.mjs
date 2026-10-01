// Captures every screen and state of the prototype as a PNG, for the FigJam
// feedback board. Drives the running dev server (npm run dev, port 5315)
// with Playwright in the Chrome already installed on the Mac, so nothing is
// downloaded. Each capture starts from a fresh load, walks the clicks that
// reach its state, and is taken at 1440 wide, 2x, with the presenter bar
// cropped off and every scrolling region (drawer tabs, the pages over the
// drawer, the phone) opened out to its full height, so nothing on the
// feedback board hides behind a scroll. The homepage's board is the
// exception: its columns scroll inside themselves by design, so it's
// captured as Jenna sees it on a screen tall enough for the whole page, with
// the board at its 800px. Run after any change: npm run capture
//
// Writes captures/NN-slug.png and captures/manifest.json, which says what
// each file is, which stop it belongs to and how it was reached; the board
// is laid out from the manifest.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "captures");
const base = process.env.BASE ?? "http://localhost:5315";
const only = process.argv[2]; // a slug prefix, to recapture a few
const WIDTH = 1440;
const BAR = 48; // --demo-bar-h
const MIN_HEIGHT = 900;

// Freezes motion and opens out anything that scrolls inside itself, so a
// tall enough viewport shows it whole. The drawer and the dialog size to the
// viewport, so the height is worked out per capture (see shot). A page over
// the drawer hides what it covers, so the drawer grows to the page rather
// than to the profile under it, and its body takes the height of what's in
// it, so its footer comes after it rather than over it.
const unclamp = `
  *, *::before, *::after { animation-duration: 0s !important; animation-delay: 0s !important; transition: none !important; }
  .overflow-y-auto:not([data-board] .overflow-y-auto) { overflow: visible !important; }
  [data-slot="dialog-content"] { max-height: none !important; height: auto !important; }
  [data-slot="sheet-content"]:has(> [data-state="open"]) > [inert] { display: none !important; }
  [data-phase-body] { flex: none !important; }
  [class*="max-w-[390px]"] { height: auto !important; min-height: 780px !important; max-height: none !important; overflow: visible !important; }
`;

const manifest = [];

const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext({
  viewport: { width: WIDTH, height: MIN_HEIGHT },
  deviceScaleFactor: 2,
  reducedMotion: "reduce",
});
const page = await context.newPage();
mkdirSync(out, { recursive: true });

/* ------------------------------------------------------------------
 * Driving the prototype
 * ------------------------------------------------------------------ */

async function fresh() {
  await page.setViewportSize({ width: WIDTH, height: MIN_HEIGHT });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: unclamp });
  await page.evaluate(() => document.fonts.ready);
}

/** Jumps to a stop by its label in the presenter bar. */
async function jump(label) {
  await page.getByRole("button", { name: "Jump to" }).click();
  await page.getByRole("menuitem", { name: label }).click();
  await page.waitForTimeout(150);
}

/** Answers Leah's questionnaire, so the later days know she did. */
async function answerQuestionnaire() {
  await jump("Leah's questionnaire");
  for (let i = 0; i < 4; i++) await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Finish" }).click();
}

const button = (name) => page.getByRole("button", { name });
const menuItem = (name) => page.getByRole("menuitem", { name });
const tab = (name) => page.getByRole("tab", { name });

/**
 * Grows the viewport to fit whatever is on screen. A drawer or dialog opened
 * out to its full height can run past the viewport, and Playwright can't
 * scroll a fixed panel's button into view, so every click fits first.
 */
async function fit() {
  const height = Math.max(MIN_HEIGHT, await neededHeight());
  if (page.viewportSize().height < height) {
    await page.setViewportSize({ width: WIDTH, height });
    await page.waitForTimeout(80);
  }
}

async function click(name) {
  await fit();
  await button(name).click();
}

async function hover(name) {
  await fit();
  await button(name).hover();
}

/** Opens a household's drawer from its line or card on the homepage's board. */
async function openProfile(name) {
  await click(`Open ${name}`);
  await page.waitForTimeout(250);
}

/**
 * Closes the drawer, which stays open on the profile after Send now, Skip or
 * Close out, so the board behind it shows. Its toast goes with it.
 */
async function closeDrawer() {
  await page.waitForTimeout(400);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
}

/** The drawer's banner, which opens the page behind it. */
async function clickBanner(action) {
  await page.locator('[data-slot="sheet-content"]').getByRole("button", { name: new RegExp(`${action}$`) }).click();
  await page.waitForTimeout(250);
}

/* ------------------------------------------------------------------
 * Taking the picture
 * ------------------------------------------------------------------ */

/** How tall the viewport has to be for everything on screen to show whole. */
async function neededHeight() {
  return page.evaluate((BAR) => {
    const pageNeed = document.documentElement.scrollHeight;
    const overlayNeed = (el, margin) => {
      if (!el) return 0;
      const top = el.getBoundingClientRect().top + window.scrollY;
      return top + el.scrollHeight + margin;
    };
    const sheet = document.querySelector('[data-slot="sheet-content"]');
    // Dialogs are centered, so what matters is their own height plus room.
    const dialogs = [...document.querySelectorAll('[data-slot="dialog-content"]')];
    const dialogNeed = Math.max(0, ...dialogs.map((d) => d.scrollHeight + BAR + 96));
    return Math.ceil(Math.max(pageNeed, overlayNeed(sheet, 0), dialogNeed));
  }, BAR);
}

async function shot({ slug, stop, title, via, after }) {
  // Measure at the base height, grow to fit, then measure once more, since
  // the drawer and the dialog re-lay out against the new height.
  await page.setViewportSize({ width: WIDTH, height: MIN_HEIGHT });
  await page.waitForTimeout(100);
  let height = Math.max(MIN_HEIGHT, await neededHeight());
  await page.setViewportSize({ width: WIDTH, height });
  await page.waitForTimeout(100);
  height = Math.max(MIN_HEIGHT, await neededHeight());
  await page.setViewportSize({ width: WIDTH, height });
  await page.waitForTimeout(150);
  await page.evaluate(() => window.scrollTo(0, 0));
  // A tooltip closes when the viewport changes under it, so point again now.
  if (after) {
    await after();
    await page.waitForTimeout(500);
  }

  const file = `${slug}.png`;
  await page.screenshot({
    path: join(out, file),
    clip: { x: 0, y: BAR, width: WIDTH, height: height - BAR },
  });
  manifest.push({ file, slug, stop, title, via, width: WIDTH, height: height - BAR });
  console.log(`${file}  ${WIDTH}×${height - BAR}`);
}

/* ------------------------------------------------------------------
 * The captures, in walk order. Each starts fresh so none leans on another.
 * ------------------------------------------------------------------ */

const NOTE = "Called Rhea about the mortgagee clause. She'll send the lender's letter tomorrow.";

const captures = [
  // 1
  { slug: "01-a-new-week", stop: 1, title: "A new week", card: true, run: () => jump("A new week") },
  // 2
  { slug: "02-the-monday-email", stop: 2, title: "The Monday email", run: () => jump("The Monday email") },
  // 3
  { slug: "03-at-her-desk", stop: 3, title: "At her desk", card: true, run: () => jump("At her desk") },
  // 4
  { slug: "04-monday", stop: 4, title: "Monday: Jenna opens Upline", run: () => jump("Monday: Jenna opens Upline") },
  {
    slug: "04a-jennas-menu",
    stop: 4,
    title: "Jenna's menu",
    via: "Jenna's name in the top bar",
    run: async () => {
      await jump("Monday: Jenna opens Upline");
      await click(/Jenna Ruiz/);
    },
  },
  {
    slug: "04d-snoozed",
    stop: 4,
    title: "A snoozed task, at the foot of its column",
    via: "Rhea Iyer's drawer → the clock at the end of the banner → Until tomorrow → close the drawer",
    run: async () => {
      await jump("Monday: Jenna opens Upline");
      await openProfile("Rhea Iyer");
      await click("Snooze");
      await menuItem("Until tomorrow").click();
      await page.keyboard.press("Escape");
      await page.waitForTimeout(400);
      // The column scrolls inside itself, so bring its foot into view.
      await page
        .locator('section[aria-labelledby="col-sent"] .overflow-y-auto')
        .evaluate((el) => el.scrollTo(0, el.scrollHeight));
    },
  },
  {
    slug: "04j-drawer-details",
    stop: 4,
    title: "Household drawer: Details (blue banner)",
    via: "Rhea Iyer's card",
    run: async () => {
      await jump("Monday: Jenna opens Upline");
      await openProfile("Rhea Iyer");
    },
  },
  {
    slug: "04k-drawer-activity",
    stop: 4,
    title: "Household drawer: Recent activity",
    via: "Rhea Iyer's drawer → Recent activity tab",
    run: async () => {
      await jump("Monday: Jenna opens Upline");
      await openProfile("Rhea Iyer");
      await tab("Recent activity").click();
    },
  },
  {
    slug: "04l-drawer-notes",
    stop: 4,
    title: "Household drawer: Notes, with a note added",
    via: "Rhea Iyer's drawer → Notes tab → Add note",
    run: async () => {
      await jump("Monday: Jenna opens Upline");
      await openProfile("Rhea Iyer");
      await tab("Notes").click();
      await page.getByRole("textbox", { name: "Add a note" }).fill(NOTE);
      await click("Add note");
    },
  },
  {
    slug: "04m-drawer-gray-banner",
    stop: 4,
    title: "Household drawer: gray banner (email scheduled)",
    via: "The Pruitts' Scheduled line",
    run: async () => {
      await jump("Monday: Jenna opens Upline");
      await openProfile("Leah & Tom Pruitt");
    },
  },
  {
    slug: "04n-drawer-banner-snooze",
    stop: 4,
    title: "Snooze from the drawer's banner",
    via: "Rhea Iyer's drawer → the clock at the end of the banner",
    run: async () => {
      await jump("Monday: Jenna opens Upline");
      await openProfile("Rhea Iyer");
      await click("Snooze");
      await page.waitForTimeout(200);
    },
  },
  {
    slug: "04o-close-out-page",
    stop: 4,
    title: "Close-out page, over Rhea Iyer's drawer",
    via: "Rhea Iyer's drawer → banner → Review",
    run: async () => {
      await jump("Monday: Jenna opens Upline");
      await openProfile("Rhea Iyer");
      await clickBanner("Review");
    },
  },
  {
    slug: "04oa-closed-out-profile",
    stop: 4,
    title: "After Close out: back on Rhea Iyer's profile, with the toast",
    via: "Close-out page → What happened → Close out",
    run: async () => {
      await jump("Monday: Jenna opens Upline");
      await openProfile("Rhea Iyer");
      await clickBanner("Review");
      await page.getByRole("textbox", { name: "What happened" }).fill("Bound Westfield in the portal this morning. Mortgagee clause confirmed.");
      await click("Close out");
      await page.waitForTimeout(400);
    },
  },
  {
    slug: "04p-closed-out",
    stop: 4,
    title: "After Close out: the card moves to Completed, with Undo",
    via: "Close-out page → What happened → Close out → close the drawer",
    run: async () => {
      await jump("Monday: Jenna opens Upline");
      await openProfile("Rhea Iyer");
      await clickBanner("Review");
      await page.getByRole("textbox", { name: "What happened" }).fill("Bound Westfield in the portal this morning. Mortgagee clause confirmed.");
      await click("Close out");
      await closeDrawer();
    },
  },
  {
    slug: "04q-completed-folded",
    stop: 4,
    title: "Completed folded to a strip",
    via: "The fold control in Completed's header",
    run: async () => {
      await jump("Monday: Jenna opens Upline");
      await click("Fold Completed");
    },
  },
  {
    slug: "04s-mini-column-folded",
    stop: 4,
    title: "A mini column folded to a strip",
    via: "The fold control in Awaiting Response's header",
    run: async () => {
      await jump("Monday: Jenna opens Upline");
      await click("Fold Awaiting Response");
    },
  },
  {
    slug: "04t-needs-me",
    stop: 4,
    title: "Needs me: only what has an accent",
    via: "Needs me in the toolbar",
    run: async () => {
      await jump("Monday: Jenna opens Upline");
      await click(/^Needs me/);
    },
  },
  {
    slug: "04u-search",
    stop: 4,
    title: "Searched by name",
    via: "Search by name → \"mar\"",
    run: async () => {
      await jump("Monday: Jenna opens Upline");
      await page.getByRole("searchbox", { name: "Search by name" }).fill("mar");
    },
  },
  {
    slug: "04r-not-in-prototype",
    stop: 4,
    title: "An invented household: not built out for the prototype",
    via: "Point at any line or card that isn't one of the named twelve",
    run: async () => {
      await jump("Monday: Jenna opens Upline");
    },
    after: () => page.locator('section[aria-labelledby="col-awaiting"] [tabindex="0"]').first().hover(),
  },
  // 5
  { slug: "05-review-the-pruitts-email", stop: 5, title: "Review the Pruitts' email", run: () => jump("Review the Pruitts' email") },
  {
    slug: "05a-shape-the-shop-hover",
    stop: 5,
    title: "Why a grayed Shape-the-shop button doesn't apply",
    via: "Hover Medicare",
    run: async () => {
      await jump("Review the Pruitts' email");
      await hover("Medicare");
    },
    after: () => button("Medicare").hover(),
  },
  {
    slug: "05b-skip-outreach-confirm",
    stop: 5,
    title: "Skip outreach: are you sure?",
    via: "Skip outreach",
    run: async () => {
      await jump("Review the Pruitts' email");
      await click("Skip outreach");
      await page.waitForTimeout(250);
    },
  },
  {
    slug: "05c-skipped",
    stop: 5,
    title: "After skipping: the Pruitts move to Completed, marked Skipped",
    via: "Skip outreach → Skip outreach → close the drawer",
    run: async () => {
      await jump("Review the Pruitts' email");
      await click("Skip outreach");
      await page.getByRole("dialog").getByRole("button", { name: "Skip outreach" }).click();
      await closeDrawer();
    },
  },
  {
    slug: "05d-skipped-review-undo",
    stop: 5,
    title: "The skipped review, with Undo",
    via: "After skipping → back on the profile → banner → Review",
    run: async () => {
      await jump("Review the Pruitts' email");
      await click("Skip outreach");
      await page.getByRole("dialog").getByRole("button", { name: "Skip outreach" }).click();
      await page.waitForTimeout(3000); // let the toast go
      await clickBanner("Review");
    },
  },
  {
    slug: "05e-sent-now",
    stop: 5,
    title: "After Send now: the Pruitts move to Awaiting Response",
    via: "Send now → close the drawer",
    run: async () => {
      await jump("Review the Pruitts' email");
      await click("Send now");
      await closeDrawer();
    },
  },
  {
    slug: "05ea-sent-now-profile",
    stop: 5,
    title: "After Send now: back on the Pruitts' profile, with the toast",
    via: "Send now",
    run: async () => {
      await jump("Review the Pruitts' email");
      await click("Send now");
      await page.waitForTimeout(400);
    },
  },
  {
    slug: "05f-review-over-drawer",
    stop: 5,
    title: "The review, read-only once sent",
    via: "Send now → back on the profile → banner → View",
    run: async () => {
      await jump("Review the Pruitts' email");
      await click("Send now");
      await page.waitForTimeout(3000);
      await clickBanner("View");
    },
  },
  // 6
  { slug: "06-meanwhile-at-the-pruitts", stop: 6, title: "Meanwhile, at the Pruitts'", card: true, run: () => jump("Meanwhile, at the Pruitts'") },
  // 7
  { slug: "07-leahs-inbox", stop: 7, title: "Leah's inbox", run: () => jump("Leah's inbox") },
  // 8
  { slug: "08-questionnaire-1", stop: 8, title: "Leah's questionnaire: 1 of 5", run: () => jump("Leah's questionnaire") },
  ...[2, 3, 4, 5].map((n) => ({
    slug: `08${"abcd"[n - 2]}-questionnaire-${n}`,
    stop: 8,
    title: `Leah's questionnaire: ${n} of 5`,
    via: "Continue",
    run: async () => {
      await jump("Leah's questionnaire");
      for (let i = 1; i < n; i++) await click("Continue");
    },
  })),
  {
    slug: "08e-questionnaire-done",
    stop: 8,
    title: "Leah's questionnaire: done",
    via: "Finish",
    run: async () => {
      await answerQuestionnaire();
      await page.waitForTimeout(200);
    },
  },
  // 9
  { slug: "09-back-at-the-agency", stop: 9, title: "Back at the agency", card: true, run: () => jump("Back at the agency") },
  // 10
  {
    slug: "10-wednesday",
    stop: 10,
    title: "Wednesday",
    run: async () => {
      await answerQuestionnaire();
      await jump("Wednesday");
    },
  },
  {
    slug: "10a-pruitts-details-info-updated",
    stop: 10,
    title: "The Pruitts' drawer: Details, with the changed detail marked",
    via: "The Pruitts' Shopping line",
    run: async () => {
      await answerQuestionnaire();
      await jump("Wednesday");
      await openProfile("Leah & Tom Pruitt");
    },
  },
  {
    slug: "10b-pruitts-activity",
    stop: 10,
    title: "The Pruitts' drawer: Recent activity while shopping",
    via: "The Pruitts' drawer → Recent activity tab",
    run: async () => {
      await answerQuestionnaire();
      await jump("Wednesday");
      await openProfile("Leah & Tom Pruitt");
      await tab("Recent activity").click();
    },
  },
  {
    slug: "10c-shop-in-progress",
    stop: 10,
    title: "Shop in progress page",
    via: "The Pruitts' drawer → banner → View",
    run: async () => {
      await answerQuestionnaire();
      await jump("Wednesday");
      await openProfile("Leah & Tom Pruitt");
      await clickBanner("View");
    },
  },
  {
    slug: "10d-nudge-page",
    stop: 10,
    title: "Nudge page",
    via: "Tobi Adeyemi's Awaiting Response line → banner → Review",
    run: async () => {
      await answerQuestionnaire();
      await jump("Wednesday");
      await openProfile("Tobi Adeyemi");
      await clickBanner("Review");
    },
  },
  {
    slug: "10e-nudge-skipped",
    stop: 10,
    title: "A skipped nudge: the banner, and the page's Undo",
    via: "Nudge page → Skip nudge → back on the profile → banner → Review",
    run: async () => {
      await answerQuestionnaire();
      await jump("Wednesday");
      await openProfile("Tobi Adeyemi");
      await clickBanner("Review");
      await click("Skip nudge");
      await page.waitForTimeout(3000);
      await clickBanner("Review");
    },
  },
  {
    slug: "10g-drawer-no-banner",
    stop: 10,
    title: "Household drawer with nothing going on (no banner)",
    via: "Diane Mercer's Completed card",
    run: async () => {
      await answerQuestionnaire();
      await jump("Wednesday");
      await openProfile("Diane Mercer");
    },
  },
  // 11
  { slug: "11-the-quotes-are-in", stop: 11, title: "The quotes are in", card: true, run: () => jump("The quotes are in") },
  // 12
  {
    slug: "12-thursday",
    stop: 12,
    title: "Thursday: results are back",
    run: async () => {
      await answerQuestionnaire();
      await jump("Thursday: results are back");
    },
  },
  {
    slug: "12a-results-step-1",
    stop: 12,
    title: "Shop results: step 1, Shopping Results",
    via: "The Pruitts' card → View the full report (their drawer, with the results over it)",
    run: async () => {
      await answerQuestionnaire();
      await jump("Thursday: results are back");
      await page.getByText("View the full report").click();
      await page.waitForTimeout(250);
    },
  },
  {
    slug: "12b-results-step-2",
    stop: 12,
    title: "Shop results: step 2, Select Your Recommendation",
    via: "Continue to select your recommendation",
    run: async () => {
      await answerQuestionnaire();
      await jump("Thursday: results are back");
      await page.getByText("View the full report").click();
      await click("Continue to select your recommendation");
    },
  },
  {
    slug: "12c-results-step-3",
    stop: 12,
    title: "Shop results: step 3, Review Your Recommendation Email",
    via: "Review recommendation email",
    run: async () => {
      await answerQuestionnaire();
      await jump("Thursday: results are back");
      await page.getByText("View the full report").click();
      await click("Continue to select your recommendation");
      await click("Review recommendation email");
    },
  },
  {
    slug: "12d-view-quotes",
    stop: 12,
    title: "Quotes from the carriers",
    via: "Step 1 → View quotes from the carriers",
    run: async () => {
      await answerQuestionnaire();
      await jump("Thursday: results are back");
      await page.getByText("View the full report").click();
      await click("View quotes from the carriers");
      await page.waitForTimeout(250);
    },
  },
  {
    slug: "12e-recommendation-sent",
    stop: 12,
    title: "After Send recommendation email: back on the Pruitts' profile",
    via: "Step 3 → Send recommendation email",
    run: async () => {
      await answerQuestionnaire();
      await jump("Thursday: results are back");
      await page.getByText("View the full report").click();
      await click("Continue to select your recommendation");
      await click("Review recommendation email");
      await click("Send recommendation email");
      await page.waitForTimeout(400);
    },
  },
  {
    slug: "12f-results-read-only",
    stop: 12,
    title: "Shop results once sent: step 3, read-only",
    via: "After sending → back on the profile → banner → View → step 3",
    run: async () => {
      await answerQuestionnaire();
      await jump("Thursday: results are back");
      await page.getByText("View the full report").click();
      await click("Continue to select your recommendation");
      await click("Review recommendation email");
      await click("Send recommendation email");
      await page.waitForTimeout(3000);
      await clickBanner("View");
      await click("Continue to select your recommendation");
      await click("Review recommendation email");
    },
  },
  {
    slug: "12g-pruitts-details-blue",
    stop: 12,
    title: "The Pruitts' drawer: Details, results to review",
    via: "The Pruitts' card",
    run: async () => {
      await answerQuestionnaire();
      await jump("Thursday: results are back");
      await openProfile("Leah & Tom Pruitt");
    },
  },
  {
    slug: "12h-pruitts-activity-results",
    stop: 12,
    title: "The Pruitts' drawer: Recent activity, with the results card",
    via: "The Pruitts' drawer → Recent activity tab",
    run: async () => {
      await answerQuestionnaire();
      await jump("Thursday: results are back");
      await openProfile("Leah & Tom Pruitt");
      await tab("Recent activity").click();
    },
  },
  // 13
  { slug: "13-that-evening", stop: 13, title: "That evening", card: true, run: () => jump("That evening") },
  // 14
  { slug: "14-leahs-recommendation", stop: 14, title: "Leah's recommendation: the email", run: () => jump("Leah's recommendation") },
  {
    slug: "14a-leahs-page",
    stop: 14,
    title: "Leah's recommendation: the page",
    via: "The link in the email",
    run: async () => {
      await jump("Leah's recommendation");
      await click("See the details");
    },
  },
  {
    slug: "14b-leah-approved",
    stop: 14,
    title: "Leah's recommendation: approved",
    via: "Approve Auto-Owners",
    run: async () => {
      await jump("Leah's recommendation");
      await click("See the details");
      await click("Approve Auto-Owners");
    },
  },
  // 15
  { slug: "15-closing-the-week", stop: 15, title: "Closing the week", card: true, run: () => jump("Closing the week") },
  // 16
  {
    slug: "16-friday",
    stop: 16,
    title: "Friday: bind it",
    run: async () => {
      await answerQuestionnaire();
      await jump("Friday: bind it");
    },
  },
  {
    slug: "16a-pruitts-drawer-bind",
    stop: 16,
    title: "The Pruitts' drawer: approved, waiting to be bound",
    via: "The Pruitts' card → View profile and close",
    run: async () => {
      await answerQuestionnaire();
      await jump("Friday: bind it");
      await click("View profile");
      await page.waitForTimeout(250);
    },
  },
  {
    slug: "16b-close-out-page",
    stop: 16,
    title: "Close-out page for the Pruitts",
    via: "The Pruitts' drawer → banner → Review",
    run: async () => {
      await answerQuestionnaire();
      await jump("Friday: bind it");
      await click("View profile");
      await clickBanner("Review");
    },
  },
  {
    slug: "16c-done",
    stop: 16,
    title: "After Close out: Done. The Pruitts are set.",
    via: "Close-out page → What happened → Close out → close the drawer",
    run: async () => {
      await answerQuestionnaire();
      await jump("Friday: bind it");
      await click("View profile");
      await clickBanner("Review");
      await page.getByRole("textbox", { name: "What happened" }).fill("Bound Auto-Owners in the portal this morning.");
      await click("Close out");
      await closeDrawer();
    },
  },
];

const failures = [];
for (const c of captures) {
  if (only && !c.slug.startsWith(only)) continue;
  try {
    await fresh();
    await c.run();
    await page.waitForTimeout(200);
    await shot(c);
  } catch (e) {
    failures.push(c.slug);
    console.error(`FAILED ${c.slug}: ${e.message.split("\n")[0]}`);
  }
}

// A partial run updates its entries in the manifest and leaves the rest.
const manifestPath = join(out, "manifest.json");
let entries = manifest;
if (only && existsSync(manifestPath)) {
  const kept = JSON.parse(readFileSync(manifestPath, "utf8")).filter((m) => !manifest.some((n) => n.slug === m.slug));
  entries = [...kept, ...manifest].sort((a, b) => a.slug.localeCompare(b.slug));
}
writeFileSync(manifestPath, JSON.stringify(entries, null, 2));
await browser.close();
if (failures.length) {
  console.error(`\n${failures.length} failed: ${failures.join(", ")}`);
  process.exit(1);
}
