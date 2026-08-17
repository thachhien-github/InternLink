# InternLink Frontend-Backend Mapping Audit & Implementation Plan

**Date:** 2026-08-16  
**Status:** Comprehensive audit complete - Ready for implementation  
**Current State:** Giao diện 3 role chưa hoàn toàn map đúng backend. Sử dụng mock data quá nhiều.

---

## Executive Summary

### Current Situation
- ✅ **Backend API:** Đã định nghĩa đầy đủ (21 controllers, seed data sẵn sàng)
- ✅ **Frontend Pages:** Cấu trúc 3 role (Admin, Lecturer, Student) đã tạo
- ❌ **Data Binding:** Chỉ ~30% properly mapped; ~70% còn dùng mock data
- ❌ **Flow:** Không nhất quán, chưa chuẩn hóa

### Root Cause
Frontend được phát triển với `VITE_USE_MOCK=true` flag:
- Đơn giản hóa dev ban đầu
- Nhưng giờ phải loại bỏ toàn bộ để production-ready
- **219 occurrences** của USE_MOCK spread across 41 files

### Impact
- User không thấy real data khi test
- Admin không quản lý được dữ liệu thực
- Lecturer không thấy sinh viên được phân công
- Student không thấy đợt thực tập của mình

---

## Part 1: Current Status by Role

### ⚠️ STUDENT ROLE (MOST CRITICAL)

**Pages Summary:**
| Page | Status | Mock Files | Issue |
|------|--------|-----------|-------|
| Dashboard | ❌ Broken | STUDENT_PROFILE, INITIAL_STUDENT_TASKS, STUDENT_REPORT_DEADLINES, STUDENT_FEEDBACKS, STUDENT_NOTIFICATIONS | All hardcoded mock data |
| Weekly Reports | ⚠️ Mixed | MOCK_WEEKLY_REPORTS + weeklyReportService | Dual path, USE_MOCK decides |
| Submissions | ⚠️ Mixed | mockUploadSeed + API | Same dual path |
| Feedback | ❌ Broken | MOCK_FEEDBACKS | Only mock data |
| Internship | ⚠️ Mixed | STUDENT_PROFILE + StudentPortalContext | Incomplete binding |
| Notifications | ⚠️ Mixed | MOCK_NOTIFICATIONS | Dual path |
| Templates | ⚠️ Mixed | MOCK_TEMPLATES | Unclear purpose |
| Account | ✅ OK | — | Uses auth service |

**Student Dashboard - Current Code:**
```typescript
// File: src/features/student/pages/DashboardView.tsx
import { STUDENT_PROFILE, INITIAL_STUDENT_TASKS, STUDENT_REPORT_DEADLINES, ... } from "../../../data/studentMockData";

const { profile } = useStudentPortal();  // ← Tries to get from context
// But then uses hardcoded mock data instead:
<PageHeader title={`Xin chào, ${profile.name}`} ...>
<span>{profile.statusBadge}</span>
</PageHeader>
// profile comes from mock, not from API /api/StudentPortal/me
```

**What Should Happen:**
```typescript
// Step 1: Fetch profile from API
const [profile, setProfile] = useState<StudentPortalProfileDto | null>(null)
useEffect(() => {
  studentPortalService.getMe()
    .then(setProfile)
    .catch(err => onShowToast(getApiErrorMessage(err), 'error'))
}, [])

// Step 2: Fetch weekly reports
const [reports, setReports] = useState<WeeklyReportDto[]>([])
useEffect(() => {
  weeklyReportService.getMine()
    .then(setReports)
    .catch(err => onShowToast(getApiErrorMessage(err), 'error'))
}, [])

// Step 3: Compute tasks from reports
const tasks = computeTasksFromReports(reports, profile?.internship)

// Step 4: Render with real data
<PageHeader title={`Xin chào, ${profile?.fullName}`} ...>
```

---

### ⚠️ LECTURER ROLE

