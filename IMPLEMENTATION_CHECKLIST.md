# InternLink Data Mapping - Quick Reference Checklist

## Environment Setup
- [ ] Backend running on `:7109`
- [ ] Swagger available at `http://localhost:7109/swagger`
- [ ] `.env` updated: `VITE_USE_MOCK=false`
- [ ] Frontend can call backend API

---

## PHASE 1: Student Module (Critical)

### 1.1 Dashboard View
**File:** `src/features/student/pages/DashboardView.tsx`

**Remove These:**
```typescript
- import { STUDENT_PROFILE, INITIAL_STUDENT_TASKS, STUDENT_REPORT_DEADLINES, STUDENT_FEEDBACKS, STUDENT_NOTIFICATIONS }
- Any hardcoded mock data
- USE_MOCK conditionals
```

**Add These:**
```typescript
import { studentPortalService } from "../../../services/studentPortal.service";
import { weeklyReportService } from "../../../services/weeklyReport.service";

// Fetch profile
const [profile, setProfile] = useState(null);
useEffect(() => {
  studentPortalService.getMe()
    .then(setProfile)
    .catch(err => onShowToast(getApiErrorMessage(err), 'error'));
}, []);

// Fetch reports
const [reports, setReports] = useState([]);
useEffect(() => {
  if (!profile?.internshipId) return;
  weeklyReportService.getByInternship(profile.internshipId)
    .then(setReports)
    .catch(err => onShowToast(getApiErrorMessage(err), 'error'));
}, [profile?.internshipId]);

// Compute tasks from reports, not mock data
const tasks = useMemo(() => computeTasksFromReports(reports), [reports]);
```

**Test:**
- [ ] Login as student1
- [ ] Dashboard shows real name, MSSV
- [ ] Dashboard shows real company, position
- [ ] Tasks come from weekly reports
- [ ] Feedback comes from API

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Completed

---

### 1.2 Weekly Reports View
**File:** `src/features/student/pages/WeeklyReportsView.tsx`

**Remove:**
```typescript
- const MOCK_WEEKLY_REPORTS = [...]
- USE_MOCK ? MOCK_WEEKLY_REPORTS : []
```

**Replace with:**
```typescript
const [reports, setReports] = useState<WeeklyReportDto[]>([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  if (!profile?.internshipId) return;
  weeklyReportService.getByInternship(profile.internshipId)
    .then(data => setReports(data.map(mapWeeklyReportDtoToUi)))
    .catch(err => onShowToast(getApiErrorMessage(err), 'error'))
    .finally(() => setIsLoading(false));
}, [profile?.internshipId]);
```

**Test:**
- [ ] List loads from API
- [ ] Can create new report
- [ ] Can submit report
- [ ] Status updates saved to DB

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Completed

---

### 1.3 Submissions View
**File:** `src/features/student/pages/SubmissionsView.tsx`

**Remove:**
```typescript
- mockUploadSeed
- USE_MOCK ? mockUploadSeed : []
```

**Add:**
```typescript
import { submissionService } from "../../../services/submission.service";

const [submissions, setSubmissions] = useState<SubmissionDto[]>([]);

useEffect(() => {
  submissionService.getMine()
    .then(setSubmissions)
    .catch(err => onShowToast(getApiErrorMessage(err), 'error'));
}, []);
```

**Test:**
- [ ] List loads from API
- [ ] Can upload new submission
- [ ] Files persist in database

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Completed

---

### 1.4 Feedback View
**File:** `src/features/student/pages/FeedbackView.tsx`

**Remove:**
```typescript
- MOCK_FEEDBACKS
- USE_MOCK ? MOCK_FEEDBACKS : []
```

**Add:**
```typescript
// Feedback should come from API responses (embedded in weekly reports or submissions)
const [feedbacks, setFeedbacks] = useState([]);

useEffect(() => {
  weeklyReportService.getByInternship(internshipId)
    .then(reports => {
      const extracted = reports
        .filter(r => r.lecturerComment)
        .map(r => ({
          from: 'Giảng viên',
          avatar: r.lecturerAvatar,
          comment: r.lecturerComment,
          date: r.reviewedAt,
          reportRef: `Báo cáo tuần ${r.weekNumber}`,
        }));
      setFeedbacks(extracted);
    })
    .catch(err => onShowToast(getApiErrorMessage(err), 'error'));
}, [internshipId]);
```

