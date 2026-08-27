# MVP

**Goal:** Ship the first sellable front-end experience the agent actually touches — review and send — with some steps still manual (VAs shopping) behind the scenes. First paying customer around **Nov 6**.

Build window on Through Line: **Sep 14 through Nov 6**, coming out of sprint week, in tandem with Stockton Hill. Feature cards on the site are still placeholders. The working strawman is the layered journey — [`journey-maps.md`](journey-maps.md).

POC `mvp-scope.md` is still an empty template. Use this file + the journey map until sprint week writes a real spec.

---

## What “MVP” means here

Not “every step automated.” The agent-facing week has to be real. Shopping can stay a person. Onboard can be CSV + renewal report + portal logins (Path 2), not a live AMS sync.

If the bet is wrong, sprint week changes the bet. If the experience does not serve the bet, sprint week changes the experience. The spec is written the week after, not during. See [`../project-planning/2026-09-08-strategy-sprint.md`](../project-planning/2026-09-08-strategy-sprint.md).

---

## Above the line (working)

- Agency gives access in one sitting (AMS login, renewal export, contacts, carrier portals)
- Book dated into weeks; ~30 households served each week
- VA deep-pull on that week
- Drafted outreach the agent reviews and sends **in Upline**
- Questionnaire in; shop ticket out
- VA shops the three carriers Upline picked
- Recommendation the agent reviews and sends
- Close: **undecided** — do not invent Calendly or an Upline-led meeting unless the room holds that

## On ice (unless sprint week pulls them forward)

- Live AMS / EZLynx API sync
- Auto-shopping
- Upline-run close meeting
- AMS replacement as the open
- Life as the price lead

---

## Run-cost (not price)

One ~1,500-household agency, ongoing time + tools, not engineering:

- VA shopping ~$190/mo + light refresh ~$65/mo
- RPA ~$20–100/mo
- Close $0 to Upline
- **~$350–430 / month**

Price we charge is [`pricing.md`](pricing.md). How the people work is [`va-and-shopping.md`](va-and-shopping.md).

---

## Data we expect to hold by the end of a week

Book of business → household profile, and on each profile:

- **Client details** — contacts, policies, decs, multi-year premium, latest renewal + % change, carrier, claims, gaps, cross-sell interest
- **Communications** — outreach, replies, questionnaire answers, calls/meetings, texts
- **Past outreach logic** — which frame, when, cadence, follow-ups, cross-sell offers
- **Responses & sentiment** — rates, type, sentiment, outcome (shopped / switched / retained / cross-sold)

Not framed as an AMS replacement now. Over 12–24 months the repository can become more current than the agency’s AMS. How much of this lands in the first ship is a sprint-week call.

---

## Outcome

Build has not started. Outcome TBD. The outcome we want: a first commercial customer live on the product around Nov 6.

---

## Sources

Through Line `#/mvp` and `#/mvp-journey`. Aug 24 How Should We. Members 1st learnings (promoted, not copied).
