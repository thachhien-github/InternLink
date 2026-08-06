import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { LoginPortal } from '../components/common/LoginPortal';

// Layouts
import AdminLayout from '../layouts/AdminLayout';
import LecturerLayout from '../layouts/LecturerLayout';
import StudentLayout from '../layouts/StudentLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Admin Pages
import { DashboardView as AdminDashboardView } from '../features/admin/pages/DashboardView';
import { SemestersView as AdminSemestersView } from '../features/admin/pages/SemestersView';
import { AssignmentsView as AdminAssignmentsView } from '../features/admin/pages/AssignmentsView';
import { LecturersView as AdminLecturersView } from '../features/admin/pages/LecturersView';
import { StudentsView as AdminStudentsView } from '../features/admin/pages/StudentsView';
import { AccountRequestsView as AdminAccountRequestsView } from '../features/admin/pages/AccountRequestsView';
import { NotificationsView as AdminNotificationsView } from '../features/admin/pages/NotificationsView';
import { SettingsView as AdminSettingsView } from '../features/admin/pages/SettingsView';
import { AccountView as AdminAccountView } from '../features/admin/pages/AccountView';

// Lecturer Pages
import { StatsCards } from '../features/lecturer/components/StatsCards';
import { TimelineStepper } from '../features/lecturer/components/TimelineStepper';
import { ActionItemsCard, UpcomingDeadlinesCard } from '../features/lecturer/components/ActionRequired';
import { ProgressOverview, TopEnterprises } from '../features/lecturer/components/ProgressOverview';
import { RecentSubmissions } from '../features/lecturer/components/RecentSubmissions';

import { StudentsView as LecturerStudentsView } from '../features/lecturer/pages/StudentsView';
import { EnterprisesView as LecturerEnterprisesView } from '../features/lecturer/pages/EnterprisesView';
import { TemplatesView as LecturerTemplatesView } from '../features/lecturer/pages/TemplatesView';
import { ReportsView as LecturerReportsView } from '../features/lecturer/pages/ReportsView';
import { AnalyticsView as LecturerAnalyticsView } from '../features/lecturer/pages/AnalyticsView';
import { EvaluationsView as LecturerEvaluationsView } from '../features/lecturer/pages/EvaluationsView';
import { NotificationsView as LecturerNotificationsView } from '../features/lecturer/pages/NotificationsView';
import { AccountView as LecturerAccountView } from '../features/lecturer/pages/AccountView';

// Student Pages
import { DashboardView as StudentDashboardView } from '../features/student/pages/DashboardView';
import { InternshipView as StudentInternshipView } from '../features/student/pages/InternshipView';
import { WeeklyReportsView as StudentWeeklyReportsView } from '../features/student/pages/WeeklyReportsView';
import { SubmissionsView as StudentSubmissionsView } from '../features/student/pages/SubmissionsView';
import { FeedbackView as StudentFeedbackView } from '../features/student/pages/FeedbackView';
import { TemplatesView as StudentTemplatesView } from '../features/student/pages/TemplatesView';
import { NotificationsView as StudentNotificationsView } from '../features/student/pages/NotificationsView';
import { AccountView as StudentAccountView } from '../features/student/pages/AccountView';

// Services & Data
import { INITIAL_STUDENTS, INITIAL_ENTERPRISES, INITIAL_SUBMISSIONS, INITIAL_ACTION_ITEMS, INITIAL_DEADLINES } from '../data/mockData';
import { useState, useMemo } from 'react';

