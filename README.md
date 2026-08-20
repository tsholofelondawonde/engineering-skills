# engineering-skills

*23 narrowly-triggered engineering standards skills, plus a pre-ship review agent.*

One plugin's worth of Agent Skills that enforce web, security, performance,
compliance, and quality standards while you build — plus a documentation
skill and a deliberately-invoked production-readiness review agent. Each
skill fires independently based on its own description; nothing turns on
until the task actually calls for it.

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License" /></a>
  &nbsp;
  <a href="https://github.com/vercel-labs/agent-skills"><img src="https://img.shields.io/badge/Agent%20Skills-compatible-brightgreen" alt="Agent Skills compatible" /></a>
  &nbsp;
  <a href="#installing"><img src="https://img.shields.io/badge/Codex%20%C2%B7%20Cursor%20%C2%B7%20Claude-installable-blueviolet" alt="Codex, Cursor, Claude" /></a>
</p>

<p align="center"><sub><a href="#installing">Installing</a> · <a href="#skills">Skills</a> · <a href="#core-invariantsmd">core-invariants.md</a> · <a href="#common-questions">FAQ</a> · <a href="#before-you-publish-this">Before you publish this</a> · <a href="#updating">Updating</a></sub></p>

The repo ships two ways from one canonical source: as portable Agent Skills
(`skills/`, installable in any compatible agent) and as a Claude Code plugin
marketplace (`plugins/engineering-quality`). `skills/` is what gets edited;
`plugins/engineering-quality/skills/` is a generated mirror kept in sync by
`scripts/sync-plugin-skills.mjs` and checked in CI — see CONTRIBUTING.md.

## Installing

