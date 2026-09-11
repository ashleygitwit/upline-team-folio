# Timelines — GTM and product

Two timelines, both landing on **Friday November 6**. Product supersedes the milestone dates in
[`2026-11-06-mvp-build-plan.md`](2026-11-06-mvp-build-plan.md); the shape here (three weeks design,
dev starting now, two weeks QA before launch) is tighter on dev and more disciplined on testing.

**Week numbering used throughout:**

| Week | Dates |
|---|---|
| W1 | Sep 14–18 |
| W2 | Sep 21–25 |
| W3 | Sep 28–Oct 2 |
| W4 | Oct 5–9 |
| W5 | Oct 12–16 |
| W6 | Oct 19–23 |
| W7 | Oct 26–30 |
| W8 | Nov 2–6 |

---

# Part 1 — Product timeline

## The shape

```
        W1     W2     W3     W4     W5     W6     W7     W8
      Sep14  Sep21  Sep28  Oct 5  Oct12  Oct19  Oct26  Nov 2
DESIGN ████████████████████
DEV    ████████████████████████████████████████
QA                                        ██████████████
PILOT  ███ Stockton Hill ███  ████ Design partner ████████ │ Customer 1 →
                                                           ▲
                                                      Nov 6 LAUNCH
```

- **Design:** W1–W3, done Fri Oct 2
- **Dev:** W1–W6, feature freeze Fri Oct 23
- **QA:** W7–W8, two weeks, no new surfaces
- **Launch:** Fri Nov 6, first paying customer onboards

**Dev starts now, in parallel with design, because the first two weeks of build need no design at
all** — agency accounts, auth, multi-tenancy, the credential vault, the AMS renewal pull, and the
Microsoft mailbox OAuth spike. That is roughly two weeks of infrastructure, which is exactly the
runway design needs.

## Week by week

| Week | Design | Dev | Pilot | Gate |
|---|---|---|---|---|
| **W1** Sep 14–18 | Shop results, insured page (Ashley) · queue, Outreach Review (Amanda) | Accounts, auth, multi-tenancy · **start the OAuth spike** | **Stockton Hill wk 1** | Fri: all 10 blocking decisions answered, Linear stood up |
| **W2** Sep 21–25 | Iterate on Stockton Hill reactions | Credential vault · AMS renewal pull | Stockton Hill wk 2 | |
| **W3** Sep 28–Oct 2 | Questionnaire polish, stats email | Renewal queue on real data | Stockton Hill wk 3 · **name the design partner** | **Fri Oct 2: design done.** Exit test — Stockton Hill's next 30 visible in the queue |
| **W4** Oct 5–9 | Support only | Outreach Review · send from agent mailbox · scheduled auto-send | **Design partner starts** | Fri: a real email leaves a real mailbox and returns a completed questionnaire |
| **W5** Oct 12–16 | Support only | PDF parse and diff · shop results · talking points | Design partner wk 2 | Fri: one household goes questionnaire → shop → proposal |
| **W6** Oct 19–23 | Support only | Proposal editor · insured page · Kanban and needs-binding | Design partner wk 3 | **Fri Oct 23: FEATURE FREEZE** |
| **W7** Oct 26–30 | Bug fixes only | **QA wk 1** — full dry run, 30 real households, timed | Design partner wk 4 · **doubles as QA users** | Fri: two consecutive 24-hour shops delivered |
| **W8** Nov 2–6 | — | **QA wk 2** — hardening, onboarding runbook | Design partner wk 5 → hands off | **Fri Nov 6: LAUNCH** |

## Why the pilots line up the way they do

Stockton Hill runs W1–W3, which is exactly the design window. That is the point — they are reacting
to wireframes and to their own real households while design is still cheap to change. Review Fridays,
one shopped household at a time, individual sessions rather than a group.

The design partner starts W4, the week dev begins shipping user-facing surfaces, and runs straight
through to launch. **They become the QA population for W7 and W8** — real users on real software
during the two QA weeks, which is far better than testing against ourselves. Then they hand off and
the first paying customer onboards Nov 6.

## What the freeze means

After **Fri Oct 23**, no new surfaces. Bugs only. If something is not built by then it either ships
degraded from the release valve list or it ships after launch. That is the whole function of a
freeze — it converts a scope argument in week seven into a decision made in week one.

**Release valve, in the order we give things up:** weekly stats email sent by hand · VA fills a form
instead of PDF parsing · flat status list instead of Kanban · template instead of the WYSIWYG editor
· manual weekly send trigger · celebration animation ships later.

## The two dates that carry the most risk

**Fri Oct 2 — design done.** If design slips, dev has no runway left; the infrastructure work that
does not need design is finished by then. Design slipping one week costs a week of dev, not a week
of design.

**Fri Oct 23 — feature freeze.** Six dev weeks for six new surfaces means one week each with no
slack, and the mailbox work in W4 is the piece most likely to overrun. Protect W4.

---

# Part 2 — GTM timeline

## What we are working back from

**120 demos booked by end of November** → ~90 held at a 75% show rate → **~30 contracts closed by
end of December**, which implies a third of held demos closing.

Eleven weeks from Sep 14 to Nov 30.

## The ramp

Paid social cannot carry the early weeks. Tuesday's read was that the instrumentation takes about a
month to start working, so the first stretch is carried entirely by outbound and conferences.

