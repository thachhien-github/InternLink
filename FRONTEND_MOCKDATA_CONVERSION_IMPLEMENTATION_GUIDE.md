# Frontend MockData Conversion - Implementation Guide

**Purpose**: Step-by-step code examples and patterns for converting from mockdata to real backend API calls

---

## Part 1: Infrastructure Setup (Phase 1)

### 1.1 Create API Configuration

**File**: `frontend/src/services/api.config.ts`

```typescript
import type { AxiosInstance } from 'axios';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 1.2 Create Data Fetching Hook

**File**: `frontend/src/hooks/useBackendData.ts`

```typescript
import { useState, useEffect } from 'react';
import apiClient from '../services/api.config';

interface UseBackendDataOptions {
  skip?: boolean;
  refetchInterval?: number;
}

interface UseBackendDataState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useBackendData = <T,>(
  endpoint: string,
  options: UseBackendDataOptions = {}
): UseBackendDataState<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!options.skip);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    if (options.skip) return;

    try {
      setLoading(true);
      const response = await apiClient.get<T>(endpoint);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    if (options.refetchInterval) {
      const interval = setInterval(fetchData, options.refetchInterval);
      return () => clearInterval(interval);
    }
  }, [endpoint, options.skip]);

  return { data, loading, error, refetch: fetchData };
};
```

### 1.3 Create Mutation Hook for Mutations

**File**: `frontend/src/hooks/useMutation.ts`

```typescript
import { useState } from 'react';
import apiClient from '../services/api.config';

interface UseMutationState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export const useMutation = <TData, TVariables = any>(
  method: 'post' | 'put' | 'delete',
  endpoint: string | ((variables: TVariables) => string)
) => {
  const [state, setState] = useState<UseMutationState<TData>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = async (variables?: TVariables) => {
    try {
      setState({ data: null, loading: true, error: null });
      
      const url = typeof endpoint === 'function' ? endpoint(variables!) : endpoint;
      const response = await apiClient[method]<TData>(
        url,
        method !== 'delete' ? variables : undefined
      );
      
      setState({ data: response.data, loading: false, error: null });
      return response.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setState({ data: null, loading: false, error });
      throw error;
    }
  };

  return { ...state, mutate };
};
```

### 1.4 Create Global API Service Instance

**File**: `frontend/src/services/api.ts`

```typescript
import apiClient from './api.config';

export const apiService = {
  // Auth
  auth: {
    login: (credentials: { email: string; password: string }) =>
      apiClient.post('/Auth/login', credentials),
    logout: () => apiClient.post('/Auth/logout', {}),
    changePassword: (data: { currentPassword: string; newPassword: string }) =>
      apiClient.post('/Auth/change-password', data),
  },

  // Student Portal
  student: {
    getProfile: () => apiClient.get('/StudentPortal/profile'),
    getTasks: () => apiClient.get('/StudentPortal/tasks'),
    getNotifications: () => apiClient.get('/StudentPortal/notifications'),
    getFeedbacks: () => apiClient.get('/StudentPortal/feedback'),
    getReports: () => apiClient.get('/StudentPortal/reports'),
  },

  // Admin
  admin: {
    students: {
      list: (params?: any) => apiClient.get('/Admin/students', { params }),
      get: (id: string) => apiClient.get(`/Admin/students/${id}`),
      create: (data: any) => apiClient.post('/Admin/students', data),
      update: (id: string, data: any) => apiClient.put(`/Admin/students/${id}`, data),
      delete: (id: string) => apiClient.delete(`/Admin/students/${id}`),
    },
    companies: {
      list: (params?: any) => apiClient.get('/Admin/companies', { params }),
      get: (id: string) => apiClient.get(`/Admin/companies/${id}`),
      create: (data: any) => apiClient.post('/Admin/companies', data),
      update: (id: string, data: any) => apiClient.put(`/Admin/companies/${id}`, data),
      delete: (id: string) => apiClient.delete(`/Admin/companies/${id}`),
    },
    lecturers: {
      list: () => apiClient.get('/Admin/lecturers'),
      get: (id: string) => apiClient.get(`/Admin/lecturers/${id}`),
      create: (data: any) => apiClient.post('/Admin/lecturers', data),
      update: (id: string, data: any) => apiClient.put(`/Admin/lecturers/${id}`, data),
      delete: (id: string) => apiClient.delete(`/Admin/lecturers/${id}`),
    },
    semesters: {
      list: () => apiClient.get('/Admin/semesters'),
      get: (id: string) => apiClient.get(`/Admin/semesters/${id}`),
      create: (data: any) => apiClient.post('/Admin/semesters', data),
      update: (id: string, data: any) => apiClient.put(`/Admin/semesters/${id}`, data),
      delete: (id: string) => apiClient.delete(`/Admin/semesters/${id}`),
    },
  },

  // Notifications
  notifications: {
    list: (params?: any) => apiClient.get('/Notification', { params }),
    get: (id: string) => apiClient.get(`/Notification/${id}`),
    markAsRead: (id: string) => apiClient.put(`/Notification/${id}/read`, {}),
  },
};
```

---

## Part 2: Student Portal Migration (Phase 2)

### 2.1 Convert Student Profile Hook

**Before** (using mockdata):
```typescript
// hooks/useStudentPortalContext.ts
import { USE_MOCK } from "../config/env";
import { STUDENT_PROFILE } from "../data/studentMockData";

