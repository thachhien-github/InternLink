import { apiRequestRaw } from "../lib/apiClient";

import type {

  CreateEvaluationRequestDto,

  EvaluationDetailDto,

  EvaluationListItemDto,

  UpdateEvaluationRequestDto,

} from "../types/api";



export type UiEvaluationPayload = {

  id?: string;

  internshipId?: string;

  enterpriseScore?: number;

  lecturerScore?: number;

  presentationScore?: number;

  lecturerComments?: string;

};



function toScoreBody(s: UiEvaluationPayload): UpdateEvaluationRequestDto {

  const technical = Math.round(s.lecturerScore ?? 8);

  const communication = Math.round(s.enterpriseScore ?? 8);

  const teamwork = Math.round(s.presentationScore ?? 8);

  return {

    technicalScore: technical,

    communicationScore: communication,

    teamworkScore: teamwork,

    initiativeScore: Math.round((technical + communication) / 2),

    comments: s.lecturerComments?.trim() || undefined,

  };

}



function isGuid(id?: string) {

  if (!id) return false;

  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(

    id,

  );

}



export const evaluationService = {

  list(skip = 0, take = 500): Promise<EvaluationListItemDto[]> {

    return apiRequestRaw<EvaluationListItemDto[]>(

      `/api/Evaluation?skip=${skip}&take=${take}`,

    );

  },



  getById(id: string): Promise<EvaluationDetailDto> {

    return apiRequestRaw<EvaluationDetailDto>(`/api/Evaluation/${id}`);

  },



  getByInternship(internshipId: string): Promise<EvaluationDetailDto | null> {

    return apiRequestRaw<EvaluationDetailDto>(

      `/api/Evaluation/internship/${internshipId}`,

    ).catch(() => null);

  },



  create(body: CreateEvaluationRequestDto): Promise<EvaluationDetailDto> {

    return apiRequestRaw<EvaluationDetailDto>("/api/Evaluation", {

      method: "POST",

      body,

    });

  },



  update(

    id: string,

    body: UpdateEvaluationRequestDto,

  ): Promise<EvaluationDetailDto> {

    return apiRequestRaw<EvaluationDetailDto>(`/api/Evaluation/${id}`, {

      method: "PUT",

      body,

    });

  },



  finalize(id: string): Promise<EvaluationDetailDto> {

    return apiRequestRaw<EvaluationDetailDto>(

      `/api/Evaluation/${id}/finalize`,

      { method: "POST" },

    );

  },



  /** Map UI grading form → create/update + optional finalize. */

  async persistFromUi(

    student: UiEvaluationPayload,

    finalize: boolean,

  ): Promise<EvaluationDetailDto> {

    const scores = toScoreBody(student);



    if (isGuid(student.id)) {

      await this.update(student.id!, scores);

      if (finalize) {

        return this.finalize(student.id!);

      }

      return this.getById(student.id!);

    }



    if (!student.internshipId) {

      throw new Error("Thiếu internshipId để tạo đánh giá");

    }



    return this.create({

      internshipId: student.internshipId,

      ...scores,

      technicalScore: scores.technicalScore ?? 8,

      communicationScore: scores.communicationScore ?? 8,

      teamworkScore: scores.teamworkScore ?? 8,

      initiativeScore: scores.initiativeScore ?? 8,

      isFinalized: finalize,

    });

  },

};


