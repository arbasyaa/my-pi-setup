---
name: backend-db-discipline
description: "Backend and database performance discipline. Prevents N+1 queries, unbounded tables, missing indexes, and resource leaks."
---

# Backend & Database Performance Discipline

> Fast and robust backends come from disciplined data access patterns, not afterthought optimizations. Enforce these backend and database guardrails across all API and persistence layers.

---

## 1. Anti N+1 Query Elimination
- **FORBIDDEN:** Executing database queries inside loops or mapping over arrays (e.g. `items.map(async item => await db.user.find(...))`).
- Always use:
  - Relation eager loading (`include`, `select_related`, `prefetch_related`).
  - Batching / `DataLoader` patterns for GraphQL or distributed resolvers.
  - SQL `JOIN`s or `WHERE id IN (...)` queries to fetch related entities in a single round-trip.

## 2. Unbounded Query Prevention (Pagination by Default)
- **FORBIDDEN:** Fetching full tables without limits (e.g., `SELECT * FROM orders` or unbounded `.findMany()`).
- Any collection endpoint or query that can grow over time **must** implement pagination (cursor-based preferred, or offset with a hard limit like `limit = min(req.limit, 100)`).
- Select only the specific fields needed by the view or consumer; avoid returning massive columns (like raw JSON blobs or text bodies) when only an ID or summary is needed.

## 3. Indexing & Schema Guardrails
- Ensure every column queried in `WHERE`, `ORDER BY`, `GROUP BY`, or `JOIN ON` has a supporting index.
- Foreign key columns must always be indexed to prevent table scans during cascading operations and joins.
- Create explicit migration files whenever adding or modifying database tables, columns, or indexes.

## 4. Transactional Integrity & Idempotency
- Multi-step write operations that depend on each other must be wrapped in atomic transactions (e.g., `db.$transaction`, `BEGIN...COMMIT`).
- Roll back immediately on error; never leave the database in a partially-updated state.
- Critical operations (payment processing, order creation, state transitions) must support idempotency (e.g., idempotency keys or unique constraint handling).

## 5. Connection & Resource Lifecycle Management
- Always release or close database connections, file handles, streams, and network sockets in `finally` blocks, context managers (`with`), or automated resource scopes.
- Prevent connection pool exhaustion by keeping transaction durations as short as possible. Do not perform slow network calls or heavy CPU work inside an open database transaction.
