# Frontend MockData Conversion - Implementation Checklist

**Status**: Ready for Implementation  
**Total Tasks**: 50+  
**Estimated Timeline**: 15-20 working days  
**Priority**: High - Blocks full backend integration testing

---

## ✅ PHASE 1: Infrastructure Setup (1-2 days) 
**Owner**: [TBD]  
**Status**: 🔴 Not Started

### API Configuration
- [ ] Create `frontend/src/services/api.config.ts`
  - [ ] Import axios
  - [ ] Configure baseURL with env variable
  - [ ] Setup request interceptor for auth token
  - [ ] Setup response interceptor for 401 errors
  - [ ] Test configuration locally

- [ ] Update `frontend/.env.example` with API configuration
  - [ ] Add VITE_API_URL
  - [ ] Add VITE_API_TIMEOUT
  - [ ] Add feature flags

- [ ] Create `.env.local` for local development
  ```
  VITE_API_URL=http://localhost:5000/api
  VITE_API_TIMEOUT=10000
  ```

### Data Fetching Hooks
- [ ] Create `frontend/src/hooks/useBackendData.ts`
  - [ ] Implement generic hook for GET requests
  - [ ] Add loading and error states
  - [ ] Add refetch capability
  - [ ] Add optional refetch interval
  - [ ] Write unit tests

- [ ] Create `frontend/src/hooks/useMutation.ts`
  - [ ] Implement generic hook for POST/PUT/DELETE
  - [ ] Support method parameter
  - [ ] Support dynamic endpoint generation
  - [ ] Handle both data and no-data mutations
  - [ ] Write unit tests

### Service Layer
- [ ] Create `frontend/src/services/api.ts`
  - [ ] Organize services by module (auth, student, admin, etc.)
  - [ ] Implement all endpoints from swagger.json
  - [ ] Add JSDoc comments to all methods
  - [ ] Write integration tests

- [ ] Create `frontend/src/services/api.error.ts`
  - [ ] Implement error parsing
  - [ ] Add error logger
  - [ ] Add user-friendly error messages

### Error Handling
- [ ] Create `frontend/src/components/ErrorBoundary.tsx`
  - [ ] Implement error boundary component
  - [ ] Add fallback UI
  - [ ] Add error logging

- [ ] Create `frontend/src/hooks/useErrorHandler.ts`
  - [ ] Implement error handler hook
  - [ ] Add toast/notification integration if applicable

### Validation
- [ ] Test API client can connect to backend
- [ ] Test auth interceptor adds token
- [ ] Test 401 redirect on invalid token
- [ ] Test error handling on network failure
- [ ] Verify all hooks work in isolation

---

## ✅ PHASE 2: Student Portal (2-3 days)
**Owner**: [TBD]  
**Status**: 🔴 Not Started

### Student Profile & Dashboard
- [ ] Update `hooks/useStudentPortalContext.ts`
  - [ ] Remove USE_MOCK check
  - [ ] Import useBackendData hook
  - [ ] Call `GET /api/StudentPortal/profile`
  - [ ] Return profile, loading, error, refetch
  - [ ] Test with real backend

- [ ] Update `features/student/pages/DashboardPage.tsx`
  - [ ] Use updated useStudentPortalContext
  - [ ] Add loading spinner
  - [ ] Add error message display
  - [ ] Test with real data

- [ ] Update `features/student/pages/AccountView.tsx`
  - [ ] Replace USE_MOCK with API call
  - [ ] Display current student profile
  - [ ] Add edit capability if needed
  - [ ] Test form submission

### Student Tasks & Deadlines
- [ ] Create new hook `hooks/useStudentTasks.ts`
  - [ ] Call `GET /api/StudentPortal/tasks`
  - [ ] Return tasks, loading, error

- [ ] Update `features/student/pages/DashboardPage.tsx`
  - [ ] Integrate useStudentTasks
  - [ ] Display tasks with proper status
  - [ ] Add action buttons
  - [ ] Test task interactions

