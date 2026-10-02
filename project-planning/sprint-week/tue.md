# Tuesday Sept 8 — Journeys

Strategy sprint, day 1. Product experience map walk after the GTM morning.

**Sources:** Journey-map session transcript (reviewed [Through Line `#/mvp-journey`](https://upline-throughline.vercel.app/#/mvp-journey)). No wall photos or phase capture sheets were dropped with this recording. The transcript cuts off during the client-access / brief discussion, after the room said they would remake the map on the board. Do not treat the board remake as captured.

**Room (from the week plan):** Ashley, Austin, Justin, Davie, Jacob, Douglas, Amanda. Dan is in the transcript on paradox of choice and AMS/IBAN.

---

## Headline

The strawman held as the spine — weekly 30, VA pull, agent-named email, questionnaire as the trigger, three carriers, VA shops, agent sends the recommendation. The room revised *how the train moves* (emails go unless stopped; do not dump the whole book at onboard; do not write back to the AMS) and left **close** and **how the agent gets at the data** as the unfinished stretch.

---

## GTM morning (tail only)

Only the end of the GTM block is in this recording. Capture what was said; do not reconstruct the rest of Claire’s workshop.

- Events still happen (video, legitimacy) but costed at **~$500–$1,000 per customer**. They think they can beat that.
- **Paid top-of-funnel is the swing play.** Not influencer. Paid video, hard and fast. If it converts to demos it scales; then pour gas on no-AMS and try to land **~2,000 customers**. Davie becomes the machine on this. Cold outbound continues.
- Implication: **Austin spends more time on GTM than product.** Do not pull Doug off product. The stumble is instrumentation — feed the algorithms which videos become demos, run them through LinkedIn / Meta / Google Display. Most startups take a year to stand this up; the ask is to get the machine crawling in about a month.
- Numbers said in the room: **90 demos, 30 contracts.** Video possibly live next week.
- Onboarding is a **separate conversation**. This map assumes contract signed and onboarded.

---

## How we walked

Ashley walked the existing 20-step map beginning to end rather than starting from a blank wall. Two tests on every stretch:

1. **Sold vs delivered** — number-one risk named out loud: we sell a journey, they use it, and it is not what they were sold.
2. **More with less** — where to put the eggs; let non-business-maker fires burn.

Three layers the current map does not yet show: **policyholder-facing**, **agent (Trojan horse)**, **internal / VA ops**. Rename **customer → insured / policyholder** (the agency’s customer is the consumer).

Above the line = cannot go live. Below the line = love it, can ship customer 1 without it. Black-hole features that eat 60% of the build are the failure mode.

---

## Hold / revise / drop by phase

### Set up the data (steps 1–2)

**Held**

- Agency provides access. Bare minimum is an **individual Upline login** to their AMS (not “use their login”). They also add Upline at every carrier they want shopped.
- We store credentials. We will be in the AMS at least weekly.
- Do **not** integrate with the AMS. That is the strategy: no integration conversation, no “you are replacing EZLynx” on day one, and they cannot turn off an API.

**Revised**

- Do **not** deep-map the whole book at onboard. Data goes stale; onboard would take weeks. Census/placeholders only if needed. Write the real household file when we pull **this week’s 30**.
- Access is the SLA, not a full-book dump. Example said: “If you have AMS 360, these 10 things in the first week.” Charge if they stall. We cannot start without AMS access.
- Carrier set: they may appoint ~30 (Brandon); personal lines closer to ~8; some agencies were fine with **3**. Explore the expectation in sales. MVP shops the **top three most likely**, not every appointed carrier every time.
- Shared-login agencies exist (Higinbotham / Rusty’s name on every page). 2FA is messy (SMS, 1Password tokens, one carrier required Teams + ID + Norton). Credential vault has to survive VA swap and later AI.
- AMS is priced per seat — ask for **one**.
- Do not name the user `upline@…`. Use something that looks like the agency.

**Dropped / below the line**

- Live AMS sync. Full-book extract on day one (unless the month-13 AMS-off pitch forces a later change to onboard).
- Writing structured data back into the AMS. Room aligned: **do not**. Optional compliance dump as a note is a sales talking point, not a product we want to operate. Force two systems; ours has to be the one they gravitate toward.

**Added (ops, not a journey step)**

- Kick-ass **onboarding survey**: agency carrier preferences, how they prioritize, default send vs hold, ranking philosophy. Not one-offs later.

### This week (steps 3–8)

**Held**

- Name ~30 for the week from renewals (30–45 day window said in the room). Repeatable every week.
- VA pulls the household file for those 30. Pulling is a fraction of shopping time; a person can do it. Automation is below the line (recycle last year’s EZLynx RPA if there is time).
- Upline drafts outreach. Agent reviews. Email only for MVP.
- Ready **Monday 8:00 AM** (or “ready by Monday”; do not make Monday the agency’s ritual day).

**Revised**

- Rank: pick something and roll. Rudimentary = renewal date or biggest % first. Surface and tag “MVP clients” if we define it. Justin: a short **diagnostic survey** (“how would you prioritize A / B / C”) that dictates ranking — room liked it. Do not build a fancy algorithm.
- **Emails go unless they stop them.** Monday 8:00 → send window (Tuesday 9:00 was the example) → silence means send. Never stack 90 in an inbox. Optional onboard default of “don’t send,” but the sales posture is: you are buying a moving train. If they need to approve every email forever, they may not be a customer.
- Upline sends **from the agent’s mailbox**. Microsoft first; Google is growing. Individual sends (Pipedrive-style), not a blast from `outreach@upline…`. Phishing/spam look is the fear.
- Text / “just dropped your email” is later. Data-hygiene benefit we *can* claim: we get an email and a phone every time.

**Dropped / below the line**

- SMS / omnichannel.
- Headless-browser pull as a launch requirement.
- Batch-approve chrome if the timeout default-send solves the pile-up.

### Intake (steps 9–10)

**Held**

- Filling out the **questionnaire is the trigger**. Not “reply,” not “book a call,” not a separate “yes, shop me” in the email.

**Revised**

- Questionnaire to everyone. What it *asks* and how the email is framed can change.
- Do not shop-ask the same way every time. Frame by increase **and** account complexion. Small increase / decrease → “I probably would not shop; happy to if you want” (inspection risk, deductibles, coverages). Material increase → shop. Premium going *down* is a chance to raise coverages / drop deductibles.
- Agency does not get one-off customization. They get options / a **$ and % threshold**, or they let Upline decide.
- Incentive warning: a flat base fee incents us to ask everyone to shop. If we sold “AI runs this and only does what is best for the book,” we should be incented to *not* shop when it is dumb. Pricing and shop logic have to match that story over time.

### Shop & recommend (steps 11–19)

**Held**

- Upline picks **three** carriers (current + three options). Fit rules knock people out (teen driver, claims, dog, trampoline, roof). VA does not choose.
- Shop ticket → VA claims → shops those portals → **uploads the three carrier PDFs**. Upline parses, locks the pick, drafts the rec. PDF upload is also the QA hook (wood stove missed, deductible twice as high).
- Agent **must** review the recommendation. This one does **not** auto-send. AI cannot be the one advising the insured.
- Rec comes from the agent’s mailbox.

**Revised**

- Language: **we have access to the markets**; we used judgment. Do not say we shopped 30 if we shopped 3. Paradox of choice / doctor prescription: the insured wants an expert, not a pile. Show *why we rolled someone out* (“pit bull”) rather than fake receipts.
- “Best carrier first,” not cheapest. Agency preference and contingency (need $100k more Donegal) belong in the onboard survey. Future: carriers pay to be in the default three. **Contract should say we can shop where we choose** so a Nationwide deal does not require going back to every agency.
- Insured-facing **landing page** for the proposal (Jolene: do not cram the comparison into the email). Custom HTML, not a jargon PDF. Room treated this as in, even though the printed strawman did not show it.
- VA kit / same shopping method / ticketing is easy to overlook and required to keep the **24-hour** sales promise from being a lie.

**Dropped / below the line**

- Shop every appointed carrier.
- Own rater / multi-rater API as a launch requirement (interesting; not required to go live).
- Calendly + recording the close call.

### Close (step 20) — still the open stretch

The strawman left this undecided. The room talked a lot and did **not** lock a single path before the recording cut off.

**Leaning**

- Phone stays in the process. Majority of agent–insured conversations are still phone, not Zoom.
- For MVP, **reply to this email** to book time — warm, from the agent’s inbox. Calendly without recording is not worth it. Recording is below the line for Nov 6.
- Dual desire: some insureds will just want to **click approve** (“$500 cheaper, same coverage, switch me”). That is how the world should work. It is also the fall-off: they think they bought, the agent deletes the email, nobody binds, there is a claim.
- Approve, if it exists, means **pending**. Upline notifies the agency: they want this; quote is sitting at Nationwide; you close paperwork / bank / DocuSign. We midwife. We do not bind.
- Need a **close-the-loop surface** so “needs binding” cannot vanish: Kanban (emails to send / QQ in progress / proposal ready / needs binding) or a dashboard tile. Stuck until the agent marks their part done. Otherwise we cannot tell a true retention number (Ashley already does this by going back into EZLynx).
- IBAN will download a new policy if they actually bind. It will **not** notify anyone that they did not.

**Not decided in this transcript**

- Keep click-approve in MVP, kill it and phone-only, or “select this / we will be in touch — this is not bound.”
- Whether the landing page *is* the Upline close (proposal sent = we are done in-product) or we stay in the loop through bind.

---

## Flagships to sketch Wednesday

Named because the room kept returning to them as the wow / the sales slide / the thing that cannot be half-built:

1. **Login dopamine** — the first screen feels like an AI system already working. Leading metrics (touched, opened, questionnaire in) and lagging (shopped, retained, cross-sold, referred). “While you were out selling, here is what we did to the book.” This is the first slide in the deck. May be MVP.
2. **Client brief** — type the name, get the one-pager (file + questionnaire + recommendation) and/or a chat that talks like Cursor on top of that file. Not 17 AMS screens. CRM for this workflow, not an AMS.
3. **Insured proposal page** — beautiful, specific to that household, expert pick + why we did not shop X. Email is the invitation; the page is the brief.
4. **Default-on week** — ranked 30, drafts written, emails go Tuesday unless they intervene. The train moves.
5. **Needs-binding loop** — whatever close we keep, the agency can see who still owes a human action.

---

## Risk we cannot ignore

**Sold ≠ delivered** was named #1 at the open.

The close of the walk added a second that can kill us in production: **false purchase** — insured clicked approve (or thinks they did), agent never bound, claim happens, they blame Upline.

A third that is operational, not UX: **no AMS access, no product.** Credentialing is the key to the kingdom.

---

## Unknowns (do not solve in the sketch; name them)

| Unknown | Why it is still open |
| --- | --- |
| Official launch date | Nov 6 is tentative; lock Friday |
| Rank rule | Date vs % vs “MVP client” vs onboard survey |
| Who we offer to shop | Threshold vs Upline-decides vs shop-ask everyone |
| Click-approve in MVP | Wanted and dangerous |
| Chat vs profile vs both | Ashley leans both; Jacob leans chat-on-data so we do not rebuild SaaS |
| Dashboard above the line? | Strong pull; not cut |
| Write-back as a sales checkbox | Built for the conversation, rarely used? |
| Whose name is on the logins | Davie vs agency-looking user vs shared-login shops |
| Microsoft + Google send | Both needed; volume vs deliverability |
| How we measure retention | Must pull AMS (or later IBAN) — approve ≠ retained |
| Two-system objection | How many owners refuse a second source of truth |
| 24-hour shop | Sales deck already says it; VA system is not designed |

---

## What sales can say / must not promise

**Can say (if we build what we just walked)**

- Give us access and the week runs. Emails come from you.
- Questionnaire is the ask. We shop the right three, not a junk drawer.
- You keep the last word on the recommendation.
- We will get you a real email and phone. Your bad data starts to go away.
- We have access to your markets; we use judgment. Best carrier, not just cheapest.

**Do not promise**

- We shopped all 30 carriers (unless we did).
- Click approve = you are bound.
- We replaced your AMS / we write everything back into EZLynx.
- Calendly + recorded meetings + Upline binds.
- 24-hour shop if the VA kit is not real.
- Text / omnichannel in the first ship.

**Risky assumption to document:** agency owners will tolerate two systems (AMS + Upline) while we make ours the one they actually open.

---

## After the map (AMS chess — said, not a Tuesday build)

- IBAN is the switch. One AMS per agency. The day they point IBAN at us, we are the system of record. Hardest part is getting them to say they do not need the old one, not the integration itself.
- Do not come out as “we are an AMS.” Category move: there is no need for an AMS. Chat on trusted workflow data. Feature-parity trap if we accept the AMS frame.
- Month-13 “turn it off” messaging will get out. Be ready for the war conversation. Login should not say Upline.
- Dual-book problem: after ~120 households we have a better file than the AMS for those people and nothing for the rest. One move: by month 3 the experience is so easy they do not want to wait a year — then pull the rest.

---

## Gaps in this capture

- No photos of the wall or the remade board.
- Transcript ends mid-thought on chat vs repeating the same questions.
- GTM workshop (ICP, full sales journey, deck critique) is not in this file except the paid-TOF tail.
- “What we sketch tomorrow” was not formally closed on the recording. Flagships above are inferred from what the room would not drop — mark them if the wall said something different.
