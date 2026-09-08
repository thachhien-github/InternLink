# InternLink - Documentation Maintenance

## Source-of-truth order

When updating documentation, use this order:

1. Runtime behavior verified by a test or HTTP/database check.
2. `docker-compose.yml`, Dockerfiles and Nginx configuration.
3. Backend controllers, DTOs, services, entities and migrations.
4. Frontend route tree, pages, hooks, contexts and service clients.
5. Existing docs and diagrams.

Existing documentation must not override current code.

## Required checks after feature changes

- Update the relevant document in `docs/current/`.
- Update API endpoint tables when a controller route changes.
- Update domain/database documents when an entity, relationship, index or migration changes.
- Update storage documentation when upload path, size, extension or deletion behavior changes.
- Update route documentation when portal navigation changes.
- Run `git diff --check`.
- Run the narrowest relevant build/test command.
- Verify health endpoints for runtime changes.

## Release snapshot checklist

Record:

- verification date;
- backend/frontend/database versions;
- current migration name;
- seeded account policy;
- public host ports;
- persistent volume names;
- known warnings or test limitations.

## Avoid stale claims

Do not document a feature as implemented when it is only represented by mock UI data, a test fixture, an old SQL repair script or a planned interface. Mark it as `partial`, `fixture-only` or `planned` until the runtime path is verified.

Do not hard-code secrets, private SMTP passwords, local absolute paths or temporary upload names in documentation.

## Historical documents

The older numbered files outside `docs/current/` are retained as historical material. When a historical document is revised, either update it to point to the current document or label it `legacy`. New technical claims belong in `docs/current/`.
