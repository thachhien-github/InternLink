namespace InternLink.Domain.Enums;

/// <summary>
/// Determines how the rubric is applied to lecturers.
/// Required: all lecturers must use this rubric exactly as defined.
/// LecturerCustom: admin provides a template; lecturers may adjust weights or add/remove criteria.
/// </summary>
public enum RubricApplicationMode
{
    Required = 0,
    LecturerCustom = 1
}