export function AppRoutes() {
  const { isLoggedIn, role, login, logout, switchRole } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // State
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [enterprises, setEnterprises] = useState(INITIAL_ENTERPRISES);
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [actionItems] = useState(INITIAL_ACTION_ITEMS);
  const [currentLecturer] = useState("Thầy Phước");

  const [filters, setFilters] = useState({
    term: "Học kỳ I - 2026",
    searchQuery: ""
  });

  const assignedStudents = useMemo(() => {
    if (currentLecturer === "Tất cả") return students;
    return students.filter((s) => s.lecturer === currentLecturer);
  }, [students, currentLecturer]);

  const stats = useMemo(() => {
    const total = assignedStudents.length;
    const interning = assignedStudents.filter((s) => s.company !== "Chưa có").length;
    const pending = assignedStudents.filter((s) => s.status === "Chờ phản hồi" || s.status === "Đang chỉnh sửa").length;
    const overdue = assignedStudents.filter((s) => s.status === "Quá hạn" || s.riskFlag).length;
    const completed = assignedStudents.filter((s) => s.status === "Hoàn thành").length;
    const avgProg = total > 0 ? Math.round(assignedStudents.reduce((acc, s) => acc + s.progress, 0) / total) : 0;
    return { total, interning, pending, overdue, completed, avgProg };
  }, [assignedStudents]);

  const assignedSubmissions = useMemo(() => {
    const mssvSet = new Set(assignedStudents.map((s) => s.mssv));
    return submissions.filter((sub) => mssvSet.has(sub.mssv));
  }, [submissions, assignedStudents]);

  const handleUpdateSubmissionStatus = (id: string, newStatus: string, note?: string) => {
    setSubmissions((prev) => prev.map((s) => s.id === id ? { ...s, status: newStatus, lecturerNote: note || s.lecturerNote } : s));
  };

  const handleApproveEnterprise = (id: string) => {
    setEnterprises((prev) => prev.map((item) => item.id === id ? { ...item, status: "Đã duyệt" } : item));
    showToast("Đã phê duyệt doanh nghiệp!");
  };

  const handleAddEnterprise = (newEnt: any) => {
    setEnterprises((prev) => [newEnt, ...prev]);
    showToast(`Đã thêm doanh nghiệp ${newEnt.name}`);
  };

  const handleAddStudent = (student: any) => {
    setStudents((prev) => [student, ...prev]);
    showToast(`Đã thêm sinh viên ${student.name}`);
  };

  const currentTabFromPath = location.pathname.split('/').pop() || 'dashboard';

  return (
    <Routes>
      {/* Public Login Route */}
      <Route
        path="/login"
        element={
          isLoggedIn ? (
            <Navigate to={`/${role}/dashboard`} replace />
          ) : (
            <LoginPortal
              onLoginSuccess={(user: any) => {
                login(user);
                showToast(`Chào mừng ${user.name}`);
                navigate(`/${user.role}/dashboard`);
              }}
            />
          )
        }
      />

      {/* ADMIN ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route
          path="/admin/*"
          element={
            <AdminLayout
              activeTab={currentTabFromPath}
              onNavigate={(tab) => navigate(`/admin/${tab.replace('admin-', '')}`)}
              onSwitchPortal={(r) => {
                switchRole(r as any);
                navigate(`/${r}/dashboard`);
              }}
              onLogout={() => {
                logout();
                navigate('/login');
              }}
            >
              <Routes>
                <Route path="dashboard" element={<AdminDashboardView onShowToast={showToast} onNavigateTab={(t) => navigate(`/admin/${t.replace('admin-', '')}`)} />} />
                <Route path="semesters" element={<AdminSemestersView onShowToast={showToast} onNavigateTab={(t) => navigate(`/admin/${t.replace('admin-', '')}`)} />} />
                <Route path="assignments" element={<AdminAssignmentsView onShowToast={showToast} onNavigateTab={(t) => navigate(`/admin/${t.replace('admin-', '')}`)} />} />
                <Route path="lecturers" element={<AdminLecturersView onShowToast={showToast} onNavigateTab={(t) => navigate(`/admin/${t.replace('admin-', '')}`)} />} />
                <Route path="students" element={<AdminStudentsView onShowToast={showToast} onNavigateTab={(t) => navigate(`/admin/${t.replace('admin-', '')}`)} />} />
                <Route path="account-requests" element={<AdminAccountRequestsView onShowToast={showToast} onNavigateTab={(t) => navigate(`/admin/${t.replace('admin-', '')}`)} />} />
                <Route path="notifications" element={<AdminNotificationsView onShowToast={showToast} onNavigateTab={(t) => navigate(`/admin/${t.replace('admin-', '')}`)} />} />
                <Route path="settings" element={<AdminSettingsView onShowToast={showToast} onNavigateTab={(t) => navigate(`/admin/${t.replace('admin-', '')}`)} />} />
                <Route path="account" element={<AdminAccountView onShowToast={showToast} onNavigateTab={(t) => navigate(`/admin/${t.replace('admin-', '')}`)} />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </Routes>
            </AdminLayout>
          }
        />
      </Route>

      {/* LECTURER ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={['lecturer']} />}>
        <Route
          path="/lecturer/*"
          element={
            <LecturerLayout
              activeTab={currentTabFromPath}
              onNavigate={(tab) => navigate(`/lecturer/${tab}`)}
              onSwitchPortal={(r) => {
                switchRole(r as any);
                navigate(`/${r}/dashboard`);
              }}
              onLogout={() => {
                logout();
                navigate('/login');
              }}
              searchQuery={filters.searchQuery}
              onSearchChange={(q) => setFilters((p) => ({ ...p, searchQuery: q }))}
              currentLecturer={currentLecturer}
              assignedStudentsCount={assignedStudents.length}
            >
              <Routes>
                <Route
                  path="dashboard"
                  element={
                    <div className="space-y-4">
                      <StatsCards totalStudents={stats.total} interningCount={stats.interning} pendingResponseCount={stats.pending} overdueCount={stats.overdue} completedCount={stats.completed} avgProgress={stats.avgProg} onCardClick={() => navigate('/lecturer/students')} />
                      <TimelineStepper currentTerm={filters.term} onStepClick={() => showToast('Mốc thời gian')} />
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
                        <div className="lg:col-span-2 space-y-5">
                          <ProgressOverview onSelectStatusFilter={() => navigate('/lecturer/students')} />
                          <RecentSubmissions submissions={assignedSubmissions} onViewAll={() => navigate('/lecturer/students')} onReviewSubmission={() => showToast('Nhận xét bài nộp')} />
                        </div>
                        <div className="lg:col-span-1 space-y-5">
                          <ActionItemsCard actionItems={actionItems} onActionClick={() => navigate('/lecturer/students')} />
                          <UpcomingDeadlinesCard deadlines={INITIAL_DEADLINES} onViewCalendar={() => showToast('Lịch làm việc')} />
                          <TopEnterprises enterprises={enterprises} onViewAll={() => navigate('/lecturer/enterprises')} />
                        </div>
                      </div>
                    </div>
                  }
                />
                <Route path="students" element={<LecturerStudentsView students={assignedStudents} onAddStudent={handleAddStudent} onSendReminder={(s) => showToast(`Nhắc nhở ${s.name}`)} />} />
                <Route path="enterprises" element={<LecturerEnterprisesView enterprises={enterprises} onApproveEnterprise={handleApproveEnterprise} onAddEnterprise={handleAddEnterprise} />} />
                <Route path="templates" element={<LecturerTemplatesView />} />
                <Route path="evaluations" element={<LecturerEvaluationsView />} />
                <Route path="reports" element={<LecturerReportsView submissions={assignedSubmissions} onUpdateSubmissionStatus={handleUpdateSubmissionStatus} showToast={showToast} />} />
                <Route path="analytics" element={<LecturerAnalyticsView showToast={showToast} />} />
                <Route path="notifications" element={<LecturerNotificationsView />} />
                <Route path="account" element={<LecturerAccountView />} />
                <Route path="*" element={<Navigate to="/lecturer/dashboard" replace />} />
              </Routes>
            </LecturerLayout>
          }
        />
      </Route>

      {/* STUDENT ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={['student']} />}>
        <Route
          path="/student/*"
          element={
            <StudentLayout
              activeTab={currentTabFromPath}
              onNavigate={(tab) => navigate(`/student/${tab.replace('student-', '')}`)}
              onSwitchPortal={(r) => {
                switchRole(r as any);
                navigate(`/${r}/dashboard`);
              }}
              onLogout={() => {
                logout();
                navigate('/login');
              }}
            >
              <Routes>
                <Route path="dashboard" element={<StudentDashboardView onNavigate={(t) => navigate(`/student/${t.replace('student-', '')}`)} onShowToast={showToast} />} />
                <Route path="internship" element={<StudentInternshipView onShowToast={showToast} />} />
                <Route path="weekly-reports" element={<StudentWeeklyReportsView onShowToast={showToast} />} />
                <Route path="submissions" element={<StudentSubmissionsView onShowToast={showToast} />} />
                <Route path="feedback" element={<StudentFeedbackView onShowToast={showToast} />} />
                <Route path="templates" element={<StudentTemplatesView onShowToast={showToast} />} />
                <Route path="notifications" element={<StudentNotificationsView onShowToast={showToast} onNavigate={(t) => navigate(`/student/${t.replace('student-', '')}`)} />} />
                <Route path="account" element={<StudentAccountView onShowToast={showToast} onNavigate={(t) => navigate(`/student/${t.replace('student-', '')}`)} onLogout={() => { logout(); navigate('/login'); }} />} />
                <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
              </Routes>
            </StudentLayout>
          }
        />
      </Route>

      {/* Default Catch-all */}
      <Route
        path="*"
        element={
          isLoggedIn && role ? (
            <Navigate to={`/${role}/dashboard`} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}
