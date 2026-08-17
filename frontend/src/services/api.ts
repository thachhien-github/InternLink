import apiClient from './api.config';

/**
 * Centralized API Service
 * Organized by module for easy access and type safety
 */

export const apiService = {
  // ========== AUTH ==========
  auth: {
    login: (credentials: { email: string; password: string }) => {
      console.log('🔐 Login attempt...');
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
    getProfile: () => apiClient.get('/StudentPortal/profile'),
    getTasks: () => apiClient.get('/StudentPortal/tasks'),
    getNotifications: () => apiClient.get('/StudentPortal/notifications'),
    getFeedbacks: () => apiClient.get('/StudentPortal/feedback'),
    getReports: () => apiClient.get('/StudentPortal/reports'),
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
    list: (params?: any) => apiClient.get('/Admin/lecturers', { params }),
    get: (id: string) => apiClient.get(`/Admin/lecturers/${id}`),
    create: (data: any) => apiClient.post('/Admin/lecturers', data),
    update: (id: string, data: any) =>
      apiClient.put(`/Admin/lecturers/${id}`, data),
    delete: (id: string) => apiClient.delete(`/Admin/lecturers/${id}`),
  },

  // ========== ADMIN - SEMESTERS ==========
  adminSemesters: {
    list: (params?: any) => apiClient.get('/Admin/semesters', { params }),
    get: (id: string) => apiClient.get(`/Admin/semesters/${id}`),
    create: (data: any) => apiClient.post('/Admin/semesters', data),
    update: (id: string, data: any) =>
      apiClient.put(`/Admin/semesters/${id}`, data),
    delete: (id: string) => apiClient.delete(`/Admin/semesters/${id}`),
  },

  // ========== ADMIN - ASSIGNMENTS ==========
  adminAssignments: {
    list: () => apiClient.get('/Admin/assignments'),
    getByLecturer: (lecturerId: string) =>
      apiClient.get(`/Admin/assignments/by-lecturer/${lecturerId}`),
    get: (lecturerId: string, studentId: string) =>
      apiClient.get(`/Admin/assignments/${lecturerId}/${studentId}`),
    bulkAssign: (data: { lecturerId: string; studentIds: string[] }) =>
      apiClient.post('/Admin/assignments', data),
    unassign: (data: { lecturerId: string; studentId: string }) =>
      apiClient.delete('/Admin/assignments', { data }),
  },

  // ========== ADMIN - USERS ==========
  adminUsers: {
    list: (params?: any) => apiClient.get('/Admin/users', { params }),
    get: (id: string) => apiClient.get(`/Admin/users/${id}`),
    create: (data: any) => apiClient.post('/Admin/users', data),
    update: (id: string, data: any) =>
      apiClient.put(`/Admin/users/${id}`, data),
    delete: (id: string) => apiClient.delete(`/Admin/users/${id}`),
  },

  // ========== LECTURER ==========
  lecturer: {
    getProfile: () => apiClient.get('/LecturerProfile'),
    getStudents: () => apiClient.get('/Lecturer/students'),
    getCompanies: () => apiClient.get('/Lecturer/companies'),
    getInternships: () => apiClient.get('/Lecturer/internships'),
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
