# Product — the next four weeks

**Sept 14 – Oct 9, 2026 · for the whole team**

This is the product lane at day resolution, organized by initiative. It is the first four weeks of
[`timelines.md`](timelines.md) Part 1 zoomed in — same dates, same gates, more detail about what is
actually moving on which day. Nothing here changes a date that timeline already set.

**The short version:** wireframes for the whole customer-facing app go to visual design on
**Mon Sept 21**, design closes on **Fri Oct 2**, and the first real outreach email leaves a real
mailbox on **Fri Oct 9**. Stockton Hill runs underneath all of it, with review sessions Monday,
Wednesday and Friday.

Source: the Sept 15 product sync with Ashley, Amanda and Doug.

---

## The chart

```
                                       ▼ today
                                    W1 Sep 14      W2 Sep 21      W3 Sep 28      W4 Oct 5
                                    14 15 16 17 18 21 22 23 24 25 28 29 30  1  2  5  6  7  8  9
                                     M  T  W  T  F  M  T  W  T  F  M  T  W  T  F  M  T  W  T  F
STOCKTON HILL PILOT
  Account setup                     ██████  Ashley
  Kickoff                                       ███  Ashley
  Review sessions — Mon, Wed, Fri                  █████████████████████████████████████████████  Ashley

CUSTOMER-FACING MVP
  Client-app wireframes, end to end       ████████████  Ashley
  Magic-moment screens — v3                           ██████  Amanda
  Design pass on the whole flow                             ██████  Amanda
  v4–v5 into the design gate                                      ███████████████  Ashley + Amanda
  Accounts, auth, multi-tenancy     ███████████████  Doug
  Microsoft mailbox OAuth spike        █████████████████████  Doug
  Outreach email, first pass              █████████  Doug
  AMS pull, queue on real data                                    ███████████████  Doug
  Outreach Review, mailbox send                                                  ███████████████  Doug

UPLINE ADMIN
  Admin wireframes                                       █████████  Ashley
  Split client / admin app                         ██████████████████████████████  Doug

EVERYTHING ELSE
  OKR first pass                          ███  Ashley
  Brand positioning, design hub     ███████████████  Amanda
  Stand-ups, Tue and Thu mornings            ███████████████████████████████████████████████████  all
  Linear tickets drafted in Cursor              ████████████████████████████████████████████████  all
```

Columns are working days, Monday through Friday. Owners sit to the right of their bar. Bars are
working time, not effort — several of these are half days sitting next to each other.

---

## Stockton Hill pilot

The first agency on the software. Account setup finishes today; their AMS is organized differently
from Members First, which cost most of Monday and Tuesday. Kickoff is **Friday the 18th**, and from
there we review **Monday, Wednesday and Friday** — individual sessions walking one shopped household
at a time, not a group. The pilot's real function is that they are reacting to wireframes and to
their own real households while design is still cheap to change, which is why it sits underneath the
design weeks rather than after them.

Something has to be queued up for them ahead of each session. That is the part with no slack in it.

## Customer-facing MVP

The seven surfaces above the line. Ashley is wireframing the full end-to-end flow first — it will
look like a demo, and that is the intent — with the iterations concentrated on the two magic moments
rather than spread evenly. That goes to Amanda on the 21st. Amanda takes the magic-moment screens
first, then a pass over the whole flow if there is time, and the room's own read was that the full
pass always takes longer than it looks.

Doug is building the parts that need no design at all: accounts, auth and multi-tenancy, then the
AMS renewal pull. The Microsoft mailbox OAuth spike starts early on purpose because it is the piece
most likely to overrun, and the whole outreach flow sits behind it. He is also taking the first pass
at the outreach email design out of the design hub.

## Upline Admin

The back office — inviting an agency owner, who then configures their own agents, plus the support
roles for people working at Upline. Doug is splitting the app in two, client and admin, on the same
design system so the admin side does not become its own project.

The deliberate call here is that **admin skips the visual design pass**: Ashley's wireframes go
straight to Doug. It is internal-facing, the bar is genuinely lower, and we have shipped worse and
lived with it for well over a year before. If it works, it is a repeatable pattern.

## Everything else

OKRs get a first pass Wednesday morning — an hour or two, deliberately rough, because the point is
for the team to argue with it rather than approve it. Amanda's brand positioning and design-hub work
is upstream of every screen after it: she is tuning the hub so Claude returns a better result
automatically. Stand-ups are Tuesday and Thursday mornings, chosen because Monday and Wednesday are
the meeting-heavy days and Tuesday and Thursday are supposed to stay heads-down. Linear is already
stood up; invites go out this week, and tickets get drafted straight out of Cursor as the work
happens rather than written up separately.

---

## The dates that gate someone else

| Date | What has to be true | Owner |
|---|---|---|
| **Wed Sept 16** | OKR first pass drafted, ready to be torn up at the weekly | Ashley |
| **Fri Sept 18** | Ten blocking decisions closed · Linear invites out · Stockton Hill kickoff | Ashley, Doug |
| **Mon Sept 21** | End-to-end client-app wireframes handed to Amanda | Ashley |
| **Wed Sept 23** | Review handoff — Ashley walks Amanda through it, Doug optional and inside his own hours | Ashley, Amanda |
| **Fri Sept 25** | Magic-moment screens through visual design | Amanda |
| **Fri Oct 2** | **Design done** · design partner named | Ashley, Amanda |
| **Fri Oct 9** | A real email leaves a real mailbox · Stockton Hill closes | Doug, Ashley |

---

## How a screen gets from rough to build-ready

| | What | When | Who |
|---|---|---|---|
| **v1** | Design hub | live now | Amanda |
| **v2** | Wireframes, end to end | Mon Sept 21 | Ashley |
| **v3** | Visual design pass | Fri Sept 25 | Amanda |
| **v4–v5** | Iterations to build-ready | Fri Oct 2 | Both |

The room expects roughly five passes before anything is ready to hand to Doug. Read anything before
v4 as a draft that is supposed to be wrong — that is the whole reason the versions are numbered.

---

## Three things worth watching

**Amanda has two dedicated design days that week.** Tuesday the 22nd and Wednesday the 23rd are the
entire window before the design pass is due. If the handoff slips from Monday to Tuesday it becomes
one day, and only the magic-moment screens will fit.

**Upline Admin is deliberately skipping the visual design pass.** That is a test of how much can
bypass design entirely, not an oversight. But if the test fails, the rework lands in the week design
is trying to close.

**The two hardest dates are one week apart.** Design done on Oct 2 and sending from the agent's own
mailbox on Oct 9 sit in the same fortnight, and the mailbox work is the piece most likely to overrun.
Everything downstream in the build depends on it working.

---

## What this does not cover

Go-to-market, capital and people lanes are in [`timelines.md`](timelines.md) Part 2 and
[`okr-plan.md`](okr-plan.md). Weeks 5 through 8 — shop results, the proposal editor, feature freeze,
QA and the Nov 6 launch — are in [`timelines.md`](timelines.md) Part 1. Open product questions are
quarantined in [`sprint-week/decisions.md`](sprint-week/decisions.md) §13; ten of them close Friday.

One bar is an assumption rather than a commitment: the **split of the client and admin apps** is a
stated intent with no dates attached yet. It is drawn where it plausibly fits, and Doug should move
it.