export const useStudentPortalContext = () => {
  if (USE_MOCK) {
    return { profile: STUDENT_PROFILE, loading: false, error: null };
  }
  // Real implementation missing
};
```

**After** (using backend API):
```typescript
// hooks/useStudentPortalContext.ts
import { useBackendData } from './useBackendData';
import type { StudentProfile } from '../types/common';

export const useStudentPortalContext = () => {
  const { data: profile, loading, error } = useBackendData<StudentProfile>(
    '/StudentPortal/profile'
  );

  return { profile, loading, error };
};
```

### 2.2 Convert Student Header Notifications

**Before**:
```typescript
// features/student/components/Header.tsx
import { STUDENT_NOTIFICATIONS } from "../../../data/studentMockData";

export const Header = () => {
  const notifications = STUDENT_NOTIFICATIONS;
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div>
      <NotificationBell count={unreadCount} notifications={notifications} />
    </div>
  );
};
```

**After**:
```typescript
// features/student/components/Header.tsx
import { useBackendData } from '../../../hooks/useBackendData';
import type { StudentNotification } from '../../../types/common';

export const Header = () => {
  const { data: notifications = [], loading, error } = useBackendData<StudentNotification[]>(
    '/Notification?studentId=me'
  );

  const unreadCount = notifications.filter(n => n.unread).length;

  if (error) {
    return <div>Error loading notifications</div>;
  }

  return (
    <div>
      <NotificationBell 
        count={unreadCount} 
        notifications={notifications}
        loading={loading}
      />
    </div>
  );
};
```

### 2.3 Convert Student Dashboard

**Before**:
```typescript
// features/student/pages/DashboardPage.tsx
import { STUDENT_PROFILE, INITIAL_STUDENT_TASKS } from "../../../data/studentMockData";

export const DashboardPage = () => {
  const profile = STUDENT_PROFILE;
  const tasks = INITIAL_STUDENT_TASKS;

  return (
    <div>
      <ProfileCard profile={profile} />
      <TasksList tasks={tasks} />
    </div>
  );
};
```

**After**:
```typescript
// features/student/pages/DashboardPage.tsx
import { useBackendData } from '../../../hooks/useBackendData';
import type { StudentProfile, StudentTask } from '../../../types/common';

export const DashboardPage = () => {
  const { data: profile, loading: profileLoading } = useBackendData<StudentProfile>(
    '/StudentPortal/profile'
  );
  
  const { data: tasks = [], loading: tasksLoading } = useBackendData<StudentTask[]>(
    '/StudentPortal/tasks'
  );

  if (profileLoading) return <LoadingSpinner />;
  if (!profile) return <ErrorMessage />;

  return (
    <div>
      <ProfileCard profile={profile} />
      <TasksList tasks={tasks} loading={tasksLoading} />
    </div>
  );
};
```

---

## Part 3: Admin Pages Migration (Phase 3)

### 3.1 Convert Admin Students View

**Before**:
```typescript
// features/admin/pages/StudentsView.tsx
import { USE_MOCK } from "../../../config/env";
import { INITIAL_STUDENTS } from "../../../data/mockData";
import { useAdminStudentsPage } from "../../../hooks/useAdminStudentsPage";

