sequenceDiagram

participant Browser

participant React

participant API

participant Service

participant Repository

participant SQL

Browser->>React: Click Button

React->>API: HTTP Request

API->>Service: Business Logic

Service->>Repository: Query

Repository->>SQL: SQL

SQL-->>Repository: Data

Repository-->>Service

Service-->>API

API-->>React: JSON

React-->>Browser: Render UI