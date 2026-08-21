using InternLink.API.Extensions;
using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Shared.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InternLink.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DocumentController : ControllerBase
{
    private readonly IDocumentService _documentService;

    public DocumentController(IDocumentService documentService)
    {
        _documentService = documentService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllDocuments([FromQuery] int skip = 0, [FromQuery] int take = 100)
    {
        var userId = User.GetUserId();
        var isLecturerOrAdmin = User.IsInRole("Lecturer") || User.IsInRole("SuperAdmin");
        var documents = await _documentService.GetAllDocumentsAsync(skip, take, userId, isLecturerOrAdmin);
        return Ok(ApiResponse<IEnumerable<DocumentListItemDto>>.Ok(documents));
    }

    [HttpPost("filter")]
    public async Task<IActionResult> GetDocumentsWithFilter([FromBody] DocumentFilterRequest filter)
    {
        var userId = User.GetUserId();
        var isLecturerOrAdmin = User.IsInRole("Lecturer") || User.IsInRole("SuperAdmin");
        var result = await _documentService.GetDocumentsWithFilterAsync(filter, userId, isLecturerOrAdmin);
        return Ok(ApiResponse<PaginatedResponse<DocumentListItemDto>>.Ok(result));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetDocumentById(Guid id)
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        try
        {
            var isLecturerOrAdmin = User.IsInRole("Lecturer") || User.IsInRole("SuperAdmin");
            var document = await _documentService.GetDocumentByIdAsync(id, userId.Value, isLecturerOrAdmin);
            if (document == null)
                return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Document not found" }));

            return Ok(ApiResponse<DocumentDetailDto>.Ok(document));
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    [HttpGet("internship/{internshipId:guid}")]
    public async Task<IActionResult> GetDocumentsByInternship(Guid internshipId, [FromQuery] int skip = 0, [FromQuery] int take = 100)
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        try
        {
            var isLecturerOrAdmin = User.IsInRole("Lecturer") || User.IsInRole("SuperAdmin");
            var documents = await _documentService.GetDocumentsByInternshipAsync(internshipId, skip, take, userId.Value, isLecturerOrAdmin);
            return Ok(ApiResponse<IEnumerable<DocumentListItemDto>>.Ok(documents));
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    [HttpPost("upload")]
    [Authorize(Policy = "RequireLecturerOrAdmin")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadDocument([FromForm] UploadDocumentFormRequest form)
    {
        if (form.File == null || form.File.Length == 0)
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "File is required" }));

        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        var createRequest = new CreateDocumentRequest
        {
            InternshipId = form.InternshipId,
            Title = form.Title,
            Description = form.Description,
            Category = form.Category,
            IsRequired = form.IsRequired
        };

        try
        {
            await using var stream = form.File.OpenReadStream();
            var document = await _documentService.UploadDocumentAsync(createRequest, stream, form.File.FileName, userId.Value);

            return CreatedAtAction(nameof(GetDocumentById), new { id = document.Id }, ApiResponse<DocumentDetailDto>.Ok(document));
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = ex.Message }));
        }
    }

    [HttpPut("{id:guid}")]
    [Authorize(Policy = "RequireLecturerOrAdmin")]
    public async Task<IActionResult> UpdateDocument(Guid id, [FromBody] UpdateDocumentRequest request)
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        try
        {
            var document = await _documentService.UpdateDocumentAsync(id, request, userId.Value);
            if (document == null)
                return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Document not found" }));

            return Ok(ApiResponse<DocumentDetailDto>.Ok(document));
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    [HttpGet("{id:guid}/download")]
    public async Task<IActionResult> DownloadDocument(Guid id)
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        try
        {
            var isLecturerOrAdmin = User.IsInRole("Lecturer") || User.IsInRole("SuperAdmin");
            var document = await _documentService.DownloadDocumentAsync(id, userId.Value, isLecturerOrAdmin);
            if (document == null)
                return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Document not found" }));

            return File(document.FileContent, document.MimeType, document.FileName);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Policy = "RequireLecturerOrAdmin")]
    public async Task<IActionResult> DeleteDocument(Guid id)
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        try
        {
            var result = await _documentService.DeleteDocumentAsync(id, userId.Value);
            if (!result)
                return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Document not found" }));

            return Ok(ApiResponse<object>.Ok(null));
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    [HttpGet("internship/{internshipId:guid}/count")]
    public async Task<IActionResult> GetDocumentCount(Guid internshipId)
    {
        var userId = User.GetUserId();
        var isLecturerOrAdmin = User.IsInRole("Lecturer") || User.IsInRole("SuperAdmin");
        try
        {
            var count = await _documentService.GetDocumentCountByInternshipAsync(internshipId, userId, isLecturerOrAdmin);
            return Ok(ApiResponse<int>.Ok(count));
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }
}
