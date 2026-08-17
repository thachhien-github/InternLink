# Frontend MockData Audit & Backend Integration Plan

**Status**: Comprehensive Review & Mapping  
**Last Updated**: 2026-08-17  
**Priority**: High - Full Frontend Refactoring Required

---

## 📊 Executive Summary

The frontend currently uses hardcoded mockdata across **44 import statements** across **37 files**, affecting pages, components, hooks, contexts, and services. This document provides a complete audit, mapping, and step-by-step implementation plan to replace all mockdata with real backend API calls.

---

## 🔍 Current MockData Sources

### 1. **mockData.ts** - Primary Mock Database
**Location**: `frontend/src/data/mockData.ts`

**Contains**:
- `INITIAL_STUDENTS` - 13+ student profiles with full details (MSSV, company, supervisor, progress, etc.)
- `INITIAL_ENTERPRISES` - Company data with name, address, field, contact info
- `INITIAL_SUBMISSIONS` - Student submission records with deadlines and scores
- `INITIAL_DEADLINES` - Assignment deadlines and milestones
- Imported/used in 15+ files across admin and lecturer features

**Size**: ~500+ lines of hardcoded data

### 2. **studentMockData.ts** - Student-Specific Mock Data
**Location**: `frontend/src/data/studentMockData.ts`

**Contains**:
- `STUDENT_PROFILE` - Current logged-in student profile data
- `INITIAL_STUDENT_TASKS` - Student task/action list
- `STUDENT_REPORT_DEADLINES` - Week-by-week reporting schedule
- `STUDENT_FEEDBACKS` - Feedback from lecturers and supervisors
- `STUDENT_NOTIFICATIONS` - Student notification feed
- Imported in 3+ student-facing components

**Size**: ~300+ lines of hardcoded data

### 3. **mockNotificationActivityLogs.ts** - Notification Logs
**Location**: `frontend/src/lib/mockNotificationActivityLogs.ts`

**Contains**:
- Activity logs for notification tracking
- Imported in admin notifications view

---

## 🗂️ Files Using MockData (44 matches across 37 files)

### **Admin Pages** (8 files)
1. `features/admin/pages/AccountView.tsx` - Uses `USE_MOCK`
2. `features/admin/pages/AssignmentsView.tsx` - Uses `USE_MOCK` + hooks
3. `features/admin/pages/CompaniesView.tsx` - Uses `INITIAL_ENTERPRISES`, `USE_MOCK`
4. `features/admin/pages/LecturersView.tsx` - Uses `USE_MOCK`
5. `features/admin/pages/NotificationsView.tsx` - Uses `USE_MOCK` + `MOCK_NOTIFICATION_ACTIVITY_LOGS`
6. `features/admin/pages/SemestersView.tsx` - Uses `USE_MOCK`
7. `features/admin/pages/SettingsView.tsx` - Uses `USE_MOCK`
8. `features/admin/pages/StudentsView.tsx` - Uses `USE_MOCK`
9. `features/admin/pages/UsersView.tsx` - Uses `USE_MOCK`

### **Admin Components** (1 file)
10. `features/admin/components/modals/AssignLecturerModal.tsx` - Uses `USE_MOCK`

### **Lecturer Pages** (4 files)
11. `features/lecturer/pages/AccountView.tsx` - Uses `USE_MOCK`
12. `features/lecturer/pages/ExportView.tsx` - Uses `USE_MOCK`
13. `features/lecturer/pages/NotificationsView.tsx` - Uses `USE_MOCK`
14. `features/lecturer/pages/TemplatesView.tsx` - Uses `USE_MOCK`

### **Lecturer Components** (1 file)
15. `features/lecturer/components/EvaluationDashboard.tsx` - Uses `USE_MOCK`

### **Student Pages** (1 file)
16. `features/student/pages/AccountView.tsx` - Uses `USE_MOCK`

### **Student Components** (1 file)
17. `features/student/components/Header.tsx` - Uses `STUDENT_NOTIFICATIONS` from mockData

