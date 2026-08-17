/** MVP feature flags — flip to true when backend/IA ready. */
export const FEATURES = {
  /** Admin Kỳ thực tập (backend chưa sẵn) */
  adminSemesters: true,
  /** Admin Yêu cầu tài khoản — gộp vào UsersView */
  adminAccountRequests: false,
  /** Floating AI assistant — out of MVP */
  floatingAi: false,
  /** Lecturer Analytics nâng cao — out of MVP */
  lecturerAnalytics: false,
} as const;

export type FeatureFlag = keyof typeof FEATURES;
