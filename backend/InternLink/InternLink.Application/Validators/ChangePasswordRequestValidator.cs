using FluentValidation;
using InternLink.Application.DTOs;

namespace InternLink.Application.Validators;

public class ChangePasswordRequestValidator : AbstractValidator<ChangePasswordRequest>
{
    public ChangePasswordRequestValidator()
    {
        RuleFor(x => x.CurrentPassword).NotEmpty().MinimumLength(6);
        RuleFor(x => x.NewPassword).NotEmpty().MinimumLength(6);
    }
}