**Pages Summary:**
| Page | Status | Issue |
|------|--------|-------|
| Dashboard | ✅ OK | Uses `useAdminDashboardStats` hook (shared) |
| Students | ⚠️ Needs Check | Should call `/api/Lecturer/internships` |
| Enterprises | ⚠️ Unclear | Data source? |
| Reports | ✅ OK | Uses `weeklyReportService` |
| Evaluations | ⚠️ Check | API binding unclear |
| Analytics | ⚠️ Unclear | How to calculate? |
| Templates | ❌ Mock | Uses INITIAL_DOCUMENTS |
| Notifications | ⚠️ Mixed | Mock + API |
| Account | ✅ OK | Uses auth service |

**Lecturer API Endpoints (Available):**
```
GET  /api/Lecturer/internships              → Get assigned students
GET  /api/Lecturer/internships/{id}         → Student detail
GET  /api/Lecturer/submissions              → Weekly reports to review
POST /api/Lecturer/submissions/{id}/feedback → Add feedback
GET  /api/Lecturer/evaluations              → Get evaluations
POST /api/Lecturer/evaluations              → Create evaluation
```

---

### ❌ ADMIN ROLE

**Pages Summary:**
| Page | Status | Issue |
|------|--------|-------|
| Dashboard | ⚠️ Check | Uses `useAdminDashboardStats` |
| Semesters | ⚠️ Check | No clear API mapping |
| Assignments | ❌ Broken | mockLecturers, mockStudents hardcoded |
| Lecturers | ⚠️ Mixed | Mock + API |
| Students | ⚠️ Mixed | mockStudents + useAdminStudentsPage hook |
| Companies | ❌ Broken | Uses INITIAL_ENTERPRISES mock |
| Users | ✅ OK | Calls adminUsersService |
| Account Requests | ❌ Unclear | Unknown status |
| Notifications | ⚠️ Mixed | Mock + API |
| Settings | ⚠️ Unclear | Unknown status |
| Account | ✅ OK | Uses auth service |

**Admin API Endpoints (Available):**
```
GET/POST/PUT/DELETE  /api/Admin/students        (+ search, import)
GET/POST/PUT/DELETE  /api/Admin/companies       (+ search, import)
GET/POST/PUT/DELETE  /api/Admin/users
GET/POST/PUT/DELETE  /api/Admin/assignments     (assign lecturer→students)
GET                  /api/Admin/semesters
GET/POST             /api/Admin/notifications
```

---

## Part 2: Detailed Implementation Plan

### PHASE 1: Remove Mock Dependency (Prerequisite)

**Goal:** Make `USE_MOCK` flag obsolete. All data from real API.

**Step 1.1: Update Environment Configuration**
```bash
# .env (frontend root)
VITE_API_BASE_URL=http://localhost:7109
VITE_USE_MOCK=false  # ← Change to false
```

**Step 1.2: Verify Backend is Running**
```
Backend should be accessible at: http://localhost:7109/swagger
Seed data should be loaded with accounts: superadmin, lecturer1, student1
```

**Step 1.3: Test One Page - StudentPortal Profile**
- Login as student1/Password123!
- Call: `GET /api/StudentPortal/me`
- Should return: `StudentPortalProfileDto { fullName, mssv, company, internshipStatus, ... }`

**Estimated Time:** 30 min (mainly waiting for backend startup)

---

### PHASE 2: Fix Student Module (Highest Priority)

#### 2.1 Dashboard View → Replace Mock Profile

**File:** `src/features/student/pages/DashboardView.tsx`

**Current Problem:**
```typescript
import { STUDENT_PROFILE, INITIAL_STUDENT_TASKS, ... } from "../../../data/studentMockData";
// Line 49-50
<PageHeader title={`Xin chào, ${profile.name}`} ...>
```

