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
        var documents = await _documentService.GetAllDocumentsAsync(skip, take);
        return Ok(ApiResponse<IEnumerable<DocumentListItemDto>>.Ok(documents));
    }

    [HttpPost("filter")]
    public async Task<IActionResult> GetDocumentsWithFilter([FromBody] DocumentFilterRequest filter)
    {
        var result = await _documentService.GetDocumentsWithFilterAsync(filter);
        return Ok(ApiResponse<PaginatedResponse<DocumentListItemDto>>.Ok(result));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetDocumentById(Guid id)
    {
        var userId = User.GetUserId();
        if (userId == null)
            return Unauthorized(ApiResponse<object>.Fail(new ApiError { Title = "Unauthorized" }));

        var isLecturerOrAdmin = User.IsInRole("Lecturer") || User.IsInRole("SuperAdmin");
        var document = await _documentService.GetDocumentByIdAsync(id, userId.Value, isLecturerOrAdmin);
        if (document == null)
            return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Document not found" }));

        return Ok(ApiResponse<DocumentDetailDto>.Ok(document));
    }

    [HttpGet("internship/{internshipId:guid}")]
    public async Task<IActionResult> GetDocumentsByInternship(Guid internshipId, [FromQuery] int skip = 0, [FromQuery] int take = 100)
    {
        var documents = await _documentService.GetDocumentsByInternshipAsync(internshipId, skip, take);
        return Ok(ApiResponse<IEnumerable<DocumentListItemDto>>.Ok(documents));
    }

    [HttpPost("upload")]
    [Authorize(Policy = "RequireLecturer")]
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

        await using var stream = form.File.OpenReadStream();
        var document = await _documentService.UploadDocumentAsync(createRequest, stream, form.File.FileName, userId.Value);

        return CreatedAtAction(nameof(GetDocumentById), new { id = document.Id }, ApiResponse<DocumentDetailDto>.Ok(document));
    }

    [HttpPut("{id:guid}")]
    [Authorize(Policy = "RequireLecturer")]
    public async Task<IActionResult> UpdateDocument(Guid id, [FromBody] UpdateDocumentRequest request)
    {
        var document = await _documentService.UpdateDocumentAsync(id, request);
        if (document == null)
            return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Document not found" }));

        return Ok(ApiResponse<DocumentDetailDto>.Ok(document));
    }

    [HttpGet("{id:guid}/download")]
    public async Task<IActionResult> DownloadDocument(Guid id)
    {
        var document = await _documentService.DownloadDocumentAsync(id);
        if (document == null)
            return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Document not found" }));

        return File(document.FileContent, document.MimeType, document.FileName);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Policy = "RequireLecturer")]
    public async Task<IActionResult> DeleteDocument(Guid id)
    {
        var result = await _documentService.DeleteDocumentAsync(id);
        if (!result)
            return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Document not found" }));

        return Ok(ApiResponse<object>.Ok(null));
    }

    [HttpGet("internship/{internshipId:guid}/count")]
    public async Task<IActionResult> GetDocumentCount(Guid internshipId)
    {
        var count = await _documentService.GetDocumentCountByInternshipAsync(internshipId);
        return Ok(ApiResponse<int>.Ok(count));
    }
}
