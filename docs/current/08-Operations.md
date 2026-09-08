# InternLink - Operations Guide

## Compose startup

```powershell
cd E:\Downloads\internlink
docker compose up -d --build
docker compose ps
```

The normal entrypoint is `http://localhost:3000`. The backend and SQL Server ports are internal to the Compose network in the current configuration. Do not assume `localhost:7109` or `localhost:1433` are published unless those lines are explicitly enabled in `docker-compose.yml`.

## Service health

```powershell
docker compose ps
docker logs --tail 200 internlink_api
Invoke-WebRequest http://localhost:3000/
```

Health endpoints are `/health`, `/health/live` and `/health/ready`. The backend healthcheck uses `/health/live`; readiness also verifies database connectivity.

## Persistence

- `internlink_database_data` persists SQL Server files.
- `internlink_uploads_data` persists `/app/uploads`.
- `docker compose down` removes containers and the Compose network but keeps named volumes.
- `docker compose down -v` destroys named volumes and therefore destroys database/upload data. Use only for an intentional reset after backup.

## Backup and restore

Back up SQL Server with `BACKUP DATABASE` and copy the `.bak` file outside the container. Back up the upload volume separately. Restore both database and files as a pair; metadata without its physical files is incomplete.

## Logs

Serilog writes to console and the configured rolling file sink. Runtime logs belong outside source control. Keep production log levels intentional because request logging can be noisy when portal polling or duplicate fetches are present.

## Common failures

| Symptom | Check |
|:--|:--|
| Backend unhealthy | `docker logs internlink_api`; then check SQL Server health and connection string |
| Login invalid | Confirm database has seeded `admin`; check migration completed and use the current password |
| Frontend cannot call API | Check Nginx proxy paths, browser network tab and backend health |
| Migration fails | Inspect the failing migration and schema; do not edit an applied migration without a recovery plan |
| Upload missing | Verify `internlink_uploads_data` is mounted and the database relative path points to an existing file |
| Docker pull/build EOF | Retry registry download after checking Docker Desktop/network; this is not necessarily a source error |

## Runtime file policy

Uploads belong in the persistent volume or an external object store, not in the repository. Use server-generated names, validate content and size, enforce ownership checks, and periodically report orphaned files before deletion.