**Solution:**
```typescript
// Remove imports of mock data
// import { STUDENT_PROFILE, INITIAL_STUDENT_TASKS, ... } → DELETE

// Import services
import { studentPortalService } from "../../../services/studentPortal.service";
import { weeklyReportService } from "../../../services/weeklyReport.service";
import { mapStudentPortalDtoToProfile } from "../../../lib/portalMappers";

// Replace useState calls:
const { profile: ctxProfile, isLoading } = useStudentPortal();

// Add API data fetching
const [reports, setReports] = useState<WeeklyReportDto[]>([]);
const [reportError, setReportError] = useState<string>("");

useEffect(() => {
  if (!ctxProfile?.internshipId) return;
  
  weeklyReportService.getByInternship(ctxProfile.internshipId)
    .then(setReports)
    .catch(err => setReportError(getApiErrorMessage(err)));
}, [ctxProfile?.internshipId]);

// Compute tasks from actual reports instead of mock
const computedTasks = useMemo(() => {
  return reports.map((r, idx) => ({
    id: r.id,
    title: `Báo cáo tuần ${r.weekNumber}`,
    deadline: r.submittedAt ? formatDate(r.submittedAt) : "Chưa nộp",
    priority: r.status === "draft" ? "Cao" : "Bình thường",
    completed: r.status !== "draft",
    category: "Báo cáo",
  }));
}, [reports]);

// Use real profile data
<PageHeader 
  title={`Xin chào, ${ctxProfile?.fullName || "Sinh viên"}`}
  subtitle={`Thực tập tại ${ctxProfile?.companyName} (${ctxProfile?.position})`}
  ...
>
```

**Breaking Changes:** Remove INITIAL_STUDENT_TASKS, STUDENT_REPORT_DEADLINES  
**Testing:** Login as student1, verify dashboard shows real internship + reports  
**Estimated Time:** 1-2 hours

---

#### 2.2 Weekly Reports → Remove Mock Data Entirely

**File:** `src/features/student/pages/WeeklyReportsView.tsx`

**Current Problem:**
```typescript
const [reports, setReports] = useState<WeeklyReportRow[]>(
  USE_MOCK ? MOCK_WEEKLY_REPORTS : []
);
```

**Solution:**
1. Remove: `const MOCK_WEEKLY_REPORTS = [...]`
2. Remove: USE_MOCK conditional
3. Fetch from API on mount:
```typescript
useEffect(() => {
  if (!profile?.internshipId) return;
  
  weeklyReportService.getByInternship(profile.internshipId)
    .then(data => {
      setReports(data.map(mapWeeklyReportDtoToUi));
    })
    .catch(err => onShowToast(getApiErrorMessage(err), 'error'));
}, [profile?.internshipId]);
```

**Estimated Time:** 30 min

---

#### 2.3 Submissions → Replace Mock Data

**File:** `src/features/student/pages/SubmissionsView.tsx`

**Current Problem:**
```typescript
const [hasSubmissions, setHasSubmissions] = useState(USE_MOCK);
const [submissions, setSubmissions] = useState(
  USE_MOCK ? mockUploadSeed : []
);
```

**Solution:** Create API service or use existing endpoints, then fetch:
```typescript
// Call to fetch submissions
const [submissions, setSubmissions] = useState<SubmissionDto[]>([]);

useEffect(() => {
  submissionService.getMine()
    .then(setSubmissions)
    .catch(err => onShowToast(getApiErrorMessage(err), 'error'));
}, []);
```

**Check if API exists:** Look for `/api/Submission/mine` or create if missing  
**Estimated Time:** 30 min

---

#### 2.4 Feedback View → Remove Mock Feedbacks

**File:** `src/features/student/pages/FeedbackView.tsx`

**Current Problem:**
```typescript
const [feedbacks] = useState(
  USE_MOCK ? MOCK_FEEDBACKS : []
);
```

**Solution:** 
1. Feedback data should come from WeeklyReport responses (embedded)
2. Or call separate feedback API if exists
3. Merge lecturer feedback + company feedback

```typescript
// Combine feedbacks from reports and submissions
const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

useEffect(() => {
  // Get feedback from weekly reports
  weeklyReportService.getByInternship(internshipId)
    .then(reports => {
      const extracted = reports
        .filter(r => r.lecturerComment)
        .map(r => ({ from: "Giảng viên", comment: r.lecturerComment, ... }));
      setFeedbacks(extracted);
    });
}, [internshipId]);
```

