# Journey maps

Four maps, four jobs. Do not collapse them.

| Map | Job | Where it lives visually |
|-----|-----|-------------------------|
| [High-level / 4-beat](#high-level--4-beat) | How we talk about the product | Sales demo + Through Line home |
| [POC / Members 1st](#poc--members-1st) | How the pilot actually ran | Through Line `#/poc` |
| [MVP](#mvp--after-the-tuesday-walk) | After the Sept 8 product-room walk | Through Line `#/mvp-journey` |
| [Ideal / end-state](#ideal--end-state) | North star if RPA and close are ours | `internal-comms/public/product-journey.html` |

Through Line is the picture. This file is the words.

---

## High-level / 4-beat

The sales and “what is Upline” story. Four products, not twenty steps.

1. **Prioritized outreach** — who this week, in the agent’s voice
2. **Household questionnaire** — gaps only, plus the next line of coverage
3. **Shopping** — the agency, their VAs, or Upline at $18
4. **Recommendation** — winner, why, draft email; the agent closes

Home-page glance (same idea, more actors):

| Phase | What happens |
|-------|----------------|
| Set up the data | Pull the book + renewals. Refresh household data before outreach. |
| Reach out & intake | Generate outreach. Agent sends from their name. Customer completes the questionnaire. |
| Shop & recommend | Shop carriers. Draft the recommendation. Agent reviews and sends. |
| Review & close | Customer schedules, meets, decides. |

One-liner: Upline handles prep, outreach, shopping, and follow-through. The agent shows up, builds trust, and closes.

Outreach alone is a win even if nobody completes a questionnaire. Shopping is optional.

---

## POC / Members 1st

Manual “product as a service.” No separate VA lane — Austin / Upline shopped. Cadence: Mon · Wed · Fri, ~30 min, ~15 households/week, **5 reviewed per session**. Jun 17 – Aug 3 retro.

| Phase | Step | Who | What actually happened |
|-------|------|-----|------------------------|
| Prep · week before | Pull renewals; build Client 360 for ~15 | Upline | EZLynx Retention / History. Deep-pull per household. Screenshots and PDFs. No API. |
| Outreach & intake | Draft the batch | Upline | Drafts evolved v1→v8, then collapsed to Jolene boilerplate. New price only — no % increase shown. |
| | Review ~5 and send | Agent | Light edits. Sends from their inbox. |
| | ~3-min household questionnaire | Client | Gap-only. Cross-sell on the form. |
| Shop & propose | Shop; write the recommendation | Upline | ~30–45 min in portals. Carrier PDFs. Draft rec email. |
| | Review, edit, send the proposal | Agent | Agent owns tone. ~30 min phone close when the client responds. |
| | Receive the proposal | Client | Asked for meeting times. Agent closed on the phone. |

**Locked funnel:** 48 on the sheet → 42 emailed → **18 QQ (43%)** → 18 recs → **7 switched · 5 stayed · 6 pending**.

Rules we learned in this run: rank biggest jumps first; 10%+ gets shop framing; never show the increase % in outreach; follow-up phone stays in-house.

Proved: agent trust, questionnaire engagement, shopping saves the agent time. Did not prove: automated onboard, a VA team, a productized send path.

---

## MVP — after the Tuesday walk

What the product room held and revised on Sept 8. 22 steps. Layers on the Through Line map: experience, data written, operational logic.

**Actors:** Upline · VA · Agent · Insured  
**Phases:** Set up the data · This week · Intake · Shop & recommend · Close  
**Always-on (not steps):** business dashboard · client brief

| # | Step | Lane | Essence |
|---|------|------|---------|
| 1 | Provide access | Agent | Individual Upline AMS login (one seat, not named upline) + carrier logins they want shopped. Access SLA. No full-book dump required. |
| 2 | Date the book | Upline | Light placeholders only. Do not deep-pull the book at onboard. |
| 3 | Name this week's 30 | Upline | Weekly pull, 30–45 day window. Ready Monday 8:00. |
| 4 | Pull household data | VA | Deep-pull this week’s 30. This is when the real file is written. Person at launch. |
| 5 | Rank the 30 | Upline | Simple table: date or %. Tag MVP clients. No algorithm. |
| 6 | Draft outreach | Upline | Questionnaire to everyone. Frame by increase + complexion. Email only. |
| 7 | Hold or it sends | Agent | Intervene or the week goes out. Never stacks to 90. |
| 8 | Send outreach | Agent | Upline sends from the agent mailbox. Individual sends, not an Upline domain. |
| 9 | Read the email | Insured | Sees their agent only |
| 10 | Questionnaire | Insured | Filling it out is the trigger. No separate “yes, shop me.” |
| 11 | Pick carriers | Upline | Always 3. Best carrier first. “We have access to your markets.” Do not say we shopped 30. |
| 12 | Create shop ticket | Upline | Ticket from the completed questionnaire + locked 3 |
| 13 | Pull the ticket | VA | Claim. Lock the household. Same kit every time. |
| 14 | Shop | VA | Those 3 portals only. **A person at launch.** |
| 15 | Attach quote PDFs | VA | PDFs trigger the rec — and QA |
| 16 | Read the quotes | Upline | Parse, compare, lock pick + why we rolled others out |
| 17 | Generate recommendation | Upline | Agent readout + draft email + **insured landing page** |
| 18 | Review recommendation | Agent | Can swap the pick or edit copy. **Does not auto-send.** |
| 19 | Send recommendation | Agent | From the agent mailbox, link to the landing page |
| 20 | Insured responds | Insured | Reply to talk. Click-approve, if it exists, is pending — not bound. Calendly below the line. |
| 21 | Needs binding | Agent | Stuck until the agent marks done. We do not bind. We do not write back to the AMS. |
| 22 | Verify renewal | Upline | Pull the AMS. Approve ≠ retention. |

Email framing: material increase → shop · small / good position → I probably would not shop · down → coverages / deductibles. Cross-sell still sits in every email.

Still open: click-approve in MVP vs phone-only.

---

## Ideal / end-state

July 15 north star. Heavier RPA. Upline more present in the close. VAs are a stepping stone, not the product.

| # | Step | Who | Assumption |
|---|------|-----|------------|
| 1 | AMS data upload | Upline (RPA) | One-time bulk pull. ~80–90% accurate. Not a live sync. |
| 2 | Pull renewal numbers | Upline (RPA) | Weekly portal sweeps 75–90 days out |
| 3 | Refresh household data | VA | Rolling, about every two weeks |
| 4 | Generate outreach | Upline | Everyone ≥ ~20 days out. Rank by increase. |
| 5 | Send outreach | Upline + Agent | From the agent’s name |
| 6 | Questionnaire | Customer | Gap-only |
| 7 | Shop | VA | Team of 3–5. ~24 hr. |
| 8 | Recommendation & review | Upline + Agent | Agent has final say |
| 9 | Client schedules | Upline + Customer | Calendly. Non-schedulers re-enter cadence. |
| 10 | Meeting & close | Upline + Agent | Upline runs the meeting, transcribes, drafts paperwork. Agent attaches signature. |

Cost sketch on this map (1,500-household agency): VA shopping ~$190/mo · refresh ~$65/mo (→ $0 if RPA) · RPA ~$20–100/mo · close $0 to Upline. Total **~$350–430 / month**. Same numbers sit on the Through Line MVP page as run-cost, not as a price.

Steps 9–10 (Calendly + Upline-led close) are the first things to cut if the room holds the Members 1st phone close.

---

## How they differ

| | POC | MVP (Tue Sept 8) | Ideal | 4-beat |
|---|-----|--------------|-------|--------|
| Steps | 7 | 22 | 10 | 4 |
| Onboard | Manual EZLynx | Access SLA + light date. No full-book dump. | RPA bulk | “Pulls from AMS” |
| Shopping | Austin / Upline | VA, 3 carriers Upline picked | VA team | Optional $18 |
| Send | Agent inbox | Upline from the agent mailbox unless they hold | Upline on their behalf | Agent reviews / sends |
| Close | Agent phone | Reply to talk; needs-binding; verify in AMS | Calendly + Upline meeting | Agent closes |
| VA visible? | Folded into Upline | Own lane | Own lane | “We can shop” |

---

## Sources

Through Line journey pages and `mvpJourney.ts`. `product-journey.html`. Aug 24 sales demo. Journey-map working sessions (Jul–Aug 2026). Tuesday Sept 8 product-room walk — [`../project-planning/sprint-week/tue.md`](../project-planning/sprint-week/tue.md).
