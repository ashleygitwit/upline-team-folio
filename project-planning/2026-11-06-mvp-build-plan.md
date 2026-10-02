# MVP build plan — working back from November 6

> **Superseded on the schedule, still current on everything else.** The milestone dates below have
> been replaced by [`timelines.md`](timelines.md), which sets the agreed shape: three weeks of
> design, dev starting immediately in parallel, feature freeze Fri Oct 23, and two full weeks of QA
> before launch. Read this document for the scope, the exit tests, the release valve, and the
> ownership table — read `timelines.md` for when things happen.

**Draft proposal, now folded into today's 2:30 session.**

Eight working weeks from Monday Sept 14 to Friday Nov 6. One engineer on build (Doug), two on
design (Ashley, Amanda), Austin mostly on go-to-market. Scope is the above-the-line list in
[`sprint-week/decisions.md`](sprint-week/decisions.md).

Every milestone below is a **gate with an exit test** — a thing you can watch happen — rather than
a status. If the exit test does not pass, the gate does not close, and we pull from the release
valve list instead of pushing the date.

---

## The good news first

The POC repo is further along than the sprint conversation assumed. `upline-poc/household-questionnaire-app`
is a live Next.js 15 / React 19 / Supabase app ("coverage-review") that already has:

- **The questionnaire, in production** — register, update, fetch, response capture, file storage.
  This is the surface with 100% pilot completion, and it is built.
- **Carrier-portal RPA** — Stagehand and Browserbase over Playwright, with `rpa:plan`,
  `rpa:run-quote`, `rpa:record-quote`, `rpa:resolve-facts`. The shopping automation we assumed was
  a next-year problem has a real head start.
- **A fact library, knockout rules, carrier docs, and a shopping protocol** in `docs/`.

So of the seven above-the-line surfaces, **one is essentially done and one has scaffolding.** That
is roughly a week and a half we do not have to spend.

**What does not exist yet, and is the actual eight weeks of work:**

| Surface | Why it is new work |
| --- | --- |
| Agency accounts, auth, multi-tenancy | The POC is single-tenant pilot tooling |
| Credential vault | Has to survive a VA swap; 2FA is genuinely nasty |
| Renewal queue (Kanban) | Does not exist |
| Outreach Review + send from the agent's mailbox | **Highest technical risk.** Microsoft OAuth, individual sends, deliverability |
| Shop results with computed diff | PDF parse to "what's different" is the hard part |
| Proposal WYSIWYG editor + insured landing page | Wireframes and a demo exist; production does not |
| Needs-binding state that cannot disappear | Does not exist |

---

## The milestones

### M0 — Decisions closed, Linear stood up · exit **Fri Sept 18**