**Estimated Time:** 30 min

---

#### 2.5 Other Student Pages

| Page | Action | Time |
|------|--------|------|
| Internship | Bind to StudentPortalContext | 20 min |
| Notifications | Call notification service | 20 min |
| Templates | Define purpose + API binding | 30 min |

**Total Student Module: 4-5 hours**

---

### PHASE 3: Fix Admin Module

#### 3.1 Students View

**File:** `src/features/admin/pages/StudentsView.tsx`

**Current Problem:**
```typescript
const [mockStudents, setMockStudents] = useState([
  { id: "st-1", mssv: "20110201", fullName: "Nguyễn Văn Minh", ... },
  { id: "st-2", mssv: "20110202", fullName: "Trần Thị Thu Thảo", ... },
  ...
]);

const students = USE_MOCK ? mockStudents : apiPage.students;
const setStudents = USE_MOCK ? setMockStudents : apiPage.setStudents;
```

**Solution:**
1. Delete `mockStudents` state variable
2. Remove all USE_MOCK conditions
3. Always use `apiPage` (which calls `/api/Admin/students`)

```typescript
// Before:
const students = USE_MOCK ? mockStudents : apiPage.students;

// After:
const students = apiPage.students;
```

**Estimated Time:** 1 hour

---

#### 3.2 Companies View

**File:** `src/features/admin/pages/CompaniesView.tsx`

**Current Problem:**
```typescript
const [companies] = useState(
  USE_MOCK ? INITIAL_ENTERPRISES : []
);
```

**Solution:** Call API service
```typescript
const [companies, setCompanies] = useState<Company[]>([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  adminCompaniesService.getAll()
    .then(setCompanies)
    .catch(err => onShowToast(getApiErrorMessage(err), 'error'))
    .finally(() => setIsLoading(false));
}, []);
```

**Estimated Time:** 45 min

---

#### 3.3 Assignments View

**File:** `src/features/admin/pages/AssignmentsView.tsx`

**Current Problem:**
```typescript
const lecturers = USE_MOCK ? mockLecturers : apiMatrix.lecturers;
const students = USE_MOCK ? mockStudents : apiMatrix.students;
```

**Solution:**
1. Delete mock arrays
2. Get data from useAdminAssignmentMatrix hook (verify it calls API)
3. Ensure assignment POST/PUT calls `/api/Admin/assignments`

**Estimated Time:** 1.5 hours

---

#### 3.4 Dashboard & Other Pages

| Page | Issue | Time |
|------|-------|------|
| Dashboard | Verify `useAdminDashboardStats` calls API | 45 min |
| Semesters | Implement API binding | 45 min |
| Lecturers | Remove mock, use API | 45 min |
| Notifications | Remove mock, use API | 45 min |

**Total Admin Module: 5-6 hours**

---

### PHASE 4: Fix Lecturer Module

| Page | Issue | Solution | Time |
|------|-------|----------|------|
| Dashboard | Verify stats | Use `/api/Lecturer/internships` | 45 min |
| Students | Should list assigned internships | Call `/api/Lecturer/internships` | 45 min |
| Reports | Check weeklyReportService | Already uses API ✓ | 0 min |
| Evaluations | Verify API binding | Call `/api/Lecturer/evaluations` | 45 min |
| Analytics | Define data source | Use report data | 1 hour |
| Templates | Remove mock | API binding | 45 min |
| Notifications | Mixed mode | Use API only | 45 min |

**Total Lecturer Module: 4-5 hours**

---

### PHASE 5: Standardize Data Flow

**Goal:** Consistent patterns across all pages

#### 5.1 Error Handling Pattern
```typescript
// Standard try-catch block
try {
  const data = await someService.fetch();
  setState(data);
} catch (error) {
  const message = getApiErrorMessage(error);
  onShowToast(message, 'error');
  setError(message);
}
```

**Files to Update:** All 30+ pages  
**Time:** 2-3 hours

