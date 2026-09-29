# Happy path v3 (Amanda, Sept 28)

A clickable prototype of the agent's week, rebuilt from Ashley's v2 (`Ashley_v2_sept_22` on Through Line) after Ashley walked it through with Amanda and Doug. Through Line shows it as **Amanda_v3_sept_28** under Prototype.

This is a prototype, not the product. Everything is canned data in `src/data.ts`.

## Before coffee

Looking over Monday's renewals is a task agents don't do today, and we're asking them to do it before 9:00 AM on a Tuesday. So the Monday email and the homepage have to be enjoyable before the first coffee: quick, painless, and doable while checking the inbox over breakfast. A greeting, one sentence and a box to ask anything; nothing that needs thinking to find.

## What changed from v2, and why

The review's direction was fewer things on screen, said in words, one action at a time (RAMP as the north star).

- **The week starts with an email, not a login.** Upline writes to the agent on Monday with everything that needs them that week. It opens on the design hub homepage's band (the grained mountain on blue 600, drawn from the hub's own files) with the white logo, "Good morning, Stacey" and "Here's what needs your attention this week." Under it, the week's to-dos in the homepage's section names, each section's households in one card with a rule between them and the section's one button across the foot: Closing first (Anika Desai and Linda Hart, approved and waiting to be bound), with Close before renewal, then Shopped and ready for review (Elena Vasquez and Raymond Foss), with Review shopped carriers, both in primary blue. Anything renewing inside a week says how long is left ("Renews in 4 days") rather than the date. The six renewal emails come last, as one quiet card whose foot is a View on Upline text link in the same place, because they need nothing from Stacey: outreach still sends Tuesday at 9:00 AM if she does nothing, as the strategy sprint decided.
- **The homepage leads with the day.** On Monday it opens on the band, as the Monday email does, with the email's "Good morning, Stacey" and, centered under it in the section titles' style, "You have two renewals closing this week.", with the Closing card straight under that in place of the Closing title, so nothing stands between Stacey and them. Under the card a white link, "Looking for something? Ask us anything.", brings up the chat with nothing asked yet: the suggested questions and a box, titled Ask us anything until her first question names it. Shopped and Scheduled follow on the page below the band. Wednesday opens the same way on the design hub's gray band, the Websites page's, under its ridge: "Good morning, Stacey", then "All scheduled renewal emails went out Tuesday at 9AM, and the Callahans are being shopped." in the same style as Monday's line, and the ask box under it, as Thursday and Friday have it. Scheduled Renewal Emails follows below the band, the one section with anything in it that day; the sections with nothing in them aren't drawn. Thursday and Friday say "Happy Thursday, Stacey" and so on, and the greeting has a sentence on the day, which on the days something needs Stacey carries the one button for it, and under that a box that says "Ask me anything", with three questions written out inside it: what needs me today, how's my retention, and who left.
- **Under that, three sections, most pressing first, in the Monday email's order.** **Closing**, **Shopped and ready for review** and **Scheduled Renewal Emails**, holding only what needs Stacey. Scheduled comes last because it goes out whether Stacey looks or not. They're drawn as the email draws them, without its buttons: each section's title sits above its card, no counts and no status chips, each Closing and Shopped row carries the name in the display face at the email's size, its lines, its carrier with the carrier's mark, and its renewal (counted down inside a week), each Shopped row opens on a preview of what the shop came back with, on the left the way the design hub's template cards set their picture (the results page's Your pick list in miniature, each carrier's mark and price with the pick selected), and each Scheduled row has the carrier's mark beside the name and, where it opens an email, a chevron after the change. On Monday Scheduled has the email's sentence and the six, one line each with the carrier's mark, the name and the change; a line opens that household's email. Later in the week it has the nudges and follow-ups that go on their own, each with why it's going. On Monday, as on Ashley's v2 board, Shopped holds Elena Vasquez and Raymond Foss, whose recommendations are ready to send, and Closing holds Anika Desai and Linda Hart, approved and waiting to be bound, each with a memo field (on gray 50) and Mark as Closed; once closed, the row says so with the memo, and Undo puts the field back. Later in the week Shopped holds the Callahans' results on Thursday, and Closing holds their approval on Friday. The rest of the time a section says there's nothing to do, and what's coming instead.
- **A household opens in v2.5's drawer, under the navigation rather than over it.** It's the drawer Ashley's board opens (v2.5's `screens/queue/HouseholdSheet.tsx`, ported into `src/household/` with her household data): the stage, the name and the change, a Details tab, and a tab for the stage the household is in, with that stage's buttons at the foot. A Scheduled row opens it on the outreach email, with Skip outreach and Send; View Profile in a row's menu opens Anika's and Linda's on Closing, with Close out, and Elena's and Raymond's on the Recommendation, with Send recommendation email. The Callahans' drawer also opens from their profile and on the walk's third stop. What happens in it lands in the walk: the email Stacey edits is the one Dana gets, the Life row in Shape the shop decides the questionnaire's life question, Send marks the email as looking good, Skip outreach skips it (and Undo brings it back), and Close out closes the household with the note as its memo.
- **Asking docks a chat along the bottom, the way a messenger does.** The first question puts a tab at the right of a footer, and the conversation pops up out of it with a box to reply. Follow-ups carry on in the same chat. The tab puts it down and brings it back on any page, and its × ends the chat, so the next question starts a new one. How Stacey is doing is an answer, not a dashboard: retention is said in words, with the strip that has a cell per household sent, so the few who left are the thing you notice.
- **Every client has a page.** On the results a client's name is a link to it; on the homepage names are plain, as in the Monday email, and each Closing and Shopped row's three-dot menu holds View Profile, which opens the household's drawer, View Renewal History and Report an Error. The profile opens on what has happened on the account, newest first, one card per event, and a card opens to the thing itself: the email as it sent, or Dana's questionnaire answers with what Dana added or changed highlighted. Household Details and Carrier Information are tabs.
- **Shopped results are a page, and their card is the blue one.** When a shop comes back, it shows under Shopped and ready for review, and its row goes straight to the results. On the profile the same results are a card in the band's blue, so it can't be mistaken for a status update. The page leads with talking points, keeps the table behind a toggle, and holds the email to Dana beside the pick. It never sends without the agent.
- **Closing stops at the decided step.** The policyholder approves, the agent binds in the carrier portal and marks it done. The feedback-loop question is on ice.

