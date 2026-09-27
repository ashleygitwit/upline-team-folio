# Happy path v3 (Amanda, Sept 28)

A clickable prototype of the agent's week, rebuilt from Ashley's v2 (`Ashley_v2_sept_22` on Through Line) after Ashley walked it through with Amanda and Doug. Through Line shows it as **Amanda_v3_sept_28** under Prototype.

This is a prototype, not the product. Everything is canned data in `src/data.ts`.

## What changed from v2, and why

The review's direction was fewer things on screen, said in words, one action at a time (RAMP as the north star).

- **The week starts with an email, not a login.** Upline writes to the agent on Monday with one button. Outreach still sends Tuesday at 9:00 AM if she does nothing, as the strategy sprint decided.
- **One page instead of a Kanban.** How the agency is doing, the one thing that needs the agent (only when something does), and this week's renewals as a flat list with a sentence per household. The board is gone; "See everyone" is a plain archive.
- **Retention in words.** No charts. A headline, one sentence against last year, and a strip with a cell per household sent, so the few who left are the thing you notice.
- **Drawers cut down.** Outreach review leads with why the price moved and the email as it will send; the household is one click down. Shape the shop is reduced to the life-quote switch, the one toggle the sprint kept.
- **Recommendation: talking points first, table behind a toggle.** The pick is pre-selected, the carrier PDFs open in a dialog, and it never sends without the agent.
- **Closing stops at the decided step.** The policyholder approves, the agent binds in the carrier portal and marks it done. The feedback-loop question is on ice.

The walk follows the Callahans end to end (outreach, questionnaire, shop, recommendation, bind), with the other five households moving around them.

## Brand and components

- Tokens are copied from the design hub (`treadwell-investor-deck`, `src/app/globals.css`): one blue (`#082db1`), no corner radius, gray/200 hairlines, Radio Canada / Radio Canada Big / Reddit Mono. If the brand moves, re-copy them rather than editing here.
- Components are shadcn's `radix-vega` style, matching the Upline shadcncraft Base 3.1.0 library. The ones the hub already had (button, badge, item, sheet, field, input, textarea, label, separator, tooltip) are the hub's own Upline-mode files; the rest follow the same rules.
- Policyholder-facing screens are Stockton Hill's, not Upline's: `.agency` in `src/index.css` swaps `--primary` for the agency's green, so every component inside follows.

## Placeholders to know about

- Carrier logos are text. The hub has no marks for Auto-Owners, Erie or Grange.
- The retention strip is the one bespoke graphic; the library's Progress is the fallback.
- The +4 points against last year may not be a number we can get from agencies. The three households who left, and their stories, are invented.
- Desktop only.

## Run it

```bash
npm install
npm run dev
```

Opens on port 5310. The presenter bar at the top steps through the nine stops; the arrow keys do the same.

## Publish it to Through Line

```bash
npm run export
```

Builds one self-contained HTML file (fonts included, no network needed) into `internal-comms/public/prototype-v3.html`.
