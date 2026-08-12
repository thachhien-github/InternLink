using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Shared.Responses;

namespace InternLink.API.Controllers;

/// <summary>
/// Read-only company lookup for Lecturers and SuperAdmin.
/// Master-data write/import moved to <see cref="AdminCompaniesController"/> (/api/Admin/companies).
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "SuperAdmin,Lecturer")]
public class CompanyController : ControllerBase
{
    private readonly ICompanyService _companyService;

    public CompanyController(ICompanyService companyService)
    {
        _companyService = companyService;
    }

    /// <summary>
    /// Get all companies with pagination (read-only).
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAllCompanies([FromQuery] int skip = 0, [FromQuery] int take = 100)
    {
        try
        {
            if (skip < 0)
                return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Skip must be greater than or equal to 0" }));

            if (take < 1 || take > 1000)
                return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Take must be between 1 and 1000" }));

            var companies = await _companyService.GetAllCompaniesAsync(skip, take);
            return Ok(ApiResponse<IEnumerable<CompanyDto>>.Ok(companies));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError { Title = "Internal server error", Detail = ex.Message }));
        }
    }

    /// <summary>
    /// Get companies with filtering (read-only).
    /// </summary>
    [HttpPost("search")]
    public async Task<IActionResult> SearchCompanies([FromBody] CompanyFilterRequest request)
    {
        try
        {
            if (request.Skip < 0)
                return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Skip must be greater than or equal to 0" }));

            if (request.Take < 1 || request.Take > 1000)
                return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Take must be between 1 and 1000" }));

            var result = await _companyService.GetCompaniesWithFilterAsync(request);
            return Ok(ApiResponse<PaginatedResponse<CompanyDto>>.Ok(result));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError { Title = "Internal server error", Detail = ex.Message }));
        }
    }

    /// <summary>
    /// Get all active companies with pagination (read-only).
    /// </summary>
    [HttpGet("active")]
    public async Task<IActionResult> GetActiveCompanies([FromQuery] int skip = 0, [FromQuery] int take = 100)
    {
        try
        {
            if (skip < 0)
                return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Skip must be greater than or equal to 0" }));

            if (take < 1 || take > 1000)
                return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Take must be between 1 and 1000" }));

            var companies = await _companyService.GetActiveCompaniesAsync(skip, take);
            return Ok(ApiResponse<IEnumerable<CompanyDto>>.Ok(companies));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError { Title = "Internal server error", Detail = ex.Message }));
        }
    }

    /// <summary>
    /// Get a specific company by ID.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetCompanyById(Guid id)
    {
        try
        {
            var company = await _companyService.GetCompanyByIdAsync(id);
            if (company == null)
                return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Company not found" }));

            return Ok(ApiResponse<CompanyDto>.Ok(company));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError { Title = "Internal server error", Detail = ex.Message }));
        }
    }

    /// <summary>
    /// Get companies by industry (read-only).
    /// </summary>
    [HttpGet("by-industry/{industry}")]
    public async Task<IActionResult> GetCompaniesByIndustry(string industry, [FromQuery] int skip = 0, [FromQuery] int take = 100)
    {
        try
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
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError { Title = "Internal server error", Detail = ex.Message }));
        }
    }

    /// <summary>
    /// Check if a company name already exists.
    /// </summary>
    [HttpGet("check/{name}")]
    public async Task<IActionResult> CheckCompanyNameExists(string name)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(name))
                return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Company name is required" }));

            var exists = await _companyService.CompanyNameExistsAsync(name);
            return Ok(ApiResponse<bool>.Ok(exists));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError { Title = "Internal server error", Detail = ex.Message }));
        }
    }
}
