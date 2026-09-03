/**
 * @deprecated This hook is no longer used.
 *
 * The EvaluationDashboard now loads students via `rubricService.getLecturerStudents()`
 * which returns `LecturerEvaluationStudentDto[]` with evaluation status built-in.
 *
 * For fetching a single evaluation, use `evaluationService.getByInternship(internshipId)`.
 * For saving scores, use `rubricService.saveScores(evaluationId, criteriaScores, comments)`.
 *
 * This file can be safely deleted once all references are confirmed removed.
 */
export {};
