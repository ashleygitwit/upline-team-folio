# Upline Venture — Team Folio

The venture-wide planning hub: a live Gantt, LLM-friendly exports, and (later) a full venture home.

**This repo is completely separate from [upline-poc](https://github.com/austinboardman/upline-poc).**
Nothing here writes to or deploys to the POC.

## Live site

- **Hosting:** Vercel (free tier)
- **URL (v1):** TBD — starts as `*.vercel.app`, custom domain added when ready
- **Custom domain goal:** something like `plan.upline.com` or a domain you register (see below)

## Try it locally

```bash
cd "/Users/ashleyroberts/Upline Venture - Team Folio"
npm run dev
```

Open **http://localhost:5299** — Team Folio uses its own port (5299), separate from other projects on 5173.

1. Edit `data/venture-plan.json` in Cursor (or ask the agent).
2. Run `npm run generate-plan` (Phase 2+) to refresh `venture/planning/execution-plan.md`.
3. Commit and push to **this repo only**.
4. Vercel redeploys automatically.

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
├── venture/planning/       # Generated execution-plan.md (Phase 2)
├── scripts/                # Generators
└── .cursor/rules/          # Workspace guardrails
```
