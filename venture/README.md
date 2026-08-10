# Venture strategy

Venture / product strategy for Upline — the durable thinking that shapes the Folio site and roadmap.

This is one of the two primary content folders in Team Folio (alongside [`../go-to-market/`](../go-to-market/)).

## What belongs here

- Planning narratives and execution-plan markdown (`planning/`)
- Strategy docs, thesis notes, and other venture-level product thinking as they show up

## How this relates to the live site

The React app stays at the repo root (`../app/`) so Vercel deploy paths stay simple. The **content** it renders lives in:

| Source | Role |
|--------|------|
| [`../data/venture-plan.json`](../data/venture-plan.json) | Thesis, mantra, proof point, Gantt tasks |
| [`../data/learnings.json`](../data/learnings.json) | Learnings shown on the Folio site |
| [`planning/execution-plan.md`](planning/execution-plan.md) | Generated LLM-friendly plan export |

Edit the JSON under `data/`, then run `npm run generate-plan` / `npm run sync-data` from the repo root.

## What does *not* belong here

- Sales demos, prospect transcripts, pitch materials → [`../go-to-market/`](../go-to-market/)
- Pilot design-customer learnings → separate [upline-poc](https://github.com/austinboardman/upline-poc) repo
