using AutoMapper;
using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Domain.Entities;
using InternLink.Infrastructure.Persistence;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace InternLink.Infrastructure.Services;

/// <summary>
/// Service for managing Document entities and file operations
/// </summary>
public class DocumentService : IDocumentService
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;
    private readonly IWebHostEnvironment _env;

    private const string UploadFolder = "uploads/documents";
    private static readonly string[] AllowedExtensions = { ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".txt", ".jpg", ".jpeg", ".png", ".gif" };

    public DocumentService(AppDbContext db, IMapper mapper, IWebHostEnvironment env)
    {
        _db = db;
        _mapper = mapper;
        _env = env;
    }

    public async Task<IEnumerable<DocumentListItemDto>> GetAllDocumentsAsync(int skip = 0, int take = 100)
    {
        var documents = await _db.Documents
            .Where(d => !d.IsDeleted)
            .Include(d => d.UploadedBy)
            .OrderByDescending(d => d.UploadedAt)
            .Skip(skip)
            .Take(take)
            .ToListAsync();

        return _mapper.Map<IEnumerable<DocumentListItemDto>>(documents);
    }

    public async Task<PaginatedResponse<DocumentListItemDto>> GetDocumentsWithFilterAsync(DocumentFilterRequest filter)
    {
        var query = _db.Documents.Where(d => !d.IsDeleted).Include(d => d.UploadedBy).AsQueryable();

        // Apply filters
        if (filter.InternshipId.HasValue)
            query = query.Where(d => d.InternshipId == filter.InternshipId);

        if (!string.IsNullOrWhiteSpace(filter.Category))
            query = query.Where(d => d.Category == filter.Category);

        if (filter.IsRequired.HasValue)
            query = query.Where(d => d.IsRequired == filter.IsRequired.Value);

        if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
        {
            var searchLower = filter.SearchTerm.ToLower();
            query = query.Where(d =>
                d.Title.ToLower().Contains(searchLower) ||
                (d.Description != null && d.Description.ToLower().Contains(searchLower)));
        }

        if (filter.UploadedFrom.HasValue)
            query = query.Where(d => d.UploadedAt >= filter.UploadedFrom.Value);

        if (filter.UploadedTo.HasValue)
            query = query.Where(d => d.UploadedAt <= filter.UploadedTo.Value);

        // Apply sorting
        query = ApplySorting(query, filter.SortBy, filter.SortOrder);

        // Get total count
        var totalCount = await query.CountAsync();

        // Apply pagination
        var documents = await query
            .Skip(filter.Skip)
            .Take(filter.Take)
            .ToListAsync();

        var items = _mapper.Map<IEnumerable<DocumentListItemDto>>(documents);

        return new PaginatedResponse<DocumentListItemDto>
        {
            Items = items,
            Total = totalCount,
            Skip = filter.Skip,
            Take = filter.Take
        };
    }

    public async Task<DocumentDetailDto?> GetDocumentByIdAsync(Guid id)
    {
        var document = await _db.Documents
            .Include(d => d.UploadedBy)
            .FirstOrDefaultAsync(d => d.Id == id && !d.IsDeleted);

        return document != null ? _mapper.Map<DocumentDetailDto>(document) : null;
    }

    public async Task<IEnumerable<DocumentListItemDto>> GetDocumentsByInternshipAsync(Guid internshipId, int skip = 0, int take = 100)
    {
        var documents = await _db.Documents
            .Where(d => d.InternshipId == internshipId && !d.IsDeleted)
            .Include(d => d.UploadedBy)
            .OrderByDescending(d => d.UploadedAt)
            .Skip(skip)
            .Take(take)
            .ToListAsync();

        return _mapper.Map<IEnumerable<DocumentListItemDto>>(documents);
    }

    public async Task<DocumentDetailDto> CreateDocumentAsync(CreateDocumentRequest request, Guid uploadedById)
    {
        throw new InvalidOperationException(
            "CreateDocumentAsync without a file is not supported. Use UploadDocumentAsync to create a document with file metadata in one step.");
    }

    public async Task<DocumentDetailDto> UploadDocumentAsync(CreateDocumentRequest request, Stream fileStream, string fileName, Guid userId)
    {
        var internshipExists = await _db.Internships.AnyAsync(i => i.Id == request.InternshipId && !i.IsDeleted);
        if (!internshipExists)
            throw new InvalidOperationException($"Internship with ID {request.InternshipId} not found");

        var lecturerId = await _db.Lecturers
            .Where(l => l.UserId == userId && !l.IsDeleted)
            .Select(l => (Guid?)l.Id)
            .FirstOrDefaultAsync();

        var (filePath, fileSize, mimeType) = await SaveFileAsync(fileStream, fileName, request.InternshipId);

        var document = new Document
        {
            Id = Guid.NewGuid(),
            InternshipId = request.InternshipId,
            UploadedById = lecturerId,
            Title = request.Title,
            Description = request.Description,
            Category = request.Category,
            IsRequired = request.IsRequired,
            FileName = fileName,
            FilePath = filePath,
            MimeType = mimeType,
            FileSize = fileSize,
            UploadedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        };

        _db.Documents.Add(document);
        await _db.SaveChangesAsync();

        var created = await _db.Documents
            .Include(d => d.UploadedBy)
            .FirstOrDefaultAsync(d => d.Id == document.Id);

        return _mapper.Map<DocumentDetailDto>(created!);
    }

    public async Task<DocumentDetailDto?> UpdateDocumentAsync(Guid id, UpdateDocumentRequest request)
    {
        var document = await _db.Documents.FirstOrDefaultAsync(d => d.Id == id && !d.IsDeleted);
        if (document == null)
            return null;

        if (!string.IsNullOrWhiteSpace(request.Title))
            document.Title = request.Title;

        if (request.Description != null)
            document.Description = request.Description;

        if (!string.IsNullOrWhiteSpace(request.Category))
            document.Category = request.Category;

        if (request.IsRequired.HasValue)
            document.IsRequired = request.IsRequired.Value;

        document.UpdatedAt = DateTime.UtcNow;

        _db.Documents.Update(document);
        await _db.SaveChangesAsync();

        var updated = await _db.Documents
            .Include(d => d.UploadedBy)
            .FirstOrDefaultAsync(d => d.Id == id && !d.IsDeleted);

        return _mapper.Map<DocumentDetailDto>(updated);
    }

    public async Task<DocumentDetailDto?> UpdateDocumentWithFileAsync(Guid id, string fileName, string filePath, long fileSize, string mimeType)
    {
        var document = await _db.Documents.FirstOrDefaultAsync(d => d.Id == id && !d.IsDeleted);
        if (document == null)
            return null;

        document.FileName = fileName;
        document.FilePath = filePath;
        document.FileSize = fileSize;
        document.MimeType = mimeType;
        document.UpdatedAt = DateTime.UtcNow;

        _db.Documents.Update(document);
        await _db.SaveChangesAsync();

        var updated = await _db.Documents
            .Include(d => d.UploadedBy)
            .FirstOrDefaultAsync(d => d.Id == id && !d.IsDeleted);

        return _mapper.Map<DocumentDetailDto>(updated);
    }

    public async Task<DocumentDownloadDto?> DownloadDocumentAsync(Guid id)
    {
        var document = await _db.Documents.FirstOrDefaultAsync(d => d.Id == id && !d.IsDeleted);
        if (document == null)
            return null;

        var fullPath = Path.Combine(_env.WebRootPath, document.FilePath);

        if (!File.Exists(fullPath))
            return null;

        var fileContent = await File.ReadAllBytesAsync(fullPath);

        return new DocumentDownloadDto
        {
            FileContent = fileContent,
            FileName = document.FileName,
            MimeType = document.MimeType
        };
    }

    public async Task<bool> DeleteDocumentAsync(Guid id)
    {
        var document = await _db.Documents.FirstOrDefaultAsync(d => d.Id == id && !d.IsDeleted);
        if (document == null)
            return false;

        document.IsDeleted = true;
        document.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return true;
    }

    public async Task<(string FilePath, long FileSize, string MimeType)> SaveFileAsync(Stream fileStream, string originalFileName, Guid internshipId)
    {
        if (fileStream == null || fileStream.Length == 0)
            throw new ArgumentException("File is required and must not be empty");

        // Validate file extension
        var extension = Path.GetExtension(originalFileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(extension))
            throw new InvalidOperationException($"File type '{extension}' is not allowed");

        // Create upload directory
        var uploadPath = Path.Combine(_env.WebRootPath, UploadFolder, internshipId.ToString());
        Directory.CreateDirectory(uploadPath);

        // Generate unique filename
        var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileNameWithoutExtension(originalFileName)}{extension}";
        var fullPath = Path.Combine(uploadPath, uniqueFileName);
        var relativePath = Path.Combine(UploadFolder, internshipId.ToString(), uniqueFileName).Replace("\\", "/");

        // Save file
        long fileSize;
        using (var stream = new FileStream(fullPath, FileMode.Create))
        {
            await fileStream.CopyToAsync(stream);
            fileSize = stream.Length;
        }

        // Determine MIME type
        var mimeType = GetMimeType(extension);

        return (relativePath, fileSize, mimeType);
    }

    public async Task<bool> DeleteFileAsync(string filePath)
    {
        if (string.IsNullOrWhiteSpace(filePath))
            return false;

        try
        {
            var fullPath = Path.Combine(_env.WebRootPath, filePath);
            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
            }
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<int> GetDocumentCountByInternshipAsync(Guid internshipId)
    {
        return await _db.Documents
            .Where(d => d.InternshipId == internshipId && !d.IsDeleted)
            .CountAsync();
    }

    private IQueryable<Document> ApplySorting(IQueryable<Document> query, string? sortBy, string? sortOrder)
    {
        var isDescending = sortOrder?.Equals("desc", StringComparison.OrdinalIgnoreCase) ?? true;

        return (sortBy?.ToLowerInvariant()) switch
        {
            "title" => isDescending ? query.OrderByDescending(d => d.Title) : query.OrderBy(d => d.Title),
            "filesize" => isDescending ? query.OrderByDescending(d => d.FileSize) : query.OrderBy(d => d.FileSize),
            _ => isDescending ? query.OrderByDescending(d => d.UploadedAt) : query.OrderBy(d => d.UploadedAt)
        };
    }

    private string GetMimeType(string extension)
    {
        return extension.ToLowerInvariant() switch
        {
            ".pdf" => "application/pdf",
            ".doc" => "application/msword",
            ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ".xls" => "application/vnd.ms-excel",
            ".xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ".txt" => "text/plain",
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".gif" => "image/gif",
            _ => "application/octet-stream"
        };
    }
}
