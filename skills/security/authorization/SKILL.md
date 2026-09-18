---
name: authorization
description: Use when adding permission checks, protecting a resource or endpoint so only the right users can access it, or auditing existing routes for missing ownership checks.
---

# Authorization

- Enforced server-side, always — never trust a frontend check.
- Verify resource ownership and tenant boundaries on every request, not
  just at login.
- Default to deny when a permission can't be established.
- If using Supabase (or another database with row-level policies), enable
  RLS on every table that holds user data and write a policy per table —
  don't rely on app-layer checks alone as the only enforcement.
- Prove it: write a test showing one user cannot read or write another
  user's record (or another tenant's data) through the endpoint.

Related skills in this plugin: `authentication` (establishing who the
user is, before deciding what they can do), `rate-limiting`.
