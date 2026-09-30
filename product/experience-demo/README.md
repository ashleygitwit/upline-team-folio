# Happy-path product demo (v2)

End-to-end click-through of the November 6 agent + insured experience. This is
Ashley's **v2 wireframe**: a product demo of the happy path, not grayscale Figma
and not the waitlist sales demo in `go-to-market/agent-demo/`.

Amanda takes this next. Edit a screen, don't rebuild the flow.

## Run it

From the Folio root:

```bash
npm run experience
```

Opens at `http://localhost:5174`.

Or:

```bash
cd product/experience-demo
npm install
npm run dev
```

Open the printed local URL. Step pills at the bottom jump to any screen. `←` / `→` also work.

## The path (11 screens)

Happy path is one household: **Dana & Mike Callahan** (synthetic, Dublin OH). Stacey Cole at Stockton Hill is the agent. Sophie just got her license; that's why Erie is up 18%.

Two real agent pages: the **renewal queue** (board or list, plus a household drawer) and **shop results**. Outreach and recommendation review live in the drawer, not as separate screens.

| # | Screen | Lane | What it is arguing |
|---|--------|------|--------------------|
| 1 | Sign in | Agent | Traditional Upline login. Lands on the renewal queue. |
| 2 | Renewal queue | Agent | Board or list. Click a card for the household drawer (details + outreach). Send from the drawer. |
| 3 | Insured inbox | Policyholder | Looks like Compose. No Upline. |
| 4 | Questionnaire | Policyholder | Stays a form. Cross-sell + referral live here, before shopping. |
| 5 | Queue · shopping | Agent | Card moved. Open the drawer, then the full shop-results page. |
| 6 | Shop results | Agent | Magic moment. What's different, talking points, generate email. |
| 7 | Recommendation | Agent | WYSIWYG. Never auto-sends. One-vs-three is logic, not a toggle. |
| 8 | Rec email | Policyholder | Invitation. The page is the brief. Reply to talk. |
| 9 | Proposal page | Policyholder | Magic moment. Agency branded. Approve ≠ bound. |
| 10 | Closing | Agent | Same queue. Close out always asks what changed. Celebration on closed-won. |
| 11 | Month in review | Agent | Dashboard substitute. Upline-branded email. Two halves. |

Yellow dashed notes on each screen are for this draft. Strip them as you edit.

## What this is not

- Not the GTM waitlist demo (`go-to-market/agent-demo/`)
- Not the Wednesday HTML sketches (`product/wireframes/*.html`) — those stay as sprint-week artifacts
- Not admin / onboard / VA tooling
- Not real Stockton Hill client data

## Sources

Thursday breadboard, `project-planning/sprint-week/decisions.md` §§6–7 and 11, `product/journey-maps.md` (MVP).
