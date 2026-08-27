# How to run a How Should We

Weekly Monday meeting. Internal Upline strategy — not a standup, not a customer check-in.

**Cursor skill:** say `How Should We this week` or `run How Should We`. The skill lives at [`.cursor/skills/how-should-we/`](../.cursor/skills/how-should-we/SKILL.md) and follows this file.

---

## What this meeting is

A **how** meeting. The room picks one or a few real decisions and works them. Status exists so the questions have a floor, not so the hour becomes a readout.

It used to be called **POW**. Same ritual, better name.

**North star we do not re-argue every week**

> For real renewals, we need proof we can repeatedly generate a **proposal moment** agents trust enough to send and customers respond to.

| Pillar | The test |
|--------|----------|
| Agent Trust | Would an agent actually send this? |
| Customer Engagement | Do customers respond to this? |
| Scalability Confidence | Can this become a real product? |

Pinned context (hypothesis, thesis, mantra, timeline, proof point) lives on Through Line and in `data/venture-plan.json`. Do not rewrite it in every agenda.

---

## Cadence

| | |
|---|---|
| When | Monday |
| Who | Ashley facilitates. Austin on build/POC. Studio (Jacob, Dan) as challenger. JV and Davey when sell/raise or VAs are on the table. |
| Length | Protect time for the decisions. Early shape was ~5 learnings / ~5 priorities / ~25 one deep-dive / ~5 close. Use that if the week is heavy; go lean if it is not. |
| Home | Agenda is paste-ready for Notion (`Upline Weekly Meetings`). Decisions get a file here: `YYYY-MM-DD-how-should-we.md`. |

---

## Four lanes (since Aug 24)

Every agenda tracks these. If a lane is quiet, one honest bullet — do not pad.

1. **Sell / raise** — what we may promise, waitlist vs contracted, JV + Davey motion
2. **Build** — engineer hire, sprint week, MVP fidelity
3. **POC** — Stockton Hill / next design customer, VA capacity
4. **Experiments** — referrals, GTM tests, anything we are running to learn

---

## A good How Should We question

Starts with **How should we…** Names a decision, a tradeoff, or a sequence. Often shows options. Ends with an owner or what "done" looks like.

**Good**

- How should we shape the sprint? Option A: dedicated client + agent time. Option B: combined MVP, primary pages only. Lean: B.
- How should we sequence Stockton Hill against sprint week if access slips?
- How should we look at pricing options 1–3 together — what holds up?

**Not the main event**

- Pipeline counts with no ask
- Rehashing a closed learning (one-email outreach, etc.)
- Customer check-in prep (that is a different meeting)

Status and FYIs live under **Last week's learnings** or at the bottom so they do not eat the room.

Open-floor prompt when the week is light or you want the team to drive:

> What do we need to be thinking about that we haven't yet? What could sneak up on us?

---

## Agenda template

```markdown
# Upline Weekly "How Should We" — [Date]

## Last week's learnings
- New only. Funnel numbers if a pilot is active.
- One or two bullets per live thread (POC, build, GTM). No recap of closed items.

## Sell / raise
- Status (short)
- How should we… [decision]

## Build
- Status (short)
- How should we… [decision]

## POC
- Status (short)
- How should we… [decision]

## Experiments
- Status (short)
- How should we… [decision]

## Open floor
What do we need to be thinking about that we haven't yet? What could sneak up on us?

## Desired outcomes
1.
2.
3.
```

Drop empty How-should-we lines. One strong question beats four weak ones.

---

## After the meeting

Write `project-planning/YYYY-MM-DD-how-should-we.md`:

```markdown
# How Should We — [Date]

## Headline
One paragraph: what shifted.

## Decisions / direction
### Sell / raise
### Build
### POC
### Experiments

## Open / confirm by mid-week
| Item | Owner | Notes |
|------|-------|-------|

## What this changes next week
Which lanes get heavier. Any question that is now closed.
```

First captured session: [`2026-08-24-how-should-we.md`](2026-08-24-how-should-we.md).

---

## Sources to load (agent)

1. This file
2. Latest dated `*-how-should-we.md` in this folder
3. [`execution-plan.md`](execution-plan.md)
4. Whatever Ashley pastes (notes, transcript, Notion funnel)
5. Product files only if a lane needs them: [`../product/pricing.md`](../product/pricing.md), [`../product/mvp.md`](../product/mvp.md), [`2026-09-08-strategy-sprint.md`](2026-09-08-strategy-sprint.md)

Do not write into upline-poc from this workspace.
