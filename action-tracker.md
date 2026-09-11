# Upline action tracker

**Everything that has to happen between now and launch. One table per lane.**

Living document — fill it in as we go. Blank owners and dates are real gaps, not oversights;
if a row says TBD, that row needs a name before it can move.

**Status key:** `○` not started · `◐` in progress · `●` done · `⚠` blocked or at risk

**Reference:** [decisions.md](project-planning/sprint-week/decisions.md) is what we agreed ·
[MVP build plan](project-planning/2026-11-06-mvp-build-plan.md) is the milestone detail ·
[GTM next steps](go-to-market/next-steps.md) is the go-to-market detail.

**Fixed dates:** Nov 6 launch · 120 demos booked by end of Nov · ~30 contracts by end of Dec.

---

## A. Decisions owed — these block the build

Doug cannot estimate or build against an open question. All of these need answers by **Fri Sept 18**.

| Item | Owner | Due | Next immediate step | Status |
|---|---|---|---|---|
| Ranking rule for the weekly list — renewal date, biggest % increase, or onboarding survey | Ashley | Sep 18 | Pick the rudimentary version and move on; do not build an algorithm | ○ |
| Who we offer to shop — threshold, Upline decides, or ask everyone | Ashley + Austin | Sep 18 | Decide whether the $ and % threshold is an agency setting or our call | ○ |
| Default send variant — (A) rate change same price, or (B) same coverage better price | Ashley | Sep 18 | Pick the Nov 6 default; the other becomes conditional | ○ |
| Recommendation format — email, visual, or both | Ashley | Sep 18 | Board still reads "Email / Visual?" — close it | ○ |
| Shopping-rules file format | Ashley + Doug | Sep 18 | Draft the markdown template we'll fill in during onboarding | ○ |
| Action center as home screen, or separate view of the queue | Amanda | Sep 18 | Jacob pushed for one screen; Amanda holds the call | ○ |
| Date-of-birth gate on the insured page | Ashley | Sep 18 | Decide; affects the landing page build | ○ |
| Can a quote go in an email body | Austin | Sep 18 | Legal question, disputed in the room. Get a real answer | ○ |
| Login naming convention — `upline@agency.com` vs. something that doesn't say Upline | Ashley | Sep 18 | Transcript and `tue.md` disagree. Settle before onboarding is written | ⚠ |
| Uplift guarantee threshold — what retention increase we promise | Austin + Jacob | Sep 25 | Needs the retention baseline math first | ○ |

---

## B. Product build — Doug

Milestones are gates with exit tests, not status updates. Detail in the
[build plan](project-planning/2026-11-06-mvp-build-plan.md).

| Item | Owner | Due | Next immediate step | Status |
|---|---|---|---|---|
| **M0** — decisions closed, Linear stood up | Ashley | Sep 18 | Create the Linear workspace and one epic per surface | ○ |
| Size every epic | Doug | Sep 18 | Rough t-shirt sizes so we know if Nov 6 is real | ○ |
| **M1** — design complete on everything above the line | Ashley + Amanda | Sep 25 | See section C | ○ |
| **M2** — spine works on real data | Doug | Oct 2 | Agency accounts, auth, multi-tenancy | ○ |
| Credential vault (AMS + carrier logins, survives VA swap, handles 2FA) | Doug | Oct 2 | Pick the storage approach before building around it | ○ |
| Renewal queue reading real renewals | Doug | Oct 2 | Exit test: Stockton Hill's next 30 visible in the queue | ○ |
| **M3** — outreach actually sends | Doug | Oct 9 | **Highest-risk week.** Start Microsoft OAuth spike early | ⚠ |
| Send from the agent's own mailbox, individually | Doug | Oct 9 | Microsoft first, Google second | ○ |
| Outreach Review screen — edit, deselect-this-renewal | Doug | Oct 9 | | ○ |
| Scheduled auto-send: ready Mon 8am, sends Tue 9am, 48hr window | Doug | Oct 9 | | ○ |
| Questionnaire wired in, pre-filled | Doug | Oct 9 | Mostly exists in `upline-poc` — port rather than rebuild | ○ |
| **M4** — shop results and proposal | Doug | Oct 16 | | ○ |
| Parse 3 carrier PDFs, compute what's different | Doug | Oct 16 | Release valve: VA fills a form instead | ○ |
| Shop results with talking points | Doug | Oct 16 | | ○ |
| WYSIWYG proposal editor | Doug | Oct 16 | | ○ |
| Insured landing page, agency-branded, approve = pending | Doug | Oct 16 | | ○ |
| **M5** — close the loop, full dry run | Doug | Oct 23 | Exit test: 30 real households, timed | ○ |
| Kanban states incl. needs-binding that visibly ages | Doug | Oct 23 | | ○ |
| Weekly stats email (replaces the cut dashboard) | Doug + Amanda | Oct 23 | Release valve: Ashley sends by hand | ○ |
| **M6** — freeze and harden | Doug | Oct 30 | No new surfaces after this date | ○ |
| **M7** — onboard customer one | Ashley | Nov 2–6 | | ○ |
| **LAUNCH** | — | **Nov 6** | | ○ |
| Decide whether Doug gets help | Jacob + Austin | Sep 11 | Raise at Friday recap. Single biggest risk in the plan | ⚠ |
| Pre-agree the release valve list | Ashley + Doug | Sep 18 | Six items ranked in the build plan — confirm the order | ○ |

