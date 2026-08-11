using FluentValidation;
using InternLink.Application.DTOs;

namespace InternLink.Application.Validators;

public class CreateLecturerRequestValidator : AbstractValidator<CreateLecturerRequest>
{
    public CreateLecturerRequestValidator()
    {
        RuleFor(x => x.StaffCode)
            .NotEmpty().WithMessage("Staff code is required")
            .MaximumLength(50);

        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Full name is required")
            .MaximumLength(200);

        RuleFor(x => x.Email)
            .EmailAddress().When(x => !string.IsNullOrWhiteSpace(x.Email))
            .MaximumLength(200);

        RuleFor(x => x.Phone).MaximumLength(50);
        RuleFor(x => x.Department).MaximumLength(150);
        RuleFor(x => x.Username).MaximumLength(100);
    }
}

public class UpdateLecturerRequestValidator : AbstractValidator<UpdateLecturerRequest>
{
    public UpdateLecturerRequestValidator()
    {
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Full name is required")
            .MaximumLength(200);

        RuleFor(x => x.Email)
            .EmailAddress().When(x => !string.IsNullOrWhiteSpace(x.Email))
            .MaximumLength(200);

        RuleFor(x => x.Phone).MaximumLength(50);
        RuleFor(x => x.Department).MaximumLength(150);
    }
}
