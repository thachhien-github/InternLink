# Lecturer Review Submission Flow

```mermaid
flowchart TD

Dashboard["Dashboard"]

Student["Student Detail"]

Submission["Submission List"]

Open["Open Submission"]

Review["Review"]

Comment["Comment"]

Save["Save Feedback"]

Dashboard --> Student

Student --> Submission

Submission --> Open

Open --> Review

Review --> Comment

Comment --> Save
```