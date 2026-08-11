using FluentValidation;
using InternLink.Application.DTOs;

namespace InternLink.Application.Validators;

public class CreateEvaluationRequestValidator : AbstractValidator<CreateEvaluationRequest>
{
    public CreateEvaluationRequestValidator()
    {
        RuleFor(x => x.InternshipId)
            .NotEmpty().WithMessage("Internship ID is required");

        RuleFor(x => x.TechnicalScore)
            .InclusiveBetween(0, 10).WithMessage("Technical Score must be between 0 and 10");

        RuleFor(x => x.CommunicationScore)
            .InclusiveBetween(0, 10).WithMessage("Communication Score must be between 0 and 10");

        RuleFor(x => x.TeamworkScore)
            .InclusiveBetween(0, 10).WithMessage("Teamwork Score must be between 0 and 10");

        RuleFor(x => x.InitiativeScore)
            .InclusiveBetween(0, 10).WithMessage("Initiative Score must be between 0 and 10");

        RuleFor(x => x.Comments)
            .MaximumLength(3000).WithMessage("Comments must not exceed 3000 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.Comments));

        RuleFor(x => x.Strengths)
            .MaximumLength(2000).WithMessage("Strengths must not exceed 2000 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.Strengths));

        RuleFor(x => x.AreasForImprovement)
            .MaximumLength(2000).WithMessage("Areas For Improvement must not exceed 2000 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.AreasForImprovement));
    }
}

public class UpdateEvaluationRequestValidator : AbstractValidator<UpdateEvaluationRequest>
{
    public UpdateEvaluationRequestValidator()
    {
        RuleFor(x => x.TechnicalScore)
            .InclusiveBetween(0, 10).WithMessage("Technical Score must be between 0 and 10")
            .When(x => x.TechnicalScore.HasValue);

        RuleFor(x => x.CommunicationScore)
            .InclusiveBetween(0, 10).WithMessage("Communication Score must be between 0 and 10")
            .When(x => x.CommunicationScore.HasValue);

        RuleFor(x => x.TeamworkScore)
            .InclusiveBetween(0, 10).WithMessage("Teamwork Score must be between 0 and 10")
            .When(x => x.TeamworkScore.HasValue);

        RuleFor(x => x.InitiativeScore)
            .InclusiveBetween(0, 10).WithMessage("Initiative Score must be between 0 and 10")
            .When(x => x.InitiativeScore.HasValue);

        RuleFor(x => x.Comments)
            .MaximumLength(3000).WithMessage("Comments must not exceed 3000 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.Comments));

        RuleFor(x => x.Strengths)
            .MaximumLength(2000).WithMessage("Strengths must not exceed 2000 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.Strengths));

        RuleFor(x => x.AreasForImprovement)
            .MaximumLength(2000).WithMessage("Areas For Improvement must not exceed 2000 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.AreasForImprovement));
    }
}

public class EvaluationFilterRequestValidator : AbstractValidator<EvaluationFilterRequest>
{
    public EvaluationFilterRequestValidator()
    {
        RuleFor(x => x.Skip)
            .GreaterThanOrEqualTo(0).WithMessage("Skip must be greater than or equal to 0");

        RuleFor(x => x.Take)
            .GreaterThan(0).WithMessage("Take must be greater than 0")
            .LessThanOrEqualTo(1000).WithMessage("Take must not exceed 1000");

        RuleFor(x => x.MinGrade)
            .InclusiveBetween(0, 10).WithMessage("Min Grade must be between 0 and 10")
            .When(x => x.MinGrade.HasValue);

        RuleFor(x => x.MaxGrade)
            .InclusiveBetween(0, 10).WithMessage("Max Grade must be between 0 and 10")
            .When(x => x.MaxGrade.HasValue);

        RuleFor(x => x)
            .Custom((request, context) =>
            {
                if (request.MinGrade.HasValue && request.MaxGrade.HasValue)
                {
                    if (request.MinGrade.Value > request.MaxGrade.Value)
                    {
                        context.AddFailure("MinGrade", "Min Grade must be less than or equal to Max Grade");
                    }
                }
            });

        RuleFor(x => x.EvaluatedFrom)
            .LessThanOrEqualTo(x => x.EvaluatedTo)
            .WithMessage("Evaluated From date must be before Evaluated To date")
            .When(x => x.EvaluatedFrom.HasValue && x.EvaluatedTo.HasValue);

        RuleFor(x => x.SortBy)
            .Must(sortBy => new[] { "FinalGrade", "EvaluatedAt", "StudentName" }.Contains(sortBy, StringComparer.OrdinalIgnoreCase))
            .WithMessage("Invalid sort field. Allowed fields: FinalGrade, EvaluatedAt, StudentName")
            .When(x => !string.IsNullOrWhiteSpace(x.SortBy));

        RuleFor(x => x.SortOrder)
            .Must(order => new[] { "asc", "desc" }.Contains(order, StringComparer.OrdinalIgnoreCase))
            .WithMessage("Sort order must be 'asc' or 'desc'")
            .When(x => !string.IsNullOrWhiteSpace(x.SortOrder));
    }
}