export const StudentsView = () => {
  const { students, loading } = useAdminStudentsPage();
  
  // Mock data is used internally in hook when USE_MOCK is true
  return <StudentsList students={students} loading={loading} />;
};
```

**After**:
```typescript
// features/admin/pages/StudentsView.tsx
import { useState } from 'react';
import { useBackendData } from '../../../hooks/useBackendData';
import { useMutation } from '../../../hooks/useMutation';
import type { Student } from '../../../types/student';

export const StudentsView = () => {
  const [filters, setFilters] = useState<any>({});
  
  const { data: students = [], loading, error, refetch } = useBackendData<Student[]>(
    `/Admin/students?${new URLSearchParams(filters).toString()}`
  );

  const { mutate: updateStudent, loading: updating } = useMutation<Student, Partial<Student>>(
    'put',
    (data) => `/Admin/students/${data.id}`
  );

  const { mutate: deleteStudent, loading: deleting } = useMutation<void>(
    'delete',
    (id: string) => `/Admin/students/${id}`
  );

  const handleUpdate = async (id: string, updates: Partial<Student>) => {
    try {
      await updateStudent({ id, ...updates });
      await refetch();
    } catch (err) {
      console.error('Failed to update student:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      try {
        await deleteStudent(id);
        await refetch();
      } catch (err) {
        console.error('Failed to delete student:', err);
      }
    }
  };

  if (error) return <ErrorMessage error={error} />;

  return (
    <StudentsList 
      students={students}
      loading={loading}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      updating={updating}
      deleting={deleting}
    />
  );
};
```

### 3.2 Convert Admin Companies View

**Before**:
```typescript
// features/admin/pages/CompaniesView.tsx
import { INITIAL_ENTERPRISES } from "../../../data/mockData";

export const CompaniesView = () => {
  const companies = INITIAL_ENTERPRISES;
  
  return <CompaniesList companies={companies} />;
};
```

**After**:
```typescript
// features/admin/pages/CompaniesView.tsx
import { useState } from 'react';
import { useBackendData } from '../../../hooks/useBackendData';
import { useMutation } from '../../../hooks/useMutation';
import type { Enterprise } from '../../../types/enterprise';

interface CreateCompanyInput {
  name: string;
  address: string;
  field: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
}

export const CompaniesView = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: companies = [], loading, error, refetch } = useBackendData<Enterprise[]>(
    '/Admin/companies'
  );

  const { mutate: createCompany } = useMutation<Enterprise, CreateCompanyInput>(
    'post',
    '/Admin/companies'
  );

  const { mutate: updateCompany } = useMutation<Enterprise, Partial<Enterprise>>(
    'put',
    (data) => `/Admin/companies/${data.id}`
  );

  const { mutate: deleteCompany } = useMutation<void>(
    'delete',
    (id: string) => `/Admin/companies/${id}`
  );

  const handleCreate = async (formData: CreateCompanyInput) => {
    try {
      await createCompany(formData);
      await refetch();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to create company:', err);
    }
  };

  const handleUpdate = async (id: string, updates: Partial<Enterprise>) => {
    try {
      await updateCompany({ id, ...updates });
      await refetch();
    } catch (err) {
      console.error('Failed to update company:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this company?')) {
      try {
        await deleteCompany(id);
        await refetch();
      } catch (err) {
        console.error('Failed to delete company:', err);
      }
    }
  };

  if (error) return <ErrorMessage error={error} />;

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>Add Company</button>
      
      {isModalOpen && (
        <CompanyModal 
          onSave={handleCreate}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      
      <CompaniesList 
        companies={companies}
        loading={loading}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </>
  );
};
```

### 3.3 Convert Admin Assignments View

**Before**:
```typescript
// features/admin/pages/AssignmentsView.tsx
import { USE_MOCK } from "../../../config/env";
import { useAdminAssignmentMatrix } from "../../../hooks/useAdminAssignmentMatrix";

export const AssignmentsView = () => {
  const { matrix, students, lecturers } = useAdminAssignmentMatrix();
  
  return <AssignmentMatrix matrix={matrix} students={students} lecturers={lecturers} />;
};
```

**After**:
```typescript
// features/admin/pages/AssignmentsView.tsx
import { useBackendData } from '../../../hooks/useBackendData';
import { useMutation } from '../../../hooks/useMutation';
import type { Student } from '../../../types/student';
import type { Lecturer } from '../../../types/lecturer';

interface AssignmentMatrix {
  [lecturerId: string]: {
    [studentId: string]: boolean;
  };
}