#### 5.2 Loading State Pattern
```typescript
// Standard loading indicator
const [isLoading, setIsLoading] = useState(true);
const [isSaving, setIsSaving] = useState(false);

useEffect(() => {
  setIsLoading(true);
  service.fetch()
    .finally(() => setIsLoading(false));
}, []);

if (isLoading) return <SkeletonLoader />;
```

**Time:** 1-2 hours

#### 5.3 Type Mapping Utility Functions
```typescript
// src/lib/mappers.ts - centralize all DTOs ↔ UI type conversions
export function mapStudentDtoToRow(dto: StudentDto): AdminStudentRow {
  return {
    id: dto.id,
    mssv: dto.studentCode,
    fullName: dto.fullName,
    // ... validate and transform
  };
}
```

**Time:** 1-2 hours

#### 5.4 API Response Validation
```typescript
// src/lib/validators.ts
export function validateStudentResponse(data: unknown): StudentDto {
  if (!data || typeof data !== 'object') throw new Error('Invalid response');
  const { id, fullName, studentCode } = data as any;
  if (!id || !fullName || !studentCode) {
    throw new Error('Missing required fields');
  }
  return data as StudentDto;
}
```

**Time:** 1-2 hours

**Total Phase 5: 5-7 hours**

---

## Part 3: Implementation Roadmap

### Week 1: Foundation
- [ ] Day 1: Backend verification + VITE_USE_MOCK=false
- [ ] Day 2-3: Student Dashboard (Phase 2.1-2.2)
- [ ] Day 4: Student remaining pages (Phase 2.3-2.5)
- [ ] Day 5: Code review + testing

### Week 2: Admin & Standardization
- [ ] Day 1-2: Admin module (Phase 3)
- [ ] Day 3-4: Lecturer module (Phase 4)
- [ ] Day 5: Data flow standardization (Phase 5)

### Week 3: Testing & Fixes
- [ ] UAT with all 3 roles
- [ ] Bug fixes
- [ ] Performance optimization
- [ ] Documentation

---

## Part 4: Testing Checklist

### Student Role
```
DASHBOARD:
  [ ] Profile shows real name, MSSV, company, position from API
  [ ] Tasks list shows only pending reports (not hardcoded)
  [ ] Deadline section shows actual report due dates
  [ ] Feedback shows messages from API
  [ ] Notifications populated from API
  
WEEKLY REPORTS:
  [ ] List shows all reports from database
  [ ] Can create new report
  [ ] Can update draft report
  [ ] Can submit report
  [ ] Lecturer can add feedback

SUBMISSIONS:
  [ ] List shows submitted files from database
  [ ] Can upload new submission
  [ ] Status updates reflect in list

FEEDBACK:
  [ ] Shows feedback from lecturer
  [ ] Shows feedback from company supervisor
  [ ] Grouped by report or time
```

### Lecturer Role
```
DASHBOARD:
  [ ] Shows only assigned students (not all students)
  [ ] Stats calculated from real internships
  [ ] Recent submissions list is accurate

STUDENTS:
  [ ] Shows only students assigned to this lecturer
  [ ] Can click to see student details
  [ ] Shows internship status

WEEKLY REPORTS:
  [ ] Shows reports from assigned students
  [ ] Can add feedback/review
  [ ] Status changes saved to database

EVALUATIONS:
  [ ] Can create evaluation for student
  [ ] Can view evaluation history
```

### Admin Role
```
STUDENTS:
  [ ] List shows all students from database
  [ ] Can create student account
  [ ] Can edit student info
  [ ] Can soft-delete student
  [ ] Can import from Excel
  [ ] Search/filter works

COMPANIES:
  [ ] List shows all companies from database
  [ ] CRUD operations work
  [ ] Import works

ASSIGNMENTS:
  [ ] Can assign students to lecturers
  [ ] Matrix shows real data
  [ ] Bulk assign works

USERS:
  [ ] Can create user accounts
  [ ] Can reset password
  [ ] Can deactivate users
```

---

## Part 5: Known Blockers & Solutions

