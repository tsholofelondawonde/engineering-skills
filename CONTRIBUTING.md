# Contributing

## Adding a new skill

1. Pick (or create) a category under
   `plugins/engineering-quality/skills/<category>/`.
2. Create `<category>/<skill-name>/SKILL.md` with frontmatter:
   ```yaml
   ---
   name: skill-name
   description: When to trigger this — be specific about the task context, not just the topic.
   ---
   ```
3. If you added a new top-level category folder (not just a new skill
   inside an existing one), add its path to the `skills` array in
   `plugins/engineering-quality/.claude-plugin/plugin.json` — skills only
   load from paths listed there.
4. Keep the body short and actionable. If a skill needs more than
   ~150 lines, split detail into a `references/` subfolder and point to
   it from the body instead of inlining everything.
5. Before opening a PR, run:
   ```
   claude plugin validate .
   claude plugin validate ./plugins/engineering-quality
   ```

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