The [`npx skills add`](https://github.com/vercel-labs/agent-skills) CLI
scans the `skills/` folder in this repo, so it works the same way for
Claude Code, Cursor, Codex, OpenCode, and any other `npx
skills`-compatible agent:

```
npx skills add tsholofelondawonde/engineering-skills
```

Prefer the Claude Code plugin marketplace instead? It wraps the same
`skills/` source and additionally installs the pre-ship review agent:

```
/plugin marketplace add tsholofelondawonde/engineering-skills
/plugin install engineering-quality@engineering-skills
```

If the install summary says `Run /reload-plugins to activate.`, run that.

## Skills

| Skill | Category | Description |
| --- | --- | --- |
| `custom-404` | web | Use when creating or reviewing 404/not-found handling for a route or application. |
| `seo-metadata` | web | Use when creating a new public page/route, or when the request concerns meta titles, meta descriptions, or basic SEO. |
| `open-graph` | web | Use when setting up social sharing previews, or adding/reviewing `og:` tags and share images. |
| `responsive-design` | web | Use when building or reviewing layout/UI that needs to work across mobile, tablet, and desktop. |
| `loading-states` | web | Use whenever wiring up an async action the user waits on — submit, upload, search, filtering, an AI call, or page-level data fetching. |
| `form-validation` | web | Use when building or modifying a form and its validation logic. |
| `error-states` | web | Use when handling API/network error responses in the UI, or confirming a successful user action (success/thank-you state). |
| `image-optimization` | web | Use when adding images or media to a page. |
| `authentication` | security | Use when creating or modifying login, signup, sessions, or authentication error handling. |
| `authorization` | security | Use when adding permission checks, or protecting a resource or endpoint so only the right users can access it. |
| `token-security` | security | Use when implementing or reviewing how access/refresh tokens are issued, stored, or rotated. |
| `rate-limiting` | security | Use when exposing a public endpoint — especially login, registration, password reset, token refresh, public forms, search, or any expensive/AI-backed operation. |
| `csrf` | security | Use when authentication relies on cookies, or when reviewing form/session security against cross-site request forgery. |
| `cors` | security | Use when configuring cross-origin access for an API. |
| `security-headers` | security | Use when configuring transport/security headers, or preparing an application for production. |
| `secrets-management` | security | Use when handling API keys, credentials, or environment configuration. |
| `caching` | performance | Use when adding caching for an API response, database query, or computed result. |
| `privacy-policy` | compliance | Opt-in only — use when explicitly asked to draft a Privacy Policy, or when the project is explicitly confirmed to be shipping to real users and needs one. Do not use for prototypes, internal tools, or MVPs by default. |
| `terms` | compliance | Opt-in only — use when explicitly asked to draft Terms of Service/Use, or when the project is explicitly confirmed to be shipping to real users and needs them. Do not use for prototypes, internal tools, or MVPs by default. |
| `cookie-consent` | compliance | Opt-in only — use when the app actually uses non-essential cookies/tracking and a consent mechanism is explicitly requested. Do not use by default. |
| `accessibility` | quality | Use when building or reviewing UI for accessibility. |
| `testing` | quality | Use when adding tests for authentication, validation, or rate-limited/routed behavior, or when asked what to test for a feature. |
| `readme-generator` | documentation | Use when asked to generate or refresh a project's README.md — gathers context from whatever manifests, docs, and AI-agent instruction files (CLAUDE.md, AGENTS.md, .cursorrules, copilot-instructions.md, etc.) actually exist in the repo. |
| `production-readiness-reviewer` | agent | Invoke deliberately before shipping. Reviews (Read/Grep/Glob/Bash, no Write) and reports gaps rather than fixing them. |

### Which one fires when?

The 23 skills above auto-trigger from their own `description` — you don't
select them, you just work, and whichever skill matches the task loads
itself. `production-readiness-reviewer` is the one exception: it's an
agent, not a skill, so it never auto-triggers — invoke it explicitly
before shipping.

## Consequences of "one plugin, 23 skills" worth knowing (plugin distribution)

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

## Common Questions

**Does this work with Cursor and Codex, or only Claude Code?**
Yes — the portable install (`npx skills add`) is agent-agnostic. This was
verified for real against the published repo: `npx skills add
tsholofelondawonde/engineering-skills --list` reports "Found 23 skills"
and lists each one exactly once (details under "Before you publish this").
The Claude Code plugin marketplace is a separate, additional distribution
channel, not a requirement.

**What is SKILL.md?**
A portable instruction file — YAML frontmatter (`name`, `description`)
plus a Markdown body — that any compatible agent can discover and load
automatically when the `description` matches the task at hand. It's the
open format behind the "Agent Skills compatible" badge above.

**How is this different from writing rules directly in my CLAUDE.md?**
CLAUDE.md-style instructions are always in context, every turn. Skills are
the opposite: near-zero cost until triggered, then loaded in full. Use
`core-invariants.md` (above) for the handful of rules that should always
be active, and skills for everything that only matters for a specific kind
of task.

**Can I install just one skill instead of all 23?**
Yes — `npx skills add tsholofelondawonde/engineering-skills --skill
<name>` installs a single skill by its folder/`name` value from the table
above.

## Before you publish this

- `owner`/`author` in `.claude-plugin/marketplace.json` and
  `plugins/engineering-quality/.claude-plugin/plugin.json` point at
  `https://github.com/tsholofelondawonde`.
- **CI is verified.** Both the `claude plugin validate` step and the
  sync-drift-check step (`scripts/sync-plugin-skills.mjs` +
  `git diff --exit-code -- plugins/engineering-quality/skills`) have run
  and passed on real GitHub Actions pushes to `main` — no
  `ANTHROPIC_API_KEY` was needed for the structural validate step.
- **`npx skills add tsholofelondawonde/engineering-skills --list` is
  verified.** Run against the real published repo, it reports "Found 23
  skills" and lists each of them — including `readme-generator` — exactly
  once, confirming the portable install path works for any `npx
  skills`-compatible agent (Codex, Cursor, OpenCode, etc.), not just Claude
  Code. The `npx skills` CLI discovers skills from the top-level `skills/`
  folder *and* separately reads `plugin.json`'s plugin-manifest
  declarations; dropping the explicit `skills` array from `plugin.json`
  avoids a collision between the two in practice, which this run confirms.
- Check `quality/accessibility` and `quality/testing` against whatever's
  already in your other Claude Code catalog (`design:accessibility-review`,
  `engineering:testing-strategy`) before running both — same overlap flagged
  earlier, still true here.

## Updating

Plugin install:

```
/plugin marketplace update engineering-skills
```

Portable install: re-run the install command.

```
npx skills add tsholofelondawonde/engineering-skills
```

## License

[MIT License](LICENSE) · Copyright (c) 2026 Tsholofelo — a default so
"anyone can install" holds up legally; swap it if you want different terms.