export const AssignmentsView = () => {
  const { data: lecturers = [], loading: lecturersLoading } = useBackendData<Lecturer[]>(
    '/Admin/lecturers'
  );

  // For each lecturer, fetch their assignments
  const lecturerAssignments = lecturers.map(lecturer => ({
    lecturer,
    data: useBackendData<Student[]>(`/Admin/assignments/by-lecturer/${lecturer.id}`),
  }));

  const { mutate: bulkAssign, loading: assigning } = useMutation<void, {
    lecturerId: string;
    studentIds: string[];
  }>(
    'post',
    '/Admin/assignments'
  );

  const { mutate: unassign, loading: unassigning } = useMutation<void, {
    lecturerId: string;
    studentId: string;
  }>(
    'delete',
    '/Admin/assignments'
  );

  const handleAssign = async (lecturerId: string, studentIds: string[]) => {
    try {
      await bulkAssign({ lecturerId, studentIds });
      // Refetch assignments for that lecturer
    } catch (err) {
      console.error('Failed to assign:', err);
    }
  };

  const handleUnassign = async (lecturerId: string, studentId: string) => {
    try {
      await unassign({ lecturerId, studentId });
      // Refetch assignments for that lecturer
    } catch (err) {
      console.error('Failed to unassign:', err);
    }
  };

  return (
    <AssignmentMatrix
      lecturers={lecturers}
      lecturerAssignments={lecturerAssignments}
      loading={lecturersLoading}
      onAssign={handleAssign}
      onUnassign={handleUnassign}
      assigning={assigning}
      unassigning={unassigning}
    />
  );
};
```

---

## Part 4: Service Layer Updates (Phase 6)

### 4.1 Update Enterprise Service

**Before**:
```typescript
// services/enterprise.service.ts
import { INITIAL_ENTERPRISES } from "../data/mockData";

export const enterpriseService = {
  getCompanies: async () => {
    return INITIAL_ENTERPRISES;
  },

  getCompanyById: async (id: string) => {
    return INITIAL_ENTERPRISES.find(c => c.id === id);
  },
};
```

**After**:
```typescript
// services/enterprise.service.ts
import { apiService } from './api';
import type { Enterprise } from '../types/enterprise';

export const enterpriseService = {
  getCompanies: async (params?: any): Promise<Enterprise[]> => {
    const response = await apiService.admin.companies.list(params);
    return response.data;
  },

  getCompanyById: async (id: string): Promise<Enterprise> => {
    const response = await apiService.admin.companies.get(id);
    return response.data;
  },

  createCompany: async (data: Omit<Enterprise, 'id'>): Promise<Enterprise> => {
    const response = await apiService.admin.companies.create(data);
    return response.data;
  },

  updateCompany: async (id: string, data: Partial<Enterprise>): Promise<Enterprise> => {
    const response = await apiService.admin.companies.update(id, data);
    return response.data;
  },

  deleteCompany: async (id: string): Promise<void> => {
    await apiService.admin.companies.delete(id);
  },
};
```

### 4.2 Update Student Service

**Before**:
```typescript
// services/student.service.ts
import { INITIAL_STUDENTS } from "../data/mockData";

export const studentService = {
  getStudents: async () => {
    return INITIAL_STUDENTS;
  },

  getStudentById: async (id: string) => {
    return INITIAL_STUDENTS.find(s => s.id === id);
  },
};
```

**After**:
```typescript
// services/student.service.ts
import { apiService } from './api';
import type { Student } from '../types/student';

export const studentService = {
  getStudents: async (params?: any): Promise<Student[]> => {
    const response = await apiService.admin.students.list(params);
    return response.data;
  },

  getStudentById: async (id: string): Promise<Student> => {
    const response = await apiService.admin.students.get(id);
    return response.data;
  },

  createStudent: async (data: Omit<Student, 'id'>): Promise<Student> => {
    const response = await apiService.admin.students.create(data);
    return response.data;
  },

  updateStudent: async (id: string, data: Partial<Student>): Promise<Student> => {
    const response = await apiService.admin.students.update(id, data);
    return response.data;
  },

  deleteStudent: async (id: string): Promise<void> => {
    await apiService.admin.students.delete(id);
  },
};
```

### 4.3 Update Submission Service

**Before**:
```typescript
// services/submission.service.ts
import { INITIAL_SUBMISSIONS } from "../data/mockData";