| Phase | Weeks | Demos booked/wk | Running total | Carried by |
|---|---|---|---|---|
| **Ramp** | W1–W3 · Sep 14–Oct 2 | ~6 | ~18 | Warm and cold outbound, plus the two conferences |
| **Paid contributes** | W4–W6 · Oct 5–23 | ~12 | ~54 | Outbound plus paid as the algorithm learns |
| **Paid at scale** | W7–W11 · Oct 26–Nov 30 | ~14 | ~124 | Paid leading, outbound steady |

That is a modeled shape to argue with, not a commitment. Its real value is showing where the plan is
thin.

**The finding: September is the fragile part.** If outbound and the two conferences do not produce
roughly 18 booked demos by Oct 2, the November number is already gone, because paid physically
cannot make it up — it will not have learned yet. Everything about whether we hit 120 is decided in
the next three weeks, by the lane we are touching least.

## Week by week

| Week | Paid social | Website | Outbound | Events | Other |
|---|---|---|---|---|---|
| **W1** Sep 14–18 | Confirm video count · tracking, pixel, UTMs · pick one platform · **v1 live Fri** | **QR page live Tue** · v2 *(slide a week?)* | Davie running · warm intros from young agents | **SIA Wed 16** · **Young agents Thu–Fri 17–18** | Press release drafted mid-week · founder posting workflow intro |
| **W2** Sep 21–25 | First read on creative · kill and replace | Website v2 · new deck pass with real pricing | Follow up every conference contact | — | Ad contest submissions |
| **W3** Sep 28–Oct 2 | Widen what is working · second platform if the first converts | Conversion fixes from real traffic | Steady | — | **Checkpoint: are we at ~18 booked?** |
| **W4** Oct 5–9 | Scale spend on winners | — | Steady | — | Decide the webinar |
| **W5** Oct 12–16 | Second creative batch | — | Steady | — | First paying customer identified |
| **W6** Oct 19–23 | Scale | — | Steady | — | |
| **W7** Oct 26–30 | Full scale | Launch page ready for Nov 6 | Steady | — | |
| **W8** Nov 2–6 | Full scale | **Launch messaging live** | Steady | — | **Nov 6 — we have a live customer to sell with** |
| **W9–W11** Nov 9–30 | Full scale | — | Steady | — | **Nov 30 — 120 booked** |
| **Dec** | Sustain | — | Closing | — | **Dec 31 — ~30 contracts** |

## Fixed dates

| Date | What | Owner |
|---|---|---|
| **Tue Sep 15** | SIA QR page live | Claire / Leander |
| **Wed Sep 16** | SIA — 3,300 in room, ~15,000 rebroadcast | Brandon, Austin |
| **Thu–Fri Sep 17–18** | Young agents conference | Davie |
| **Fri Sep 18** | Paid social v1 live | Austin |
| **Mid W1** | Press release drafted, handed to Davie | Claire |
| **Fri Oct 2** | Ramp checkpoint — ~18 booked | Austin |
| **Fri Nov 6** | Product launch, first customer live | — |
| **Sun Nov 30** | 120 demos booked | Austin, Davie |
| **Wed Dec 31** | ~30 contracts | Austin, Davie |

## Three things this timeline exposes

**Paid social depends on the website, and both are scheduled for Sept 18.** Launch paid against a
standalone landing page reusing the conference page pattern, and the dependency disappears — the
website then ships on quality rather than on someone else's launch date.

**Austin owns paid social and is at SIA during launch week.** Either front-load to Monday and
Tuesday or name a cover.

**December is a collision.** Roughly 30 contracts close in the same weeks we are stabilizing customer
one, and nobody owns onboarding. Either the demo target slides or onboarding gets an owner before the
second contract is signed.

---

# Part 3 — Both timelines together

| Week | Product | GTM |
|---|---|---|
| **W1** Sep 14–18 | Design starts · dev infra · Stockton Hill wk 1 · **decisions closed Fri** | **Two conferences** · paid v1 · QR page |
| **W2** Sep 21–25 | Design · credential vault · Stockton Hill wk 2 | Creative read · website v2 · new deck |
| **W3** Sep 28–Oct 2 | **Design done Fri** · queue on real data · name the design partner | **Ramp checkpoint ~18 booked** |
| **W4** Oct 5–9 | **Riskiest dev week — mailbox sending** · design partner starts | Scale winners |
| **W5** Oct 12–16 | Shop results and proposal | First paying customer identified |
| **W6** Oct 19–23 | **Feature freeze Fri** | Scale |
| **W7** Oct 26–30 | QA wk 1 · design partner as QA users | Full scale |
| **W8** Nov 2–6 | QA wk 2 · **LAUNCH Fri** | Launch messaging |
| **Nov 9–30** | Stabilize customer one | **120 booked by Nov 30** |
| **Dec** | ⚠ onboarding demand arrives | **~30 contracts** |

## Where the two collide

**W1** is the worst week of the eight. Design kickoff, dev kickoff, ten decisions to close, Linear to
stand up, the Stockton Hill kickoff, two conferences, a QR page, and a paid launch. Something should
move now, while moving it is cheap.

**W4** is quietly the second worst. It is the riskiest dev week (mailbox sending), the week the
design partner starts, and the week paid spend scales — three things that each want attention and
none of which can be rescheduled easily.

**December** is where the two timelines actually conflict rather than just crowd. The GTM plan
succeeding is what creates the product problem, and no one owns the lane that absorbs it.