### Student Notifications
- [ ] Create new hook `hooks/useStudentNotifications.ts`
  - [ ] Call `GET /api/Notification?studentId=me`
  - [ ] Add filtering for unread
  - [ ] Add pagination if needed

- [ ] Update `features/student/components/Header.tsx`
  - [ ] Remove STUDENT_NOTIFICATIONS import
  - [ ] Use useStudentNotifications hook
  - [ ] Display notification count
  - [ ] Add mark as read functionality
  - [ ] Test notification badge

- [ ] Create `features/student/pages/NotificationsView.tsx` if not exists
  - [ ] Display all notifications
  - [ ] Add filtering/sorting
  - [ ] Add mark as read/delete actions

### Weekly Reports Timeline
- [ ] Create new hook `hooks/useStudentReports.ts`
  - [ ] Call `GET /api/WeeklyReport/by-student/{id}`
  - [ ] Map to StudentReportDeadline type

- [ ] Update `features/student/pages/WeeklyReportsView.tsx` if exists
  - [ ] Use useStudentReports hook
  - [ ] Display report schedule
  - [ ] Show status, dates, scores
  - [ ] Add submission link

### Student Feedback & Evaluations
- [ ] Create new hook `hooks/useStudentFeedback.ts`
  - [ ] Call `GET /api/Evaluation/by-student/{id}`
  - [ ] Map response to StudentFeedback type

- [ ] Update `features/student/pages/FeedbackView.tsx` if exists
  - [ ] Use useStudentFeedback hook
  - [ ] Display feedback from lecturers
  - [ ] Display evaluations from companies
  - [ ] Add detail view modal

### Testing
- [ ] Test student dashboard loads all data
- [ ] Test notifications update in real-time
- [ ] Test task actions work properly
- [ ] Test error states display correctly
- [ ] Test loading states with slow network

---

## ✅ PHASE 3: Admin Pages (3-4 days)
**Owner**: [TBD]  
**Status**: 🔴 Not Started

### Admin Students Management
- [ ] Update `hooks/useAdminStudentsPage.ts`
  - [ ] Remove USE_MOCK check
  - [ ] Call `GET /api/Admin/students`
  - [ ] Add filter/sort/pagination support
  - [ ] Return students, loading, error, refetch

- [ ] Update `features/admin/pages/StudentsView.tsx`
  - [ ] Use updated hook
  - [ ] Test list display
  - [ ] Implement filtering
  - [ ] Add create/edit/delete modals
  - [ ] Wire up CRUD operations
  - [ ] Test all interactions

### Admin Companies Management
- [ ] Update `services/enterprise.service.ts`
  - [ ] Replace INITIAL_ENTERPRISES with API calls
  - [ ] Implement getCompanies() with API
  - [ ] Implement CRUD methods
  - [ ] Add error handling

- [ ] Update `features/admin/pages/CompaniesView.tsx`
  - [ ] Remove mockData import
  - [ ] Use enterprise.service
  - [ ] Display company list
  - [ ] Implement create modal
  - [ ] Implement edit modal
  - [ ] Add delete with confirmation
  - [ ] Test all operations

### Admin Lecturers Management
- [ ] Create `hooks/useAdminLecturers.ts` if needed
  - [ ] Call `GET /api/Admin/lecturers`

- [ ] Update `features/admin/pages/LecturersView.tsx`
  - [ ] Replace mockdata
  - [ ] Display lecturer list
  - [ ] Implement CRUD operations
  - [ ] Test filtering and searching

### Admin Assignments Management
- [ ] Update `hooks/useAdminAssignmentMatrix.ts`
  - [ ] Remove USE_MOCK
  - [ ] Fetch lecturers: `GET /api/Admin/lecturers`
  - [ ] For each lecturer, fetch: `GET /api/Admin/assignments/by-lecturer/{id}`
  - [ ] Build assignment matrix

- [ ] Update `features/admin/pages/AssignmentsView.tsx`
  - [ ] Use updated hook
  - [ ] Display assignment matrix
  - [ ] Implement drag-and-drop or checkboxes
  - [ ] Wire up bulk assign: `POST /api/Admin/assignments`
  - [ ] Wire up unassign: `DELETE /api/Admin/assignments`
  - [ ] Add loading/error states
  - [ ] Test matrix interactions

