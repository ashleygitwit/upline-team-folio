# Internal comms — Through Line

This folder is **The Through Line**, Upline's internal presentation and communication layer.

It is **not** the Upline product. The product lives in [upline-poc](https://github.com/austinboardman/upline-poc). This site is how the team sees thesis, learnings, roadmap, sprint week, the journey map, brand, and team.

**Live:** https://upline-throughline.vercel.app  
**Local:** http://localhost:5299 (from the repo root: `npm run dev`)

## What belongs here

- The React + Vite site (`src/pages/`, `src/components/`, `src/brand.css`)
- Visual / communication work: layout, copy on the site, brand page, team page
- Amanda's style pass and any later design work on Through Line

## What does *not* belong here

- Product decisions (pricing model, journey narrative, VA/shopping, MVP line) → [`../product/`](../product/)
- Timeline and room plans (sprint week, how-should-we) → [`../project-planning/`](../project-planning/)
- Sales decks and prospect demos → [`../go-to-market/`](../go-to-market/)

The site can *show* those things. The durable reference copy lives in the folders above so someone can open a `.md` without reverse-engineering a page.

## Pages (hash routes)

`#/` What is Upline · `#/learnings` · `#/roadmap` · `#/poc` · `#/sprint` · `#/mvp` · `#/mvp-journey` · `#/scale` · `#/brand` · `#/team`

## How the site gets its data

| Source | Role |
|--------|------|
| [`../data/venture-plan.json`](../data/venture-plan.json) | Thesis, mantra, proof point, Gantt tasks |
| [`../data/learnings.json`](../data/learnings.json) | Learnings shown on the site |
| [`../project-planning/execution-plan.md`](../project-planning/execution-plan.md) | Generated LLM-friendly plan export |

Edit the JSON under `data/`, then run `npm run generate-plan` / `npm run sync-data` from the repo root.

## First-time setup

See [`../through-line-setup.md`](../through-line-setup.md) if you are cloning this repo to work on Through Line.
