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
        return await GetAllDocumentsAsync(skip, take, null, isLecturerOrAdmin: true);
    }

    public async Task<IEnumerable<DocumentListItemDto>> GetAllDocumentsAsync(int skip = 0, int take = 100, Guid? userId = null, bool isLecturerOrAdmin = false)
    {
        var query = _db.Documents
            .Where(d => !d.IsDeleted)
            .Include(d => d.UploadedBy)
            .Include(d => d.Internship)
                .ThenInclude(i => i.Student)
            .Include(d => d.Internship)
                .ThenInclude(i => i.Lecturer)
            .AsQueryable();

        if (userId.HasValue)
        {
            var isSuperAdmin = await _db.Users
                .AnyAsync(u => u.Id == userId.Value && u.Role == Domain.Enums.Role.SuperAdmin && !u.IsDeleted);

            if (!isSuperAdmin)
            {
                if (isLecturerOrAdmin)
                {
                    query = query.Where(d => d.Internship.Lecturer.UserId == userId.Value || d.UploadedBy.UserId == userId.Value);
                }
                else
                {
                    query = query.Where(d => d.Internship.Student.UserId == userId.Value);
                }
            }
        }

        var documents = await query
            .OrderByDescending(d => d.UploadedAt)
            .Skip(skip)
            .Take(take)
            .ToListAsync();

        return _mapper.Map<IEnumerable<DocumentListItemDto>>(documents);
    }

    public async Task<PaginatedResponse<DocumentListItemDto>> GetDocumentsWithFilterAsync(DocumentFilterRequest filter)
    {
        return await GetDocumentsWithFilterAsync(filter, null, isLecturerOrAdmin: true);
    }

    public async Task<PaginatedResponse<DocumentListItemDto>> GetDocumentsWithFilterAsync(DocumentFilterRequest filter, Guid? userId = null, bool isLecturerOrAdmin = false)
    {
        var query = _db.Documents
            .Where(d => !d.IsDeleted)
            .Include(d => d.UploadedBy)
            .Include(d => d.Internship)
                .ThenInclude(i => i.Student)
            .Include(d => d.Internship)
                .ThenInclude(i => i.Lecturer)
            .AsQueryable();

        if (userId.HasValue)
        {
            var isSuperAdmin = await _db.Users
                .AnyAsync(u => u.Id == userId.Value && u.Role == Domain.Enums.Role.SuperAdmin && !u.IsDeleted);

            if (!isSuperAdmin)
            {
                if (isLecturerOrAdmin)
                {
                    query = query.Where(d => d.Internship.Lecturer.UserId == userId.Value || d.UploadedBy.UserId == userId.Value);
                }
                else
                {
                    query = query.Where(d => d.Internship.Student.UserId == userId.Value);
                }
            }
        }

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

    public async Task<DocumentDetailDto?> GetDocumentByIdAsync(Guid id, Guid userId, bool isLecturerOrAdmin)
    {
        var document = await _db.Documents
            .Include(d => d.UploadedBy)
            .Include(d => d.Internship)
                .ThenInclude(i => i.Student)
            .Include(d => d.Internship)
                .ThenInclude(i => i.Lecturer)
            .FirstOrDefaultAsync(d => d.Id == id && !d.IsDeleted);

        if (document == null)
            return null;

        if (document.InternshipId == Guid.Empty || document.Internship == null)
            return _mapper.Map<DocumentDetailDto>(document);

        var ownsInternship = document.Internship?.Student?.UserId == userId;
        var isAssignedLecturer = document.Internship?.Lecturer?.UserId == userId;
        var isUploader = document.UploadedBy?.UserId == userId;

        if (!isLecturerOrAdmin && !ownsInternship)
            throw new UnauthorizedAccessException("You do not have access to this document");

        if (isLecturerOrAdmin && !isAssignedLecturer && !isUploader && !ownsInternship)
        {
            var isSuperAdmin = await _db.Users
                .AnyAsync(u => u.Id == userId && u.Role == Domain.Enums.Role.SuperAdmin && !u.IsDeleted);
            if (!isSuperAdmin)
                throw new UnauthorizedAccessException("You do not have access to this document");
        }

        return _mapper.Map<DocumentDetailDto>(document);
    }

    public async Task<IEnumerable<DocumentListItemDto>> GetDocumentsByInternshipAsync(Guid internshipId, int skip = 0, int take = 100, Guid? userId = null, bool isLecturerOrAdmin = false)
    {
        if (userId.HasValue)
        {
            var isSuperAdmin = await _db.Users
                .AnyAsync(u => u.Id == userId.Value && u.Role == Domain.Enums.Role.SuperAdmin && !u.IsDeleted);

            if (!isSuperAdmin)
            {
                var internship = await _db.Internships
                    .Include(i => i.Student)
                    .Include(i => i.Lecturer)
                    .FirstOrDefaultAsync(i => i.Id == internshipId && !i.IsDeleted);

                if (internship == null)
                    return Enumerable.Empty<DocumentListItemDto>();

                var owns = internship.Student?.UserId == userId.Value;
                var assigned = internship.Lecturer?.UserId == userId.Value;

                if (!isLecturerOrAdmin && !owns)
                    throw new UnauthorizedAccessException("You do not have access to documents for this internship");

                if (isLecturerOrAdmin && !assigned && !owns)
                    throw new UnauthorizedAccessException("You do not have access to documents for this internship");
            }
        }

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
        var internship = await _db.Internships
            .Include(i => i.Lecturer)
            .FirstOrDefaultAsync(i => i.Id == request.InternshipId && !i.IsDeleted);
        if (internship == null)
            throw new InvalidOperationException($"Internship with ID {request.InternshipId} not found");

        var isAssignedLecturer = internship.Lecturer?.UserId == userId;
        var isSuperAdmin = await _db.Users.AnyAsync(u => u.Id == userId && u.Role == Domain.Enums.Role.SuperAdmin && !u.IsDeleted);
        if (!isAssignedLecturer && !isSuperAdmin)
            throw new UnauthorizedAccessException("You can only upload documents for internships assigned to you");

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

    public async Task<DocumentDetailDto?> UpdateDocumentAsync(Guid id, UpdateDocumentRequest request, Guid? actorUserId = null)
    {
        var document = await _db.Documents
            .Include(d => d.Internship)
                .ThenInclude(i => i.Lecturer)
            .FirstOrDefaultAsync(d => d.Id == id && !d.IsDeleted);
        if (document == null)
            return null;

        if (actorUserId.HasValue)
        {
            var isAssigned = document.Internship?.Lecturer?.UserId == actorUserId.Value;
            var isSuperAdmin = await _db.Users.AnyAsync(u => u.Id == actorUserId.Value && u.Role == Domain.Enums.Role.SuperAdmin && !u.IsDeleted);
            if (!isAssigned && !isSuperAdmin)
                throw new UnauthorizedAccessException("You do not have permission to update this document");
        }

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
        return await DownloadDocumentAsync(id, Guid.Empty, isLecturerOrAdmin: true);
    }

    public async Task<DocumentDownloadDto?> DownloadDocumentAsync(Guid id, Guid userId, bool isLecturerOrAdmin)
    {
        var document = await _db.Documents
            .Include(d => d.Internship)
                .ThenInclude(i => i.Student)
            .Include(d => d.Internship)
                .ThenInclude(i => i.Lecturer)
            .Include(d => d.UploadedBy)
            .FirstOrDefaultAsync(d => d.Id == id && !d.IsDeleted);

        if (document == null)
            return null;

        if (userId != Guid.Empty)
        {
            var ownsInternship = document.Internship?.Student?.UserId == userId;
            var isAssignedLecturer = document.Internship?.Lecturer?.UserId == userId;
            var isUploader = document.UploadedBy?.UserId == userId;

            if (!isLecturerOrAdmin && !ownsInternship)
                throw new UnauthorizedAccessException("You do not have access to this document");

            if (isLecturerOrAdmin && !isAssignedLecturer && !isUploader && !ownsInternship)
            {
                var isSuperAdmin = await _db.Users
                    .AnyAsync(u => u.Id == userId && u.Role == Domain.Enums.Role.SuperAdmin && !u.IsDeleted);
                if (!isSuperAdmin)
                    throw new UnauthorizedAccessException("You do not have access to this document");
            }
        }

        var fullPath = Path.Combine(GetUploadRoot(), document.FilePath);

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
        return await DeleteDocumentAsync(id, null);
    }

    public async Task<bool> DeleteDocumentAsync(Guid id, Guid? actorUserId = null)
    {
        var document = await _db.Documents
            .Include(d => d.Internship)
                .ThenInclude(i => i.Lecturer)
            .FirstOrDefaultAsync(d => d.Id == id && !d.IsDeleted);
        if (document == null)
            return false;

        if (actorUserId.HasValue)
        {
            var isAssigned = document.Internship?.Lecturer?.UserId == actorUserId.Value;
            var isSuperAdmin = await _db.Users.AnyAsync(u => u.Id == actorUserId.Value && u.Role == Domain.Enums.Role.SuperAdmin && !u.IsDeleted);
            if (!isAssigned && !isSuperAdmin)
                throw new UnauthorizedAccessException("You do not have permission to delete this document");
        }

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
        var uploadPath = Path.Combine(GetUploadRoot(), UploadFolder, internshipId.ToString());
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
            var fullPath = Path.Combine(GetUploadRoot(), filePath);
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
        return await GetDocumentCountByInternshipAsync(internshipId, null, isLecturerOrAdmin: true);
    }

    public async Task<int> GetDocumentCountByInternshipAsync(Guid internshipId, Guid? userId = null, bool isLecturerOrAdmin = false)
    {
        if (userId.HasValue)
        {
            var isSuperAdmin = await _db.Users
                .AnyAsync(u => u.Id == userId.Value && u.Role == Domain.Enums.Role.SuperAdmin && !u.IsDeleted);

            if (!isSuperAdmin)
            {
                var internship = await _db.Internships
                    .Include(i => i.Student)
                    .Include(i => i.Lecturer)
                    .FirstOrDefaultAsync(i => i.Id == internshipId && !i.IsDeleted);

                if (internship == null)
                    return 0;

                var owns = internship.Student?.UserId == userId.Value;
                var assigned = internship.Lecturer?.UserId == userId.Value;

                if (!isLecturerOrAdmin && !owns)
                    throw new UnauthorizedAccessException("You do not have access to documents for this internship");

                if (isLecturerOrAdmin && !assigned && !owns)
                    throw new UnauthorizedAccessException("You do not have access to documents for this internship");
            }
        }

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

    private string GetUploadRoot() =>
        string.IsNullOrEmpty(_env.WebRootPath) ? _env.ContentRootPath : _env.WebRootPath;

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
