# Upline — Coverage Review demo

A clickable, believable demo of the Upline agent experience for **waitlist demo calls**.
It mirrors how the Members 1st pilot actually runs today (renewal queue → client review →
outreach → customer questionnaire → responses → carrier shopping → recommendation → the call),
dressed in the current Upline brand.

> This is **not** the real product UI. It's canned, happy-path, and built to be screen-shared
> on an hour-long demo call. The real UX/UI comes out of the September strategy sprint.

## Run it

```bash
cd agent-demo
npm install
npm run dev
```

Then open the printed local URL (defaults to `http://localhost:5173`).

## Presenting

- Use the **step pills** at the bottom to jump around, or **Next / Back** (also `←` / `→` keys).
- The scenes:
  1. **Queue** — renewals ranked by increase; Corey floats to the top.
  2. **Client** — Corey's 360 view + Upline's suggested action.
  3. **Outreach** — the Members 1st boilerplate email, auto-filled.
  4. **Questionnaire** — the customer's view (Members 1st branded; Upline stays hidden).
  5. **Responses** — answers land on the card; what changed is highlighted.
  6. **Shopping** — carriers compared, coverage-matched; Travelers recommended.
  7. **Recommendation** — short client email; detail kept for the call.
  8. **Outcome** — the payoff + the one-line pitch.

## Notes

- Sample client is **Corey A. Criswell** (synthetic, carried over from the original concept demo).
- All numbers are illustrative for the narrative.
- Brand tokens mirror the live brand system (`upline-throughline.vercel.app/#/brand`):
  indigo `#3721a6`, lime `#f5ffb7`, Fraunces / DM Sans / DM Mono.
- Content is grounded in the real pilot artifacts (outreach boilerplate, questionnaire,
  recommendation-email shape) from the Upline POC.

Built with Vite + React + TypeScript. No backend — everything is local canned data in `src/data.ts`.
