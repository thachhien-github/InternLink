namespace InternLink.Domain.Entities;

/// <summary>
/// Represents an evaluation/grading of a student's internship performance
/// </summary>
public class Evaluation : BaseEntity
{
    /// <summary>
    /// The internship being evaluated
    /// </summary>
    public Guid InternshipId { get; set; }
    public Internship Internship { get; set; } = null!;

    /// <summary>
    /// The lecturer who performed the evaluation
    /// </summary>
    public Guid? EvaluatedById { get; set; }
    public User? EvaluatedBy { get; set; }

    /// <summary>
    /// Technical Skills score (0-10)
    /// </summary>
    public int TechnicalScore { get; set; }

    /// <summary>
    /// Communication Skills score (0-10)
    /// </summary>
    public int CommunicationScore { get; set; }

    /// <summary>
    /// Teamwork/Collaboration score (0-10)
    /// </summary>
    public int TeamworkScore { get; set; }

    /// <summary>
    /// Initiative/Proactivity score (0-10)
    /// </summary>
    public int InitiativeScore { get; set; }

    /// <summary>
    /// Overall final grade (calculated from 4 criteria)
    /// </summary>
    public decimal FinalGrade { get; set; }

    /// <summary>
    /// Lecturer's comments on student performance
    /// </summary>
    public string? Comments { get; set; }

    /// <summary>
    /// Strengths demonstrated by the student
    /// </summary>
    public string? Strengths { get; set; }

    /// <summary>
    /// Areas for improvement
    /// </summary>
    public string? AreasForImprovement { get; set; }

    /// <summary>
    /// Date when the evaluation was created
    /// </summary>
    public DateTime EvaluatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Flag indicating if this evaluation has been finalized
    /// </summary>
    public bool IsFinalized { get; set; } = false;

    /// <summary>
    /// Calculate overall grade as average of 4 scores
    /// </summary>
    public void CalculateFinalGrade()
    {
        FinalGrade = Math.Round((TechnicalScore + CommunicationScore + TeamworkScore + InitiativeScore) / 4.0m, 2);
    }
}
