using Microsoft.AspNetCore.Http;

namespace InternLink.Application.DTOs;

/// <summary>
/// DTO for creating a new document (file upload)
/// </summary>
public class CreateDocumentRequest
{
    public Guid InternshipId { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public string? Category { get; set; }
    public bool IsRequired { get; set; } = false;
}

/// <summary>
/// Form model for multipart upload endpoint
/// </summary>
public class UploadDocumentFormRequest
{
    public Guid InternshipId { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public string? Category { get; set; }
    public bool IsRequired { get; set; } = false;
    public IFormFile? File { get; set; }
}

/// <summary>
/// DTO for updating a document
/// </summary>
public class UpdateDocumentRequest
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Category { get; set; }
    public bool? IsRequired { get; set; }
}

/// <summary>
/// DTO for document list item (summary)
/// </summary>
public class DocumentListItemDto
{
    public Guid Id { get; set; }
    public Guid InternshipId { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public string FileName { get; set; } = null!;
    public long FileSize { get; set; }
    public string MimeType { get; set; } = null!;
    public DateTime UploadedAt { get; set; }
    public string? Category { get; set; }
    public bool IsRequired { get; set; }
    public UserSummaryDto? UploadedBy { get; set; }
}

/// <summary>
/// DTO for document detail view
/// </summary>
public class DocumentDetailDto
{
    public Guid Id { get; set; }
    public Guid InternshipId { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public string FileName { get; set; } = null!;
    public string FilePath { get; set; } = null!;
    public long FileSize { get; set; }
    public string MimeType { get; set; } = null!;
    public DateTime UploadedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? Category { get; set; }
    public bool IsRequired { get; set; }
    public UserSummaryDto? UploadedBy { get; set; }
}

/// <summary>
/// DTO for document file download response
/// </summary>
public class DocumentDownloadDto
{
    public byte[] FileContent { get; set; } = null!;
    public string FileName { get; set; } = null!;
    public string MimeType { get; set; } = null!;
}

/// <summary>
/// DTO for filtering documents
/// </summary>
public class DocumentFilterRequest : PaginationRequest
{
    /// <summary>
    /// Filter by internship ID
    /// </summary>
    public Guid? InternshipId { get; set; }

    /// <summary>
    /// Filter by document type
    /// </summary>
    public string? Category { get; set; }

    /// <summary>
    /// Search by title or description
    /// </summary>
    public string? SearchTerm { get; set; }

    /// <summary>
    /// Filter by required documents only
    /// </summary>
    public bool? IsRequired { get; set; }

    /// <summary>
    /// Filter by upload date range (from)
    /// </summary>
    public DateTime? UploadedFrom { get; set; }

    /// <summary>
    /// Filter by upload date range (to)
    /// </summary>
    public DateTime? UploadedTo { get; set; }

    /// <summary>
    /// Sort field (e.g., "UploadedAt", "Title", "FileSize")
    /// </summary>
    public string? SortBy { get; set; } = "UploadedAt";

    /// <summary>
    /// Sort order (asc or desc)
    /// </summary>
    public string? SortOrder { get; set; } = "desc";
}
