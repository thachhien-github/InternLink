using FluentValidation;
using InternLink.Application.DTOs;

namespace InternLink.Application.Validators;

public class CreateCompanyRequestValidator : AbstractValidator<CreateCompanyRequest>
{
    public CreateCompanyRequestValidator()
    {
        RuleFor(x => x.CompanyName)
            .NotEmpty().WithMessage("Company name is required")
            .MaximumLength(255).WithMessage("Company name must not exceed 255 characters");

        RuleFor(x => x.Address)
            .MaximumLength(500).WithMessage("Address must not exceed 500 characters");

        RuleFor(x => x.Website)
            .Must(BeValidUrl).WithMessage("Website must be a valid URL")
            .MaximumLength(255).WithMessage("Website must not exceed 255 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.Website));

        RuleFor(x => x.Industry)
            .MaximumLength(100).WithMessage("Industry must not exceed 100 characters");

        RuleFor(x => x.ContactPerson)
            .MaximumLength(200).WithMessage("Contact name must not exceed 200 characters");

        RuleFor(x => x.ContactEmail)
            .EmailAddress().WithMessage("Contact email must be a valid email address")
            .MaximumLength(255).WithMessage("Contact email must not exceed 255 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.ContactEmail));

        RuleFor(x => x.ContactPhone)
            .Matches(@"^[0-9\-\+\s\(\)]+$").WithMessage("Phone number format is invalid")
            .MaximumLength(20).WithMessage("Contact phone must not exceed 20 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.ContactPhone));

        RuleFor(x => x.Capacity)
            .GreaterThan(0).WithMessage("Capacity must be greater than 0")
            .When(x => x.Capacity.HasValue);
    }

    private bool BeValidUrl(string? url)
    {
        if (string.IsNullOrWhiteSpace(url))
            return true;

        return Uri.TryCreate(url, UriKind.Absolute, out var uriResult) &&
               (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
    }
}

public class UpdateCompanyRequestValidator : AbstractValidator<UpdateCompanyRequest>
{
    public UpdateCompanyRequestValidator()
    {
        RuleFor(x => x.CompanyName)
            .NotEmpty().WithMessage("Company name is required")
            .MaximumLength(255).WithMessage("Company name must not exceed 255 characters");

        RuleFor(x => x.Address)
            .MaximumLength(500).WithMessage("Address must not exceed 500 characters");

        RuleFor(x => x.Website)
            .Must(BeValidUrl).WithMessage("Website must be a valid URL")
            .MaximumLength(255).WithMessage("Website must not exceed 255 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.Website));

        RuleFor(x => x.Industry)
            .MaximumLength(100).WithMessage("Industry must not exceed 100 characters");

        RuleFor(x => x.ContactPerson)
            .MaximumLength(200).WithMessage("Contact name must not exceed 200 characters");

        RuleFor(x => x.ContactEmail)
            .EmailAddress().WithMessage("Contact email must be a valid email address")
            .MaximumLength(255).WithMessage("Contact email must not exceed 255 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.ContactEmail));

        RuleFor(x => x.ContactPhone)
            .Matches(@"^[0-9\-\+\s\(\)]+$").WithMessage("Phone number format is invalid")
            .MaximumLength(20).WithMessage("Contact phone must not exceed 20 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.ContactPhone));

        RuleFor(x => x.Capacity)
            .GreaterThan(0).WithMessage("Capacity must be greater than 0")
            .When(x => x.Capacity.HasValue);
    }

    private bool BeValidUrl(string? url)
    {
        if (string.IsNullOrWhiteSpace(url))
            return true;

        return Uri.TryCreate(url, UriKind.Absolute, out var uriResult) &&
               (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
    }
}
