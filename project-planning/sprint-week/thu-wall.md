# Thursday wall — Sept 10

Print this. Read it at 9:00. **Ashley facilitates the morning.**

**The question today:** What has to exist for launch, what does it cost to build, and what is the date?

**We stop at** 12:00. Afternoon splits into two rooms.

> **Written Wednesday afternoon, before the day closed.** The "From Wednesday" section below is
> a placeholder. Fill it tonight from the recording, the wall photos, and the phase capture sheets
> before you print. Everything else on this page is the agenda of record and Tuesday's carry-in,
> so it is safe to print now.

---

## From Wednesday

_To fill in tonight — hold / revise / drop on the five flagships, plus whatever the 2:00 sketch
review changed. Do not invent it; if it was not on the wall or in the transcript, leave it out._

**Sketched so far** — two of the five flagships exist as clickable wireframes:

| Flagship | File | What it argues |
| --- | --- | --- |
| #2 Client brief | `product/wireframes/week-board.html` | Type a name, get one surface: household file, questionnaire answers with "not in your AMS" flags, the recommendation with who we ruled out, and a chat panel scoped to that household. Plus #5 — needs-binding now ages visibly and only clears when the agent checks off every human step. |
| #3 Insured proposal page | `product/wireframes/insured-proposal.html` | Agency-branded as Seabrook, no Upline anywhere. One pick, not a price grid. Names the carrier that came back cheaper and says why we did not recommend it. The approve button says in red that it does not put coverage in place. |

Flagships #1 (login dopamine) and #4 (default-on week) are **not sketched**. #1 is closest —
`business-dashboard.html` is the owner metrics view, which is adjacent but not the login moment.

- Held:
- Revised:
- Could not build / too expensive:

---

## The four moves this morning

1. **Write the list.** Name every feature the experience needs. Tuesday's journey goes on the wall with Wednesday's sketches beside it.
2. **Keep or kill.** Above the line or below the line on every one. Above = cannot go live without it. Below = we love it and can ship customer one without it.
3. **Estimate.** Effort and complexity on everything that stays.
4. **Sequence it and set the date.**

**Everything under the line is ice** — including AMS replacement and "log in and you're live."

The failure mode to watch for: a black-hole feature that eats 60% of the build.

---

## Decisions this morning has to close

These came out of Tuesday still open. They are the reason the estimate is soft.

| Open question | Why it blocks the estimate |
| --- | --- |
| Click-approve in MVP | Wanted and dangerous. If it exists, approve means *pending*, never bound. |
| Chat vs. client profile vs. both | Ashley leans both; Jacob leans chat-on-data so we do not rebuild SaaS. Different build sizes. |
| Is the dashboard above the line? | Strong pull in the room, never cut. Decide it. |
| The rank rule | Renewal date vs. biggest % vs. onboard survey. Pick one and roll. |
| Who we offer to shop | Threshold vs. Upline decides vs. shop-ask everyone. |
| The close | Tuesday never locked it. Phone stays, but is the landing page the end of our involvement or do we stay in through bind? |

**Note the conflict to resolve out loud:** Tuesday's capture says the official launch date gets
locked **Friday**, but Thursday's agenda says this morning sets the MVP launch date. Nov 6 is
still tentative. Decide this morning whether you are setting it or teeing it up for Friday.

---

## Risk we cannot ignore

We sell a journey they do not get. And: they think they bought, nobody bound, there is a claim.

No AMS access, no product. Credentialing is the key to the kingdom.

---

## The afternoon

| Time | Room | Who | What |
| --- | --- | --- | --- |
| 1:00–5:00 | The Curve | Ashley, Amanda, Austin, Douglas | Epics, user stories, requirements. Stand up Linear or decide the tool. |
| 1:00–5:00 | The Cube | Claire, Davie, JV | Website, pitch deck, first sales motion. |

---

## What we leave with

- A feature list with every item above or below the line
- Effort estimates and an MVP launch date
- Stories in Linear, or the decision about which tool
- Website, pitch deck, and first sales motion in progress

---

## Quick things to do before 9:00 tomorrow

**Tonight**

- [ ] Nightly pass: drop today's transcript + wall photos, fill in "From Wednesday" above
- [ ] Photograph the wall at the 3:00–5:00 close (Wednesday's snapshot is on the agenda)
- [ ] Print the Thursday pack: empty above/below-the-line 2×2, Tuesday's map as it actually ended, Wednesday's sketches taped up
- [ ] Print this page
- [ ] Print or screen the two wireframes — `npm run wireframes`, then week-board and
      insured-proposal on port 4321. Nine judgment calls are flagged in the build notes; the
      two the room should rule on are **click-approve staying in** (built as pending) and
      **naming the ruled-out carriers by name** on the insured page.

**Confirmations**

- [ ] **Patrick** — confirm he can join tomorrow morning. Note: the sprint plan currently has him
      as *optional for Friday Venture Ops, 11:30–1:30*, with Mike, not Thursday. If he is coming
      to the Thursday 9:00 keep/kill instead, say which, because the print pack and the room
      count change. Draft ask is in `patrick-ask.md` next to this file.
- [ ] **"VetOps conversations"** — nothing by this name exists in either repo, in Notion, or in
      any prior chat. Thursday as scheduled is keep/kill and scoping. Name the real thing and
      it gets an agenda.
- [ ] **Stockton Hill** — kickoff email is drafted and waiting on a contact name:
      `upline-poc/clients/stockton-hill/pilot/week-1/kickoff-email.md`. Pilot starts Monday
      Sep 14, so this wants to go out today or tomorrow.

**Still owed from sprint prep**

- [ ] Empty Linear project, or make the tool choice a Thursday-afternoon decision
- [ ] Sellable-scope page for Claire — promised to her *after* the Thursday cut
