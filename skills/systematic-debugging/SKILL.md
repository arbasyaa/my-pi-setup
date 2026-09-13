---
name: systematic-debugging
description: "Systematic debugging and root cause analysis. Strictly forbids speculative code edits and guess-fixing."
---

# Systematic Debugging & Root Cause Analysis

> Stop guessing. AI agents often jump straight to editing code based on assumptions, creating regressions and compound bugs. Follow this systematic 5-phase protocol for all debugging and bug-fixing tasks.

---

## The 5-Phase Debugging Protocol

### Phase 1: Reproduce & Observe
- **Do not touch production code yet.**
- Reproduce the failure via a test case, minimal script, or terminal command.
- Capture the exact error message, stack trace, and relevant log lines.
- If reproduction isn't possible (e.g., environment-specific), explicitly state the reproduction barrier and analyze existing telemetry/logs.

### Phase 2: Trace & Hypothesize
- Trace data flow backwards from the point of failure to the input origin.
- Formulate a single, testable hypothesis: *"The error occurs because X receives Y when Z happens."*
- Verify the hypothesis by inspecting state (logs, debugger, or code inspection) before changing any logic.

### Phase 3: Root Cause Over Symptom Patching
- **Fix the root cause, never just patch the symptom.**
- If a function crashes on unexpected `null` / `undefined`, determine **why** it was null instead of just slapping an optional chaining `?.` or fallback `|| {}`.
- **Caller Audit:** Use `grep` / codebase search to inspect **all callers** of any shared function you modify. Fixing only the path mentioned in a bug report leaves sibling callers broken.

### Phase 4: Surgical Minimal Fix
- Implement the smallest, cleanest fix that completely resolves the root cause.
- Preserve existing architecture and conventions.
- Do not refactor unrelated code or add unrequested dependencies in the name of a bug fix.

### Phase 5: Verification & Regression Prevention
- Re-run the reproduction step from Phase 1 to prove the fix works.
- Run the project test suite and linter to ensure zero regressions.
- When possible, write or update an automated unit/integration test covering the edge case to prevent the bug from ever returning.
