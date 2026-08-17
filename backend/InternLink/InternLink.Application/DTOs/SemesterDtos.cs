using System;
using InternLink.Domain.Enums;

namespace InternLink.Application.DTOs;

public class SemesterDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string Term { get; set; } = null!;
    public string AcademicYear { get; set; } = null!;
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public SemesterStatus Status { get; set; }
    public string? Description { get; set; }
    public int MaxStudentsPerLecturer { get; set; }
    public int StudentsCount { get; set; }
    public int LecturersCount { get; set; }
    public int PlacedStudents { get; set; }
    public int CompaniesCount { get; set; }
    public int ProgressPercent { get; set; }
    public string CurrentPhase { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreateSemesterDto
{
    public string Name { get; set; } = null!;
    public string Term { get; set; } = null!;
    public string AcademicYear { get; set; } = null!;
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public SemesterStatus Status { get; set; } = SemesterStatus.Upcoming;
    public string? Description { get; set; }
    public int MaxStudentsPerLecturer { get; set; } = 30;
    public int TargetStudents { get; set; } = 0;
}

public class UpdateSemesterDto
{
    public string? Name { get; set; }
    public string? Term { get; set; }
    public string? AcademicYear { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public SemesterStatus? Status { get; set; }
    public string? Description { get; set; }
    public int? MaxStudentsPerLecturer { get; set; }
}
