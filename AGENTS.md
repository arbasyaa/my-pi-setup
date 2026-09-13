- run check/format/lint commands when your done making a change. if they don't exist, suggest making them for the project you're in
- avoid explicit return types unless absolutely needed
- `as any` should be an absolute last resort. always use real type safety. lean on type inference instead of manually writing new types over and over again

<!-- engineering-discipline:start -->
## Core Engineering Discipline

### 1. Anti-Overengineering & YAGNI (`ponytail`)
Follow lazy senior developer discipline: the best code is the code never written.
- **Package & Skill**: `@dietrichgebert/ponytail` (Commands: `/ponytail lite|full|ultra`)
- The Ladder: Does this need to exist? (YAGNI) -> Reuse existing codebase -> Use standard library -> Native platform feature -> Installed dependency -> Can it be one line? -> Minimum code that works.
- No unrequested abstractions, no avoidable dependencies, no premature boilerplate.

### 2. Systematic Debugging & Root Cause First (`systematic-debugging`)
Stop speculative edits and guess-and-check fixing.
- **Skill**: `skills/systematic-debugging/SKILL.md`
- Protocol: Reproduce failure -> Trace data flow -> Formulate testable hypothesis -> Fix root cause (audit all callers) -> Verify and prevent regression.

### 3. Application Security & Secrets Guard (`security-guard`)
Defensive coding and zero-trust security.
- **Skill**: `skills/security-guard/SKILL.md`
- Never hardcode secrets/keys (enforce `.env`). Prevent SQL/command/XSS injection. Validate all boundary inputs with schemas. Enforce server-side authorization.

### 4. Backend & Database Performance (`backend-db-discipline`)
High-performance APIs and persistence layers.
- **Skill**: `skills/backend-db-discipline/SKILL.md`
- Anti N+1 queries (eager loading / batching). Pagination by default on all growing collections. Ensure indexes on filtered/joined columns. Clean up streams/connections in `finally` blocks.
<!-- engineering-discipline:end -->

<!-- frontend-architecture:start -->
## Frontend Architecture: Taste Skill (Aesthetic Engine) + Anti-Slop (Quality Gate)

When designing, generating, or refactoring UI/UX, landing pages, web apps, or frontend code, follow this dual-engine pipeline:

### 1. Aesthetic & Creative Direction (`taste-skill`)
Set visual soul, motion, and layout hierarchy before writing code:
- **Core Frontend Taste**: `skills/taste-skill/SKILL.md` (Design Read + 3 Dials: VARIANCE / MOTION / DENSITY)
- **Minimalist / Linear Style**: `skills/minimalist-skill/SKILL.md` (Restrained palette, editorial product vibe)
- **Soft / Luxury Design**: `skills/soft-skill/SKILL.md` (Calm, expensive whitespace, spring motion)
- **Industrial / Brutalist**: `skills/brutalist-skill/SKILL.md` (Swiss type, high contrast, bold grid)
- **Redesign Existing Project**: `skills/redesign-skill/SKILL.md` (Audit first, preserve/overhaul layout)
- **Image-to-Code**: `skills/image-to-code-skill/SKILL.md` (Reference boards to pixel-accurate code)
- **Full Output Enforcement**: `skills/output-skill/SKILL.md` (No truncation, no placeholder comments)

### 2. Quality Gate & Production Integrity (`antislop`)
Filter out generic AI slop, protect integrity, accessibility, and functional polish:
- **Core Filter**: `skills/antislop/SKILL.md` (Hard Gate: no dead buttons/links, no fake stats/claims, Delivery Gate)
- **UI & Accessibility**: `skills/antislop-ui/SKILL.md` & `skills/antislop-human/SKILL.md` (WCAG AA contrast, keyboard navigation)
- **Copywriting**: `skills/antislop-copywriting/SKILL.md` (Natural voice, strict em-dash `—` ban, no AI buzzwords)
- **Mobile & Layout**: `skills/antislop-layoutmobile/SKILL.md` (Tap targets >= 44px, zero horizontal overflow)
- **Code Comments**: `skills/antislop-code/SKILL.md` (Strip meaningless AI doc comments)

*Workflow: Infer aesthetic direction via Taste Skill -> implement -> enforce Hard Gates via Anti-Slop before delivery.*
<!-- frontend-architecture:end -->
