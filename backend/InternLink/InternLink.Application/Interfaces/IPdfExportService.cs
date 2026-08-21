namespace InternLink.Application.Interfaces;

public interface IPdfExportService
{
    /// <summary>
    /// Generates end-of-term summary PDF for all students guided by a lecturer.
    /// </summary>
    Task<byte[]> GenerateLecturerSummaryPdfAsync(Guid lecturerUserId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Generates official internship evaluation sheet PDF for an individual student.
    /// </summary>
    Task<byte[]> GenerateStudentEvaluationPdfAsync(Guid internshipId, Guid requesterUserId, CancellationToken cancellationToken = default);
}
