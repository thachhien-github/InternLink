# Lecturer Manage Companies Flow

```mermaid
flowchart TD

Dashboard["Dashboard"]

Companies["Company List"]

Detail["Company Detail"]

Add["Add Company"]

Edit["Edit Company"]

History["Internship History"]

Dashboard --> Companies

Companies --> Detail

Companies --> Add

Detail --> Edit

Detail --> History
```