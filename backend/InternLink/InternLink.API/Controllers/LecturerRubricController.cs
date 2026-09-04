using System.Text.Json;
using InternLink.API.Extensions;
using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Domain.Entities;
using InternLink.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InternLink.API.Controllers;

/// <summary>
/// Lecturer controller for viewing approved rubrics and submitting evaluation scores per criterion.
/// </summary>
[ApiController]
[Route("api/Lecturer")]
[Authorize(Policy = "RequireLecturerOrAdmin")]
public class LecturerRubricController : ControllerBase
{
    private readonly IRubricService _rubricService;
    private readonly AppDbContext _context;
    private readonly ILecturerAccessService _lecturerAccessService;
    private readonly ILogger<LecturerRubricController> _logger;

    public LecturerRubricController(
        IRubricService rubricService,
        AppDbContext context,
        ILecturerAccessService lecturerAccessService,
        ILogger<LecturerRubricController> logger)
    {
        _rubricService = rubricService;
        _context = context;
        _lecturerAccessService = lecturerAccessService;
        _logger = logger;
    }

    /// <summary>
    /// Get approved rubric for a semester (used by lecturer to know which criteria to score)
    /// </summary>
    [HttpGet("rubric")]
    [ProducesResponseType(typeof(RubricDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RubricDto>> GetApprovedRubric([FromQuery] Guid semesterId)
    {
        try
        {
            var rubric = await _rubricService.GetApprovedRubricAsync(semesterId);
            if (rubric == null)
                return NotFound(new { message = "Chưa có rubric đã phê duyệt cho kỳ này." });

            return Ok(rubric);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving approved rubric for semester {SemesterId}", semesterId);
            return StatusCode(500, new { message = "Lỗi khi lấy rubric." });
        }
    }

    /// <summary>
    /// Save evaluation scores for a student (creates or updates, with dynamic criteria)
    /// </summary>
    [HttpPut("evaluation/{evaluationId}/scores")]
    [ProducesResponseType(typeof(EvaluationScoresResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<EvaluationScoresResponse>> SaveEvaluationScores(
        Guid evaluationId,
        [FromBody] EvaluationScoresRequest request)
    {
        try
        {
            var userId = User.GetUserId();
            if (userId == null)
                return Unauthorized(new { message = "User ID not found in token." });

            var evaluation = await _context.Evaluations
                .FirstOrDefaultAsync(e => e.Id == evaluationId && !e.IsDeleted);

            if (evaluation == null)
                return NotFound(new { message = "Không tìm thấy đánh giá." });

            if (evaluation.IsFinalized)
                return BadRequest(new { message = "Đánh giá đã chốt, không thể chỉnh sửa." });

            // Serialize criteria scores
            var scoresJson = JsonSerializer.Serialize(request.CriteriaScores);

            // Validate total weight
            var totalWeight = request.CriteriaScores.Sum(c => c.Weight);
            if (Math.Abs(totalWeight - 100) > 0.01m)
                return BadRequest(new { message = $"Tổng trọng số phải bằng 100%. Hiện tại: {totalWeight}%" });

            // Validate individual scores
            foreach (var score in request.CriteriaScores)
            {
                if (score.Score < 0 || score.Score > score.MaxScore)
                    return BadRequest(new { message = $"Điểm '{score.CriterionName}' phải từ 0 đến {score.MaxScore}." });
            }

            evaluation.CriteriaScoresJson = scoresJson;
            evaluation.Comments = request.Comments;
            evaluation.CalculateFinalGradeFromCriteria();
            evaluation.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var response = new EvaluationScoresResponse
            {
                EvaluationId = evaluation.Id,
                CriteriaScores = request.CriteriaScores.Select(c => new CriterionScoreDto
                {
                    CriterionId = c.CriterionId,
                    CriterionName = c.CriterionName,
                    Weight = c.Weight,
                    MaxScore = c.MaxScore,
                    Score = c.Score,
                    Comment = c.Comment,
                    OrderIndex = 0
                }).ToList(),
                FinalGrade = evaluation.FinalGrade,
                IsFinalized = evaluation.IsFinalized
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saving evaluation scores for {EvaluationId}", evaluationId);
            return StatusCode(500, new { message = "Lỗi khi lưu điểm." });
        }
    }

    /// <summary>
    /// Get evaluation detail with criteria scores
    /// </summary>
    [HttpGet("evaluation/{evaluationId}/scores")]
    [ProducesResponseType(typeof(EvaluationScoresResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<EvaluationScoresResponse>> GetEvaluationScores(Guid evaluationId)
    {
        try
        {
            var evaluation = await _context.Evaluations
                .FirstOrDefaultAsync(e => e.Id == evaluationId && !e.IsDeleted);

            if (evaluation == null)
                return NotFound(new { message = "Không tìm thấy đánh giá." });

            var criteriaScores = new List<CriterionScoreDto>();
            if (!string.IsNullOrWhiteSpace(evaluation.CriteriaScoresJson))
            {
                criteriaScores = JsonSerializer.Deserialize<List<CriterionScoreDto>>(evaluation.CriteriaScoresJson)
                    ?? new List<CriterionScoreDto>();
            }

            return Ok(new EvaluationScoresResponse
            {
                EvaluationId = evaluation.Id,
                CriteriaScores = criteriaScores,
                FinalGrade = evaluation.FinalGrade,
                IsFinalized = evaluation.IsFinalized
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving evaluation scores for {EvaluationId}", evaluationId);
            return StatusCode(500, new { message = "Lỗi khi lấy điểm." });
        }
    }

    /// <summary>
    /// Get all students assigned to the current lecturer for a semester,
    /// with their evaluation status (graded/ungraded/draft).
    /// </summary>
    [HttpGet("students")]
    [ProducesResponseType(typeof(IEnumerable<LecturerEvaluationStudentDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<LecturerEvaluationStudentDto>>> GetLecturerStudents(
        [FromQuery] Guid? semesterId)
    {
        try
        {
            var userId = User.GetUserId();
            if (userId == null)
                return Unauthorized(new { message = "User ID not found in token." });

            var lecturerId = await _lecturerAccessService.ResolveLecturerIdAsync(userId.Value);
            if (lecturerId == null)
                return Ok(Array.Empty<LecturerEvaluationStudentDto>());

            var query = _context.Internships
                .Where(i => i.LecturerId == lecturerId.Value && !i.IsDeleted)
                .Include(i => i.Student)
                .Include(i => i.Company)
                .Include(i => i.Semester)
                .Include(i => i.WeeklyReports.Where(wr => !wr.IsDeleted))
                .AsQueryable();

            if (semesterId.HasValue)
                query = query.Where(i => i.SemesterId == semesterId.Value);

            var internships = await query.ToListAsync();

            // Get all internship IDs to batch-fetch evaluations
            var internshipIds = internships.Select(i => i.Id).ToList();
            var evaluations = await _context.Evaluations
                .Where(e => internshipIds.Contains(e.InternshipId) && !e.IsDeleted)
                .ToDictionaryAsync(e => e.InternshipId);

            var result = internships.Select(i =>
            {
                evaluations.TryGetValue(i.Id, out var ev);
                return new LecturerEvaluationStudentDto
                {
                    StudentId = i.StudentId,
                    InternshipId = i.Id,
                    SemesterId = i.SemesterId,
                    StudentCode = i.Student?.StudentCode ?? "—",
                    FullName = i.Student?.FullName ?? "—",
                    Email = i.Student?.Email,
                    Phone = i.Student?.Phone,
                    Class = i.Student?.Class,
                    Major = i.Student?.Major,
                    CompanyId = i.CompanyId,
                    CompanyName = i.Company?.CompanyName,
                    Position = i.Position,
                    InternshipStatus = i.Status.ToString(),
                    StartDate = i.StartDate?.ToString("yyyy-MM-dd"),
                    EndDate = i.EndDate?.ToString("yyyy-MM-dd"),
                    WeeklyReportCount = i.WeeklyReports.Count,
                    PendingReportCount = 0,
                    SubmissionCount = 0,
                    FinalGrade = ev?.FinalGrade,
                    EvaluatedAt = ev?.EvaluatedAt,
                    HasEvaluation = ev != null,
                    IsEvaluationFinalized = ev?.IsFinalized ?? false,
                    ProgressPercent = i.Status == InternLink.Domain.Enums.InternshipStatus.Completed ? 100
                        : i.Status == InternLink.Domain.Enums.InternshipStatus.InProgress ? 55 : 10
                };
            }).ToList();

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving lecturer students");
            return StatusCode(500, new { message = "Lỗi khi lấy danh sách sinh viên." });
        }
    }
}

/// <summary>
/// DTO for lecturer student list (evaluation context)
/// </summary>
public class LecturerEvaluationStudentDto
{
    public Guid StudentId { get; set; }
    public Guid InternshipId { get; set; }
    public Guid? SemesterId { get; set; }
    public string StudentCode { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Class { get; set; }
    public string? Major { get; set; }
    public Guid? CompanyId { get; set; }
    public string? CompanyName { get; set; }
    public string? Position { get; set; }
    public string InternshipStatus { get; set; } = null!;
    public string? StartDate { get; set; }
    public string? EndDate { get; set; }
    public int WeeklyReportCount { get; set; }
    public int PendingReportCount { get; set; }
    public int SubmissionCount { get; set; }
    public decimal? FinalGrade { get; set; }
    public DateTime? EvaluatedAt { get; set; }
    public bool HasEvaluation { get; set; }
    public bool IsEvaluationFinalized { get; set; }
    public int ProgressPercent { get; set; }
}