**Test:**
- [ ] Shows feedback from lecturer
- [ ] Shows feedback from company
- [ ] Correctly attributed

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Completed

---

### 1.5 Internship View
**File:** `src/features/student/pages/InternshipView.tsx`

**Check:**
```typescript
// Should use useStudentPortal() context which gets from API
const { profile } = useStudentPortal();

// Display internship details from profile
<h2>{profile?.companyName}</h2>
<p>{profile?.position}</p>
// etc.
```

**Test:**
- [ ] Shows real company name
- [ ] Shows real position
- [ ] Shows supervisor info
- [ ] Shows internship status

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Completed

---

### 1.6 Notifications View
**File:** `src/features/student/pages/NotificationsView.tsx`

**Remove:**
```typescript
- MOCK_NOTIFICATIONS
- USE_MOCK ? MOCK_NOTIFICATIONS : []
```

**Add:**
```typescript
import { notificationService } from "../../../services/notification.service";

const [notifications, setNotifications] = useState([]);

useEffect(() => {
  notificationService.getAll()
    .then(setNotifications)
    .catch(err => onShowToast(getApiErrorMessage(err), 'error'));
}, []);
```

**Test:**
- [ ] Shows notifications from API
- [ ] Can mark as read

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Completed

---

### 1.7 Templates View
**File:** `src/features/student/pages/TemplatesView.tsx`

**Remove:**
```typescript
- MOCK_TEMPLATES
```

**Add:**
```typescript
// Determine: Are these document templates from backend?
// Or are they just static UI components?

// If from backend:
const [templates, setTemplates] = useState([]);
useEffect(() => {
  documentService.getTemplates()
    .then(setTemplates)
    .catch(err => onShowToast(getApiErrorMessage(err), 'error'));
}, []);

// If static: Keep as-is, no API call
```

**Test:**
- [ ] Templates load correctly
- [ ] Can download/preview template

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Completed

---

## PHASE 2: Admin Module

### 2.1 Students View
**File:** `src/features/admin/pages/StudentsView.tsx`

**Find & Remove:**
```typescript
const [mockStudents, setMockStudents] = useState([...])
const students = USE_MOCK ? mockStudents : apiPage.students;
```

**Replace with:**
```typescript
const students = apiPage.students;
const setStudents = apiPage.setStudents;
const isLoading = apiPage.isLoading;
```

**Verify:**
- [ ] `useAdminStudentsPage` calls `/api/Admin/students`
- [ ] CREATE calls `/api/Admin/students` (POST)
- [ ] UPDATE calls `/api/Admin/students/{id}` (PUT)
- [ ] DELETE calls `/api/Admin/students/{id}` (DELETE)
- [ ] IMPORT calls `/api/Admin/students/import` (POST)

**Test:**
- [ ] List shows all students from DB
- [ ] Can create student
- [ ] Can edit student
- [ ] Can delete student
- [ ] Can import from Excel
- [ ] Search/filter works

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Completed

---

### 2.2 Companies View
**File:** `src/features/admin/pages/CompaniesView.tsx`

**Remove:**
```typescript
const [companies] = useState(USE_MOCK ? INITIAL_ENTERPRISES : []);
```

**Add:**
```typescript
const [companies, setCompanies] = useState([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  adminCompaniesService.getAll()
    .then(setCompanies)
    .catch(err => onShowToast(getApiErrorMessage(err), 'error'))
    .finally(() => setIsLoading(false));
}, []);
```

**Verify API Methods:**
- [ ] `adminCompaniesService.getAll()` → `/api/Admin/companies`
- [ ] `adminCompaniesService.create(data)` → `/api/Admin/companies` (POST)
- [ ] `adminCompaniesService.update(id, data)` → `/api/Admin/companies/{id}` (PUT)
- [ ] `adminCompaniesService.delete(id)` → `/api/Admin/companies/{id}` (DELETE)

**Test:**
- [ ] List loads from DB
- [ ] CRUD operations work
- [ ] Search/filter works

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Completed

---

### 2.3 Assignments View
**File:** `src/features/admin/pages/AssignmentsView.tsx`

**Remove:**
```typescript
const mockLecturers = [...]
const mockStudents = [...]
const lecturers = USE_MOCK ? mockLecturers : ...;
const students = USE_MOCK ? mockStudents : ...;
```

**Replace with:**
```typescript
const { lecturers, students } = useAdminAssignmentMatrix(onShowToast);
```

