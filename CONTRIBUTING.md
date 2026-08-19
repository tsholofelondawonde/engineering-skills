# Contributing

## Adding a new skill

`skills/` at the repo root is the canonical source — always edit there.
`plugins/engineering-quality/skills/` is a generated mirror (see below);
never hand-edit it, your changes will be overwritten and CI will flag the
drift.

1. Pick (or create) a category under `skills/<category>/`.
2. Create `<category>/<skill-name>/SKILL.md` with frontmatter:
   ```yaml
   ---
   name: skill-name
   description: When to trigger this — be specific about the task context, not just the topic.
   ---
   ```
3. Keep the body short and actionable. If a skill needs more than
   ~150 lines, split detail into a `references/` subfolder and point to
   it from the body instead of inlining everything.
4. Regenerate the plugin mirror and validate before opening a PR:
   ```
   node scripts/sync-plugin-skills.mjs
   claude plugin validate .
   claude plugin validate ./plugins/engineering-quality
   ```

## Two distributions, one source

This repo ships two ways: as portable Agent Skills (`skills/`, installable
with `npx skills add`) and as a Claude Code plugin
(`plugins/engineering-quality`, installable via `/plugin marketplace add`).
`skills/` is what you edit; `scripts/sync-plugin-skills.mjs` regenerates
`plugins/engineering-quality/skills/` from it, and CI
(`.github/workflows/validate-plugin.yml`) fails the build if the two are
out of sync.

## Adding the production-readiness agent's checks

Edit `plugins/engineering-quality/agents/production-readiness-reviewer.md`
directly. It's an agent, not a skill — don't move it into `skills/`. It's
meant to be invoked deliberately before shipping, not triggered
automatically while code is being written, and its tool list (Read/Grep/
Glob/Bash, no Write) is what keeps it review-only.

## Design rule for this repo

One plugin, many skills. Don't add a second plugin entry to
`marketplace.json` unless there's a real reason someone would want to
install a *subset* of this without the rest — otherwise you're just
fragmenting one install into two for no reason.