### Admin Semesters Management
- [ ] Create `hooks/useAdminSemesters.ts`
  - [ ] Call `GET /api/Admin/semesters`

- [ ] Update `features/admin/pages/SemestersView.tsx`
  - [ ] Replace mockdata
  - [ ] Display semester list with dates
  - [ ] Implement create semester modal
  - [ ] Implement edit modal
  - [ ] Add delete with confirmation

### Admin Users Management
- [ ] Create `hooks/useAdminUsers.ts`
  - [ ] Call `GET /api/Admin/users`

- [ ] Update `features/admin/pages/UsersView.tsx`
  - [ ] Replace mockdata
  - [ ] Display user list
  - [ ] Add role display
  - [ ] Implement user management CRUD

### Admin Notifications Activity Log
- [ ] Create `hooks/useAdminNotifications.ts`
  - [ ] Call `GET /api/Admin/notifications`
  - [ ] Replace MOCK_NOTIFICATION_ACTIVITY_LOGS

- [ ] Update `features/admin/pages/NotificationsView.tsx`
  - [ ] Use new hook
  - [ ] Display activity log
  - [ ] Add filtering by type/date

### Admin Dashboard Stats
- [ ] Update `hooks/useAdminDashboardStats.ts`
  - [ ] Remove USE_MOCK
  - [ ] Fetch aggregated data from multiple endpoints
  - [ ] Calculate student counts, completion rates, etc.

- [ ] Update `hooks/useAdminNavStats.ts`
  - [ ] Remove USE_MOCK
  - [ ] Fetch nav bar stats

### Testing
- [ ] Test students view loads and displays correctly
- [ ] Test companies CRUD operations
- [ ] Test lecturers list and management
- [ ] Test assignment matrix interactions
- [ ] Test semester management
- [ ] Test all modals open/close correctly
- [ ] Test error handling for each operation

---

## ✅ PHASE 4: Lecturer Portal (2-3 days)
**Owner**: [TBD]  
**Status**: 🔴 Not Started

### Lecturer Profile & Dashboard
- [ ] Update `features/lecturer/pages/AccountView.tsx`
  - [ ] Replace USE_MOCK
  - [ ] Call `GET /api/LecturerProfile`
  - [ ] Display profile information
  - [ ] Add edit profile form if needed

### Lecturer Students List
- [ ] Create `hooks/useLecturerStudents.ts`
  - [ ] Call `GET /api/Lecturer/students`

- [ ] Update lecturer views to show assigned students
  - [ ] Display student list
  - [ ] Show student progress/status
  - [ ] Add link to student details

### Lecturer Evaluation Dashboard
- [ ] Update `features/lecturer/components/EvaluationDashboard.tsx`
  - [ ] Replace USE_MOCK
  - [ ] Call `GET /api/Evaluation/by-lecturer/{id}`
  - [ ] Display students needing evaluation
  - [ ] Implement grading interface
  - [ ] Wire up `PUT /api/Evaluation/{id}`
  - [ ] Test form submission

### Lecturer Notifications
- [ ] Create `hooks/useLecturerNotifications.ts`
  - [ ] Call `GET /api/Notification?lecturerId={id}`

- [ ] Update `features/lecturer/pages/NotificationsView.tsx`
  - [ ] Use new hook
  - [ ] Display notifications
  - [ ] Add mark as read

### Lecturer Templates
- [ ] Create `hooks/useLecturerTemplates.ts`
  - [ ] Call `GET /api/Document/templates?type=lecturer`

- [ ] Update `features/lecturer/pages/TemplatesView.tsx`
  - [ ] Replace mockdata
  - [ ] Display template list
  - [ ] Add download/use template functionality

### Lecturer Export
- [ ] Create `hooks/useLecturerExports.ts`
  - [ ] Call `GET /api/Lecturer/exports`

