# engineering-skills

22 narrowly-triggered engineering standards skills (web, security,
performance, compliance, quality) plus a pre-ship production-readiness
review agent. Each skill fires independently based on its own description.

The repo ships two ways from one canonical source: as portable Agent Skills
(`skills/`, installable in any compatible agent) and as a Claude Code plugin
marketplace (`plugins/engineering-quality`). `skills/` is what gets edited;
`plugins/engineering-quality/skills/` is a generated mirror kept in sync by
`scripts/sync-plugin-skills.mjs` and checked in CI — see CONTRIBUTING.md.

## Install

**Portable Agent Skills** (Claude Code, Cursor, Codex, OpenCode, and other
`npx skills`-compatible agents):

```
npx skills add tsholofelondawonde/engineering-skills
```

**Claude Code plugin marketplace** (adds the pre-ship review agent too):

```
/plugin marketplace add tsholofelondawonde/engineering-skills
/plugin install engineering-quality@engineering-skills
```

If the install summary says `Run /reload-plugins to activate.`, run that.

## What's in it

**Web (8):** custom-404, seo-metadata, open-graph, responsive-design,
loading-states, form-validation, error-states, image-optimization

**Security (8):** authentication, authorization, token-security,
rate-limiting, csrf, cors, security-headers, secrets-management

**Performance (1):** caching

**Compliance (3):** privacy-policy, terms, cookie-consent

**Quality (2):** accessibility, testing

**Agent (1):** production-readiness-reviewer — invoke this deliberately
before shipping. It's not a skill: it doesn't auto-trigger while you work,
it only reviews (Read/Grep/Glob/Bash, no Write), and it reports gaps rather
than fixing them.

## Consequences of "one plugin, 22 skills" worth knowing (plugin distribution)

The repo as a whole ships two ways from one canonical `skills/` source (see
above) — the points below are specifically about the Claude Code plugin
distribution (`plugins/engineering-quality`), not the portable install.

- **`compliance/*` is no longer install-gated.** In an earlier version of
  this repo, legal/cookie content lived in its own plugin so it wouldn't be
  present unless someone chose to install it. Now that everything ships in
  one plugin, that gate doesn't exist — the only thing keeping
  `privacy-policy`, `terms`, and `cookie-consent` from firing on unrelated
  work is their own description, which is written to require an explicit
  ask or a confirmed "this is shipping to real users." That's a weaker
  guarantee than an install-time boundary. If that turns out to misfire in
  practice, the fix is pulling `compliance/` back into its own plugin, not
  rewriting the descriptions further.
- **The `security/*` skills cross-reference each other in their bodies**
  (e.g. `authentication` points to `token-security`, `authorization`,
  `rate-limiting`) as a partial mitigation for the risk flagged earlier:
  splitting one workflow (build a login flow) across 8 independently-
  triggered skills means a request that doesn't literally mention "CSRF"
  or "rate limiting" might only pull in `authentication` and miss the
  rest. The cross-references help if Claude reads into a skill's body, but
  they don't fix triggering itself — worth watching whether these actually
  all fire together in practice, not just assuming the pointers solve it.
- **`bundles/` from the original tree is gone.** With one plugin as the
  only install unit, there's nothing left for a "bundle" to select between
  — installing the plugin already gets you everything. If you want curated
  presets back, that's a documentation concern (e.g. "for a typical web
  app you mainly need X, Y, Z") rather than an installable unit.

## core-invariants.md

Not a plugin — a plugin can't rewrite your CLAUDE.md for you. Copy this
file's content into your project's CLAUDE.md by hand. It's the handful of
rules (no client secrets, backend always re-validates, server-side
authorization, safe error responses, HTTPS in prod) that should be active
every turn rather than waiting for a skill to trigger.

## Before you publish this

- `owner`/`author` in `.claude-plugin/marketplace.json` and
  `plugins/engineering-quality/.claude-plugin/plugin.json` point at
  `https://github.com/tsholofelondawonde`.
- **CI is verified.** Both the `claude plugin validate` step and the
  sync-drift-check step (`scripts/sync-plugin-skills.mjs` +
  `git diff --exit-code -- plugins/engineering-quality/skills`) have run
  and passed on real GitHub Actions pushes to `main` — no
  `ANTHROPIC_API_KEY` was needed for the structural validate step.
- **Run `npx skills add
  tsholofelondawonde/engineering-skills --list`** and confirm each of
  the 22 skills appears exactly once. The `npx skills` CLI discovers skills
  from the top-level `skills/` folder *and* separately reads
  `plugin.json`'s plugin-manifest declarations, and its docs don't specify
  what happens if the same skill `name` surfaces from both — dropping the
  explicit `skills` array from `plugin.json` lowers the odds of a collision
  but doesn't rule one out.
- Check `quality/accessibility` and `quality/testing` against whatever's
  already in your other Claude Code catalog (`design:accessibility-review`,
  `engineering:testing-strategy`) before running both — same overlap flagged
  earlier, still true here.
- MIT license included as a default so "anyone can install" holds up
  legally; swap it if you want different terms.

## Updating

Plugin install:

```
/plugin marketplace update engineering-skills
```

Portable install: re-run the install command.

```
npx skills add tsholofelondawonde/engineering-skills
```
