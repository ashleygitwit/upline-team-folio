# Product standup board

Living board for the twice-weekly product standup (Tue and Thu mornings).

**Core:** Ashley (PM), Doug (eng), Amanda (design).
**Optional:** Davy (sales), JV (CEO).
**Last session:** Tue Sep 29, 2026 · Ashley, Amanda, Austin, Doug · v3 prototype review ahead of the Stockton Hill demo
**Transcripts:** [sessions](README.md)

If you are in Claude: this file is the board. Ask “what’s open from product standup?” or “what shipped this week?”

---

## Blockers

- **Stockton Hill demo is tomorrow (Wed Sep 30).** v3 is live on the throughline with real data and no `noindex` yet. Amanda is anonymizing and adding `robots.txt` / noindex before the demo.

---

## Open

- [ ] **Amanda** — Before Stockton Hill tomorrow: anonymize prototype data; add `robots.txt` / noindex on the throughline
- [ ] **Amanda** — v3 pass: email review opens directly (not drawer, then another click); homepage collapses to “actions required this week” + snooze, with scheduled tasks as a separate background section; chip/tag for cross-sell and for questionnaire data updates; Kanban toggle on the policyholder list (list stays the default)
- [ ] **Ashley** — Drop v3 screens into Figma, share the link in the team channel, add sticky-note feedback
- [ ] **Austin / Doug** — Notes on Ashley’s Figma (comments beat a Loom; Loom is fine as a backup)
- [ ] **Open** — Where an “update this in EZLynx” action lives when we are not shopping and there is no cross-sell. It currently disappears after the email sends.
- [ ] **Open** — No questionnaire returned: is a phone call the agent’s task, and is that an agency setting?
- [ ] **Davy** — Deep-dive Austin’s top five onlinejobs.ph VA candidates; answer today. Other contact searches in parallel
- [ ] **Austin + Ashley** — Journey map / ops by **Thursday**: VA vs RPA. What VAs do (carrier data entry) vs AMS extract vs LLM into a database
- [ ] **Austin** — Today: record Stockton Hill walking three carriers and quoting preferences
- [ ] **Ashley / Austin** — Loom the next shops (narrate). Folder of videos = VA onboarding. First VA task can be “watch and write the SOP”
- [ ] **Ashley** — Clickable happy-path demo by Oct 1 (OKR 4.3); coordinate flyer/wire timing with Amanda (Thu/Fri possible)
- [ ] **Doug** — Onboarding / quoting-preference admin: who we quote this quarter, rank 1–4, never re-shop Auto-Owners. Codify so VAs are not re-trained on every appetite email
- [ ] **Doug** — Finish testing auth; Kanban after auth ships
- [ ] **Doug** — Send Linear Claude prompt + protocols to Ashley and Amanda
- [ ] **Amanda** — Send design hub email (link + feedback form). Product UI pages coming. Sunday hub updates
- [ ] **Amanda** — Investor deck this week (Justin); website with Claire; stagger Ashley flyers
- [ ] **JV** — Follow-up today with Members First engineer on EZLynx-bypass data warehouse + morning carrier RPA. Get the build diary
- [ ] **Ashley** — Finish Through Line updates from sprint-week decisions
- [ ] **Ashley** — After wireframes: turn outreach into a workflow for the third pilot

---

## Shipped this week

- [x] **Amanda** — v3 prototype published to the throughline (shopping results, drawer, recent activity, policyholder table). Not anonymized yet.
- [x] **Austin** — Meta ads live since Friday; conversion tracking into Google/Facebook; website forms → HubSpot deals
- [x] **Leander** — Calendly demo form pared to name + email (company optional)
- [x] **Amanda** — Design hub updated, noindex, prototype stripped (business content lives on Through Line)
- [x] **Ashley** — Q4 OKRs on Through Line (verbatim from Sep 17 PDF)
- [x] **Ashley** — Stockton Hill kickoff (Fri Sep 18)

---

## Tue Sep 29 recap

