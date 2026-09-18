---
name: secrets-management
description: Use when handling API keys, credentials, or environment configuration.
---

# Secrets Management

- Nothing bundled into client-side JS is private. Never put client
  secrets, DB credentials, private API keys, or signing keys anywhere the
  client can reach.
- Secrets live in env vars or a secret manager — never hardcoded, never
  committed, never logged.
- Use separate configuration per environment (dev/staging/prod).
- Check for accidental secrets in source files, config files, `.env`
  files, build output, and CI/CD configuration.
- Auditing an existing codebase: grep source, config, and build output for
  hardcoded keys/tokens, move any found to server-side env vars, and
  confirm via the client bundle and network requests that nothing secret
  ships to the browser. List every file changed as part of the fix.

Related skills in this plugin: `token-security`.
