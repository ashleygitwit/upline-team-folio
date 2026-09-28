# Happy path v3 (Amanda, Sept 28)

A clickable prototype of the agent's week, rebuilt from Ashley's v2 (`Ashley_v2_sept_22` on Through Line) after Ashley walked it through with Amanda and Doug. Through Line shows it as **Amanda_v3_sept_28** under Prototype.

This is a prototype, not the product. Everything is canned data in `src/data.ts`.

## Before coffee

Looking over Monday's renewals is a task agents don't do today, and we're asking them to do it before 9:00 AM on a Tuesday. So the Monday email and the homepage have to be enjoyable before the first coffee: quick, painless, and doable while checking the inbox over breakfast. A greeting, one sentence and a box to ask anything; nothing that needs thinking to find.

## What changed from v2, and why

The review's direction was fewer things on screen, said in words, one action at a time (RAMP as the north star).

- **The week starts with an email, not a login.** Upline writes to the agent on Monday with one button. Outreach still sends Tuesday at 9:00 AM if Stacey does nothing, as the strategy sprint decided.
- **The homepage leads with a conversation.** "Happy Monday, Stacey" and, right under it, a box that says "Ask me anything", with three questions written out inside it: what needs me today, how's my retention, and who left. On Monday that's all there is above the sections, since the six are right below. From Wednesday a sentence on the day sits between the greeting and the box, and on the days something needs Stacey it carries the one button for it.
- **Under that, three sections a renewal moves through.** **Scheduled Renewal Emails**, **Shopped and ready for review** and **Closing**, each with a count, holding only what needs Stacey. On Monday Scheduled has the six, each with the start of its email, and one button to say they all look good; later in the week it has the nudges and follow-ups that go on their own. On Monday, as on Ashley's v2 board, Shopped holds Elena Vasquez and Raymond Foss, whose recommendations are ready to send, and Closing holds Anika Desai and Linda Hart, approved and waiting to be bound. Later in the week Shopped holds the Callahans' results on Thursday, and Closing holds their approval on Friday. The rest of the time a section says there's nothing to do, and what's coming instead.
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
- Carrier logos are text. The hub has no marks for Auto-Owners, Erie or Grange.
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
