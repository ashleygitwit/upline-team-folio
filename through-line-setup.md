# Through Line — environment setup

**First:** read [`WELCOME.md`](WELCOME.md) (or in Cursor, say **Welcome me — I’m Amanda**). This file is only how to get Through Line running locally.

**Amanda:** paste this entire file into a new Claude Code chat as your first message if you want the repo cloned, a branch created off `main`, and the local site running. After that, the setup is done — you work however you usually work.

If GitHub asks you to accept an invite first, accept it for `ashleygitwit/upline-team-folio` (Write access), then tell Claude to continue.

---

## For Claude Code

Set up Amanda Treadwell (`a-treadwell-gw`) to work on Upline's internal planning site, **The Through Line**.

Do **only** the environment and git setup below. Do **not** change styles, copy, structure, or any other files. She will make the design edits herself.

Ashley Roberts (`ashleygitwit`) owns the repo and reviews PRs. Do not merge. Do not push to `main`.

## Repo and site

- Repo: https://github.com/ashleygitwit/upline-team-folio
- Live site: https://upline-throughline.vercel.app
- Brand page: https://upline-throughline.vercel.app/#/brand
- Local site: http://localhost:5299 (hash routes)

This repo is **not** the product (`upline-poc`). Do not clone or edit that.

## Setup

Work in a folder Amanda already uses for projects. Do not nest this inside another git repo.

```bash
git clone https://github.com/ashleygitwit/upline-team-folio.git
cd upline-team-folio

git checkout main
git pull origin main

git checkout -b amanda/style-pass

npm install
cd internal-comms && npm install && cd ..
npm run dev
```

If `amanda/style-pass` already exists on the remote, check it out and pull instead of creating it again.

If clone or push fails with a permissions error, stop and tell Amanda to accept the GitHub collaborator invite, then retry.

Confirm Through Line is running at **http://localhost:5299**, then stop. Tell Amanda the setup is ready and she can take it from here.

## How we collaborate

- Work on `amanda/style-pass`, always branched off latest `main`.
- Do not push to `main`. Do not force-push. Do not merge your own PR.
- When she is ready for a look, commit, push the branch, and open a pull request into `main`.
- Vercel posts a preview URL on the PR. Ashley reviews that preview, then merges. The live site updates from `main` about a minute later.

```bash
git checkout main
git pull origin main
git checkout amanda/style-pass

git add -A
git commit -m "Your short summary of the visual changes."
git push -u origin amanda/style-pass

gh pr create --base main --title "Through Line style pass" --body "Preview on Vercel. @ashleygitwit to review."
```

If `gh` is not installed, push the branch and open:

`https://github.com/ashleygitwit/upline-team-folio/compare/main...amanda/style-pass?expand=1`

Later sessions: same branch. Pull latest `main` into `amanda/style-pass` before more work. New commits update the same PR. Do not open a second PR for the same pass.

## Orientation only

Through Line lives in `internal-comms/`. Shared styles are in `internal-comms/src/brand.css`, `internal-comms/src/index.css`, and `internal-comms/src/App.css`. Pages are hash routes (`#/`, `#/learnings`, `#/roadmap`, `#/poc`, `#/sprint`, `#/mvp`, `#/brand`, `#/team`, plus `#/mvp-journey` and `#/private`).
