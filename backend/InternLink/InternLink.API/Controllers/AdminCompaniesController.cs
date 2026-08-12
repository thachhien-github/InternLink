using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Shared.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InternLink.API.Controllers;

/// <summary>
/// Admin company master-data management (CRUD + Excel import).
/// </summary>
[ApiController]
[Route("api/Admin/companies")]
[Authorize(Policy = "RequireAdmin")]
public class AdminCompaniesController : ControllerBase
{
    private readonly ICompanyService _companyService;

    public AdminCompaniesController(ICompanyService companyService)
    {
        _companyService = companyService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int skip = 0, [FromQuery] int take = 100)
    {
        if (skip < 0)
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Skip must be greater than or equal to 0" }));
        if (take < 1 || take > 1000)
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Take must be between 1 and 1000" }));

        var companies = await _companyService.GetAllCompaniesAsync(skip, take);
        return Ok(ApiResponse<IEnumerable<CompanyDto>>.Ok(companies));
    }

    [HttpPost("search")]
    public async Task<IActionResult> Search([FromBody] CompanyFilterRequest request)
    {
        if (request.Skip < 0)
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Skip must be greater than or equal to 0" }));
        if (request.Take < 1 || request.Take > 1000)
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Take must be between 1 and 1000" }));

        var result = await _companyService.GetCompaniesWithFilterAsync(request);
        return Ok(ApiResponse<PaginatedResponse<CompanyDto>>.Ok(result));
    }

    [HttpGet("active")]
    public async Task<IActionResult> GetActive([FromQuery] int skip = 0, [FromQuery] int take = 100)
    {
        if (skip < 0)
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Skip must be greater than or equal to 0" }));
        if (take < 1 || take > 1000)
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Take must be between 1 and 1000" }));

        var companies = await _companyService.GetActiveCompaniesAsync(skip, take);
        return Ok(ApiResponse<IEnumerable<CompanyDto>>.Ok(companies));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var company = await _companyService.GetCompanyByIdAsync(id);
        if (company == null)
            return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Company not found" }));

        return Ok(ApiResponse<CompanyDto>.Ok(company));
    }

    [HttpGet("by-industry/{industry}")]
    public async Task<IActionResult> GetByIndustry(string industry, [FromQuery] int skip = 0, [FromQuery] int take = 100)
    {
        if (string.IsNullOrWhiteSpace(industry))
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Industry is required" }));
        if (skip < 0)
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Skip must be greater than or equal to 0" }));
        if (take < 1 || take > 1000)
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Take must be between 1 and 1000" }));

        var companies = await _companyService.GetCompaniesByIndustryAsync(industry, skip, take);
        return Ok(ApiResponse<IEnumerable<CompanyDto>>.Ok(companies));
    }

    [HttpGet("check/{name}")]
    public async Task<IActionResult> CheckExists(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Company name is required" }));

        var exists = await _companyService.CompanyNameExistsAsync(name);
        return Ok(ApiResponse<bool>.Ok(exists));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCompanyRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Invalid input" }));

            var company = await _companyService.CreateCompanyAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = company.Id }, ApiResponse<CompanyDto>.Ok(company));
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ApiResponse<object>.Fail(new ApiError { Title = ex.Message }));
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCompanyRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Invalid input" }));

            var company = await _companyService.UpdateCompanyAsync(id, request);
            if (company == null)
                return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Company not found" }));

            return Ok(ApiResponse<CompanyDto>.Ok(company));
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ApiResponse<object>.Fail(new ApiError { Title = ex.Message }));
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            var ok = await _companyService.DeleteCompanyAsync(id);
            if (!ok)
                return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Company not found" }));

            return Ok(ApiResponse<object>.Ok(null));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = ex.Message }));
        }
    }

    [HttpGet("import/template")]
    public IActionResult DownloadImportTemplate()
    {
        var bytes = _companyService.GetCompanyImportTemplate();
        return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "company-import-template.xlsx");
    }

    [HttpPost("import")]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(10 * 1024 * 1024)]
    public async Task<IActionResult> Import(IFormFile file)
    {
        try
        {
            if (file == null || file.Length == 0)
                return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Excel file is required" }));

            if (!string.Equals(Path.GetExtension(file.FileName), ".xlsx", StringComparison.OrdinalIgnoreCase))
                return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Only .xlsx files are supported" }));

            await using var stream = file.OpenReadStream();
            var result = await _companyService.ImportCompaniesFromExcelAsync(stream);
            return Ok(ApiResponse<CompanyImportResultDto>.Ok(result));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = ex.Message }));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = ex.Message }));
        }
    }
}