### **Authentication Pages** (3 files)
18. `features/auth/pages/ChangePasswordPage.tsx` - Uses `USE_MOCK`
19. `features/auth/pages/ForgotPasswordPage.tsx` - Uses `USE_MOCK`
20. `features/auth/pages/ResetPasswordPage.tsx` - Uses `USE_MOCK`

### **Common Components** (1 file)
21. `components/common/LoginPortal.tsx` - Uses `USE_MOCK`

### **Contexts** (3 files)
22. `contexts/AuthContext.tsx` - Uses `USE_MOCK`
23. `contexts/SemesterContext.tsx` - Uses `USE_MOCK`

### **Custom Hooks** (7 files)
24. `hooks/useAdminAssignmentMatrix.ts` - Uses `USE_MOCK`
25. `hooks/useAdminDashboardStats.ts` - Uses `USE_MOCK`
26. `hooks/useAdminNavStats.ts` - Uses `USE_MOCK`
27. `hooks/useAdminStudentsPage.ts` - Uses `USE_MOCK`
28. `hooks/useLecturerPortalData.ts` - Uses `USE_MOCK` + imports from `mockData`
29. `hooks/useStudentPortalContext.ts` - Uses `USE_MOCK` + `STUDENT_PROFILE` from mockData
30. (Additional hooks may exist)

### **Services** (3 files)
31. `services/enterprise.service.ts` - Imports `INITIAL_ENTERPRISES` from mockData
32. `services/student.service.ts` - Imports `INITIAL_STUDENTS` from mockData
33. `services/submission.service.ts` - Imports `INITIAL_SUBMISSIONS` from mockData

### **Routes** (2 files)
34. `routes/AppRoutes.tsx` - Uses `USE_MOCK` + imports `useMockAppState`
35. `routes/useMockAppState.ts` - Imports from `mockData`
36. `routes/useRealAppState.ts` - Currently incomplete, relies on `INITIAL_DEADLINES`

### **Configuration** (1 file)
37. `config/env.ts` - Defines `USE_MOCK` flag based on environment variable

---

## 📡 Backend API Endpoints Available

### **Admin Controllers** (7 endpoints groups)
```
POST   /api/Admin/assignments           - Bulk assign students to lecturers
DELETE /api/Admin/assignments           - Unassign students
GET    /api/Admin/assignments/by-lecturer/{lecturerId}
GET    /api/Admin/assignments/{lecturerId}/{studentId}

GET    /api/Admin/companies             - List all companies
POST   /api/Admin/companies             - Create company
PUT    /api/Admin/companies/{id}        - Update company
DELETE /api/Admin/companies/{id}        - Delete company

GET    /api/Admin/lecturers             - List lecturers
POST   /api/Admin/lecturers             - Create lecturer
PUT    /api/Admin/lecturers/{id}        - Update lecturer
DELETE /api/Admin/lecturers/{id}        - Delete lecturer

GET    /api/Admin/students              - List students
POST   /api/Admin/students              - Create student
PUT    /api/Admin/students/{id}         - Update student
DELETE /api/Admin/students/{id}         - Delete student

GET    /api/Admin/semesters             - List semesters
POST   /api/Admin/semesters             - Create semester
PUT    /api/Admin/semesters/{id}        - Update semester
DELETE /api/Admin/semesters/{id}        - Delete semester

GET    /api/Admin/users                 - List users
POST   /api/Admin/users                 - Create user
PUT    /api/Admin/users/{id}            - Update user
DELETE /api/Admin/users/{id}            - Delete user

GET    /api/Admin/notifications         - List notification activities
```

### **Student Controllers** (4 endpoint groups)
```
GET    /api/Student                     - Get current student profile
GET    /api/Student/{id}                - Get student by ID
GET    /api/Student/by-mssv/{mssv}      - Get student by MSSV
GET    /api/Student/by-lecturer/{lecturerId}
GET    /api/Student/exports/assignments - Export assignments for student

GET    /api/StudentPortal               - Get student portal data
GET    /api/StudentPortal/profile       - Get student profile info
GET    /api/StudentPortal/tasks         - Get student tasks/deadlines
GET    /api/StudentPortal/feedback      - Get feedback for student
```