The walk has nine stops and follows the Callahans end to end (outreach, questionnaire, shop, recommendation, bind), with the other five households moving around them.

## Brand and components

- Tokens are copied from the design hub (`treadwell-investor-deck`, `src/app/globals.css`): one blue (`#082db1`), no corner radius, gray/200 hairlines, Radio Canada / Radio Canada Big / Reddit Mono. If the brand moves, re-copy them rather than editing here.
- Components are shadcn's `radix-vega` style, matching the Upline shadcncraft Base 3.1.0 library. The ones the hub already had (button, badge, item, sheet, field, input, textarea, label, separator, tooltip) are the hub's own Upline-mode files; the rest follow the same rules.
- Policyholder-facing screens are Stockton Hill's, not Upline's: `.agency` in `src/index.css` swaps `--primary` for the agency's green, so every component inside follows.

## Placeholders to know about

- The chat is canned. Each suggested question plays a written answer, and a typed question goes to the question it sounds most like, or gets told there's no answer yet. Three more questions answer when typed (how much have I saved my clients, who's asked about a life quote, where does everyone stand), and "See where the rest stand" on Thursday asks the last one. A day's chat lasts for the walk and is gone on reload.
- Only the Callahans have a profile. The other five names are drawn as links and say so when pointed at.
- The Callahans' history before this week is partly invented: joining in 2021 and the move from Westfield to Erie in 2023. Sophie's license and the roof come from the household on file.
- Dana's questionnaire answers are written in `src/data.ts`, because the questionnaire in the walk doesn't keep what the presenter types. Sophie's license number and the changed email are invented.
- Elena Vasquez, Raymond Foss, Anika Desai and Linda Hart come from Ashley's v2 with the details it gave them. Their rows don't open anything, since only the Callahans have results and a profile; in each of their rows' menus View Profile opens the drawer, while View Renewal History and Report an Error close the menu and go nowhere yet, and the View the full report link on Elena's and Raymond's is drawn but not built and says so when pointed at, and Stacey clears them Monday afternoon off-camera, which is why they're gone by Wednesday.
- After Monday, Scheduled Renewal Emails lists the nudges and follow-ups the statuses mention, one line each. Their emails aren't written.
- The tabs on the profile are a new component in the library's style (`src/components/ui/tabs.tsx`); confirm it against the kit.
- Carrier logos are text, apart from the Monday email, which puts each carrier's mark beside its name in the carrier's own colors. It follows the design hub's CarrierMark: only the marks uplineinsurance.com already ships (`upline-marketing-site/public/logos`) are used, and that set has Nationwide and Travelers. Erie, Westfield, Auto-Owners, Grange and Ohio Mutual show their initial on gray until sanctioned color files are added to `src/assets/carriers`.
- The household thumbnails are flat drawings of each home, standing in for a property photo the real product could pull from the address on file. The homepage's lists have no pictures, only the carrier's mark, apart from Shopped's previews, which are drawn in code from each household's quotes (Elena's and Raymond's from Ashley's household data) rather than being screenshots.
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
