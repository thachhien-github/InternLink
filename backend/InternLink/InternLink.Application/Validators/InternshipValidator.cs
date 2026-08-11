using FluentValidation;
using InternLink.Application.DTOs;

namespace InternLink.Application.Validators;

public class CreateInternshipRequestValidator : AbstractValidator<CreateInternshipRequest>
{
    public CreateInternshipRequestValidator()
    {
        RuleFor(x => x.StudentId)
            .NotEmpty().WithMessage("Student ID is required");

        RuleFor(x => x.CompanyId)
            .NotEmpty().WithMessage("Company ID is required");

        RuleFor(x => x.StartDate)
            .Must(date => date == null || date.Value >= DateTime.Now.Date)
            .WithMessage("Start date must be in the future or today");

        RuleFor(x => x)
            .Custom((request, context) =>
            {
                if (request.StartDate.HasValue && request.EndDate.HasValue)
                {
                    if (request.EndDate.Value <= request.StartDate.Value)
                    {
                        context.AddFailure("EndDate", "End date must be after start date");
                    }

                    var duration = request.EndDate.Value - request.StartDate.Value;
                    if (duration.TotalDays < 7)
                    {
                        context.AddFailure("EndDate", "Internship duration must be at least 7 days");
                    }
                }
            });

        RuleFor(x => x.Position)
            .MaximumLength(200).WithMessage("Position must not exceed 200 characters");

        RuleFor(x => x.SupervisorName)
            .MaximumLength(200).WithMessage("Supervisor name must not exceed 200 characters");

        RuleFor(x => x.Notes)
            .MaximumLength(1000).WithMessage("Notes must not exceed 1000 characters");
    }
}

public class UpdateInternshipRequestValidator : AbstractValidator<UpdateInternshipRequest>
{
    public UpdateInternshipRequestValidator()
    {
        RuleFor(x => x.StartDate)
            .Must(date => date == null || date.Value >= DateTime.Now.Date)
            .WithMessage("Start date must be in the future or today")
            .When(x => x.StartDate.HasValue);

        RuleFor(x => x)
            .Custom((request, context) =>
            {
                if (request.StartDate.HasValue && request.EndDate.HasValue)
                {
                    if (request.EndDate.Value <= request.StartDate.Value)
                    {
                        context.AddFailure("EndDate", "End date must be after start date");
                    }

                    var duration = request.EndDate.Value - request.StartDate.Value;
                    if (duration.TotalDays < 7)
                    {
                        context.AddFailure("EndDate", "Internship duration must be at least 7 days");
                    }
                }
            });

        RuleFor(x => x.Position)
            .MaximumLength(200).WithMessage("Position must not exceed 200 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.Position));

        RuleFor(x => x.SupervisorName)
            .MaximumLength(200).WithMessage("Supervisor name must not exceed 200 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.SupervisorName));

        RuleFor(x => x.Notes)
            .MaximumLength(1000).WithMessage("Notes must not exceed 1000 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.Notes));
    }
}

public class UpdateInternshipStatusRequestValidator : AbstractValidator<UpdateInternshipStatusRequest>
{
    private static readonly string[] ValidStatuses = 
    { 
        "NotStarted", 
        "InProgress", 
        "BehindSchedule", 
        "AwaitingFeedback", 
        "RequiresRevision", 
        "Completed", 
        "Graded" 
    };

    public UpdateInternshipStatusRequestValidator()
    {
        RuleFor(x => x.Status)
            .NotEmpty().WithMessage("Status is required")
            .Must(status => ValidStatuses.Contains(status))
            .WithMessage($"Status must be one of: {string.Join(", ", ValidStatuses)}");
    }
}

public class AssignCompanyRequestValidator : AbstractValidator<AssignCompanyRequest>
{
    public AssignCompanyRequestValidator()
    {
        RuleFor(x => x.CompanyId)
            .NotEmpty().WithMessage("Company ID is required");
    }
}

public class InternshipFilterRequestValidator : AbstractValidator<InternshipFilterRequest>
{
    public InternshipFilterRequestValidator()
    {
        RuleFor(x => x.Skip)
            .GreaterThanOrEqualTo(0).WithMessage("Skip must be 0 or greater");

        RuleFor(x => x.Take)
            .GreaterThan(0).WithMessage("Take must be greater than 0")
            .LessThanOrEqualTo(1000).WithMessage("Take must not exceed 1000");

        RuleFor(x => x.Status)
            .Must(status => status == null || new[] { "NotStarted", "InProgress", "BehindSchedule", "AwaitingFeedback", "RequiresRevision", "Completed", "Graded" }.Contains(status))
            .WithMessage("Invalid status value")
            .When(x => !string.IsNullOrWhiteSpace(x.Status));

        RuleFor(x => x)
            .Custom((request, context) =>
            {
                if (request.StartDateFrom.HasValue && request.StartDateTo.HasValue)
                {
                    if (request.StartDateTo.Value < request.StartDateFrom.Value)
                    {
                        context.AddFailure("StartDateTo", "Start date 'to' must be after or equal to 'from'");
                    }
                }

                if (request.EndDateFrom.HasValue && request.EndDateTo.HasValue)
                {
                    if (request.EndDateTo.Value < request.EndDateFrom.Value)
                    {
                        context.AddFailure("EndDateTo", "End date 'to' must be after or equal to 'from'");
                    }
                }
            });

        RuleFor(x => x.SortBy)
            .Must(sortBy => sortBy == null || new[] { "CreatedAt", "StartDate", "EndDate", "Status" }.Contains(sortBy))
            .WithMessage("SortBy must be CreatedAt, StartDate, EndDate, or Status")
            .When(x => !string.IsNullOrWhiteSpace(x.SortBy));

        RuleFor(x => x.SortDirection)
            .Must(dir => dir == null || new[] { "asc", "desc" }.Contains(dir.ToLower()))
            .WithMessage("SortDirection must be 'asc' or 'desc'")
            .When(x => !string.IsNullOrWhiteSpace(x.SortDirection));
    }
}
