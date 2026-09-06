using InternLink.Domain.Enums;

namespace InternLink.Domain.Entities;

public class Semester : BaseEntity
{
    public string Name { get; set; } = null!;
    public string Term { get; set; } = null!; // "Học kỳ I", "Học kỳ II", "Học kỳ Hè"
    public string AcademicYear { get; set; } = null!; // "2025 - 2026"
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public SemesterStatus Status { get; set; } = SemesterStatus.Upcoming;
    public string? Description { get; set; }
    public int MaxStudentsPerLecturer { get; set; } = 30;

    public ICollection<Internship> Internships { get; set; } = new List<Internship>();

    /// <summary>
    /// Lecturers imported/registered for this semester (before they are assigned students).
    /// </summary>
    public ICollection<SemesterLecturer> SemesterLecturers { get; set; } = new List<SemesterLecturer>();

    /// <summary>
    /// Partner companies linked to this semester (IsActive = false means "ngưng liên kết").
    /// Absence of a row means the company is linked by default.
    /// </summary>
    public ICollection<SemesterCompany> SemesterCompanies { get; set; } = new List<SemesterCompany>();

    /// <summary>
    /// The evaluation rubric configured for this semester (at most one)
    /// </summary>
    public EvaluationRubric? EvaluationRubric { get; set; }
}
