# InternLink - Demo Accounts and Fixtures

**Verified:** 2026-09-08

## Seeded account

The current `SeedData.InitializeAsync` creates or repairs one account:

| Username | Password | Role | Email |
|:--|:--|:--|:--|
| `admin` | `Password123!` | `SuperAdmin` | `admin@internlink.test` |

When the account already exists, startup ensures it is active and has the `SuperAdmin` role but does not reset its password.

## What is not seeded

The current seed does not create:

- lecturer accounts such as `gv001` or `lecturer1`;
- student accounts such as `sv001` or `student1`;
- lecturer/student profiles;
- companies, semesters, internships or populated reports/submissions.

Those values may exist in test fixtures or old documentation, but they are not valid assumptions for a fresh database.

## Test fixtures

Backend tests create their own in-memory data and must not be confused with runtime demo seed data. Smoke scripts that require lecturer/student users need a fixture setup or an explicit import step before they can run against a clean database.

## Reset warning

Do not delete `internlink_database_data` to obtain demo data. That destroys the database. To reset a disposable environment, back up first, intentionally remove the volume, start the API so migrations and the admin seed run, then import documented fixture data.
