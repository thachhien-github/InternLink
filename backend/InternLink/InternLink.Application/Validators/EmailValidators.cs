using FluentValidation;
using InternLink.Application.DTOs;

namespace InternLink.Application.Validators;

public class TestEmailRequestValidator : AbstractValidator<TestEmailRequest>
{
    public TestEmailRequestValidator()
    {
        RuleFor(x => x.ToEmail)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Email must be a valid email address")
            .MaximumLength(255);

        RuleFor(x => x.FullName)
            .MaximumLength(200)
            .When(x => !string.IsNullOrWhiteSpace(x.FullName));

        RuleFor(x => x.Role)
            .IsInEnum();
    }
}