---

## C. Design — Ashley and Amanda

| Item | Owner | Due | Next immediate step | Status |
|---|---|---|---|---|
| Shop results screen | Ashley | Sep 25 | Differences-first, talking points above the table | ◐ |
| Insured proposal page | Ashley | Sep 25 | Agency-branded, one pick not a price grid | ◐ |
| Renewal queue | Amanda | Sep 25 | **Newly above the line** — was not in the dot vote | ○ |
| Outreach Review | Amanda | Sep 25 | **Newly above the line** — was not in the dot vote | ○ |
| Questionnaire polish | Amanda | Sep 25 | Keep it a questionnaire — 100% pilot completion | ○ |
| Weekly stats email design | Amanda | Oct 16 | Upline-branded, unlike outreach | ○ |
| Month-in-review email — does it survive alongside the screen? | Amanda | Sep 25 | Amanda wants it; never decided | ○ |
| Celebration / delight pass | Amanda | Oct 30 | Pipedrive golfer, gong. Release valve: ship week nine | ○ |

---

## D. Pilots and customers

Three stages in sequence, not parallel.

| Item | Owner | Due | Next immediate step | Status |
|---|---|---|---|---|
| Stockton Hill kickoff email | Ashley | **Overdue** | Waiting on a contact name. Draft is in `upline-poc/clients/stockton-hill/pilot/week-1/kickoff-email.md` | ⚠ |
| Resolve the Stockton Hill start date — Sep 14 or Sep 18? | Ashley | Sep 11 | `thu-wall.md` and the Thursday transcript disagree | ⚠ |
| Stockton Hill account setup | Ashley | Sep 18 | Needs a day, maybe two | ○ |
| Stockton Hill Review Fridays — one shopped household each week | Ashley | Weekly from Sep 18 | Individual sessions, not a group | ○ |
| Validation with Brandon (owner view) and Stacey (CSR view) | Ashley | Ongoing | Jolene is sales, not a CSR proxy | ○ |
| **Name the October design partner** | Austin + Jacob | Sep 30 | No candidate on the list. Pilot sequence assumes one | ⚠ |
| October beta — free shopping, VA practice | Ashley | Oct 1 | Starts alongside M4 | ○ |
| Megan / Josh agency onboarding | Ashley | Next week | Push to Thursday afternoon | ○ |
| First paying customer identified | Austin | Oct 15 | Needs to exist before M7 onboarding | ○ |
| Who owns onboarding when contracts close in December | TBD | Sep 30 | Nobody owns this lane. Collides with post-launch stabilization | ⚠ |

---

## E. Business, pricing and legal

| Item | Owner | Due | Next immediate step | Status |
|---|---|---|---|---|
| **Fully loaded VA cost model** | Austin | Sep 18 | Blocks the pricing number. 0.5% probably doesn't cover shopping | ⚠ |
| Set the percentage — 0.3% + $18/shop vs. ~0.5–0.7% all-in | Austin + Jacob | Sep 25 | Nobody is anchored. Instruction was to get aggressive | ○ |
| Pull $699/mo out of the sales deck | Claire | Sep 18 | Superseded. $18 stays as internal cost basis only | ⚠ |
| Draft the partnership agreement — 24 months, no implementation fee, billing starts end of month one | Austin | Oct 1 | | ○ |
| Uplift guarantee — define and document the promise | Austin + Jacob | Sep 25 | | ○ |
| Tier ranges for the pricing slide | Austin | Sep 25 | Three ranges, confirmed after AMS access | ○ |
| Decide: present both pricing options, or gate Option B | Jacob | Sep 25 | | ○ |
| Custom-pricing threshold — at what book size we stop publishing | Austin | Oct 1 | | ○ |
| Referral / revenue-share component — in or out | Jacob | Oct 1 | Raised, never resolved | ○ |
| Contract language allowing Upline to shop where we choose | Austin | Oct 1 | Protects future carrier deals | ○ |
| Legal read on quotes in email bodies | Austin | Sep 18 | Also gates the insured page design | ○ |
| E&O / regulatory position on AI recommendations | Austin | Oct 15 | Why the agent must review every recommendation | ○ |
| Oklahoma insurance commissioner relationship | Austin + Leander | Sep 30 | Find out where it actually stands. Possible first state for agentic AI recs | ○ |
| Investor pitch deck | Jacob | — | Written Sep 9 | ● |

---

## F. Go-to-market

Detail in [go-to-market/next-steps.md](go-to-market/next-steps.md).

