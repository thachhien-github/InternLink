using InternLink.Application.DTOs;

namespace InternLink.Application.Interfaces;

/// <summary>
/// Service interface for Document management operations
/// </summary>
public interface IDocumentService
{
    /// <summary>
    /// Get all documents with pagination
    /// </summary>
    Task<IEnumerable<DocumentListItemDto>> GetAllDocumentsAsync(int skip = 0, int take = 100);

    /// <summary>
    /// Get documents with filtering, sorting, and pagination
    /// </summary>
    Task<PaginatedResponse<DocumentListItemDto>> GetDocumentsWithFilterAsync(DocumentFilterRequest filter);

    /// <summary>
    /// Get a specific document by ID
    /// </summary>
    Task<DocumentDetailDto?> GetDocumentByIdAsync(Guid id);

    /// <summary>
    /// Get all documents for a specific internship
    /// </summary>
    Task<IEnumerable<DocumentListItemDto>> GetDocumentsByInternshipAsync(Guid internshipId, int skip = 0, int take = 100);

    /// <summary>
    /// Create a new document (metadata only). Prefer UploadDocumentAsync for file uploads.
    /// </summary>
    Task<DocumentDetailDto> CreateDocumentAsync(CreateDocumentRequest request, Guid uploadedById);

    /// <summary>
    /// Atomically save file then create a complete Document row (no placeholder metadata).
    /// </summary>
    Task<DocumentDetailDto> UploadDocumentAsync(CreateDocumentRequest request, Stream fileStream, string fileName, Guid uploadedById);

    /// <summary>
    /// Update document metadata
    /// </summary>
    Task<DocumentDetailDto?> UpdateDocumentAsync(Guid id, UpdateDocumentRequest request);

    /// <summary>
    /// Update document with file information after upload
    /// </summary>
    Task<DocumentDetailDto?> UpdateDocumentWithFileAsync(Guid id, string fileName, string filePath, long fileSize, string mimeType);

    /// <summary>
    /// Download document file content
    /// </summary>
    Task<DocumentDownloadDto?> DownloadDocumentAsync(Guid id);

    /// <summary>
    /// Delete a document (soft delete if supported)
    /// </summary>
    Task<bool> DeleteDocumentAsync(Guid id);

    /// <summary>
    /// Save file to disk and return file path
    /// </summary>
    Task<(string FilePath, long FileSize, string MimeType)> SaveFileAsync(Stream fileStream, string originalFileName, Guid internshipId);

    /// <summary>
    /// Delete file from disk
    /// </summary>
    Task<bool> DeleteFileAsync(string filePath);

    /// <summary>
    /// Get document count for an internship
    /// </summary>
    Task<int> GetDocumentCountByInternshipAsync(Guid internshipId);
}
