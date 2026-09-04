/**
 * Frontend contracts for the configurable internship evaluation rubric.
 *
 * These deliberately keep the rubric definition separate from an evaluation
 * score snapshot: an approved rubric can change only for future evaluations,
 * while a saved evaluation retains the criterion names, weights and scale that
 * were used when it was graded.
 */

export type RubricApplicationMode = "Required" | "LecturerCustom";

export type EvaluationRubricStatus =
  | "Draft"
  | "PendingApproval"
  | "Approved"
  | "Rejected"
  | "Locked";

export interface EvaluationRubricCriterionDto {
  id: string;
  name: string;
  description?: string | null;
  weight: number;
  maxScore: number;
  orderIndex: number;
}

export interface EvaluationRubricDto {
  id: string;
  semesterId: string;
  name: string;
  applicationMode: RubricApplicationMode;
  status: EvaluationRubricStatus;
  criteria: EvaluationRubricCriterionDto[];
  rejectionReason?: string | null;
  submittedAt?: string | null;
  reviewedAt?: string | null;
  approvedAt?: string | null;
  approvedByName?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

/** A criterion snapshot stored with an evaluation. */
export interface EvaluationCriterionScoreDto {
  id?: string;
  criterionId?: string | null;
  criterionName: string;
  criterionDescription?: string | null;
  weight: number;
  maxScore: number;
  score: number;
  comment?: string | null;
  orderIndex?: number;
  weightedScore?: number;
}

export interface EvaluationCriterionScoreInput {
  /** Required when the semester uses an approved Required rubric. */
  criterionId?: string;
  /** Required for lecturer-defined criteria. */
  criterionName?: string;
  criterionDescription?: string;
  weight?: number;
  maxScore?: number;
  score: number;
  comment?: string;
  orderIndex?: number;
}

export interface DynamicEvaluationCreateRequest {
  internshipId: string;
  criteriaScores: EvaluationCriterionScoreInput[];
  comments?: string;
}

export interface DynamicEvaluationUpdateRequest {
  criteriaScores: EvaluationCriterionScoreInput[];
  comments?: string;
}

/** Student list returned by GET /api/Lecturer/students. */
export interface LecturerEvaluationStudentDto {
  studentId: string;
  internshipId: string;
  semesterId?: string | null;
  studentCode: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  class?: string | null;
  major?: string | null;
  companyId?: string | null;
  companyName?: string | null;
  position?: string | null;
  internshipStatus: string;
  startDate?: string | null;
  endDate?: string | null;
  weeklyReportCount: number;
  pendingReportCount?: number;
  submissionCount?: number;
  finalGrade?: number | null;
  evaluatedAt?: string | null;
  hasEvaluation: boolean;
  isEvaluationFinalized: boolean;
  progressPercent: number;
}

export function calculateWeightedGrade(
  criteria: Pick<EvaluationCriterionScoreDto, "score" | "maxScore" | "weight">[],
): number {
  const percentage = criteria.reduce((total, criterion) => {
    if (!Number.isFinite(criterion.maxScore) || criterion.maxScore <= 0) {
      return total;
    }
    return total + (criterion.score / criterion.maxScore) * criterion.weight;
  }, 0);

  return Number((percentage / 10).toFixed(2));
}

export function classifyGrade(score: number): string {
  if (score >= 9) return "Xuất sắc";
  if (score >= 8) return "Giỏi";
  if (score >= 6.5) return "Khá";
  if (score >= 5) return "Trung bình";
  return "Không đạt";
}
