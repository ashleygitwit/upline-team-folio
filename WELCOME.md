# Welcome to Team Folio

You have access to Upline’s **venture home** — the place we keep the thinking, the plan, and the site the team reads.

This is not the Upline product. The product repo is separate (`upline-poc`). You do not need it to work here.

Open a Cursor chat in this repo and say:

> **Welcome me — I’m [your name].**

The agent will greet you by name and walk this file with you. You can also just read it.

---

## What this repo is for

Four kinds of work live here:

1. **Internal comms** — [Through Line](https://upline-throughline.vercel.app), the site. Thesis, learnings, roadmap, brand, team. How the venture looks when we show it to ourselves.
2. **Project planning** — when things happen, in what order, which rooms. Sprint week. Weekly How Should We.
3. **Product** — what we believe and what we are building toward. Pricing, journey maps, VA/shopping, MVP line.
4. **Go-to-market** — sales demos, prospect notes, pitch decks.

Ashley has been doing a lot of this in conversation with Cursor. The `.md` files in those folders are the durable copy so you do not have to reverse-engineer a chat or a React page.

---

## Lay of the land

```
Team Folio/
├── WELCOME.md                    ← you are here
├── internal-comms/               Through Line (the site) — not “the Upline app”
├── project-planning/             Timeline, sprint week, How Should We
├── product/                      Pricing, journeys, VA/shopping, MVP
├── go-to-market/                 Sales demos, pitch decks, prospect notes
├── data/                         Numbers the site reads (leave unless you mean to)
└── through-line-setup.md         How to run Through Line locally
```

| If you are here to… | Start here | Then |
|---------------------|------------|------|
| Design / brand / the look of Through Line | Live site, especially `#/brand` | `internal-comms/` and [`through-line-setup.md`](through-line-setup.md) |
| Understand the product | [`product/README.md`](product/README.md) | `pricing.md`, `journey-maps.md`, `mvp.md` |
| Help with timeline or sprint week | [`project-planning/README.md`](project-planning/README.md) | Sprint note + How Should We guide |
| Sales, deck, or a demo | [`go-to-market/README.md`](go-to-market/README.md) | `pitch-deck/` and `sales-demos/` |

You do not need to read everything. Pick the one row that matches why you were invited.

---

## How we work in here

- **Through Line** is the presentation layer. Edit it when you are changing what the team *sees*.
- **Markdown in the four folders** is the record. Edit it when you are changing what the team *decided*.
- **Work on a branch.** Push. Open a PR into `main`. Ashley reviews. Do not push to `main`.
- **Do not touch `upline-poc`** from this workspace. If you need the product, that is a different repo and a different conversation.

---

## First fifteen minutes

1. Skim this file. Open the one folder that matches your work.
2. Click through [Through Line](https://upline-throughline.vercel.app) so the names (sprint, journey, Path to Scale) mean something.
3. In Cursor, say **Welcome me — I’m [name]** if you want the walkthrough out loud.
4. If you are running Through Line locally, use [`through-line-setup.md`](through-line-setup.md).

Ashley owns this repo. If something feels noisy or you cannot find a decision, ask her — or ask the agent to point at the file, not to invent one.
