using FluentValidation;
using InternLink.Application.DTOs;
using InternLink.Domain.Enums;

namespace InternLink.Application.Validators;

public class CreateWeeklyReportRequestValidator : AbstractValidator<CreateWeeklyReportRequest>
{
    public CreateWeeklyReportRequestValidator()
    {
        RuleFor(x => x.InternshipId)
            .NotEmpty().WithMessage("Internship ID is required");

        RuleFor(x => x.WeekNumber)
            .GreaterThan(0).WithMessage("Week number must be greater than 0")
            .LessThanOrEqualTo(52).WithMessage("Week number must not exceed 52");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(250).WithMessage("Title must not exceed 250 characters");

        RuleFor(x => x.Content)
            .NotEmpty().WithMessage("Content is required")
            .MaximumLength(8000).WithMessage("Content must not exceed 8000 characters");
    }
}

public class UpdateWeeklyReportRequestValidator : AbstractValidator<UpdateWeeklyReportRequest>
{
    public UpdateWeeklyReportRequestValidator()
    {
        RuleFor(x => x.Title)
            .MaximumLength(250).WithMessage("Title must not exceed 250 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.Title));

        RuleFor(x => x.Content)
            .MaximumLength(8000).WithMessage("Content must not exceed 8000 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.Content));
    }
}

public class ReviewWeeklyReportRequestValidator : AbstractValidator<ReviewWeeklyReportRequest>
{
    private static readonly string[] ValidStatuses =
    {
        nameof(WeeklyReportStatus.Reviewed),
        nameof(WeeklyReportStatus.RevisionRequested),
        nameof(WeeklyReportStatus.Approved)
    };

    public ReviewWeeklyReportRequestValidator()
    {
        RuleFor(x => x.Status)
            .NotEmpty().WithMessage("Status is required")
            .Must(s => ValidStatuses.Contains(s, StringComparer.OrdinalIgnoreCase))
            .WithMessage($"Status must be one of: {string.Join(", ", ValidStatuses)}");

        RuleFor(x => x.LecturerComment)
            .MaximumLength(2000).WithMessage("Lecturer comment must not exceed 2000 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.LecturerComment));
    }
}
