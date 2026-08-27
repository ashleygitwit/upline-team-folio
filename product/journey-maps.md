# Journey maps

Four maps, four jobs. Do not collapse them.

| Map | Job | Where it lives visually |
|-----|-----|-------------------------|
| [High-level / 4-beat](#high-level--4-beat) | How we talk about the product | Sales demo + Through Line home |
| [POC / Members 1st](#poc--members-1st) | How the pilot actually ran | Through Line `#/poc` |
| [MVP](#mvp--layered-strawman) | What we bring into sprint week | Through Line `#/mvp-journey` |
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

## MVP — layered strawman

What we take into sprint week. 20 steps. Layers on the Through Line map: experience, UX, data written, operational logic, agent value, functionality.

**Actors:** Upline · VA · Agent · Customer  
**Phases:** Set up the data · This week · Intake · Shop & recommend · Close

| # | Step | Lane | Essence |
|---|------|------|---------|
| 1 | Provide access | Agent | One sitting: EZLynx login, full renewal export, email CSV, ~7–30 carrier portal logins |
| 2 | Map the book | Upline | Census. Date every household. Assign a week ≥ ~20 days before renewal. Not a Coverage Review file. |
| 3 | Serve this week's 30 | Upline | ~30/week off the year map. Cap ~30. Overflow slides. |
| 4 | Pull household data | VA | Deep-pull this week’s 30 in EZLynx (History, FPD, docs, notes) |
| 5 | Prioritize the batch | Upline | Rank after the pull: increases first, then flat, then decrease |
| 6 | Draft outreach | Upline | Frame by % change. Cross-sell every email. Gap-only QQ attached. |
| 7 | Review the week | Agent | Ranked 30 + drafts. Edit or hold. Does not send yet. |
| 8 | Send outreach | Agent | Send in Upline from the agent mailbox |
| 9 | Read the email | Customer | Sees their agent only |
| 10 | Questionnaire | Customer | Pre-filled gaps. Shop opt-in. |
| 11 | Pick carriers | Upline | Always 3, from the appointed set |
| 12 | Create shop ticket | Upline | Ticket on shop-yes + locked 3-carrier list |
| 13 | Pull the ticket | VA | Claim. Lock the household. |
| 14 | Shop | VA | Those 3 portals only. ~30–45 min. **A person at launch.** |
| 15 | Attach quote PDFs | VA | PDFs on the ticket trigger the next step |
| 16 | Read the quotes | Upline | Parse, compare, lock pick + rationale |
| 17 | Generate recommendation | Upline | Agent readout + draft email |
| 18 | Review recommendation | Agent | Can swap the pick or edit copy |
| 19 | Send recommendation | Agent | From the agent mailbox, in Upline |
| 20 | Close | Customer | **Open.** Members 1st asked for times; agent closed on the phone. Do not fake this on the map. |

Email framing locked in this draft: >10% → shop · <10% → discounts · flat/down → good news. Cross-sell: <65 life · ≥65 Medicare/Medicaid · missing home or auto → the missing line.

Open forks for the room: year-map “this week’s 30” vs a 60-day pull-and-rank; how close works.

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

| | POC | MVP strawman | Ideal | 4-beat |
|---|-----|--------------|-------|--------|
| Steps | 7 | 20 | 10 | 4 |
| Onboard | Manual EZLynx | CSV + report + portal logins | RPA bulk | “Pulls from AMS” |
| Shopping | Austin / Upline | VA, 3 carriers Upline picked | VA team | Optional $18 |
| Send | Agent inbox | Agent **in Upline** | Upline on their behalf | Agent reviews / sends |
| Close | Agent phone | TBD | Calendly + Upline meeting | Agent closes |
| VA visible? | Folded into Upline | Own lane | Own lane | “We can shop” |

---

## Sources

Through Line journey pages and `mvpJourney.ts`. `product-journey.html`. Aug 24 sales demo. Journey-map working sessions (Jul–Aug 2026).