| | Since last | Today / next | Blockers |
|---|---|---|---|
| **Amanda** | Pushed v3 to the throughline herself | Anonymize + noindex before tomorrow’s demo; collapse homepage; chips; Kanban toggle; email review opens directly | Live prototype still has real data |
| **Ashley** | — | Figma of the v3 screens + sticky notes; write down the shop / cross-sell / data-only paths | None |
| **Austin** | — | Comments on Ashley’s Figma | Closing workflow is most of the work and the card hides it |
| **Doug** | — | Notes on the Figma if he has them | None |

Full notes: [2026-09-29-product-standup.md](2026-09-29-product-standup.md)

---

## Tue Sep 22 recap

| | Yesterday / since last | Today | Blockers |
|---|---|---|---|
| **Austin** | Meta live, Google launched (0 impressions), HubSpot deals from forms | Stockton Hill 3-carrier recording; VA vs RPA clarity by Thursday | 0 demo conversions; Meta form auto-scroll looks fake |
| **Davy** | Warm list, deck rewrite, VA resume skim | VA top-five answer; LinkedIn + $149 PR; Looms for VA training | Still not emailing from last week’s outage |
| **Ashley** | OKRs, Stockton Hill, demo/wires | Journey map with Austin; record shops; flyer timing with Amanda | None |
| **Amanda** | Design hub pass, investor-deck test | Hub email; investor deck; website with Claire later in the week | Website + flyers landing at the same time — staggering |
| **JV** | Investor group teased Friday | Investor Sunday; Members First EZLynx-bypass follow-up this afternoon | Left for another meeting |

---

## Carry-forward

- **From Sep 29.** Policyholder landing page is out of MVP (fast-follow). Shopping summary stays bullets. Shopping on/off is an agency setting (Stockton Hill: no shop on Auto-Owners); the questionnaire still goes to everyone. Homepage is one “actions required this week” list with snooze, plus a scheduled section. Kanban is a view on the policyholder list, not the default. Cross-sell with no shop is an immediate action; snooze if it belongs to a sales team. “Closed” must not mean “recommendation email sent.”
- Demos lead with the magic moments and the primary workspace.
- Insured outreach: no Upline branding — looks like the agent hit Compose.
- Stockton Hill A/B: every five people → two boilerplate, two logic, one no-increase / decrease.
- AMS reports are not standard. Stockton Hill did not have Members First’s renewal report.
- Stockton Hill runs its own renewal campaigns — outreach copy has to dodge that.
- Stockton Hill: never re-shop Auto-Owners (contingency / loss ratio). Could change next quarter.
- Linear: deployed ≠ released. Feature flags sit in Deployed until product turns them on.
- Skills = one-shot. Workflows = sequenced skills that depend on each other.
- Agency-specific outreach logic belongs in an open spec.
- VAs are hammer-and-nails in carrier portals. Upline → carrier → Upline handoff is ours, not theirs.
- Shopping authority stays with Upline.

---

## Parking lot

- Policyholder landing page — fast-follow after the core review-and-send experience. Ashley wants it first; Austin and Doug put it below the line for MVP.
- Chat / business-insights modal — conversational placeholder only. Not MVP.
- Pre-launch pass on which email fields are actually editable (subject line, questionnaire link) and how that is signaled.
- Post-MVP: “raider-style” round-one email with numbers already in hand (Davy’s design-partner agent).
- Agency Zoom / CRM sync — agents will ask; need talking points for “do you integrate?” not just yes/no.
- Chrome plugin to record VA shopping sessions (screen + mouse) so we can automate later.
- AOS-style AMS import: admin button opens a side panel and drives the browser.
- Designed HTML for Upline-to-agent mail. Insured-facing stays unbranded.
- Appetite guide: pull carrier PDFs, stoplight green/yellow/red (Risk Advisor pattern). We give agencies insight rather than them pushing every update at us.
- Guided VA quoting portal (agency + carrier + producer code + “do this next”) — more error-proof than Looms at 40 carriers.
- Members First engineer: data warehouse + morning RPA may bypass EZLynx for commissions/downloads. Not retention. Watch the build diary.
