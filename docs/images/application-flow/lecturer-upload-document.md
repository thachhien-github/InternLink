# Lecturer Upload Document Flow

```mermaid
flowchart TD

Dashboard["Dashboard"]

Documents["Documents"]

Upload["Upload Document"]

Metadata["Enter Title & Category"]

Publish["Publish"]

Dashboard --> Documents

Documents --> Upload

Upload --> Metadata

Metadata --> Publish
```