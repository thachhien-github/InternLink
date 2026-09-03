import { apiRequestRaw } from "../lib/apiClient";
import type {
  EvaluationRubricDto,
  EvaluationRubricCriterionDto,
  EvaluationRubricStatus,
  RubricApplicationMode,
} from "../types/evaluation";

// --- API DTOs (backend shape) ---

interface RubricCriterionApiDto {
  id: string;
  name: string;
  description?: string | null;
  weight: number;
  maxScore: number;
  orderIndex: number;
}

interface RubricApiDto {
  id: string;
  semesterId: string;
  name: string;
  applicationMode: string;
  status: string;
  criteria: RubricCriterionApiDto[];
  rejectionReason?: string | null;
  submittedByName?: string | null;
  submittedAt?: string | null;
  approvedByName?: string | null;
  approvedAt?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

interface CreateRubricCriterionRequest {
  name: string;
  description?: string;
  weight: number;
  maxScore: number;
  orderIndex: number;
}

interface CreateRubricRequest {
  name: string;
  applicationMode: string;
  criteria: CreateRubricCriterionRequest[];
}

interface UpdateRubricRequest {
  name?: string;
  applicationMode?: string;
  criteria?: {
    name?: string;
    description?: string;
    weight?: number;
    maxScore?: number;
    orderIndex?: number;
  }[];
}

// --- Mappers ---

function mapCriterionFromApi(c: RubricCriterionApiDto): EvaluationRubricCriterionDto {
  return {
    id: c.id,
    name: c.name,
    description: c.description ?? null,
    weight: c.weight,
    maxScore: c.maxScore,
    orderIndex: c.orderIndex,
  };
}

function mapFromApi(r: RubricApiDto): EvaluationRubricDto {
  return {
    id: r.id,
    semesterId: r.semesterId,
    name: r.name,
    applicationMode: r.applicationMode as RubricApplicationMode,
    status: r.status as EvaluationRubricStatus,
    criteria: r.criteria.map(mapCriterionFromApi),
    rejectionReason: r.rejectionReason ?? null,
    submittedAt: r.submittedAt ?? null,
    reviewedAt: r.approvedAt ?? null,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt ?? null,
  };
}

// --- Service ---

export const rubricService = {
  /**
   * Get rubric for a semester
   */
  async getBySemester(semesterId: string): Promise<EvaluationRubricDto | null> {
    try {
      const raw = await apiRequestRaw<RubricApiDto>(
        `/api/Admin/semesters/${semesterId}/rubric`,
      );
      return mapFromApi(raw);
    } catch {
      return null;
    }
  },

  /**
   * Get approved rubric for a semester (lecturer view)
   */
  async getApproved(semesterId: string): Promise<EvaluationRubricDto | null> {
    try {
      const raw = await apiRequestRaw<RubricApiDto>(
        `/api/Lecturer/rubric?semesterId=${semesterId}`,
      );
      return mapFromApi(raw);
    } catch {
      return null;
    }
  },

  /**
   * Create a new rubric
   */
  async create(
    semesterId: string,
    request: CreateRubricRequest,
  ): Promise<EvaluationRubricDto> {
    const raw = await apiRequestRaw<RubricApiDto>(
      `/api/Admin/semesters/${semesterId}/rubric`,
      {
        method: "POST",
        body: request,
      },
    );
    return mapFromApi(raw);
  },

  /**
   * Update rubric
   */
  async update(
    semesterId: string,
    request: UpdateRubricRequest,
  ): Promise<EvaluationRubricDto> {
    const raw = await apiRequestRaw<RubricApiDto>(
      `/api/Admin/semesters/${semesterId}/rubric`,
      {
        method: "PUT",
        body: request,
      },
    );
    return mapFromApi(raw);
  },

  /**
   * Delete rubric
   */
  async delete(semesterId: string): Promise<void> {
    await apiRequestRaw(`/api/Admin/semesters/${semesterId}/rubric`, {
      method: "DELETE",
    });
  },

  /**
   * Submit rubric for approval
   */
  async submitForApproval(
    semesterId: string,
    note?: string,
  ): Promise<EvaluationRubricDto> {
    const raw = await apiRequestRaw<RubricApiDto>(
      `/api/Admin/semesters/${semesterId}/rubric/submit`,
      {
        method: "POST",
        body: { note },
      },
    );
    return mapFromApi(raw);
  },

  /**
   * Approve rubric (SuperAdmin acts as DepartmentHead)
   */
  async approve(
    semesterId: string,
    note?: string,
  ): Promise<EvaluationRubricDto> {
    const raw = await apiRequestRaw<RubricApiDto>(
      `/api/Admin/semesters/${semesterId}/rubric/approve`,
      {
        method: "POST",
        body: { note },
      },
    );
    return mapFromApi(raw);
  },

  /**
   * Reject rubric
   */
  async reject(
    semesterId: string,
    rejectionReason: string,
  ): Promise<EvaluationRubricDto> {
    const raw = await apiRequestRaw<RubricApiDto>(
      `/api/Admin/semesters/${semesterId}/rubric/reject`,
      {
        method: "POST",
        body: { rejectionReason },
      },
    );
    return mapFromApi(raw);
  },

  /**
   * Save evaluation scores for a student (lecturer)
   */
  async saveScores(
    evaluationId: string,
    criteriaScores: {
      criterionId: string;
      criterionName: string;
      weight: number;
      maxScore: number;
      score: number;
      comment?: string;
    }[],
    comments?: string,
  ): Promise<{
    evaluationId: string;
    finalGrade: number;
    isFinalized: boolean;
  }> {
    return apiRequestRaw(
      `/api/Lecturer/evaluation/${evaluationId}/scores`,
      {
        method: "PUT",
        body: { criteriaScores, comments },
      },
    );
  },

  /**
   * Get evaluation scores for a student (lecturer/student view)
   */
  async getScores(
    evaluationId: string,
  ): Promise<{
    evaluationId: string;
    criteriaScores: {
      criterionId?: string;
      criterionName: string;
      weight: number;
      maxScore: number;
      score: number;
      comment?: string;
    }[];
    finalGrade: number;
    isFinalized: boolean;
  }> {
    return apiRequestRaw(
      `/api/Lecturer/evaluation/${evaluationId}/scores`,
    );
  },

  /**
   * Get all students assigned to lecturer (with evaluation status)
   */
  async getLecturerStudents(semesterId?: string): Promise<
    {
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
      weeklyReportCount: number;
      hasEvaluation: boolean;
      isEvaluationFinalized: boolean;
      finalGrade?: number | null;
      progressPercent: number;
    }[]
  > {
    const qs = semesterId ? `?semesterId=${semesterId}` : "";
    return apiRequestRaw(`/api/Lecturer/students${qs}`);
  },
};
