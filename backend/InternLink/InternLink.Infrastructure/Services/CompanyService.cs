using AutoMapper;
using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Domain.Entities;
using InternLink.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace InternLink.Infrastructure.Services;

public class CompanyService : ICompanyService
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;

    public CompanyService(AppDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    public async Task<IEnumerable<CompanyDto>> GetAllCompaniesAsync(int skip = 0, int take = 100)
    {
        var companies = await _db.Companies
            .Where(c => !c.IsDeleted)
            .OrderBy(c => c.CompanyName)
            .Skip(skip)
            .Take(take)
            .ToListAsync();

        return _mapper.Map<List<CompanyDto>>(companies);
    }

    public async Task<PaginatedResponse<CompanyDto>> GetCompaniesWithFilterAsync(CompanyFilterRequest filter)
    {
        var query = _db.Companies.Where(c => !c.IsDeleted);

        if (!string.IsNullOrWhiteSpace(filter.Industry))
            query = query.Where(c => c.Industry == filter.Industry);

        if (filter.IsActive.HasValue)
            query = query.Where(c => c.IsActive == filter.IsActive.Value);

        if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
        {
            var searchLower = filter.SearchTerm.ToLower();
            query = query.Where(c =>
                c.CompanyName.ToLower().Contains(searchLower) ||
                (c.ContactPerson != null && c.ContactPerson.ToLower().Contains(searchLower))
            );
        }

        var total = await query.CountAsync();

        var companies = await query
            .OrderBy(c => c.CompanyName)
            .Skip(filter.Skip)
            .Take(filter.Take)
            .ToListAsync();

        return new PaginatedResponse<CompanyDto>
        {
            Items = _mapper.Map<List<CompanyDto>>(companies),
            Total = total,
            Skip = filter.Skip,
            Take = filter.Take
        };
    }

    public async Task<CompanyDto?> GetCompanyByIdAsync(Guid id)
    {
        var company = await _db.Companies
            .FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted);

        return company == null ? null : _mapper.Map<CompanyDto>(company);
    }

    public async Task<IEnumerable<CompanyDto>> GetActiveCompaniesAsync(int skip = 0, int take = 100)
    {
        var companies = await _db.Companies
            .Where(c => c.IsActive && !c.IsDeleted)
            .OrderBy(c => c.CompanyName)
            .Skip(skip)
            .Take(take)
            .ToListAsync();

        return _mapper.Map<List<CompanyDto>>(companies);
    }

    public async Task<CompanyDto> CreateCompanyAsync(CreateCompanyRequest request)
    {
        var existingCompany = await _db.Companies
            .FirstOrDefaultAsync(c => c.CompanyName == request.CompanyName && !c.IsDeleted);

        if (existingCompany != null)
            throw new InvalidOperationException($"Company name '{request.CompanyName}' already exists");

        var company = new Company
        {
            Id = Guid.NewGuid(),
            CompanyName = request.CompanyName,
            Address = request.Address,
            Website = request.Website,
            Industry = request.Industry,
            ContactPerson = request.ContactPerson,
            ContactEmail = request.ContactEmail,
            ContactPhone = request.ContactPhone,
            Capacity = request.Capacity,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        await _db.Companies.AddAsync(company);
        await _db.SaveChangesAsync();

        return _mapper.Map<CompanyDto>(company);
    }

    public async Task<CompanyDto?> UpdateCompanyAsync(Guid id, UpdateCompanyRequest request)
    {
        var company = await _db.Companies
            .FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted);

        if (company == null)
            return null;

        if (company.CompanyName != request.CompanyName)
        {
            var existingCompany = await _db.Companies
                .FirstOrDefaultAsync(c => c.CompanyName == request.CompanyName && c.Id != id && !c.IsDeleted);

            if (existingCompany != null)
                throw new InvalidOperationException($"Company name '{request.CompanyName}' already exists");
        }

        company.CompanyName = request.CompanyName;
        company.Address = request.Address;
        company.Website = request.Website;
        company.Industry = request.Industry;
        company.ContactPerson = request.ContactPerson;
        company.ContactEmail = request.ContactEmail;
        company.ContactPhone = request.ContactPhone;
        company.Capacity = request.Capacity;
        if (request.IsActive.HasValue)
            company.IsActive = request.IsActive.Value;
        company.UpdatedAt = DateTime.UtcNow;

        _db.Companies.Update(company);
        await _db.SaveChangesAsync();

        return _mapper.Map<CompanyDto>(company);
    }

    public async Task<bool> DeleteCompanyAsync(Guid id)
    {
        var company = await _db.Companies
            .FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted);

        if (company == null)
            return false;

        var hasInternships = await _db.Internships
            .AnyAsync(i => i.CompanyId == id && !i.IsDeleted);

        if (hasInternships)
            throw new InvalidOperationException("Cannot delete company with existing internships");

        company.IsDeleted = true;
        company.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return true;
    }

    public async Task<bool> CompanyNameExistsAsync(string name, Guid? excludeId = null)
    {
        var query = _db.Companies.Where(c => c.CompanyName == name && !c.IsDeleted);

        if (excludeId.HasValue)
            query = query.Where(c => c.Id != excludeId.Value);

        return await query.AnyAsync();
    }

    public async Task<IEnumerable<CompanyDto>> GetCompaniesByIndustryAsync(string industry, int skip = 0, int take = 100)
    {
        var companies = await _db.Companies
            .Where(c => c.Industry == industry && !c.IsDeleted)
            .OrderBy(c => c.CompanyName)
            .Skip(skip)
            .Take(take)
            .ToListAsync();

        return _mapper.Map<List<CompanyDto>>(companies);
    }
}
