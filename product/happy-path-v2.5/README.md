# Happy path v2.5 (Amanda, Sept 27)

A clickable prototype of the agent's week, rebuilt from Ashley's v2 (`Ashley_v2_sept_22` on Through Line) after Ashley walked it through with Amanda and Doug. Through Line shows it as **Amanda_v2.5_sept_27** under Prototype, between Ashley's v2 and Amanda's v3.

This is the overview-and-renewals direction as it stood on the evening of Sept 27. v3 (`../happy-path-v3`, **Amanda_v3_sept_28**) started from here and went conversational: a chat homepage, a dock and client profiles. The two are separate folders and can move independently.

This is a prototype, not the product. Everything is canned data in `src/data.ts`.

## Before coffee

Looking over Monday's renewals is a task agents don't do today, and we're asking them to do it before 9:00 AM on a Tuesday. So the Monday email and the homepage have to be enjoyable before the first coffee: quick, painless, and doable while checking the inbox over breakfast. One sentence and one button at the top of every screen; nothing that needs thinking to find.

## What changed from v2, and why

The review's direction was fewer things on screen, said in words, one action at a time (RAMP as the north star).

- **The week starts with an email, not a login.** Upline writes to the agent on Monday with one button. It lands first as an Outlook notification on Stacey's phone, and tapping it opens the email in her Outlook inbox. The notification's subject and preview are the email's own subject and opening. Outreach still sends Tuesday at 9:00 AM if Stacey does nothing, as the strategy sprint decided.
- **The homepage picks up where the email left off.** A blue banner at the top carries today's one thing. On Monday it's a slim bar like the Founding Members bar on uplineinsurance.com, set inside the page padding, that points to the six rather than repeating the email. On later days it's the full band, with the one thing that needs Stacey, or that nothing does. Under it, an overview of how Stacey is doing.
- **Retention in words.** No charts. A headline, one sentence against last year, and a strip with a cell per household sent, so the few who left are the thing you notice. Three cards under it say what Stacey has been up to, one number and one sentence each.
- **The week's renewals get their own page, with no Kanban.** One click from the banner: a flat list with a thumbnail of each household's home and a sentence on why the price moved. On Monday the same six also appear a second way, below a divider, written as a colleague handing over prepped work ("I have six renewal requests queued to send tomorrow…"), so the team can compare the two. "See everyone" is a plain archive.
- **Drawers cut down.** Outreach review leads with why the price moved and the email as it will send; the household is one click down. Shape the shop is reduced to the life-quote switch, the one toggle the sprint kept.
- **Recommendation: talking points first, table behind a toggle.** The pick is pre-selected, the carrier PDFs open in a dialog, and it never sends without the agent.
- **Closing stops at the decided step.** The policyholder approves, the agent binds in the carrier portal and marks it done. The feedback-loop question is on ice.

The walk has eleven stops and follows the Callahans end to end (outreach, questionnaire, shop, recommendation, bind), with the other five households moving around them.

## Brand and components

- Tokens are copied from the design hub (`treadwell-investor-deck`, `src/app/globals.css`): one blue (`#082db1`), no corner radius, gray/200 hairlines, Radio Canada / Radio Canada Big / Reddit Mono. If the brand moves, re-copy them rather than editing here.
- Components are shadcn's `radix-vega` style, matching the Upline shadcncraft Base 3.1.0 library. The ones the hub already had (button, badge, item, sheet, field, input, textarea, label, separator, tooltip) are the hub's own Upline-mode files; the rest follow the same rules.
- Policyholder-facing screens are Stockton Hill's, not Upline's: `.agency` in `src/index.css` swaps `--primary` for the agency's green, so every component inside follows.

## Placeholders to know about

- The phone is a drawing of an iPhone 18 Pro, not Apple's artwork: its 402 × 874 point screen and the smaller Dynamic Island, with the home screen in iOS's Clear icon style so the notification is the only color on it, and Outlook in the dock. It uses the system font, so it shows in SF Pro on a Mac and a stand-in elsewhere. The notification's preview is clamped to the two lines a banner shows.
- The Outlook window is a drawing of Outlook on the web and the new desktop app, in Segoe UI where the machine has it and the system font where it doesn't. Only the email in it does anything. The Outlook icons are drawn stand-ins for Microsoft's. The rest of Stacey's inbox (Linda Hart, Auto-Owners and Erie) is written for the walk.
- Carrier logos are text. The hub has no marks for Auto-Owners, Erie or Grange.
- The household thumbnails are flat drawings of each home, standing in for a property photo the real product could pull from the address on file.
- The colleague notes are written for this walk, including the Callahans' son Owen.
- The retention strip is the one bespoke graphic; the library's Progress is the fallback.
- The +4 points against last year may not be a number we can get from agencies. The three households who left, and their stories, are invented.
- Desktop only.

## Run it

```bash
npm install
npm run dev
```

Opens on port 5305, so it can run beside v3 on 5310. The presenter bar at the top steps through the eleven stops; the arrow keys do the same.

## Publish it to Through Line

```bash
npm run export
```

Builds one self-contained HTML file (fonts included, no network needed) into `internal-comms/public/prototype-v2-5.html`.