export const submissionService = {
  getSubmissions: async () => {
    return INITIAL_SUBMISSIONS;
  },
};
```

**After**:
```typescript
// services/submission.service.ts
import apiClient from './api.config';
import type { Submission } from '../types/submission';

export const submissionService = {
  getSubmissions: async (params?: any): Promise<Submission[]> => {
    const response = await apiClient.get('/Submission', { params });
    return response.data;
  },

  getSubmissionById: async (id: string): Promise<Submission> => {
    const response = await apiClient.get(`/Submission/${id}`);
    return response.data;
  },

  getSubmissionsByStudent: async (studentId: string): Promise<Submission[]> => {
    const response = await apiClient.get(`/Submission/by-student/${studentId}`);
    return response.data;
  },

  createSubmission: async (data: Omit<Submission, 'id'>): Promise<Submission> => {
    const response = await apiClient.post('/Submission', data);
    return response.data;
  },

  updateSubmission: async (id: string, data: Partial<Submission>): Promise<Submission> => {
    const response = await apiClient.put(`/Submission/${id}`, data);
    return response.data;
  },

  gradeSubmission: async (id: string, grade: number): Promise<Submission> => {
    const response = await apiClient.post(`/Submission/${id}/grade`, { grade });
    return response.data;
  },

  deleteSubmission: async (id: string): Promise<void> => {
    await apiClient.delete(`/Submission/${id}`);
  },
};
```

---

## Part 5: Testing & Error Handling

### 5.1 Error Handling Wrapper

**File**: `frontend/src/hooks/useApi.ts`

```typescript
import { useState, useCallback } from 'react';
import { useBackendData } from './useBackendData';
import { useMutation } from './useMutation';

interface ApiError {
  message: string;
  status?: number;
  details?: any;
}

const handleApiError = (error: any): ApiError => {
  if (error.response) {
    return {
      message: error.response.data?.message || 'An error occurred',
      status: error.response.status,
      details: error.response.data,
    };
  }
  if (error.request) {
    return {
      message: 'No response from server',
    };
  }
  return {
    message: error.message || 'An unexpected error occurred',
  };
};

export const useApi = {
  useQuery: useBackendData,
  useMutation: useMutation,
  handleError: handleApiError,
};
```

### 5.2 Example Error Boundary

**File**: `frontend/src/components/ErrorBoundary.tsx`

```typescript
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        this.props.fallback || (
          <div className="error-container">
            <h2>Something went wrong</h2>
            <p>{this.state.error.message}</p>
            <button onClick={() => this.setState({ error: null })}>
              Try again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

---

## Part 6: Environment Configuration

### 6.1 Update .env.example

**File**: `frontend/.env.example`

```
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_API_TIMEOUT=10000

# Feature Flags (for gradual rollout)
VITE_ENABLE_REAL_STUDENT_DATA=true
VITE_ENABLE_REAL_ADMIN_DATA=true
VITE_ENABLE_REAL_LECTURER_DATA=true
VITE_ENABLE_REAL_AUTH=true

# Deprecated
VITE_USE_MOCK=false
```

### 6.2 Update config/env.ts

**File**: `frontend/src/config/env.ts`

```typescript
export const ENV = {
  // API
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),

  // Feature Flags
  ENABLE_REAL_STUDENT_DATA: import.meta.env.VITE_ENABLE_REAL_STUDENT_DATA !== 'false',
  ENABLE_REAL_ADMIN_DATA: import.meta.env.VITE_ENABLE_REAL_ADMIN_DATA !== 'false',
  ENABLE_REAL_LECTURER_DATA: import.meta.env.VITE_ENABLE_REAL_LECTURER_DATA !== 'false',
  ENABLE_REAL_AUTH: import.meta.env.VITE_ENABLE_REAL_AUTH !== 'false',

  // Legacy (deprecated)
  USE_MOCK: import.meta.env.VITE_USE_MOCK === 'true',
};
```

---

## Summary

This implementation guide provides:

1. ✅ **Infrastructure** - API configuration, hooks, services
2. ✅ **Code patterns** - Before/after examples for each major component type
3. ✅ **Error handling** - Proper error boundaries and handling
4. ✅ **Environment setup** - Configuration for gradual rollout
5. ✅ **Service layer** - Complete service layer examples

**Next Steps**:
1. Start with Phase 1 infrastructure
2. Implement hooks and services first
3. Then gradually migrate pages by phase
4. Test each phase thoroughly before moving to the next