### **Submission Controllers** (3 endpoint groups)
```
GET    /api/Submission                  - List submissions
POST   /api/Submission                  - Create submission
PUT    /api/Submission/{id}             - Update submission
GET    /api/Submission/{id}             - Get submission by ID
DELETE /api/Submission/{id}             - Delete submission

GET    /api/Submission/by-student/{studentId}
GET    /api/Submission/by-assignment/{assignmentId}
POST   /api/Submission/{id}/grade       - Grade a submission
```

### **Lecturer Controllers** (4 endpoint groups)
```
GET    /api/Lecturer                    - Get current lecturer profile
GET    /api/Lecturer/{id}               - Get lecturer by ID
GET    /api/LecturerProfile             - Get lecturer profile details
PUT    /api/LecturerProfile             - Update lecturer profile

GET    /api/Lecturer/companies          - Get companies assigned to lecturer
GET    /api/Lecturer/students           - Get students assigned to lecturer
GET    /api/Lecturer/internships        - Get internship records
GET    /api/Lecturer/exports            - Export lecturer data
```

### **Weekly Report & Evaluation** (4 endpoint groups)
```
GET    /api/WeeklyReport                - List weekly reports
POST   /api/WeeklyReport                - Create report
PUT    /api/WeeklyReport/{id}           - Update report
GET    /api/WeeklyReport/by-student/{studentId}
GET    /api/WeeklyReport/by-week/{week}

GET    /api/Evaluation                  - List evaluations
POST   /api/Evaluation                  - Create evaluation
PUT    /api/Evaluation/{id}             - Update evaluation
GET    /api/Evaluation/by-student/{studentId}
```

### **Notification Controller** (2 endpoint groups)
```
GET    /api/Notification                - List notifications
POST   /api/Notification                - Create notification
GET    /api/Notification/{id}           - Get notification by ID
PUT    /api/Notification/{id}/read      - Mark as read
GET    /api/Notification/unread         - Get unread count
```

### **Auth Controller** (3 endpoint groups)
```
POST   /api/Auth/login                  - User login
POST   /api/Auth/logout                 - User logout
POST   /api/Auth/refresh                - Refresh token
POST   /api/Auth/change-password        - Change password
POST   /api/Auth/forgot-password        - Request password reset
POST   /api/Auth/reset-password         - Reset password
```

---

## 🔗 MockData → Backend API Mapping

| MockData | Current Usage | Backend Endpoint | Status |
|----------|---------------|------------------|--------|
| `INITIAL_STUDENTS` | Admin StudentsView, Services | `GET /api/Admin/students` | ⚠️ Needs implementation |
| `INITIAL_ENTERPRISES` | Admin CompaniesView, Services | `GET /api/Admin/companies` | ⚠️ Needs implementation |
| `INITIAL_SUBMISSIONS` | Submission Service | `GET /api/Submission` | ⚠️ Needs implementation |
| `INITIAL_DEADLINES` | useRealAppState, Routes | `GET /api/Submission/deadlines` | ⚠️ Missing endpoint |
| `STUDENT_PROFILE` | Student Portal, Hooks | `GET /api/StudentPortal/profile` | ⚠️ Needs implementation |
| `INITIAL_STUDENT_TASKS` | Student Portal | `GET /api/StudentPortal/tasks` | ⚠️ Missing endpoint |
| `STUDENT_REPORT_DEADLINES` | Student Portal | `GET /api/WeeklyReport/by-student/{id}` | ⚠️ Needs mapping |
| `STUDENT_FEEDBACKS` | Student Portal | `GET /api/Evaluation/by-student/{id}` | ⚠️ Needs mapping |
| `STUDENT_NOTIFICATIONS` | Header, Notifications View | `GET /api/Notification?unread=true` | ⚠️ Needs implementation |
| `MOCK_NOTIFICATION_ACTIVITY_LOGS` | Admin Notifications | `GET /api/Admin/notifications` | ⚠️ Needs implementation |

---

## 📋 Implementation Plan - Phase by Phase

### **Phase 1: Infrastructure Setup** ✅ (Foundation)
**Goal**: Prepare services and hooks to support backend API calls