- [ ] Update `features/lecturer/pages/ExportView.tsx`
  - [ ] Replace mockdata
  - [ ] Display export options
  - [ ] Wire up export download

### Testing
- [ ] Test lecturer profile loads correctly
- [ ] Test evaluation dashboard displays students
- [ ] Test grading form submission
- [ ] Test export functionality

---

## ✅ PHASE 5: Authentication & Common (1-2 days)
**Owner**: [TBD]  
**Status**: 🔴 Not Started

### Authentication Context & Login
- [ ] Update `contexts/AuthContext.tsx`
  - [ ] Replace USE_MOCK
  - [ ] Use real auth service
  - [ ] Implement login flow
  - [ ] Store auth token securely
  - [ ] Handle logout

- [ ] Update `components/common/LoginPortal.tsx`
  - [ ] Replace USE_MOCK
  - [ ] Wire up login form
  - [ ] Call `POST /api/Auth/login`
  - [ ] Store token on success
  - [ ] Redirect on success

- [ ] Update `routes/ProtectedRoute.tsx`
  - [ ] Use real auth context
  - [ ] Verify token validity
  - [ ] Redirect to login if needed

### Auth Pages
- [ ] Update `features/auth/pages/ChangePasswordPage.tsx`
  - [ ] Remove USE_MOCK
  - [ ] Wire up `POST /api/Auth/change-password`

- [ ] Update `features/auth/pages/ForgotPasswordPage.tsx`
  - [ ] Remove USE_MOCK
  - [ ] Wire up `POST /api/Auth/forgot-password`

- [ ] Update `features/auth/pages/ResetPasswordPage.tsx`
  - [ ] Remove USE_MOCK
  - [ ] Wire up `POST /api/Auth/reset-password`

### Semester Context
- [ ] Update `contexts/SemesterContext.tsx`
  - [ ] Remove USE_MOCK
  - [ ] Call `GET /api/Admin/semesters`
  - [ ] Store current semester in context

### Testing
- [ ] Test login flow end-to-end
- [ ] Test token storage and retrieval
- [ ] Test logout functionality
- [ ] Test protected routes redirect properly
- [ ] Test password change flow
- [ ] Test password reset flow

---

## ✅ PHASE 6: Services & Hooks Cleanup (2-3 days)
**Owner**: [TBD]  
**Status**: 🔴 Not Started

### Service Layer Updates
- [ ] Update `services/enterprise.service.ts`
  - [ ] ✅ Remove INITIAL_ENTERPRISES import
  - [ ] ✅ Implement all methods with API calls
  - [ ] ✅ Add error handling
  - [ ] ✅ Write unit tests

- [ ] Update `services/student.service.ts`
  - [ ] ✅ Remove INITIAL_STUDENTS import
  - [ ] ✅ Implement all methods with API calls
  - [ ] ✅ Add error handling
  - [ ] ✅ Write unit tests

- [ ] Update `services/submission.service.ts`
  - [ ] ✅ Remove INITIAL_SUBMISSIONS import
  - [ ] ✅ Implement all methods with API calls
  - [ ] ✅ Add error handling
  - [ ] ✅ Write unit tests

- [ ] Update `services/studentPortal.service.ts`
  - [ ] ✅ Implement all methods with API calls

### Hook Cleanup
- [ ] Remove or archive `routes/useMockAppState.ts`
  - [ ] Verify no imports remain
  - [ ] Move to `deprecated/` folder

- [ ] Update `routes/useRealAppState.ts`
  - [ ] Make it fully functional
  - [ ] Replace INITIAL_DEADLINES reference
  - [ ] Test all data loading

- [ ] Audit all remaining hooks for mockdata references
  - [ ] `useLecturerPortalData.ts`
  - [ ] Any other hook using mockdata

### Config & Environment
- [ ] Remove `USE_MOCK` env variable from all places
  - [ ] Update `config/env.ts`
  - [ ] Remove from `.env.example`
  - [ ] Clean up any `if (USE_MOCK)` conditionals

