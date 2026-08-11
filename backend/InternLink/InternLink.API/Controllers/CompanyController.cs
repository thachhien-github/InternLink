using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Shared.Responses;

namespace InternLink.API.Controllers;

/// <summary>
/// API endpoints for company management (Lecturer access only)
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "RequireLecturer")]
public class CompanyController : ControllerBase
{
    private readonly ICompanyService _companyService;

    public CompanyController(ICompanyService companyService)
    {
        _companyService = companyService;
    }

    /// <summary>
    /// Get all companies with pagination
    /// </summary>
    /// <param name="skip">Number of records to skip (default: 0)</param>
    /// <param name="take">Number of records to take (default: 100, max: 1000)</param>
    /// <returns>List of companies</returns>
    [HttpGet]
    public async Task<IActionResult> GetAllCompanies([FromQuery] int skip = 0, [FromQuery] int take = 100)
    {
        try
        {
            // Validate pagination parameters
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
    /// Get companies with filtering
    /// </summary>
    /// <param name="request">Filter request with search, industry, active status, pagination</param>
    /// <returns>Paginated list of companies</returns>
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
    /// Get all active companies with pagination
    /// </summary>
    /// <param name="skip">Number of records to skip (default: 0)</param>
    /// <param name="take">Number of records to take (default: 100, max: 1000)</param>
    /// <returns>List of active companies</returns>
    [HttpGet("active")]
    public async Task<IActionResult> GetActiveCompanies([FromQuery] int skip = 0, [FromQuery] int take = 100)
    {
        try
        {
            // Validate pagination parameters
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
    /// Get a specific company by ID
    /// </summary>
    /// <param name="id">Company ID</param>
    /// <returns>Company details</returns>
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
    /// Get companies by industry
    /// </summary>
    /// <param name="industry">Industry name</param>
    /// <param name="skip">Number of records to skip (default: 0)</param>
    /// <param name="take">Number of records to take (default: 100, max: 1000)</param>
    /// <returns>List of companies in the specified industry</returns>
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
    /// Create a new company
    /// </summary>
    /// <param name="request">Company creation request</param>
    /// <returns>Created company</returns>
    [HttpPost]
    public async Task<IActionResult> CreateCompany([FromBody] CreateCompanyRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = "Invalid input" }));

            var company = await _companyService.CreateCompanyAsync(request);
            return CreatedAtAction(nameof(GetCompanyById), new { id = company.Id }, ApiResponse<CompanyDto>.Ok(company));
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ApiResponse<object>.Fail(new ApiError { Title = ex.Message }));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError { Title = "Internal server error", Detail = ex.Message }));
        }
    }

    /// <summary>
    /// Update an existing company
    /// </summary>
    /// <param name="id">Company ID</param>
    /// <param name="request">Company update request</param>
    /// <returns>Updated company</returns>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCompany(Guid id, [FromBody] UpdateCompanyRequest request)
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
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError { Title = "Internal server error", Detail = ex.Message }));
        }
    }

    /// <summary>
    /// Delete a company
    /// </summary>
    /// <param name="id">Company ID</param>
    /// <returns>Success status</returns>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCompany(Guid id)
    {
        try
        {
            var result = await _companyService.DeleteCompanyAsync(id);
            if (!result)
                return NotFound(ApiResponse<object>.Fail(new ApiError { Title = "Company not found" }));

            return Ok(ApiResponse<object>.Ok(null));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<object>.Fail(new ApiError { Title = ex.Message }));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.Fail(new ApiError { Title = "Internal server error", Detail = ex.Message }));
        }
    }

    /// <summary>
    /// Check if a company name already exists
    /// </summary>
    /// <param name="name">Company name to check</param>
    /// <returns>Boolean indicating if company name exists</returns>
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
