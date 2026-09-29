# Happy path v3 (Amanda, Sept 28)

A clickable prototype of the agent's week, rebuilt from Ashley's v2 (`Ashley_v2_sept_22` on Through Line) after Ashley walked it through with Amanda and Doug. Through Line shows it as **Amanda_v3_sept_28** under Prototype.

This is a prototype, not the product. Everything is canned data in `src/data.ts`.

## Before coffee

Looking over Monday's renewals is a task agents don't do today, and we're asking them to do it before 9:00 AM on a Tuesday. So the Monday email and the homepage have to be enjoyable before the first coffee: quick, painless, and doable while checking the inbox over breakfast. A greeting, one sentence and a box to ask anything; nothing that needs thinking to find.

## What changed from v2, and why

The review's direction was fewer things on screen, said in words, one action at a time (RAMP as the north star).

- **The week starts with an email, not a login.** Upline writes to the agent on Monday with everything that needs them that week. It opens on the design hub homepage's band (the grained mountain on blue 600, drawn from the hub's own files) with the white logo, "Good morning, Stacey" and "Here's what needs your attention this week." Under it, the week's to-dos in the homepage's section names, each section's households in one card with a rule between them and the section's one button across the foot: Closing first (Anika Desai and Linda Hart, approved and waiting to be bound), with Close before renewal, then Shopped and ready for review (Elena Vasquez and Raymond Foss), with Review shopped carriers, both in primary blue. Anything renewing inside a week says how long is left ("Renews in 4 days") rather than the date. The six renewal emails come last, as one quiet card whose foot is a View on Upline text link in the same place, because they need nothing from Stacey: outreach still sends Tuesday at 9:00 AM if she does nothing, as the strategy sprint decided.
- **The homepage leads with a conversation.** "Happy Monday, Stacey" and, right under it, a box that says "Ask me anything", with three questions written out inside it: what needs me today, how's my retention, and who left. On Monday that's all there is above the sections, since everything that needs Stacey is right below. From Wednesday a sentence on the day sits between the greeting and the box, and on the days something needs Stacey it carries the one button for it.
- **Under that, three sections, most pressing first, in the Monday email's order.** **Closing**, **Shopped and ready for review** and **Scheduled Renewal Emails**, holding only what needs Stacey. Scheduled comes last because it goes out whether Stacey looks or not. They're drawn as the email draws them, without its buttons: each section's title sits above its card, no counts and no status chips, each Closing and Shopped row carries its lines, its carrier with the carrier's mark, and its renewal (counted down inside a week), and each Scheduled row has the carrier's mark beside the name. On Monday Scheduled has the email's sentence and the six, one line each with the carrier's mark, the name and the change, and one button to say they all look good; a line opens that household's email. Later in the week it has the nudges and follow-ups that go on their own, each with why it's going. On Monday, as on Ashley's v2 board, Shopped holds Elena Vasquez and Raymond Foss, whose recommendations are ready to send, and Closing holds Anika Desai and Linda Hart, approved and waiting to be bound. Later in the week Shopped holds the Callahans' results on Thursday, and Closing holds their approval on Friday. The rest of the time a section says there's nothing to do, and what's coming instead.
- **A household's email opens in a sheet from the right.** It comes first, exactly as it will send, where it can be edited, approved or skipped; why the price moved, Upline's note on the household, what we'll ask and the household itself are each one click down.
- **Asking docks a chat along the bottom, the way a messenger does.** The first question puts a tab at the right of a footer, and the conversation pops up out of it with a box to reply. Follow-ups carry on in the same chat. The tab puts it down and brings it back on any page, and its × ends the chat, so the next question starts a new one. How Stacey is doing is an answer, not a dashboard: retention is said in words, with the strip that has a cell per household sent, so the few who left are the thing you notice.
- **Every client has a page.** A client's name is a link wherever it appears. The profile opens on what has happened on the account, newest first, one card per event, and a card opens to the thing itself: the email as it sent, or Dana's questionnaire answers with what Dana added or changed highlighted. Household Details and Carrier Information are tabs.
- **Shopped results are a page, and their card is the blue one.** When a shop comes back, it shows under Shopped and ready for review, and its row goes straight to the results. On the profile the same results are a card in the band's blue, so it can't be mistaken for a status update. The page leads with talking points, keeps the table behind a toggle, and holds the email to Dana beside the pick. It never sends without the agent.
- **Closing stops at the decided step.** The policyholder approves, the agent binds in the carrier portal and marks it done. The feedback-loop question is on ice.

The walk has nine stops and follows the Callahans end to end (outreach, questionnaire, shop, recommendation, bind), with the other five households moving around them.

## Brand and components

- Tokens are copied from the design hub (`treadwell-investor-deck`, `src/app/globals.css`): one blue (`#082db1`), no corner radius, gray/200 hairlines, Radio Canada / Radio Canada Big / Reddit Mono. If the brand moves, re-copy them rather than editing here.
- Components are shadcn's `radix-vega` style, matching the Upline shadcncraft Base 3.1.0 library. The ones the hub already had (button, badge, item, sheet, field, input, textarea, label, separator, tooltip) are the hub's own Upline-mode files; the rest follow the same rules.
- Policyholder-facing screens are Stockton Hill's, not Upline's: `.agency` in `src/index.css` swaps `--primary` for the agency's green, so every component inside follows.

## Placeholders to know about

- The chat is canned. Each suggested question plays a written answer, and a typed question goes to the question it sounds most like, or gets told there's no answer yet. Three more questions answer when typed (how much have I saved my clients, who's asked about a life quote, where does everyone stand), and "See where they stand" on Wednesday and Thursday asks the last one. A day's chat lasts for the walk and is gone on reload.
- Only the Callahans have a profile. The other five names are drawn as links and say so when pointed at.
- The Callahans' history before this week is partly invented: joining in 2021 and the move from Westfield to Erie in 2023. Sophie's license and the roof come from the household on file.
- Dana's questionnaire answers are written in `src/data.ts`, because the questionnaire in the walk doesn't keep what the presenter types. Sophie's license number and the changed email are invented.
- Elena Vasquez, Raymond Foss, Anika Desai and Linda Hart come from Ashley's v2 with the details it gave them. Their rows don't open anything, since only the Callahans have results and a profile, and Stacey clears them Monday afternoon off-camera, which is why they're gone by Wednesday.
- After Monday, Scheduled Renewal Emails lists the nudges and follow-ups the statuses mention, one line each. Their emails aren't written.
- The tabs on the profile are a new component in the library's style (`src/components/ui/tabs.tsx`); confirm it against the kit.
- Carrier logos are text, apart from the Monday email, which puts each carrier's mark beside its name in the carrier's own colors. It follows the design hub's CarrierMark: only the marks uplineinsurance.com already ships (`upline-marketing-site/public/logos`) are used, and that set has Nationwide and Travelers. Erie, Westfield, Auto-Owners, Grange and Ohio Mutual show their initial on gray until sanctioned color files are added to `src/assets/carriers`.
- The household thumbnails are flat drawings of each home, standing in for a property photo the real product could pull from the address on file. The lists use initials instead.
- The colleague notes are written for this walk, including the Callahans' son Owen.
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
