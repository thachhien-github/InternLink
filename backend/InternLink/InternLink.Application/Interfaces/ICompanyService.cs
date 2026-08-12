using InternLink.Application.DTOs;

namespace InternLink.Application.Interfaces;

/// <summary>
/// Service interface for Company management operations
/// </summary>
public interface ICompanyService
{
    /// <summary>
    /// Get all companies with optional pagination
    /// </summary>
    Task<IEnumerable<CompanyDto>> GetAllCompaniesAsync(int skip = 0, int take = 100);

    /// <summary>
    /// Get companies with filtering and pagination
    /// </summary>
    Task<PaginatedResponse<CompanyDto>> GetCompaniesWithFilterAsync(CompanyFilterRequest filter);

    /// <summary>
    /// Get a company by ID
    /// </summary>
    Task<CompanyDto?> GetCompanyByIdAsync(Guid id);

    /// <summary>
    /// Get all active companies
    /// </summary>
    Task<IEnumerable<CompanyDto>> GetActiveCompaniesAsync(int skip = 0, int take = 100);

    /// <summary>
    /// Create a new company
    /// </summary>
    Task<CompanyDto> CreateCompanyAsync(CreateCompanyRequest request);

    /// <summary>
    /// Update an existing company
    /// </summary>
    Task<CompanyDto?> UpdateCompanyAsync(Guid id, UpdateCompanyRequest request);

    /// <summary>
    /// Delete a company by ID
    /// </summary>
    Task<bool> DeleteCompanyAsync(Guid id);

    /// <summary>
    /// Check if company name already exists
    /// </summary>
    Task<bool> CompanyNameExistsAsync(string name, Guid? excludeId = null);

    /// <summary>
    /// Get companies by industry
    /// </summary>
    Task<IEnumerable<CompanyDto>> GetCompaniesByIndustryAsync(string industry, int skip = 0, int take = 100);

    /// <summary>
    /// Import companies from an Excel (.xlsx) stream. Row 1 = headers.
    /// </summary>
    Task<CompanyImportResultDto> ImportCompaniesFromExcelAsync(Stream excelStream);

    /// <summary>
    /// Build a blank Excel template for company import.
    /// </summary>
    byte[] GetCompanyImportTemplate();
}