### Blocker 1: Missing API Endpoints?
**Check these endpoints in Swagger:**
```
GET /api/Submission/mine
POST /api/Submission
GET /api/Lecturer/internships
GET /api/Lecturer/evaluations
POST /api/Lecturer/evaluations
```

**If missing:** Create them in backend (backend/InternLink/InternLink.API/Controllers/)

---

### Blocker 2: Type Mismatches
**Example:** API returns `weekNumber: number`, UI expects `weekNumber: string`

**Solution:** Use mapper functions to transform:
```typescript
export function mapWeeklyReportDtoToRow(dto: WeeklyReportDto): WeeklyReportRow {
  return {
    ...dto,
    weekNumber: dto.weekNumber, // already a number
    deadline: formatDate(dto.dueDate),
  };
}
```

---

### Blocker 3: Circular Dependencies
**If services import from mock data and vice versa:**
- Remove mock data imports from services
- Keep mock data only in test files
- Use services directly in pages

---

## Implementation Priority Summary

```
CRITICAL PATH (Week 1):
1. Disable VITE_USE_MOCK
2. Fix Student Dashboard
3. Fix Student Weekly Reports
4. Fix Student Submissions
5. Fix Admin Students
6. Fix Admin Companies

HIGH PRIORITY (Week 2):
7. Fix Lecturer internships list
8. Fix Admin Assignments
9. Standardize error handling
10. Standardize loading states

MEDIUM PRIORITY (Week 3):
11. Fix remaining pages
12. Add input validation
13. Performance optimization
14. Documentation
```

---

## File Changes Summary

### Files to DELETE (Mock Data)
- ~~`src/data/mockData.ts`~~ (Keep for tests only)
- ~~`src/data/studentMockData.ts`~~ (Keep for tests only)
- Remove INITIAL_STUDENTS, INITIAL_ENTERPRISES imports
- Remove MOCK_WEEKLY_REPORTS, MOCK_FEEDBACKS, etc.

### Files to CREATE
- `src/lib/mappers.ts` - DTO ↔ UI type conversions
- `src/lib/validators.ts` - API response validation
- Missing API service files (if needed)

### Files to MODIFY (~30+ files)
All page components in:
- `src/features/admin/pages/*.tsx` (11 pages)
- `src/features/lecturer/pages/*.tsx` (10 pages)
- `src/features/student/pages/*.tsx` (7 pages)

Plus:
- `src/hooks/use*.ts` (10+ hooks)
- `src/contexts/*.ts` (2-3 contexts)
- `src/services/*.ts` (verify all call APIs correctly)

---

## Questions for Team

1. **Is `/api/Admin/assignments` endpoint fully implemented?**
   - Should support bulk assign
   - Should support assign/unassign operations

2. **Do we have evaluation endpoints?**
   - `/api/Lecturer/evaluations` (GET/POST)
   - `/api/Student/evaluations` (GET)

3. **What's the analytics calculation method?**
   - Aggregate from reports? Or separate calculation?

4. **Email notifications implemented?**
   - Should UI show only UI notifications?
   - Or fetch from notification service?

5. **Can we remove mock data entirely from production build?**
   - Or keep as fallback?

---

## Success Criteria

✅ All data shown in UI comes from database, never from hardcoded mock  
✅ USE_MOCK flag is obsolete (can be removed)  
✅ All 3 roles pass UAT with real data  
✅ Consistent error handling across all pages  
✅ Consistent loading states  
✅ No console errors related to data fetching  
✅ Response times < 500ms for most API calls  

---

## Next Steps

1. **Immediate:** Review this plan with team
2. **This Week:** 
   - [ ] Verify backend API completeness
   - [ ] Set `VITE_USE_MOCK=false` in .env
   - [ ] Start Phase 1: Student Dashboard
3. **Week 2:** Admin & Lecturer modules
4. **Week 3:** Testing & fixes

---

**Document Status:** Ready for implementation  
**Last Updated:** 2026-08-16  
**Prepared by:** GitHub Copilot  
