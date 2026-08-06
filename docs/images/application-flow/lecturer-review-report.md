# Lecturer Review Weekly Report Flow

```mermaid
flowchart TD

Dashboard["Dashboard"]

Student["Student Detail"]

Reports["Weekly Reports"]

Select["Select Report"]

Review["Review Report"]

Feedback["Write Feedback"]

Save["Save Feedback"]

Dashboard --> Student

Student --> Reports

Reports --> Select

Select --> Review

Review --> Feedback

Feedback --> Save
```