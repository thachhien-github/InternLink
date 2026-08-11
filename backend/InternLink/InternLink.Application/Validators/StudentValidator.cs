using FluentValidation;
using InternLink.Application.DTOs;

namespace InternLink.Application.Validators;

public class CreateStudentRequestValidator : AbstractValidator<CreateStudentRequest>
{
    public CreateStudentRequestValidator()
    {
        RuleFor(x => x.StudentCode)
            .NotEmpty().WithMessage("Student code is required")
            .MaximumLength(50).WithMessage("Student code must not exceed 50 characters");

        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Full name is required")
            .MaximumLength(200).WithMessage("Full name must not exceed 200 characters");

        RuleFor(x => x.Class)
            .MaximumLength(100).WithMessage("Class must not exceed 100 characters");

        RuleFor(x => x.Major)
            .MaximumLength(100).WithMessage("Major must not exceed 100 characters");

        RuleFor(x => x.Email)
            .EmailAddress().WithMessage("Email must be a valid email address")
            .MaximumLength(255).WithMessage("Email must not exceed 255 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.Email));

        RuleFor(x => x.Phone)
            .Matches(@"^[0-9\-\+\s\(\)]+$").WithMessage("Phone number format is invalid")
            .MaximumLength(20).WithMessage("Phone must not exceed 20 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.Phone));
    }
}

public class UpdateStudentRequestValidator : AbstractValidator<UpdateStudentRequest>
{
    public UpdateStudentRequestValidator()
    {
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Full name is required")
            .MaximumLength(200).WithMessage("Full name must not exceed 200 characters");

        RuleFor(x => x.Class)
            .MaximumLength(100).WithMessage("Class must not exceed 100 characters");

        RuleFor(x => x.Major)
            .MaximumLength(100).WithMessage("Major must not exceed 100 characters");

        RuleFor(x => x.Email)
            .EmailAddress().WithMessage("Email must be a valid email address")
            .MaximumLength(255).WithMessage("Email must not exceed 255 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.Email));

        RuleFor(x => x.Phone)
            .Matches(@"^[0-9\-\+\s\(\)]+$").WithMessage("Phone number format is invalid")
            .MaximumLength(20).WithMessage("Phone must not exceed 20 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.Phone));
    }
}
