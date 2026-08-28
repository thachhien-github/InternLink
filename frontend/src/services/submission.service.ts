import type { Submission } from "../types/submission";
import { submissionApiService } from "./submissionApi.service";
import { mapSubmissionDtoToRow } from "../lib/portalMappers";

export const submissionService = {
  async getSubmissions(): Promise<Submission[]> {
    const list = await submissionApiService.getMine();
    return list.map((s) => mapSubmissionDtoToRow(s, {}));
  },

  async updateSubmissionStatus(
    id: string,
    newStatus: string,
    note?: string,
  ): Promise<Submission | null> {
    const updated = await submissionApiService.review(id, newStatus, note);
    return mapSubmissionDtoToRow(updated, {});
  },
};

