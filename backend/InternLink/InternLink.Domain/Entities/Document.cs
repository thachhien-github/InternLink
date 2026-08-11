namespace InternLink.Domain.Entities;

/// <summary>
/// Represents a document (file) related to an internship
/// </summary>
public class Document : BaseEntity
{
    /// <summary>
    /// The internship this document belongs to
    /// </summary>
    public Guid InternshipId { get; set; }
    public Internship Internship { get; set; } = null!;

    /// <summary>
    /// The lecturer who uploaded this document
    /// </summary>
    public Guid? UploadedById { get; set; }
    public Lecturer? UploadedBy { get; set; }

    /// <summary>
    /// Document title/name
    /// </summary>
    public string Title { get; set; } = null!;

    /// <summary>
    /// Document description
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Original file name
    /// </summary>
    public string FileName { get; set; } = null!;

    /// <summary>
    /// File path relative to wwwroot/uploads/documents/
    /// </summary>
    public string FilePath { get; set; } = null!;

    /// <summary>
    /// File size in bytes
    /// </summary>
    public long FileSize { get; set; }

    /// <summary>
    /// File MIME type (e.g., application/pdf, application/msword)
    /// </summary>
    public string MimeType { get; set; } = null!;

    /// <summary>
    /// Date the document was uploaded
    /// </summary>
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Flag indicating if this is a required document
    /// </summary>
    public bool IsRequired { get; set; } = false;

    /// <summary>
    /// Document category/type (e.g., "WeeklyReport", "MidtermReport", "FinalReport", "Other")
    /// </summary>
    public string? Category { get; set; }
}