**Tasks**:
1. [ ] Create API client configuration (baseURL, headers, interceptors)
2. [ ] Create type definitions for all API responses
3. [ ] Create error handling and loading state utilities
4. [ ] Update authentication service to use real backend auth endpoints
5. [ ] Create `useBackendData` hook pattern for reusable data fetching

**Timeline**: 1-2 days  
**Files**: `services/api.config.ts`, `types/api.ts`, `hooks/useBackendData.ts`

---

### **Phase 2: Student Portal (High Priority)** 🎯
**Goal**: Convert student-facing features to use real data

**2.1 Student Profile & Dashboard**
- [ ] Replace `STUDENT_PROFILE` mockdata
  - File: `features/student/pages/DashboardPage.tsx`
  - Endpoint: `GET /api/StudentPortal/profile`
  - Affected: Student profile display, semester info, company details

- [ ] Replace `INITIAL_STUDENT_TASKS` mockdata
  - File: `features/student/pages/DashboardPage.tsx`
  - Endpoint: `GET /api/StudentPortal/tasks` (or derive from submissions)
  - Affected: Action items, deadlines

**2.2 Student Notifications**
- [ ] Replace `STUDENT_NOTIFICATIONS` mockdata
  - Files: `features/student/components/Header.tsx`, `features/student/pages/NotificationsView.tsx`
  - Endpoint: `GET /api/Notification?studentId={id}`
  - Affected: Notification badge, notification list

**2.3 Weekly Reports Timeline**
- [ ] Replace `STUDENT_REPORT_DEADLINES` mockdata
  - File: `features/student/pages/WeeklyReportsView.tsx`
  - Endpoint: `GET /api/WeeklyReport/by-student/{id}`
  - Affected: Report deadline display, status tracking

**2.4 Feedback & Evaluations**
- [ ] Replace `STUDENT_FEEDBACKS` mockdata
  - File: `features/student/pages/FeedbackView.tsx`
  - Endpoint: `GET /api/Evaluation/by-student/{id}` + `GET /api/Feedback/by-student/{id}`
  - Affected: Lecturer feedback, company evaluations

**Timeline**: 2-3 days  
**Hooks to Update**: `useStudentPortalContext`, `useStudentPortalData`

---

### **Phase 3: Admin Pages** ⚙️
**Goal**: Convert admin management panels to use real data

**3.1 Admin Students Management**
- [ ] Replace mockdata in StudentsView
  - File: `features/admin/pages/StudentsView.tsx`
  - Endpoints: 
    - `GET /api/Admin/students` (list)
    - `PUT /api/Admin/students/{id}` (update)
    - `DELETE /api/Admin/students/{id}` (delete)
  - Affected: Student list, filters, bulk actions

**3.2 Admin Companies Management**
- [ ] Replace `INITIAL_ENTERPRISES` mockdata
  - File: `features/admin/pages/CompaniesView.tsx`
  - Endpoints:
    - `GET /api/Admin/companies` (list)
    - `POST /api/Admin/companies` (create)
    - `PUT /api/Admin/companies/{id}` (update)
    - `DELETE /api/Admin/companies/{id}` (delete)
  - Affected: Company list, details modal

**3.3 Admin Lecturers Management**
- [ ] Replace mockdata in LecturersView
  - File: `features/admin/pages/LecturersView.tsx`
  - Endpoints:
    - `GET /api/Admin/lecturers` (list)
    - `PUT /api/Admin/lecturers/{id}` (update)
    - `DELETE /api/Admin/lecturers/{id}` (delete)
  - Affected: Lecturer list

**3.4 Admin Assignments Management**
- [ ] Replace mockdata in AssignmentsView
  - File: `features/admin/pages/AssignmentsView.tsx`
  - Endpoints:
    - `GET /api/Admin/assignments/by-lecturer/{lecturerId}` (get matrix)
    - `POST /api/Admin/assignments` (bulk assign)
    - `DELETE /api/Admin/assignments` (unassign)
  - Affected: Assignment matrix view

