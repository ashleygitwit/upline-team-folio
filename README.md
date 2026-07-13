# Upline Venture — Team Folio

The venture-wide planning hub: a live Gantt, LLM-friendly exports, and (later) a full venture home.

**This repo is completely separate from [upline-poc](https://github.com/austinboardman/upline-poc).**
Nothing here writes to or deploys to the POC.

## Live site

**https://upline-team-folio.vercel.app**

- **Hosting:** Vercel (Upline team)
- **GitHub:** https://github.com/ashleygitwit/upline-team-folio
- **Custom domain:** add in Vercel → Settings → Domains when ready (e.g. `plan.upline.com`)

## Try it locally

```bash
cd "/Users/ashleyroberts/Upline Venture - Team Folio"
npm run dev
```

Open **http://localhost:5299** — Team Folio uses its own port (5299), separate from other projects on 5173.

## How to update the plan (Ashley)

1. Edit `data/venture-plan.json` in Cursor (or ask the agent).
2. Run `npm run generate-plan` to refresh `venture/planning/execution-plan.md`.
3. Commit and push to **this repo only**.
4. Vercel redeploys automatically (~1 min).

## Page layout

1. Venture thesis
2. Mantra
3. Upcoming proof point
4. Gantt (filters by status / workstream)
5. Copy for your LLM (`execution-plan.md`)

Edit thesis, mantra, and proof point in `data/venture-plan.json` under the `venture` key.

## POC isolation

| Team Folio | upline-poc |
|---|---|
| This folder + its own GitHub repo | `/Users/ashleyroberts/Documents/upline-poc` |
| Own git history and remote | `github.com/austinboardman/upline-poc` |
| Agent may read POC for reference | Agent must never write/commit/push POC from this workspace |

## Brand

- Logo: `assets/upline-logo.png`
- Primary color: `#4338CA` (Upline indigo)

## Structure

```
Team Folio/
├── app/                    # Web app (React + Vite)
├── assets/                 # Brand assets
├── data/venture-plan.json  # Source of truth for Gantt data
├── venture/planning/       # Generated execution-plan.md
├── scripts/                # Generators
└── .cursor/rules/          # Workspace guardrails
```
