# API Specification

**Project:** InternLink – Internship Management & Collaboration Platform

**Version:** 1.0

**Status:** Draft

---

# 1. Overview

Tài liệu này mô tả các RESTful API của hệ thống InternLink.

API được xây dựng bằng **ASP.NET Core Web API** và trả dữ liệu dưới định dạng **JSON**.

Authentication sử dụng **JWT Bearer Token**.

Base URL:

```
https://localhost:5001/api
```

---

# 2. API Conventions

## HTTP Methods

| Method | Purpose |
|---------|----------|
| GET | Lấy dữ liệu |
| POST | Tạo mới |
| PUT | Cập nhật toàn bộ |
| PATCH | Cập nhật một phần |
| DELETE | Xóa |

---

## Response Format

```json
{
    "success": true,
    "message": "Success",
    "data": {}
}
```

---

## Error Response

```json
{
    "success": false,
    "message": "Student not found."
}
```

---

# 3. Authentication API

## Login

POST

```
/api/auth/login
```

Request

```json
{
    "username": "lecturer01",
    "password": "******"
}
```

Response

```json
{
    "token": "...",
    "expiredAt": "...",
    "role": "Lecturer"
}
```

---

## Current User

GET

```
/api/auth/me
```

---

# 4. Student API

## Get All Students

GET

```
/api/students
```

---

## Get Student By Id

GET

```
/api/students/{id}
```

---

## Create Student

POST

```
/api/students
```

---

## Update Student

PUT

```
/api/students/{id}
```

---

## Delete Student

DELETE

```
/api/students/{id}
```

---

# 5. Company API

## Get Companies

GET

```
/api/companies
```

---

## Company Detail

GET

```
/api/companies/{id}
```

---

## Create Company

POST

```
/api/companies
```

---

## Update Company

PUT

```
/api/companies/{id}
```

---

## Delete Company

DELETE

```
/api/companies/{id}
```

---

# 6. Internship API

## Get Internship

GET

```
/api/internships
```

---

## Internship Detail

GET

```
/api/internships/{id}
```

---

## Assign Company

PUT

```
/api/internships/{id}/company
```

---

## Update Status

PATCH

```
/api/internships/{id}/status
```

---

# 7. Weekly Report API

## Get Reports

GET

```
/api/weekly-reports
```

---

## Create Report

POST

```
/api/weekly-reports
```

---

## Update Report

PUT

```
/api/weekly-reports/{id}
```

---

## Delete Report

DELETE

```
/api/weekly-reports/{id}
```

---

# 8. Internship Log API

## Get Logs

GET

```
/api/internship-logs
```

---

## Create Log

POST

```
/api/internship-logs
```

---

## Update Log

PUT

```
/api/internship-logs/{id}
```

---

## Delete Log

DELETE

```
/api/internship-logs/{id}
```

---

# 9. Submission API

## Get Submissions

GET

```
/api/submissions
```

---

## Upload Submission

POST

```
/api/submissions
```

Request

multipart/form-data

```
file
title
internshipId
```

---

## Submission Detail

GET

```
/api/submissions/{id}
```

---

## Delete Submission

DELETE

```
/api/submissions/{id}
```

---

# 10. Feedback API

## Get Feedback

GET

```
/api/feedbacks
```

---

## Add Feedback

POST

```
/api/feedbacks
```

---

## Update Feedback

PUT

```
/api/feedbacks/{id}
```

---

# 11. Evaluation API

## Get Evaluation

GET

```
/api/evaluations/{internshipId}
```

---

## Save Evaluation

POST

```
/api/evaluations
```

---

## Update Evaluation

PUT

```
/api/evaluations/{id}
```

---

# 12. Document API

## Public Documents

GET

```
/api/documents
```

---

## Upload Document

POST

```
/api/documents
```

---

## Download Document

GET

```
/api/documents/{id}/download
```

---

## Delete Document

DELETE

```
/api/documents/{id}
```

---

# 13. Notification API

## Get Notifications

GET

```
/api/notifications
```

---

## Mark As Read

PATCH

```
/api/notifications/{id}/read
```

---

# 14. HTTP Status Codes

| Code | Meaning |
|------|----------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

---

# 15. Authorization

| Role | Permissions |
|------|-------------|
| Lecturer | Full Access |
| Student | Own Internship Data |

---

# 16. API Naming Convention

Resource-based REST API.

Examples:

```
GET     /students
GET     /students/{id}
POST    /students
PUT     /students/{id}
DELETE  /students/{id}
```

Nested Resources

```
GET /students/{id}/internship

GET /companies/{id}/internships

GET /internships/{id}/submissions

GET /submissions/{id}/feedbacks
```

---

# 17. Swagger

Tất cả API sẽ được tự động tài liệu hóa bằng Swagger/OpenAPI.

Development URL:

```
https://localhost:5001/swagger
```

---

# 18. Summary

InternLink cung cấp RESTful API theo mô hình Resource-Oriented.

Các nhóm API chính gồm:

- Authentication
- Students
- Companies
- Internships
- Weekly Reports
- Internship Logs
- Submissions
- Feedbacks
- Evaluations
- Documents
- Notifications

Tất cả API sử dụng JSON, JWT Authentication và được triển khai bằng ASP.NET Core Web API.