**3.5 Admin Semesters Management**
- [ ] Replace mockdata in SemestersView
  - File: `features/admin/pages/SemestersView.tsx`
  - Endpoints:
    - `GET /api/Admin/semesters` (list)
    - `POST /api/Admin/semesters` (create)
    - `PUT /api/Admin/semesters/{id}` (update)
  - Affected: Semester list, schedule

**3.6 Admin Users Management**
- [ ] Replace mockdata in UsersView
  - File: `features/admin/pages/UsersView.tsx`
  - Endpoints:
    - `GET /api/Admin/users` (list)
    - `PUT /api/Admin/users/{id}` (update)
    - `DELETE /api/Admin/users/{id}` (delete)

**3.7 Admin Notifications**
- [ ] Replace `MOCK_NOTIFICATION_ACTIVITY_LOGS` mockdata
  - File: `features/admin/pages/NotificationsView.tsx`
  - Endpoint: `GET /api/Admin/notifications` (activity logs)

**Timeline**: 3-4 days  
**Hooks to Update**: `useAdminStudentsPage`, `useAdminDashboardStats`, `useAdminNavStats`, `useAdminAssignmentMatrix`

---

### **Phase 4: Lecturer Portal** 👨‍🏫
**Goal**: Convert lecturer-facing features to use real data

**4.1 Lecturer Dashboard & Profile**
- [ ] Replace mockdata in Lecturer AccountView
  - Endpoint: `GET /api/LecturerProfile`
  - Affected: Lecturer profile, stats

**4.2 Lecturer Students List**
- [ ] Replace mockdata in Lecturer views
  - Endpoint: `GET /api/Lecturer/students`
  - Affected: Assigned students display

**4.3 Lecturer Evaluation Dashboard**
- [ ] Replace mockdata in EvaluationDashboard
  - File: `features/lecturer/components/EvaluationDashboard.tsx`
  - Endpoints:
    - `GET /api/Evaluation/by-lecturer/{id}` (or similar)
    - `PUT /api/Evaluation/{id}` (submit evaluation)
  - Affected: Grading interface

**4.4 Lecturer Notifications**
- [ ] Replace mockdata in Lecturer NotificationsView
  - Endpoint: `GET /api/Notification?lecturerId={id}`

**4.5 Lecturer Templates**
- [ ] Replace mockdata in TemplatesView
  - Endpoint: `GET /api/Document/templates?type=lecturer`

**4.6 Lecturer Export**
- [ ] Replace mockdata in ExportView
  - Endpoint: `GET /api/Lecturer/exports`

**Timeline**: 2-3 days  
**Hooks to Update**: `useLecturerPortalData`

---

### **Phase 5: Authentication & Common** 🔐
**Goal**: Convert auth and shared components to use real data

**5.1 Login Portal**
- [ ] Replace mockdata in LoginPortal
  - File: `components/common/LoginPortal.tsx`
  - Endpoint: `POST /api/Auth/login`
  - Affected: Authentication flow

**5.2 Auth Pages**
- [ ] ChangePasswordPage: `POST /api/Auth/change-password`
- [ ] ForgotPasswordPage: `POST /api/Auth/forgot-password`
- [ ] ResetPasswordPage: `POST /api/Auth/reset-password`

**5.3 Contexts**
- [ ] AuthContext: Use real backend auth state
- [ ] SemesterContext: Use real semester data from backend

**Timeline**: 1-2 days  
**Files**: `contexts/AuthContext.tsx`, `contexts/SemesterContext.tsx`, `features/auth/pages/*.tsx`

---

### **Phase 6: Services & Hooks Cleanup** 🧹
**Goal**: Remove mockdata dependencies and consolidate service layer

**6.1 Service Updates**
- [ ] `enterprise.service.ts` - Remove `INITIAL_ENTERPRISES`, use API
- [ ] `student.service.ts` - Remove `INITIAL_STUDENTS`, use API
- [ ] `submission.service.ts` - Remove `INITIAL_SUBMISSIONS`, use API
- [ ] Update all services to use real HTTP client

**6.2 Hook Refactoring**
- [ ] Remove `useMockAppState` hook or convert to use real data
- [ ] Update `useRealAppState` to be fully functional
- [ ] Consolidate all data-fetching hooks to use common pattern

