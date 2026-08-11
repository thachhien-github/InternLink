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
    private readonly ILogger<DocumentController> _logger;

    public DocumentController(IDocumentService documentService, ILogger<DocumentController> logger)
    {
        _documentService = documentService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllDocuments([FromQuery] int skip = 0, [FromQuery] int take = 100)
    {
        try
        {
            var documents = await _documentService.GetAllDocumentsAsync(skip, take);
            return Ok(ApiResponse<IEnumerable<DocumentListItemDto>>.Ok(documents));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving documents");
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError { Title = "Error retrieving documents" }));
        }
    }

    [HttpPost("filter")]
    public async Task<IActionResult> GetDocumentsWithFilter([FromBody] DocumentFilterRequest filter)
    {
        try
        {
            var result = await _documentService.GetDocumentsWithFilterAsync(filter);
            return Ok(ApiResponse<PaginatedResponse<DocumentListItemDto>>.Ok(result));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error filtering documents");
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError { Title = "Error filtering documents" }));
        }
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetDocumentById(Guid id)
    {
        try
        {
            var document = await _documentService.GetDocumentByIdAsync(id);
            if (document == null)
                return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Document not found" }));

            return Ok(ApiResponse<DocumentDetailDto>.Ok(document));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving document {DocumentId}", id);
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError { Title = "Error retrieving document" }));
        }
    }

    [HttpGet("internship/{internshipId:guid}")]
    public async Task<IActionResult> GetDocumentsByInternship(Guid internshipId, [FromQuery] int skip = 0, [FromQuery] int take = 100)
    {
        try
        {
            var documents = await _documentService.GetDocumentsByInternshipAsync(internshipId, skip, take);
            return Ok(ApiResponse<IEnumerable<DocumentListItemDto>>.Ok(documents));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving documents for internship {InternshipId}", internshipId);
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError { Title = "Error retrieving documents" }));
        }
    }

    [HttpPost("upload")]
    [Authorize(Policy = "RequireLecturer")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadDocument([FromForm] UploadDocumentFormRequest form)
    {
        try
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
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Invalid operation during document upload");
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = ex.Message }));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading document");
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError { Title = "Error uploading document" }));
        }
    }

    [HttpPut("{id:guid}")]
    [Authorize(Policy = "RequireLecturer")]
    public async Task<IActionResult> UpdateDocument(Guid id, [FromBody] UpdateDocumentRequest request)
    {
        try
        {
            var document = await _documentService.UpdateDocumentAsync(id, request);
            if (document == null)
                return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Document not found" }));

            return Ok(ApiResponse<DocumentDetailDto>.Ok(document));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating document {DocumentId}", id);
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError { Title = "Error updating document" }));
        }
    }

    [HttpGet("{id:guid}/download")]
    public async Task<IActionResult> DownloadDocument(Guid id)
    {
        try
        {
            var document = await _documentService.DownloadDocumentAsync(id);
            if (document == null)
                return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Document not found" }));

            return File(document.FileContent, document.MimeType, document.FileName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error downloading document {DocumentId}", id);
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError { Title = "Error downloading document" }));
        }
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Policy = "RequireLecturer")]
    public async Task<IActionResult> DeleteDocument(Guid id)
    {
        try
        {
            var result = await _documentService.DeleteDocumentAsync(id);
            if (!result)
                return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Document not found" }));

            return Ok(ApiResponse<object>.Ok(null));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting document {DocumentId}", id);
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError { Title = "Error deleting document" }));
        }
    }

    [HttpGet("internship/{internshipId:guid}/count")]
    public async Task<IActionResult> GetDocumentCount(Guid internshipId)
    {
        try
        {
            var count = await _documentService.GetDocumentCountByInternshipAsync(internshipId);
            return Ok(ApiResponse<int>.Ok(count));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting document count for internship {InternshipId}", internshipId);
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError { Title = "Error getting document count" }));
        }
    }
}
