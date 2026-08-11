using FluentValidation;
using InternLink.Application.DTOs;

namespace InternLink.Application.Validators;

public class CreateDocumentRequestValidator : AbstractValidator<CreateDocumentRequest>
{
    private static readonly string[] AllowedMimeTypes =
    {
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/plain",
        "image/jpeg",
        "image/png",
        "image/gif"
    };

    private const long MaxFileSize = 50 * 1024 * 1024; // 50 MB

    public CreateDocumentRequestValidator()
    {
        RuleFor(x => x.InternshipId)
            .NotEmpty().WithMessage("Internship ID is required");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Document title is required")
            .MaximumLength(300).WithMessage("Document title must not exceed 300 characters");

        RuleFor(x => x.Description)
            .MaximumLength(2000).WithMessage("Description must not exceed 2000 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.Description));

        RuleFor(x => x.Category)
            .MaximumLength(100).WithMessage("Document type must not exceed 100 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.Category));
    }
}

public class UpdateDocumentRequestValidator : AbstractValidator<UpdateDocumentRequest>
{
    public UpdateDocumentRequestValidator()
    {
        RuleFor(x => x.Title)
            .MaximumLength(300).WithMessage("Document title must not exceed 300 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.Title));

        RuleFor(x => x.Description)
            .MaximumLength(2000).WithMessage("Description must not exceed 2000 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.Description));

        RuleFor(x => x.Category)
            .MaximumLength(100).WithMessage("Document type must not exceed 100 characters")
            .When(x => !string.IsNullOrWhiteSpace(x.Category));
    }
}

public class DocumentFilterRequestValidator : AbstractValidator<DocumentFilterRequest>
{
    public DocumentFilterRequestValidator()
    {
        RuleFor(x => x.Skip)
            .GreaterThanOrEqualTo(0).WithMessage("Skip must be greater than or equal to 0");

        RuleFor(x => x.Take)
            .GreaterThan(0).WithMessage("Take must be greater than 0")
            .LessThanOrEqualTo(1000).WithMessage("Take must not exceed 1000");

        RuleFor(x => x.UploadedFrom)
            .LessThanOrEqualTo(x => x.UploadedTo)
            .WithMessage("Uploaded From date must be before Uploaded To date")
            .When(x => x.UploadedFrom.HasValue && x.UploadedTo.HasValue);

        RuleFor(x => x.SortBy)
            .Must(sortBy => new[] { "UploadedAt", "Title", "FileSize" }.Contains(sortBy, StringComparer.OrdinalIgnoreCase))
            .WithMessage("Invalid sort field. Allowed fields: UploadedAt, Title, FileSize")
            .When(x => !string.IsNullOrWhiteSpace(x.SortBy));

        RuleFor(x => x.SortOrder)
            .Must(order => new[] { "asc", "desc" }.Contains(order, StringComparer.OrdinalIgnoreCase))
            .WithMessage("Sort order must be 'asc' or 'desc'")
            .When(x => !string.IsNullOrWhiteSpace(x.SortOrder));
    }
}
