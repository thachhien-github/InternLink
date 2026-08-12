using FluentValidation;
using InternLink.Application.DTOs;

namespace InternLink.Application.Validators;

public class BulkAssignRequestValidator : AbstractValidator<BulkAssignRequest>
{
    public BulkAssignRequestValidator()
    {
        RuleFor(x => x.LecturerId)
            .NotEmpty().WithMessage("LecturerId is required");

        RuleFor(x => x.StudentIds)
            .NotNull().WithMessage("StudentIds is required")
            .Must(ids => ids.Count > 0).WithMessage("At least one student is required")
            .Must(ids => ids.Distinct().Count() == ids.Count)
            .WithMessage("StudentIds must not contain duplicates");
    }
}

public class UnassignRequestValidator : AbstractValidator<UnassignRequest>
{
    public UnassignRequestValidator()
    {
        RuleFor(x => x.LecturerId)
            .NotEmpty().WithMessage("LecturerId is required");

        RuleFor(x => x.StudentId)
            .NotEmpty().WithMessage("StudentId is required");
    }
}