| Item | Owner | Due | Next immediate step | Status |
|---|---|---|---|---|
| **120 demos booked** | Austin + Davie | End of Nov | The one metric that matters | ◐ |
| ~30 contracts closed | Austin + Davie | End of Dec | | ○ |
| Warm outbound — runs as its own workflow | Davie | Ongoing | Davie's CRM, Davie's tools. We assist on request only | ◐ |
| Davie / JV sales progress reviews | Davie + Jacob | Recurring | Set the cadence | ○ |
| Paid social v1 launch | Austin | Sep 18 | Decide destination: standalone page (recommended) or wait for website v2 | ⚠ |
| Confirm how many videos actually exist | Austin + Davie | Sep 14 | Sprint goal was 20. Likely the real blocker | ⚠ |
| Record the video gap | Davie | Sep 17 | | ○ |
| Tracking end to end — pixel, UTMs, demo-booked as the conversion | Austin | Sep 18 | Not clicks. Instrumentation is the hard part | ○ |
| Pick first platform to spend on | Austin | Sep 16 | LinkedIn, Meta, or Google Display. Not all three | ○ |
| Weekly spend cap and creative kill rule | Austin | Sep 18 | | ○ |
| Cover for Austin while he's at SIA | TBD | Sep 14 | He owns the lane and is out mid-week | ⚠ |
| Website v2 | Claire | Sep 18 | Consider sliding a week so paid isn't blocked on it | ◐ |
| Website sitemap and story | Claire | Sep 14 | | ◐ |
| New pass on the pitch deck | Claire | Sep 18 | Must reflect new pricing | ○ |
| Press release | Claire drafts → Davie | Mid next week | | ○ |
| Founder-led posting workflow | Claire → Davie + Jacob | Next week | Claire demos what she's built | ○ |
| Ad contest — everyone submits one, tracked by click-through | Austin | Sep 25 | Winner gets a bike or equivalent | ○ |
| Sponsored webinar — do we run it? | TBD | Oct 1 | Liked on Tuesday, never assigned | ○ |
| Channel rank order past "events first, paid is the swing" | Austin | — | May not need reconciling | ○ |

---

## G. Conferences and events

| Item | Owner | Due | Next immediate step | Status |
|---|---|---|---|---|
| **SIA Independent Agent Evolve 2026** — Brandon's panel | Brandon + Austin | **Wed Sep 16** | 3,300 in room, ~15,000 rebroadcast | ◐ |
| SIA conference QR landing page | Claire / Leander | **Sep 15** | Owner set at today's 2:30 ops. Brief is in the build plan | ⚠ |
| Get Brandon's panel email to the team | Austin | Sep 11 | Still owed | ⚠ |
| Brandon's talking points | Austin + Claire | Sep 15 | Pilot reference + early founder investment, ask is a demo | ○ |
| **Young agents conference** | Davie | **Thu–Fri Sep 17–18** | Warm intros already lined up through a network relationship | ◐ |
| Young agents — ask, material, follow-up plan | TBD | Sep 15 | Currently has none. Own page or reuse SIA's? | ⚠ |
| Decide if Ashley attends young agents | Ashley | Sep 12 | Davie offered to register her | ○ |

---

## H. Team and operating cadence

| Item | Owner | Due | Next immediate step | Status |
|---|---|---|---|---|
| Friday recap — owners, timeline, next steps | Ashley | **Fri Sep 11, 10:30–11:30** | Bring decisions.md and the build plan | ◐ |
| Venture ops — cadence, tooling, conference page | Ashley | **Today 2:30** | | ◐ |
| Stand up Linear | Ashley | Sep 18 | Chosen, not yet created | ○ |
| Set recurring meeting cadence | Ashley + Jacob | Sep 11 | Jacob is connecting his calendars — grab time when it's free | ○ |
| VA kit, shared shopping method, ticketing | Ashley | Oct 30 | What keeps the 24-hour promise from being a lie | ○ |
| Quoting guide for VAs — parity pass then upsell pass | Ashley | Oct 16 | Implied by the upsell decision, not yet written | ○ |
| Onboarding runbook + shopping-rules interview script | Ashley | Oct 30 | Exit test: someone not in the room can run it | ○ |
| Point `upline-poc/venture/strategy/mvp-scope.md` at decisions.md | Ashley | Sep 18 | Empty placeholder, now the stalest file in either repo | ○ |
| Circulate decisions.md to the team | Ashley | Sep 11 | Ask for corrections by Friday | ◐ |

---

## The four things most likely to hurt us

1. **Doug is the only engineer** for seven new surfaces in eight weeks, with no slack in the schedule.
2. **Friday Sept 18 is carrying four launches and a conference** — website v2, paid social v1, product
   decisions closed, possibly the Stockton Hill kickoff, plus day two of young agents.
3. **The VA cost model gates pricing**, and pricing gates every sales conversation.
4. **Nobody owns onboarding** when contracts start closing in December, which is exactly when we're
   stabilizing customer one.
