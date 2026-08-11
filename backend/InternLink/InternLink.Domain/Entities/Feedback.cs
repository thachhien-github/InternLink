namespace InternLink.Domain.Entities;

public class Feedback : BaseEntity
{
    public Guid SubmissionId { get; set; }
    public Submission Submission { get; set; } = null!;

    public Guid? LecturerId { get; set; }
    public Lecturer? Lecturer { get; set; }

    public string Comment { get; set; } = null!;
    public bool IsPublic { get; set; } = true;
}
