# Get this repo

**Send this file to anyone who should have Team Folio.** They paste the whole thing into a new Claude Code chat. Claude clones the repo and orients them. After that, they work however they usually work.

Repo: https://github.com/ashleygitwit/upline-team-folio  
This is **not** the Upline product (`upline-poc`). Do not clone or edit that.

Ashley Roberts (`ashleygitwit`) owns the repo and reviews PRs. Do not merge. Do not push to `main`.

If you only need to *read* it, the clone below is enough — the repo is public. If you need to *push* a branch, ask Ashley to add you as a collaborator (Write), then tell Claude to continue.

---

## For Claude Code

Set up this person to work in Upline’s venture home, **Team Folio**.

Do **only** the clone and git setup below. Do **not** change files, styles, copy, or structure. They will do the work themselves.

Ask their name once if you do not have it. Use it.

### Setup

Work in a folder they already use for projects. Do not nest this inside another git repo.

```bash
git clone https://github.com/ashleygitwit/upline-team-folio.git
cd upline-team-folio

git checkout main
git pull origin main
```

If they will make changes, create a branch off `main` named `{their-name}/…` (for example `doug/standup-notes` or `amanda/style-pass`). Do not push to `main`.

Confirm the clone succeeded, then stop. Tell them:

1. Open [`WELCOME.md`](WELCOME.md) (or say **Welcome me — I’m [name]**).
2. Through Line, the team site, is live at https://upline-throughline.vercel.app
3. Product standup board: [`product/standups/board.md`](product/standups/board.md)

### How we collaborate

- Work on a branch off latest `main`.
- Do not push to `main`. Do not force-push. Do not merge your own PR.
- When they are ready for a look, commit, push the branch, and open a pull request into `main`. Ashley reviews.

If clone or push fails with a permissions error, they need Write access. Stop and tell them to ask Ashley to add their GitHub username as a collaborator on `ashleygitwit/upline-team-folio`, then retry.
