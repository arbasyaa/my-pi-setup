---
name: security-guard
description: "Application security and defensive coding guardrails. Prevents hardcoded secrets, injection flaws, and OWASP vulnerabilities."
---

# Security & Defensive Coding Guardrails

> Security is not an afterthought. AI coding agents often take shortcuts that leave critical vulnerabilities or leak secrets. Enforce these mandatory security gates across all code.

---

## 1. Zero Hardcoded Secrets (Non-Negotiable)
- **NEVER** hardcode API keys, tokens, passwords, database credentials, JWT secrets, or private keys in source code.
- Always load secrets via environment variables (`process.env`, `os.environ`, etc.) or secure vaults.
- If a new environment variable is introduced, add it with a dummy placeholder to `.env.example` immediately.
- Never commit `.env` or sensitive credential files. Verify `.gitignore` covers them.

## 2. Injection Defense
- **SQL / NoSQL Injection:**
  - Always use parameterized queries or ORM/query builder bindings.
  - **FORBIDDEN:** String concatenation or template literals in raw queries (e.g. `` `SELECT * FROM users WHERE id = ${id}` `` is strictly banned).
- **Command Injection:**
  - Never pass raw user inputs into shell execution functions (`exec()`, `system()`, `child_process.exec()`).
  - Use structured array arguments with `execFile()` or `spawn()` with shell disabled (`shell: false`).
- **Cross-Site Scripting (XSS):**
  - Treat all user-supplied data as untrusted.
  - Avoid raw HTML rendering (`dangerouslySetInnerHTML`, `v-html`, `innerHTML`) without verified, robust sanitization (e.g., DOMPurify).

## 3. Boundary Input Validation & Type Safety
- Validate all incoming data at the system boundary (API routes, webhooks, CLI arguments, file uploads) using schemas (Zod, Pydantic, TypeBox, Valibot, etc.).
- Enforce strict size limits and MIME type checking on file uploads.
- Never rely solely on frontend validation; backend validation is mandatory.

## 4. Authentication & Authorization Guardrails
- **IDOR Prevention:** Always verify that the authenticated user owns or has explicit permission to access/modify the requested resource ID. Never trust client-supplied user IDs.
- **Timing Attacks:** Use constant-time string comparisons (e.g., `crypto.timingSafeEqual`) when validating API tokens or signatures.
- **Cookie Security:** Auth cookies must always have `HttpOnly; Secure; SameSite=Lax/Strict`.
- **No Wildcard CORS:** Never set `Access-Control-Allow-Origin: *` together with `Access-Control-Allow-Credentials: true`.