**Verify Hook:**
- [ ] `useAdminAssignmentMatrix` returns lecturers from `/api/Lecturer` or `/api/Admin/lecturers`
- [ ] `useAdminAssignmentMatrix` returns students from `/api/Admin/students`
- [ ] Assignment changes call `/api/Admin/assignments` (PUT/DELETE)

**Test:**
- [ ] Matrix shows real lecturers & students
- [ ] Can assign student to lecturer
- [ ] Can unassign
- [ ] Can bulk assign

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Completed

---

### 2.4 Dashboard
**File:** `src/features/admin/pages/DashboardView.tsx`

**Verify:**
```typescript
const { stats, isLoading } = useAdminDashboardStats(true, onShowToast);
```

**Check Hook Implementation:**
- [ ] Calls `/api/Admin/students` to count students
- [ ] Calls `/api/Admin/assignments` to count assignments
- [ ] Calls `/api/WeeklyReport` to count submissions
- [ ] Calls `/api/Admin/internships` or similar to get internship status
- [ ] All data is from API, not mock

**Test:**
- [ ] Stats show correct counts
- [ ] Charts show real data
- [ ] Refresh button works

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Completed

---

### 2.5 Other Admin Pages
**Files:**
- `LecturersView.tsx` → Remove INITIAL_LECTURERS mock
- `Semesters View.tsx` → Call `/api/Admin/semesters`
- `Notifications.tsx` → Call notification service
- `Settings.tsx` → Define what this page does

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Completed

---

## PHASE 3: Lecturer Module

### 3.1 Dashboard
**File:** `src/features/lecturer/pages/DashboardView.tsx`

**Verify:**
```typescript
const { stats } = useAdminDashboardStats(true, onShowToast);
// This is shared with admin, but filters for current lecturer
```

**Should show:**
- [ ] Only assigned students (from `/api/Lecturer/internships`)
- [ ] Stats for those students only
- [ ] Recent submissions from assigned students

**Test:**
- [ ] Login as lecturer1
- [ ] Dashboard shows only their assigned students
- [ ] Stats are accurate

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Completed

---

### 3.2 Students View (Lecturer)
**File:** `src/features/lecturer/pages/StudentsView.tsx`

**Should call:**
```typescript
import { lecturerInternshipsService } from "../../../services/lecturerInternships.service";

const [students, setStudents] = useState([]);

useEffect(() => {
  lecturerInternshipsService.getAll()
    .then(data => setStudents(data.map(...)))
    .catch(err => onShowToast(getApiErrorMessage(err), 'error'));
}, []);
```

**Test:**
- [ ] Shows only assigned students
- [ ] Can click to see internship details
- [ ] Shows internship status

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Completed

---

### 3.3 Reports View (Weekly Reports)
**File:** `src/features/lecturer/pages/ReportsView.tsx`

**Should call:**
```typescript
// Get all weekly reports from assigned students
const [reports, setReports] = useState([]);

useEffect(() => {
  lecturerInternshipsService.getSubmissions() // Or similar
    .then(setReports)
    .catch(err => onShowToast(getApiErrorMessage(err), 'error'));
}, []);
```

**Test:**
- [ ] Shows reports from assigned students
- [ ] Can add feedback
- [ ] Can change status

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Completed

---

### 3.4 Evaluations View
**File:** `src/features/lecturer/pages/EvaluationsView.tsx`

**Should call:**
```typescript
const [evaluations, setEvaluations] = useState([]);

useEffect(() => {
  lecturerService.getEvaluations() // Or similar
    .then(setEvaluations)
    .catch(err => onShowToast(getApiErrorMessage(err), 'error'));
}, []);
```

**Test:**
- [ ] Can create evaluation
- [ ] Can view evaluation history
- [ ] Scores saved to database

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Completed

---

## PHASE 4: Standardization

### 4.1 Error Handling
**Apply to all pages:**

```typescript
catch (error) {
  const message = getApiErrorMessage(error);
  onShowToast(message, 'error');
  setError(message);
  // Don't leave user in loading state on error
  setIsLoading(false);
}
```

**Checklist:**
- [ ] All API calls have try-catch
- [ ] Error messages are user-friendly
- [ ] Loading state cleared on error

---

### 4.2 Loading States
**Apply to all pages:**