Doug cannot estimate, let alone build, against the open list. Eight of the items in
[section 13](sprint-week/decisions.md#13-still-open) block build specifically:

1. The ranking rule for the weekly list → blocks the queue
2. Who we offer to shop (threshold / Upline decides / everyone) → blocks outreach logic
3. Which send variant is the default (A or B) → blocks proposal generation
4. Recommendation as email, visual, or both → blocks the whole recommendation surface
5. Shopping-rules file format → blocks the VA workflow and onboarding
6. Action center as home screen, or separate view → blocks the queue's information architecture
7. Date-of-birth gate on the insured page → blocks the landing page
8. Whether a quote can go in an email body → legal, and it changes the email

**Exit test:** all eight answered in writing, Linear has an epic per surface with stories, and Doug
has given a rough size to each.

**Also due this month:** name the October design partner. The pilot sequence assumes a second agency
in beta before we charge anyone, and there is no candidate on the list.

**Owner:** Ashley on the decisions and Linear. Doug consulted on sizing. Anything with a legal edge
goes to Austin.

### M1 — Design done on everything above the line · exit **Fri Sept 25**

Design has to lead build by about a week, and it has to stop leading it after that.

**Ashley:** shop results, insured proposal page — the two she took in the Wednesday swap.
**Amanda:** renewal queue, Outreach Review, questionnaire polish.

**Note the priority change nobody has said out loud.** Tuesday's dot vote ranked shop results first,
performance dashboard second, policyholder proposal third. The dashboard was cut Thursday, so the
second-place design priority is no longer being built. Amanda's capacity should move to the queue
and Outreach Review — surfaces nobody voted for, which are now above the line and undesigned.

**Exit test:** Doug can build any of the five without asking a question.

### M2 — The spine works on real data, unstyled · exit **Fri Oct 2**

Agency account and auth. Credential vault holding one agency's AMS and carrier logins. Renewal queue
reading actual renewals.

**Exit test:** Stockton Hill's next thirty renewals are visible in the queue, pulled from their AMS.

**Pilot overlay:** Stockton Hill's Review Fridays are running by now — one shopped household from
the queue, walked through together. That is the requirements feed for M3 and M4.

### M3 — Outreach actually sends · exit **Fri Oct 9**

Microsoft mailbox OAuth. Individual sends from the agent's own mailbox. Outreach Review with edit and
deselect-this-renewal. Scheduled auto-send with the intervention window. Questionnaire linked and
pre-filled.

**This is the week most likely to slip.** OAuth and deliverability are unglamorous and they bite.
If it slips, it slips into M4 and we lose the buffer, so treat this as the week to protect.

**Exit test:** a real email leaves a real agent's mailbox and produces a completed questionnaire.

> **Correction to an earlier version of this plan.** The Wednesday sketch review set a three-stage
> pilot sequence that the milestones below did not originally account for: Stockton Hill in
> September, **a design partner or pre-launch beta in October**, then the first paying customer
> Nov 6. Run in sequence, not in parallel. The October pilot is folded into M4 and M5 below, and
> **the design partner has no name yet** — that is a decision owed before the end of September.

### M4 — Shop results and the proposal · exit **Fri Oct 16**

VA uploads three carrier PDFs, we parse them and compute what is different. Shop results with talking
points. WYSIWYG proposal editor. Agency-branded insured landing page where approve means pending.

**Exit test:** one household goes questionnaire → shop → proposal → approve, end to end.

**Pilot overlay:** the October design partner starts here — free shopping, VA practice, a second
agency's reality on the surfaces as they land. Feedback in individual sessions, not a group.

### M5 — Close the loop, then a full dry run · exit **Fri Oct 23**

Kanban states including needs-binding that visibly ages and only clears on the agent's action.
Closed-won, with the celebration. The weekly stats email that replaces the cut dashboard.

**Exit test:** a full dry run across thirty real Stockton Hill households, timed, with the 24-hour
shop promise actually measured.

### M6 — Freeze and harden · exit **Fri Oct 30**

No new surfaces. Bugs only. Onboarding runbook and the shopping-rules interview script written. VA
kit and ticketing operational.

**Exit test:** two consecutive 24-hour shops delivered, and someone who was not in the room can run
onboarding from the runbook.

### M7 — Onboard customer one · **Nov 2–6**

Credentials, shopping-rules interview, first weekly list. Live Nov 6.

---

## Honest read on whether this fits

It fits with **zero slack**, which means it does not fit. M3 and M4 are each a genuinely full week
for one engineer, and there is no buffer between M6 and launch. One bad week on OAuth and November 6
moves.

Two ways to buy room:

**1. Get Doug help — open question, for Friday.** One engineer for seven new surfaces in eight weeks
is the single biggest risk in this plan. Whether we can do anything about it is not settled, so it
goes to Friday as a decision rather than an assumption; the milestones above are costed with Doug
alone. Worth noting there is already a conflict on the books: Tuesday's decision was explicitly "do
not pull Doug off product," and the same conversation had him showing up for and being part of the
growth function. If the answer Friday is that Doug stays solo, the release valve below stops being a
contingency and becomes the plan.

**2. Pre-agree the release valve.** Decide now what degrades to manual so that in week six we are
choosing from a list instead of arguing. In rough order of what I would give up first:

| If we need a week | Ship instead | Cost |
| --- | --- | --- |
| Weekly stats email | Ashley sends it by hand | Her time, four times |
| PDF parsing to diff | VA fills a short form | VA minutes per shop |
| Kanban board | Flat status list with filters | Loses some of the delight |
| WYSIWYG editor | Template plus a plain edit box | Agent edits copy, not layout |
| Auto-send scheduling | Ashley triggers the weekly send | Not scalable past a few customers |
| Celebration animation | Ship it in week nine | Nothing, for one customer |

Everything on that list is Upline-side manual work the customer never sees, which is the right kind
of thing to cut. Nothing on it is a promise we made in the deck.

---

## Ownership

| Lane | Owner | Between now and Nov 6 |
| --- | --- | --- |
| Build, all surfaces | **Doug** | M2 through M6. Sole engineer, which is the risk above |
| Shop results + insured proposal design | **Ashley** | M1, then the pilot and onboarding runbook |
| Queue + Outreach Review design | **Amanda** | M1, then the weekly stats email |
| Decisions, Linear, pilot | **Ashley** | M0, Stockton Hill, keeps the decisions doc true |
| Go-to-market engine | **Austin** with **Davie** | 120 demos booked by end of Nov |
| Pricing and the VA cost model | **Austin** | Owed before we quote a percentage |
| Carrier access and credentialing | **Austin** | Gates M2 |
| Conference landing page | **Claire / Leander** | **Due Wednesday.** Owner and deadline set at today's 2:30 venture ops |
| Positioning and pricing call | **Jacob** | Unblocks the sales deck rewrite |

---

## Three conflicts to settle

**The Stockton Hill date does not agree with itself.** `thu-wall.md` says the pilot starts Monday
Sept 14 and the kickoff email needed to go out Wednesday or Thursday. The Thursday transcript has
Ashley kicking it off Friday, Sept 18. The kickoff email is drafted and still waiting on a contact
name at `upline-poc/clients/stockton-hill/pilot/week-1/kickoff-email.md`. Whichever is right, the
email is late.

**The SIA conference is next Wednesday, Sept 16 — six days out.** 3,300 people in the room and
roughly 15,000 on the rebroadcast is the largest single audience on our calendar this quarter, and
it lands squarely in M0 week. **Owner and deadline get set at today's 2:30 venture ops session**;
brief is below so it does not need to be reconstructed in the room.

### Brief for the conference page (for 2:30)

Everything here is already decided in [`decisions.md`](sprint-week/decisions.md) — it just has not
been written as a page brief.

- **Built for this conference specifically**, not a general landing page. That was Amanda's
  suggestion and Austin agreed.
- **The ask is a demo.** Demo is the best next step *into* an investment conversation, not an
  investment ask on the page. Austin, Amanda, and Jacob all landed there.
- **What Brandon can say:** he is part of a pilot, he cannot share much detail, and there are early
  founder investment opportunities he is aware of but does not control. "I can't guarantee anything,
  but I do know that is an opportunity."
- **QR code** goes on his slide and lands here.
- **Positioning to lead with:** we are the servicing half of the agency, the back-office concierge.
  Let the human be human. Not an AMS, not another SaaS tool.
- **Do not put pricing on it.** The percentage is unsettled and the deck's $699 is superseded.
- **Do not promise** a 24-hour shop, click-to-bind, or AMS replacement.
- **Still needed from Austin:** the email Brandon sent with the panel details.

**The go-to-market target and the build crunch collide in December.** 120 demos booked by end of
November converting to about 30 contracts by end of December means onboarding demand arrives exactly
when we are stabilizing customer one. Nobody owns onboarding capacity in this plan. Either the demo
target slides, or someone owns onboarding as a lane before we sign the second customer.

---

## One housekeeping item

`upline-poc/venture/strategy/mvp-scope.md` is still an empty placeholder with "populate this as the
pilot produces evidence." It is now the stalest file in either repo, because
[`decisions.md`](sprint-week/decisions.md) is the real scope. Suggest we point it at the decisions
doc rather than maintain two versions of the MVP line.
