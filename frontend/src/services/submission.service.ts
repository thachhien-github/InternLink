import type { Submission } from '../types/submission';
import { INITIAL_SUBMISSIONS } from '../data/mockData';

let submissionsData: Submission[] = [...INITIAL_SUBMISSIONS];

export const submissionService = {
  async getSubmissions(): Promise<Submission[]> {
    return [...submissionsData];
  },

  async updateSubmissionStatus(id: string, newStatus: string, note?: string): Promise<Submission | null> {
    const idx = submissionsData.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    submissionsData[idx] = {
      ...submissionsData[idx],
      status: newStatus,
      lecturerNote: note || submissionsData[idx].lecturerNote,
      approvedAt: newStatus === 'Đã duyệt' ? '03/11/2026 14:00' : submissionsData[idx].approvedAt
    };
    return submissionsData[idx];
  }
};
