flowchart LR

Student[Student]
Lecturer[Lecturer]

Student --> FE
Lecturer --> FE

subgraph Frontend
FE[React + TypeScript]
end

subgraph Backend
API[ASP.NET Core Web API]
APP[Application Layer]
DOMAIN[Domain Layer]
INFRA[Infrastructure Layer]
end

subgraph Database
DB[(SQL Server)]
end

FE --> API
API --> APP
APP --> DOMAIN
APP --> INFRA
INFRA --> DB