namespace InternLink.Application.DTOs;

// --- Criterion DTOs ---

public class RubricCriterionDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public decimal Weight { get; set; }
    public int MaxScore { get; set; } = 10;
    public int OrderIndex { get; set; }
}

public class CreateRubricCriterionRequest
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public decimal Weight { get; set; }
    public int MaxScore { get; set; } = 10;
    public int OrderIndex { get; set; }
}

public class UpdateRubricCriterionRequest
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public decimal? Weight { get; set; }
    public int? MaxScore { get; set; }
    public int? OrderIndex { get; set; }
}

// --- Rubric DTOs ---

public class RubricDto
{
    public Guid Id { get; set; }
    public Guid SemesterId { get; set; }
    public string Name { get; set; } = null!;
    public string ApplicationMode { get; set; } = "Required";
    public string Status { get; set; } = "Draft";
    public List<RubricCriterionDto> Criteria { get; set; } = new();
    public string? RejectionReason { get; set; }
    public string? SubmittedByName { get; set; }
    public DateTime? SubmittedAt { get; set; }
    public string? ApprovedByName { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class CreateRubricRequest
{
    public string Name { get; set; } = null!;
    public string ApplicationMode { get; set; } = "Required";
    public List<CreateRubricCriterionRequest> Criteria { get; set; } = new();
}

public class UpdateRubricRequest
{
    public string? Name { get; set; }
    public string? ApplicationMode { get; set; }
    public List<UpdateRubricCriterionRequest>? Criteria { get; set; }
}

public class SubmitRubricRequest
{
    public string? Note { get; set; }
}

public class ApproveRubricRequest
{
    public string? Note { get; set; }
}

public class RejectRubricRequest
{
    public string RejectionReason { get; set; } = null!;
}

// --- Evaluation Criteria Score DTOs (for Lecturer scoring) ---

public class CriterionScoreInput
{
    public Guid CriterionId { get; set; }
    public string CriterionName { get; set; } = null!;
    public decimal Weight { get; set; }
    public int MaxScore { get; set; } = 10;
    public int Score { get; set; }
    public string? Comment { get; set; }
}

public class EvaluationScoresRequest
{
    public List<CriterionScoreInput> CriteriaScores { get; set; } = new();
    public string? Comments { get; set; }
}

public class EvaluationScoresResponse
{
    public Guid EvaluationId { get; set; }
    public List<CriterionScoreDto> CriteriaScores { get; set; } = new();
    public decimal FinalGrade { get; set; }
    public bool IsFinalized { get; set; }
}

public class CriterionScoreDto
{
    public Guid? CriterionId { get; set; }
    public string CriterionName { get; set; } = null!;
    public string? CriterionDescription { get; set; }
    public decimal Weight { get; set; }
    public int MaxScore { get; set; }
    public int Score { get; set; }
    public string? Comment { get; set; }
    public int OrderIndex { get; set; }
}