- [ ] Update `routes/AppRoutes.tsx`
  - [ ] Remove mockdata reference
  - [ ] Use real state management
  - [ ] Test all routes

### Data Files Archival
- [ ] Backup `src/data/mockData.ts` to `deprecated/`
- [ ] Backup `src/data/studentMockData.ts` to `deprecated/`
- [ ] Backup `src/lib/mockNotificationActivityLogs.ts` to `deprecated/`
- [ ] Remove from imports in all files

### Testing
- [ ] Verify no mockdata imports remain in codebase
- [ ] Run grep for "mockdata" or "mockData"
- [ ] Verify no "USE_MOCK" references remain
- [ ] Audit for any remaining hardcoded test data

---

## ✅ PHASE 7: Testing & Validation (2-3 days)
**Owner**: [TBD]  
**Status**: 🔴 Not Started

### Integration Testing
- [ ] Test student portal full workflow
  - [ ] Login as student
  - [ ] View dashboard
  - [ ] Check notifications
  - [ ] View reports
  - [ ] Check feedback
  - [ ] Logout

- [ ] Test admin portal full workflow
  - [ ] Login as admin
  - [ ] View and manage students
  - [ ] View and manage companies
  - [ ] View and manage lecturers
  - [ ] Manage assignments
  - [ ] View notifications
  - [ ] Logout

- [ ] Test lecturer portal full workflow
  - [ ] Login as lecturer
  - [ ] View assigned students
  - [ ] Grade evaluations
  - [ ] Check notifications
  - [ ] Export data
  - [ ] Logout

### Error Handling Testing
- [ ] Test network error handling
- [ ] Test invalid credentials
- [ ] Test expired token
- [ ] Test 404 errors
- [ ] Test server errors (500)
- [ ] Test validation errors

### Performance Testing
- [ ] Measure API response times
- [ ] Test with large datasets
  - [ ] 100+ students
  - [ ] 50+ companies
  - [ ] 30+ lecturers
- [ ] Check loading state transitions
- [ ] Verify no memory leaks

### Browser & Device Testing
- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari
- [ ] Test on mobile devices
- [ ] Test responsive design

### Load Testing (Optional)
- [ ] Test concurrent user access
- [ ] Test API rate limiting
- [ ] Verify caching works properly

### Documentation
- [ ] Update README with backend setup instructions
- [ ] Document all API changes
- [ ] Update type definitions documentation
- [ ] Create developer guide for new contributors

### Final Verification
- [ ] Run linter: `npm run lint`
- [ ] Run type check: `npm run typecheck`
- [ ] Run tests: `npm run test`
- [ ] Build for production: `npm run build`
- [ ] Verify no console errors
- [ ] Verify no console warnings

---

## 📊 Progress Tracking

| Phase | Tasks | Started | Completed | % Done |
|-------|-------|---------|-----------|--------|
| Phase 1 | 15 | [ ] | [ ] | 0% |
| Phase 2 | 12 | [ ] | [ ] | 0% |
| Phase 3 | 18 | [ ] | [ ] | 0% |
| Phase 4 | 7 | [ ] | [ ] | 0% |
| Phase 5 | 5 | [ ] | [ ] | 0% |
| Phase 6 | 8 | [ ] | [ ] | 0% |
| Phase 7 | 5 | [ ] | [ ] | 0% |
| **TOTAL** | **70** | | | **0%** |

---

## 🔑 Key Notes

- Start with Phase 1 infrastructure - it's required for all other phases
- Don't skip testing - test each page thoroughly before moving to the next phase
- Use feature flags for gradual rollout if needed
- Keep mockdata files as backup until all features are fully tested
- Communicate progress to the team
- Update this checklist as you complete tasks

---

## 📞 Support & Questions

- **API Documentation**: See `../api/swagger.json` or `../docs/08-API-Specification.md`
- **Backend Issues**: Check backend logs and verify endpoints are working
- **Type Issues**: Review `frontend/src/types/` for type definitions
- **Performance**: Check network tab in browser DevTools

---

**Last Updated**: 2026-08-17  
**Next Review**: After Phase 1 completion
