# Upline Venture — Team Folio

The venture-wide planning hub: Through Line (internal comms), project planning, product strategy, and go-to-market.

**New here?** Start with [`WELCOME.md`](WELCOME.md). In Cursor, say **Welcome me — I’m [your name].**

**This repo is completely separate from [upline-poc](https://github.com/austinboardman/upline-poc).**
Nothing here writes to or deploys to the POC.

## Live site

**https://upline-throughline.vercel.app**

- **Hosting:** Vercel (Upline team)
- **GitHub:** https://github.com/ashleygitwit/upline-team-folio
- **Legacy URL:** `upline-team-folio.vercel.app` still resolves to the same project.

## Try it locally

```bash
cd "/Users/ashleyroberts/Upline Venture - Team Folio"
npm run dev
```

Open **http://localhost:5299** — Through Line uses its own port (5299), separate from other projects on 5173.

## How to update the plan (Ashley)

1. Edit `data/venture-plan.json` in Cursor (or ask the agent).
2. Run `npm run generate-plan` to refresh `project-planning/execution-plan.md`.
3. Commit and push to **this repo only**.
4. Vercel redeploys automatically (~1 min).

## Four top-level folders

```
Team Folio/
├── internal-comms/               # Through Line — presentation / internal communication
├── project-planning/             # Timeline, sprint week, execution plan
├── product/                      # Product strategy and build
├── go-to-market/                 # Sales + GTM
│
├── data/                         # venture-plan.json + learnings.json (site source of truth)
├── scripts/                      # Generators (generate-plan, sync-data)
└── assets/                       # Brand assets
```

| Folder | What it is | What it is not |
|---|---|---|
| [`internal-comms/`](internal-comms/) | Through Line — the site the team reads | The Upline product |
| [`project-planning/`](project-planning/) | When, in what order, which rooms | Product decisions |
| [`product/`](product/) | Pricing, journey, VA/shopping, MVP line | Sales decks |
| [`go-to-market/`](go-to-market/) | Demos, prospect notes, sales decks | Product strategy |

`data/` and `scripts/` stay at the root so Through Line can keep reading one JSON plan. Edit those when the live site needs new numbers; put the *thinking* in the four folders above.

## POC isolation

| Team Folio | upline-poc |
|---|---|
| This folder + its own GitHub repo | `/Users/ashleyroberts/Documents/upline-poc` |
| Own git history and remote | `github.com/austinboardman/upline-poc` |
| Agent may read POC for reference | Agent must never write/commit/push POC from this workspace |

## Brand

- Logo: `assets/upline-logo.png`
- Primary color: `#4338CA` (Upline indigo)