```typescript
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  setIsLoading(true);
  apiCall()
    .finally(() => setIsLoading(false));
}, []);

if (isLoading) return <Skeleton />;
```

**Checklist:**
- [ ] Show skeleton while loading
- [ ] Disable buttons while saving
- [ ] Show "No data" when empty
- [ ] Hide spinner when done

---

### 4.3 Type Mapping
**Create file:** `src/lib/portalMappers.ts`

```typescript
export function mapStudentDtoToRow(dto: StudentDto): AdminStudentRow {
  return {
    id: dto.id,
    mssv: dto.studentCode,
    fullName: dto.fullName,
    classCode: dto.class,
    // ... validate each field
  };
}

export function mapWeeklyReportDtoToUi(dto: WeeklyReportDto): WeeklyReportRow {
  return {
    id: dto.id,
    weekNumber: dto.weekNumber,
    title: `Báo cáo tuần ${dto.weekNumber}`,
    // ... transform dates, enums, etc.
  };
}
```

**Checklist:**
- [ ] Create mappers for all DTOs
- [ ] Use mappers in all pages
- [ ] Validate required fields exist

---

## Testing Matrix

### Student Role Tests
```
User: student1 / Password123!

PAGES TO TEST:
Dashboard
  [ ] Real name shown
  [ ] Real company shown
  [ ] Real tasks from reports
  [ ] Real deadlines

Weekly Reports
  [ ] Can view all reports
  [ ] Can create new report
  [ ] Can submit report
  [ ] Feedback appears after submit

Submissions
  [ ] Can upload file
  [ ] File listed
  [ ] Can download

Feedback
  [ ] Shows lecturer feedback
  [ ] Shows company feedback

Internship
  [ ] Company details correct
  [ ] Position correct
  [ ] Supervisor info correct

Notifications
  [ ] Notifications appear
  [ ] Can mark read
```

### Lecturer Role Tests
```
User: lecturer1 / Password123!

PAGES TO TEST:
Dashboard
  [ ] Shows only assigned students
  [ ] Correct student count
  [ ] Correct report count

Students
  [ ] Shows only assigned students
  [ ] Can click for details

Reports
  [ ] Shows all student reports
  [ ] Can add feedback
  [ ] Feedback saved

Evaluations
  [ ] Can create evaluation
  [ ] Can view evaluations
  [ ] Scores saved
```

### Admin Role Tests
```
User: superadmin / Password123!

PAGES TO TEST:
Students
  [ ] List shows all students
  [ ] Can create student
  [ ] Can edit student
  [ ] Can delete student
  [ ] Can import from Excel

Companies
  [ ] List shows all companies
  [ ] Can CRUD companies

Assignments
  [ ] Can assign student to lecturer
  [ ] Can bulk assign
  [ ] Matrix shows correct assignments

Dashboard
  [ ] Shows correct total counts
  [ ] Charts display real data

Users
  [ ] Can manage user accounts
  [ ] Can reset passwords
```

---

## Success Criteria

- [ ] Zero occurrences of mock data imports in production pages
- [ ] All data shown comes from API responses
- [ ] No hardcoded demo/test data visible
- [ ] Consistent error handling across all pages
- [ ] Consistent loading indicators
- [ ] All 3 roles pass UAT
- [ ] No console errors related to missing data
- [ ] API response times < 500ms

---

## Blockers & Solutions

| Blocker | Solution |
|---------|----------|
| API endpoint missing | Create in backend |
| Type mismatch | Create mapper function |
| Service doesn't exist | Create new service file |
| Mock data hardcoded | Extract to API call |
| USE_MOCK flag scattered | Use grep to find all 219 occurrences, replace one by one |

---

## Quick Links

**Files to Review:**
- Backend API Spec: `docs/08-API-Specification.md`
- Domain Model: `docs/05a-Domain-Model.md`
- Frontend Plan: `docs/Frontend-UI-Plan.md`
- UAT Checklist: `docs/M7-UAT-Checklist.md`

**Key Services:**
- `src/services/studentPortal.service.ts`
- `src/services/weeklyReport.service.ts`
- `src/services/adminStudents.service.ts`
- `src/services/lecturerInternships.service.ts`

**Key Hooks:**
- `src/hooks/useAdminDashboardStats.ts`
- `src/hooks/useAdminStudentsPage.ts`
- `src/hooks/useLecturerPortalData.ts`

---

**Last Updated:** 2026-08-16  
**Status:** Ready for Implementation  
