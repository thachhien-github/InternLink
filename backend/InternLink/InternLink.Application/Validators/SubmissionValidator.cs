using FluentValidation;
using InternLink.Application.DTOs;
using InternLink.Domain.Enums;

namespace InternLink.Application.Validators;

public class CreateSubmissionRequestValidator : AbstractValidator<CreateSubmissionRequest>
{
    private static readonly string[] ValidTypes = Enum.GetNames(typeof(SubmissionType));

    public CreateSubmissionRequestValidator()
    {
        RuleFor(x => x.InternshipId)
            .NotEmpty().WithMessage("Internship ID is required");

        RuleFor(x => x.Type)
            .NotEmpty().WithMessage("Type is required")
            .Must(t => ValidTypes.Contains(t, StringComparer.OrdinalIgnoreCase))
            .WithMessage($"Type must be one of: {string.Join(", ", ValidTypes)}");

        RuleFor(x => x.Title)
            .MaximumLength(250).WithMessage("Title must not exceed 250 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.Title));

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.Description));

        RuleFor(x => x.FileName)
            .MaximumLength(250).WithMessage("File name must not exceed 250 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.FileName));

        RuleFor(x => x.FileUrl)
            .MaximumLength(1000).WithMessage("File URL must not exceed 1000 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.FileUrl));
    }
}

public class UpdateSubmissionStatusRequestValidator : AbstractValidator<UpdateSubmissionStatusRequest>
{
    private static readonly string[] ValidStatuses = Enum.GetNames(typeof(SubmissionStatus));

    public UpdateSubmissionStatusRequestValidator()
    {
        RuleFor(x => x.Status)
            .NotEmpty().WithMessage("Status is required")
            .Must(s => ValidStatuses.Contains(s, StringComparer.OrdinalIgnoreCase))
            .WithMessage($"Status must be one of: {string.Join(", ", ValidStatuses)}");
    }
}

public class ResubmitRequestValidator : AbstractValidator<ResubmitRequest>
{
    public ResubmitRequestValidator()
    {
        RuleFor(x => x.Title)
            .MaximumLength(250).WithMessage("Title must not exceed 250 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.Title));

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.Description));

        RuleFor(x => x.FileName)
            .MaximumLength(250).WithMessage("File name must not exceed 250 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.FileName));

        RuleFor(x => x.FileUrl)
            .MaximumLength(1000).WithMessage("File URL must not exceed 1000 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.FileUrl));
    }
}

public class CreateFeedbackRequestValidator : AbstractValidator<CreateFeedbackRequest>
{
    private static readonly string[] ValidStatuses = Enum.GetNames(typeof(SubmissionStatus));

    public CreateFeedbackRequestValidator()
    {
        RuleFor(x => x.Comment)
            .NotEmpty().WithMessage("Comment is required")
            .MaximumLength(2000).WithMessage("Comment must not exceed 2000 characters");

        RuleFor(x => x.NewStatus)
            .Must(s => s == null || ValidStatuses.Contains(s, StringComparer.OrdinalIgnoreCase))
            .WithMessage($"NewStatus must be one of: {string.Join(", ", ValidStatuses)}");
    }
}

public class UpdateFeedbackRequestValidator : AbstractValidator<UpdateFeedbackRequest>
{
    public UpdateFeedbackRequestValidator()
    {
        RuleFor(x => x.Comment)
            .NotEmpty().WithMessage("Comment is required")
            .MaximumLength(2000).WithMessage("Comment must not exceed 2000 characters");
    }
}
