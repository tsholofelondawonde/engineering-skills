# Core Engineering Invariants

Not a plugin — plugins can't edit your CLAUDE.md for you. Copy this file's
content into your project's CLAUDE.md (or equivalent standing project
instructions) by hand. It's short enough to hold in context on every turn,
which is the point: these are the rules that shouldn't wait for a skill to
trigger.

## Secrets & data
- Nothing bundled into client-side JS is private. Never put client secrets,
  DB credentials, private API keys, or signing keys anywhere the client can
  reach.
- Secrets live in env vars or a secret manager — never hardcoded, never
  committed, never logged.
- Never log passwords, access tokens, refresh tokens, or unnecessary PII.

## Trust boundary
- Treat every request the backend receives as untrusted, including role,
  user ID, and tenant ID fields the client sends. Derive identity from the
  authenticated session, not from request payloads.
- Authorization is enforced server-side, always. A frontend check is UX, not
  security. Default to deny when authorization can't be established.

## Failure behavior
- Production error responses never include stack traces, DB errors, or
  internal details.
- HTTPS is required in production; no mixed content, no credentials sent
  over HTTP.

## Definition of done
- Don't mark a feature complete because it compiles or a placeholder exists.
  Verify it actually works end to end from the user's perspective before
  reporting it as finished.
