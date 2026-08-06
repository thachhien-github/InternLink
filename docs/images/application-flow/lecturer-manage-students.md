# Lecturer Manage Students Flow

```mermaid
flowchart TD

Dashboard["Dashboard"]

Students["Student List"]

Search["Search / Filter"]

Detail["Student Detail"]

Dashboard --> Students

Students --> Search

Search --> Detail

Students --> Detail
```