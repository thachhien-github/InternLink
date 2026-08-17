# InternLink

InternLink is a platform scaffold for connecting interns, mentors, and organizations.

✨ Features

✔ Dashboard

✔ Student Management

✔ Internship Management

✔ Company Management

✔ Public Documents

✔ Evaluation & Grading

✔ Analytics & Reporting

✔ Notifications

✔ Account Management

## Repository Structure

- docs/: project documentation, architecture, and ADRs
- backend/: API service and tests
- frontend/: web client
- database/: schema docs, ERD, migration history, verify scripts (EF migrations in backend)
- api/: API contracts and examples
- design-system/: visual system assets and reference files
- assets/: branding and media assets
- scripts/: setup and maintenance utilities
- .github/: issue templates, PR template, and CI workflow

## Getting Started

### Quick local (MVP)

```bash
# Terminal 1 — API (http://localhost:7109)
dotnet run --project backend/InternLink/InternLink.API/InternLink.API.csproj --launch-profile http

# Terminal 2 — Web (http://localhost:5173)
cd frontend
cp .env.example .env.local   # or copy manually on Windows
npm install && npm run dev
```

### Security & Configuration
 
#### JWT Secret Configuration (Required >= 32 characters)
For local development:
```bash
# Option 1: Using .NET User Secrets (Recommended for dev)
cd backend/InternLink/InternLink.API
dotnet user-secrets init
dotnet user-secrets set "Jwt:Secret" "YourStrongDevelopmentSecretKeyWithAtLeast32Chars!"

# Option 2: Using Environment Variable
export Jwt__Secret="YourStrongProductionSecretKeyWithAtLeast32Chars!"
```

#### CORS Configuration
Configured in `appsettings.json` / `appsettings.Development.json` under `Cors:AllowedOrigins`:
```json
"Cors": {
  "AllowedOrigins": [
    "http://localhost:5173"
  ]
}
```

Demo logins: `superadmin` / `lecturer1` / `student1` — `Password123!`

API smoke test: `powershell -ExecutionPolicy Bypass -File scripts/smoke-test-m6.ps1`

See `frontend/README.md` and `docs/Frontend-UI-Plan.md` for UI phases and MVP scope.

Use the provided setup scripts and Docker configuration for other initialization options.