**6.3 Config Cleanup**
- [ ] Remove `USE_MOCK` environment variable dependency
- [ ] Remove or archive mockData files
- [ ] Update `AppRoutes.tsx` to use real state management

**Timeline**: 2-3 days

---

### **Phase 7: Testing & Validation** ✅
**Goal**: Ensure all components work correctly with real backend data

**7.1 Integration Testing**
- [ ] Test each page with real backend
- [ ] Verify error handling for failed API calls
- [ ] Test loading states and data display
- [ ] Test filters, sorting, pagination if applicable

**7.2 E2E Testing**
- [ ] User workflows: Login → Browse Data → Perform Actions
- [ ] Role-based access: Admin, Lecturer, Student flows
- [ ] Error scenarios: Network errors, invalid data

**7.3 Performance Optimization**
- [ ] Add request caching where appropriate
- [ ] Implement pagination for large datasets
- [ ] Optimize re-render behavior

**Timeline**: 2-3 days

---

## 🛠️ Technical Implementation Details

### API Configuration Pattern
```typescript
// services/api.config.ts
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';

export const createApiClient = () => ({
  get: async (endpoint: string) => {...},
  post: async (endpoint: string, data: any) => {...},
  put: async (endpoint: string, data: any) => {...},
  delete: async (endpoint: string) => {...},
});
```

### Hook Pattern for Data Fetching
```typescript
// hooks/useBackendData.ts
export const useBackendData = <T>(
  endpoint: string,
  options?: UseQueryOptions<T>
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(endpoint);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
};
```

### Service Layer Pattern
```typescript
// services/studentPortal.service.ts
export const studentPortalService = {
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/StudentPortal/profile`);
    return response.json();
  },
  
  getTasks: async () => {
    const response = await fetch(`${API_BASE_URL}/StudentPortal/tasks`);
    return response.json();
  },
  
  // etc...
};
```

---

## 📊 Risk Assessment & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Backend API not fully implemented | 🔴 High | Phase 1: Verify all endpoints exist before implementation |
| Data mismatch between mock and real data | 🟡 Medium | Create data mapping documentation, type definitions |
| Breaking changes in API responses | 🟡 Medium | Use TypeScript types, API versioning |
| Performance degradation with real data | 🟡 Medium | Implement pagination, caching, lazy loading |
| User confusion during migration | 🟡 Medium | Gradual rollout, feature flags per module |

---

## ✅ Success Criteria

- [ ] All 44 mockdata imports replaced with real API calls
- [ ] All pages/components render correctly with backend data
- [ ] No console errors or type mismatches
- [ ] Performance metrics maintained or improved
- [ ] 100% test coverage for data fetching logic
- [ ] User workflows function end-to-end
- [ ] mockData.ts and studentMockData.ts can be archived

---

## 📅 Timeline Summary

| Phase | Duration | Status |
|-------|----------|--------|
| Phase 1: Infrastructure | 1-2 days | 🔴 Not Started |
| Phase 2: Student Portal | 2-3 days | 🔴 Not Started |
| Phase 3: Admin Pages | 3-4 days | 🔴 Not Started |
| Phase 4: Lecturer Portal | 2-3 days | 🔴 Not Started |
| Phase 5: Auth & Common | 1-2 days | 🔴 Not Started |
| Phase 6: Cleanup | 2-3 days | 🔴 Not Started |
| Phase 7: Testing | 2-3 days | 🔴 Not Started |
| **Total** | **15-20 days** | **🔴 Not Started** |

---

## 📝 Next Steps

1. **Review this audit** with the team
2. **Verify backend API endpoints** are fully implemented
3. **Start Phase 1** - Infrastructure setup
4. **Create per-phase task tickets** in your project management system
5. **Set feature flags** to gradually enable real data integration
6. **Document API response schemas** for TypeScript type generation

---

## 📎 Related Documents

- [Backend API Documentation](../api/swagger.json)
- [Frontend Architecture](./frontend/README.md)
- [Type Definitions](./frontend/src/types/)
- [Environment Configuration](./frontend/.env.example)
