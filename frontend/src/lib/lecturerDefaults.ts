export const LECTURER_DEFAULT_FILTERS = {
  classFilter: 'Tất cả',
  companyFilter: 'Tất cả',
  statusFilter: 'Tất cả',
  progressFilter: 'Tất cả',
  gpaFilter: 'Tất cả',
  majorFilter: 'Tất cả',
  sortBy: 'name',
  pageSize: 10,
} as const;

export const LECTURER_DEFAULT_SEARCH_PLACEHOLDER =
  'Tìm MSSV, họ tên, lớp, doanh nghiệp...';

export const LECTURER_CHAT_INITIAL_HISTORY: LecturerChatMessage[] = [];

export type LecturerChatMessage = {
  sender: string;
  text: string;
  time: string;
  role: 'lecturer' | 'student';
};
