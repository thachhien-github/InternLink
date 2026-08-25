import apiClient from './api.config';

/**
 * Centralized API Service
 * Organized by module for easy access and type safety
 */

export const apiService = {
  // ========== AUTH ==========
  auth: {
    login: (credentials: { username?: string; email?: string; password: string }) => {
      return apiClient.post('/Auth/login', credentials);
    },
    logout: () => apiClient.post('/Auth/logout', {}),
    changePassword: (data: {
      currentPassword: string;
      newPassword: string;
    }) => apiClient.post('/Auth/change-password', data),
    forgotPassword: (email: string) =>
      apiClient.post('/Auth/forgot-password', { email }),
    resetPassword: (token: string, newPassword: string) =>
      apiClient.post('/Auth/reset-password', { token, newPassword }),
  },

  // ========== STUDENT PORTAL ==========
  studentPortal: {
    getMe: () => apiClient.get('/StudentPortal/me'),
    getProfile: () => apiClient.get('/StudentPortal/me'),
    getNotifications: (params?: any) => apiClient.get('/Notification', { params }),
    getFeedbacks: (params?: any) => apiClient.get('/Feedback', { params }),
    getReports: () => apiClient.get('/WeeklyReport/mine'),
    getSubmissions: () => apiClient.get('/Submission/mine'),
  },

  // ========== STUDENT ==========
  student: {
    list: (params?: any) => apiClient.get('/Student', { params }),
    getById: (id: string) => apiClient.get(`/Student/${id}`),
    getByMssv: (mssv: string) => apiClient.get(`/Student/by-mssv/${mssv}`),
  },

  // ========== ADMIN - STUDENTS ==========
  adminStudents: {
    list: (params?: any) => apiClient.get('/Admin/students', { params }),
    get: (id: string) => apiClient.get(`/Admin/students/${id}`),
    create: (data: any) => apiClient.post('/Admin/students', data),
    update: (id: string, data: any) =>
      apiClient.put(`/Admin/students/${id}`, data),
    delete: (id: string) => apiClient.delete(`/Admin/students/${id}`),
  },

  // ========== ADMIN - COMPANIES ==========
  adminCompanies: {
    list: (params?: any) => apiClient.get('/Admin/companies', { params }),
    get: (id: string) => apiClient.get(`/Admin/companies/${id}`),
    create: (data: any) => apiClient.post('/Admin/companies', data),
    update: (id: string, data: any) =>
      apiClient.put(`/Admin/companies/${id}`, data),
    delete: (id: string) => apiClient.delete(`/Admin/companies/${id}`),
  },

  // ========== ADMIN - LECTURERS ==========
  adminLecturers: {
    list: (params?: any) => apiClient.get('/LecturerProfile', { params }),
    get: (id: string) => apiClient.get(`/LecturerProfile/${id}`),
    getOverview: (id: string) => apiClient.get(`/LecturerProfile/${id}/overview`),
    create: (data: any) => apiClient.post('/LecturerProfile', data),
    update: (id: string, data: any) =>
      apiClient.put(`/LecturerProfile/${id}`, data),
    delete: (id: string) => apiClient.delete(`/LecturerProfile/${id}`),
  },

  // ========== ADMIN - SEMESTERS ==========
  adminSemesters: {
    list: (params?: any) => apiClient.get('/Admin/semesters', { params }),
    get: (id: string) => apiClient.get(`/Admin/semesters/${id}`),
    create: (data: any) => apiClient.post('/Admin/semesters', data),
    update: (id: string, data: any) =>
      apiClient.put(`/Admin/semesters/${id}`, data),
    close: (id: string) => apiClient.post(`/Admin/semesters/${id}/close`, {}),
    delete: (id: string) => apiClient.delete(`/Admin/semesters/${id}`),
  },

  // ========== ADMIN - ASSIGNMENTS ==========
  adminAssignments: {
    list: () => apiClient.get('/Admin/assignments'),
    getByLecturer: (lecturerId: string) =>
      apiClient.get(`/Admin/assignments/by-lecturer/${lecturerId}`),
    bulkAssign: (data: { lecturerId: string; studentIds: string[] }) =>
      apiClient.post('/Admin/assignments', data),
    unassign: (data: { lecturerId: string; studentId: string }) =>
      apiClient.delete('/Admin/assignments', { data }),
    getHistory: (limit = 50) => apiClient.get(`/Admin/assignments/history?limit=${limit}`),
    autoAssign: (data: any) => apiClient.post('/Admin/assignments/auto', data),
  },

  // ========== ADMIN - USERS ==========
  adminUsers: {
    list: (params?: any) => apiClient.get('/Admin/users', { params }),
    get: (id: string) => apiClient.get(`/Admin/users/${id}`),
    create: (data: any) => apiClient.post('/Admin/users', data),
    update: (id: string, data: any) =>
      apiClient.put(`/Admin/users/${id}`, data),
    resetPassword: (id: string) => apiClient.post(`/Admin/users/${id}/reset-password`, {}),
    delete: (id: string) => apiClient.delete(`/Admin/users/${id}`),
  },

  // ========== ADMIN - SETTINGS & STATS ==========
  adminSettings: {
    get: () => apiClient.get('/Admin/settings'),
    update: (data: any) => apiClient.put('/Admin/settings', data),
    reset: () => apiClient.post('/Admin/settings/reset', {}),
  },
  adminDashboard: {
    getInternshipStats: () => apiClient.get('/Admin/internship-stats'),
  },
  adminNotifications: {
    getCampaigns: () => apiClient.get('/Admin/notifications/campaigns'),
    broadcast: (data: any) => apiClient.post('/Admin/notifications/broadcast', data),
    deleteCampaign: (data: any) => apiClient.delete('/Admin/notifications/campaign', { data }),
  },

  // ========== LECTURER ==========
  lecturer: {
    getMe: () => apiClient.get('/Lecturer/me'),
    getProfile: () => apiClient.get('/Lecturer/me'),
    getDashboard: () => apiClient.get('/Lecturer/dashboard'),
    getStats: () => apiClient.get('/Lecturer/stats'),
    getStudents: (params?: any) => apiClient.get('/Lecturer/students', { params }),
    getCompanies: () => apiClient.get('/Lecturer/companies'),
    getInternships: () => apiClient.get('/Lecturer/internships'),
    getInternship: (id: string) => apiClient.get(`/Lecturer/internships/${id}`),
    getSubmissions: (internshipId: string) =>
      apiClient.get(`/Lecturer/internships/${internshipId}/submissions`),
    addFeedback: (submissionId: string, data: { comment: string; isPublic?: boolean; newStatus?: string }) =>
      apiClient.post(`/Lecturer/submissions/${submissionId}/feedback`, data),
    getWeeklyReports: (params?: any) => apiClient.get('/Lecturer/weekly-reports', { params }),
    getWeeklyReport: (id: string) => apiClient.get(`/Lecturer/weekly-reports/${id}`),
    reviewWeeklyReport: (id: string, data: { status: string; lecturerComment?: string }) =>
      apiClient.post(`/Lecturer/weekly-reports/${id}/review`, data),
    getEvaluations: (params?: any) => apiClient.get('/Lecturer/evaluations', { params }),
    getEvaluationByInternship: (internshipId: string) => apiClient.get(`/Lecturer/evaluations/internship/${internshipId}`),
    createEvaluation: (data: any) => apiClient.post('/Lecturer/evaluations', data),
    updateEvaluation: (id: string, data: any) => apiClient.put(`/Lecturer/evaluations/${id}`, data),
    finalizeEvaluation: (id: string) => apiClient.post(`/Lecturer/evaluations/${id}/finalize`, {}),
    getDocuments: (params?: any) => apiClient.get('/Lecturer/documents', { params }),
    uploadDocument: (formData: FormData) => apiClient.post('/Lecturer/documents/upload', formData),
    downloadDocument: (id: string) => apiClient.get(`/Lecturer/documents/${id}/download`, { responseType: 'blob' }),
    exportEndOfTerm: () => apiClient.get('/Lecturer/export/end-of-term', { responseType: 'blob' }),
  },

  // ========== SUBMISSIONS ==========
  submission: {
    list: (params?: any) => apiClient.get('/Submission', { params }),
    get: (id: string) => apiClient.get(`/Submission/${id}`),
    getByStudent: (studentId: string) =>
      apiClient.get(`/Submission/by-student/${studentId}`),
    getByAssignment: (assignmentId: string) =>
      apiClient.get(`/Submission/by-assignment/${assignmentId}`),
    create: (data: any) => apiClient.post('/Submission', data),
    update: (id: string, data: any) =>
      apiClient.put(`/Submission/${id}`, data),
    grade: (id: string, grade: number) =>
      apiClient.post(`/Submission/${id}/grade`, { grade }),
    delete: (id: string) => apiClient.delete(`/Submission/${id}`),
  },

  // ========== NOTIFICATIONS ==========
  notification: {
    list: (params?: any) => apiClient.get('/Notification', { params }),
    get: (id: string) => apiClient.get(`/Notification/${id}`),
    markAsRead: (id: string) => apiClient.put(`/Notification/${id}/read`, {}),
    delete: (id: string) => apiClient.delete(`/Notification/${id}`),
  },

  // ========== WEEKLY REPORTS ==========
  weeklyReport: {
    list: (params?: any) => apiClient.get('/WeeklyReport', { params }),
    get: (id: string) => apiClient.get(`/WeeklyReport/${id}`),
    getByStudent: (studentId: string) =>
      apiClient.get(`/WeeklyReport/by-student/${studentId}`),
    getByWeek: (week: string) =>
      apiClient.get(`/WeeklyReport/by-week/${week}`),
    create: (data: any) => apiClient.post('/WeeklyReport', data),
    update: (id: string, data: any) =>
      apiClient.put(`/WeeklyReport/${id}`, data),
  },

  // ========== EVALUATIONS ==========
  evaluation: {
    list: (params?: any) => apiClient.get('/Evaluation', { params }),
    get: (id: string) => apiClient.get(`/Evaluation/${id}`),
    getByStudent: (studentId: string) =>
      apiClient.get(`/Evaluation/by-student/${studentId}`),
    create: (data: any) => apiClient.post('/Evaluation', data),
    update: (id: string, data: any) =>
      apiClient.put(`/Evaluation/${id}`, data),
  },
};
