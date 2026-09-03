using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using AutoMapper;
using ClosedXML.Excel;
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
    private readonly IExcelService _excelService;

    // Fuzzy matching definitions for company columns
    private static readonly Dictionary<string, ColumnDefinition> CompanyColumns = new()
    {
        [nameof(CompanyColumn.CompanyName)] = new("tendn", "ten dn", "companyname", "company name", "ten doanh nghiep", "doanh nghiep", "name", "ten cong ty", "cong ty", "ten don vi", "don vi", "organization"),
        [nameof(CompanyColumn.Industry)] = new("nganh", "ngành", "industry", "linh vuc", "lĩnh vực", "linh vuc hoat dong", "nganh nghe", "sector"),
        [nameof(CompanyColumn.ContactPerson)] = new("nguoilienhe", "nguoi lien he", "contactperson", "contact person", "contactname", "nguoi dai dien", "lien he", "ho ten nguoi lien he", "representative"),
        [nameof(CompanyColumn.ContactEmail)] = new("email", "e-mail", "contactemail", "contact email", "email lien he", "email address"),
        [nameof(CompanyColumn.ContactPhone)] = new("phone", "sdt", "sđt", "dien thoai", "điện thoại", "contactphone", "contact phone", "so dien thoai", "số điện thoại", "phone number", "sdt lien he"),
        [nameof(CompanyColumn.Address)] = new("diachi", "dia chi", "address", "dia chi tru so", "dia chi chi nhanh", "dia diem"),
        [nameof(CompanyColumn.Website)] = new("website", "web", "trang web", "trang chu", "url", "homepage"),
        [nameof(CompanyColumn.Capacity)] = new("succhua", "suc chua", "capacity", "so luong", "so luong sv", "so luong tiep nhan", "chi tieu", "so luong tiep nhan sv", "so luong tuyen", "tieu chi", "slsv"),
    };

    public CompanyService(AppDbContext db, IMapper mapper, IExcelService excelService)
    {
        _db = db;
        _mapper = mapper;
        _excelService = excelService;
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
            CompanyName = request.CompanyName.Trim(),
            Address = NullIfWhiteSpace(request.Address),
            Website = NullIfWhiteSpace(request.Website),
            Industry = NullIfWhiteSpace(request.Industry),
            ContactPerson = NullIfWhiteSpace(request.ContactPerson),
            ContactEmail = NullIfWhiteSpace(request.ContactEmail),
            ContactPhone = NullIfWhiteSpace(request.ContactPhone),
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

        if (!string.Equals(company.CompanyName, request.CompanyName, StringComparison.Ordinal))
        {
            var existingCompany = await _db.Companies
                .FirstOrDefaultAsync(c => c.CompanyName == request.CompanyName && c.Id != id && !c.IsDeleted);

            if (existingCompany != null)
                throw new InvalidOperationException($"Company name '{request.CompanyName}' already exists");
        }

        company.CompanyName = request.CompanyName.Trim();
        company.Address = NullIfWhiteSpace(request.Address);
        company.Website = NullIfWhiteSpace(request.Website);
        company.Industry = NullIfWhiteSpace(request.Industry);
        company.ContactPerson = NullIfWhiteSpace(request.ContactPerson);
        company.ContactEmail = NullIfWhiteSpace(request.ContactEmail);
        company.ContactPhone = NullIfWhiteSpace(request.ContactPhone);
        company.Capacity = request.Capacity;
        if (request.IsActive.HasValue)
            company.IsActive = request.IsActive.Value;
        company.UpdatedAt = DateTime.UtcNow;

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

    public async Task<CompanyImportResultDto> ImportCompaniesFromExcelAsync(Stream excelStream)
    {
        if (excelStream == null || !excelStream.CanRead)
            throw new ArgumentException("Excel file stream is required");

        using var workbook = new XLWorkbook(excelStream);
        var worksheet = workbook.Worksheets.FirstOrDefault()
            ?? throw new InvalidOperationException("Excel file has no worksheet");

        var usedRange = worksheet.RangeUsed();
        if (usedRange == null)
            throw new InvalidOperationException("Excel file is empty");

        var headerRow = TemplateHelper.FindHeaderRow(worksheet, row =>
            BuildColumnMap(row).ContainsKey(CompanyColumn.CompanyName)) ?? usedRange.FirstRow();

        var columnMap = BuildColumnMap(headerRow);
        if (!columnMap.ContainsKey(CompanyColumn.CompanyName))
            throw new InvalidOperationException("Excel must include TenDN (CompanyName) column");

        var errors = new List<CompanyImportErrorDto>();
        var created = new List<Company>();
        var seenInFile = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var totalRows = 0;
        var skippedDuplicates = 0;

        foreach (var row in usedRange.RowsUsed())
        {
            if (row.RowNumber() <= headerRow.RowNumber())
                continue;

            var rowNumber = row.RowNumber();
            var companyName = GetCell(row, columnMap, CompanyColumn.CompanyName);
            var industry = GetCell(row, columnMap, CompanyColumn.Industry);
            var contactPerson = GetCell(row, columnMap, CompanyColumn.ContactPerson);
            var contactEmail = GetCell(row, columnMap, CompanyColumn.ContactEmail);
            var contactPhone = GetCell(row, columnMap, CompanyColumn.ContactPhone);
            var address = GetCell(row, columnMap, CompanyColumn.Address);
            var website = GetCell(row, columnMap, CompanyColumn.Website);
            var capacityText = GetCell(row, columnMap, CompanyColumn.Capacity);

            (contactEmail, contactPhone) = TemplateHelper.SanitizeEmailAndPhone(contactEmail, contactPhone);

            if (IsBlankRow(companyName, industry, contactPerson, contactEmail, contactPhone, address, website, capacityText))
                continue;

            totalRows++;

            if (string.IsNullOrWhiteSpace(companyName))
            {
                errors.Add(new CompanyImportErrorDto { RowNumber = rowNumber, Message = "Company name (TenDN) is required" });
                continue;
            }

            companyName = companyName.Trim();

            if (companyName.Length > 255)
            {
                errors.Add(new CompanyImportErrorDto
                {
                    RowNumber = rowNumber,
                    CompanyName = companyName,
                    Message = "Company name must not exceed 255 characters"
                });
                continue;
            }

            if (!string.IsNullOrWhiteSpace(contactEmail) && !IsValidEmail(contactEmail))
            {
                errors.Add(new CompanyImportErrorDto
                {
                    RowNumber = rowNumber,
                    CompanyName = companyName,
                    Message = "Invalid contact email format"
                });
                continue;
            }

            if (!string.IsNullOrWhiteSpace(website) && !IsValidUrl(website))
            {
                errors.Add(new CompanyImportErrorDto
                {
                    RowNumber = rowNumber,
                    CompanyName = companyName,
                    Message = "Invalid website URL"
                });
                continue;
            }

            int? capacity = null;
            if (!string.IsNullOrWhiteSpace(capacityText))
            {
                if (!int.TryParse(capacityText, out var parsed) || parsed <= 0)
                {
                    errors.Add(new CompanyImportErrorDto
                    {
                        RowNumber = rowNumber,
                        CompanyName = companyName,
                        Message = "Capacity must be a positive integer"
                    });
                    continue;
                }

                capacity = parsed;
            }

            if (!seenInFile.Add(companyName))
            {
                errors.Add(new CompanyImportErrorDto
                {
                    RowNumber = rowNumber,
                    CompanyName = companyName,
                    Message = "Duplicate company name in file"
                });
                continue;
            }

            if (await CompanyNameExistsAsync(companyName))
            {
                skippedDuplicates++;
                errors.Add(new CompanyImportErrorDto
                {
                    RowNumber = rowNumber,
                    CompanyName = companyName,
                    Message = "Company name already exists in system"
                });
                continue;
            }

            created.Add(new Company
            {
                Id = Guid.NewGuid(),
                CompanyName = companyName,
                Industry = NullIfWhiteSpace(industry),
                ContactPerson = NullIfWhiteSpace(contactPerson),
                ContactEmail = NullIfWhiteSpace(contactEmail),
                ContactPhone = NullIfWhiteSpace(contactPhone),
                Address = NullIfWhiteSpace(address),
                Website = NullIfWhiteSpace(website),
                Capacity = capacity,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            });
        }

        if (created.Count > 0)
        {
            await _db.Companies.AddRangeAsync(created);
            await _db.SaveChangesAsync();
        }

        return new CompanyImportResultDto
        {
            TotalRows = totalRows,
            SuccessCount = created.Count,
            FailedCount = errors.Count,
            SkippedDuplicateCount = skippedDuplicates,
            CreatedCompanies = _mapper.Map<List<CompanyDto>>(created),
            Errors = errors
        };
    }

    public byte[] GetCompanyImportTemplate()
    {
        return TemplateHelper.GetTemplateBytes("Mau-danh-sach-doanh-nghiep.xlsx", () =>
        {
            using var workbook = new XLWorkbook();
            var sheet = workbook.Worksheets.Add("Companies");

            sheet.Cell(1, 1).Value = "TenDN";
            sheet.Cell(1, 2).Value = "Nganh";
            sheet.Cell(1, 3).Value = "NguoiLienHe";
            sheet.Cell(1, 4).Value = "Email";
            sheet.Cell(1, 5).Value = "SDT";
            sheet.Cell(1, 6).Value = "DiaChi";
            sheet.Cell(1, 7).Value = "Website";
            sheet.Cell(1, 8).Value = "SucChua";

            sheet.Cell(2, 1).Value = "FPT Software";
            sheet.Cell(2, 2).Value = "Cong nghe thong tin";
            sheet.Cell(2, 3).Value = "Ms. Linh Tran";
            sheet.Cell(2, 4).Value = "linh.tran@fptsoftware.com";
            sheet.Cell(2, 5).Value = "0909123456";
            sheet.Cell(2, 6).Value = "Phu My Hung, Q7, TP.HCM";
            sheet.Cell(2, 7).Value = "https://fptsoftware.com";
            sheet.Cell(2, 8).Value = 10;

            sheet.Row(1).Style.Font.Bold = true;
            sheet.Columns().AdjustToContents();

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return stream.ToArray();
        });
    }

    public async Task<byte[]> ExportCompaniesExcelAsync()
    {
        var companies = await _db.Companies
            .Include(c => c.Internships)
            .Where(c => !c.IsDeleted)
            .OrderBy(c => c.CompanyName)
            .ToListAsync();

        var mappings = new Dictionary<string, Func<Company, object?>>
        {
            ["STT"] = c => companies.IndexOf(c) + 1,
            ["Tên Doanh Nghiệp"] = c => c.CompanyName,
            ["Lĩnh Vực / Ngành"] = c => c.Industry ?? "-",
            ["Người Đại Diện / Liên Hệ"] = c => c.ContactPerson ?? "-",
            ["Email Liên Hệ"] = c => c.ContactEmail ?? "-",
            ["Số Điện Thoại"] = c => c.ContactPhone ?? "-",
            ["Địa Chỉ"] = c => c.Address ?? "-",
            ["Website"] = c => c.Website ?? "-",
            ["Sức Chứa (SV)"] = c => c.Capacity,
            ["Số SV Đang Tiếp Nhận"] = c => c.Internships.Count(i => !i.IsDeleted),
            ["Trạng Thái Hợp Tác"] = c => c.IsActive ? "Đang hoạt động" : "Tạm ngưng",
        };

        return _excelService.ExportToExcel(
            "DanhSachDoanhNghiep",
            "DANH SÁCH DOANH NGHIỆP ĐỐI TÁC TIẾP NHẬN THỰC TẬP",
            companies,
            mappings);
    }

    private enum CompanyColumn
    {
        CompanyName,
        Industry,
        ContactPerson,
        ContactEmail,
        ContactPhone,
        Address,
        Website,
        Capacity
    }

    private static Dictionary<CompanyColumn, int> BuildColumnMap(IXLRangeRow headerRow)
    {
        // Use fuzzy column matcher with expanded aliases
        var fuzzyResult = FuzzyColumnMatcher.Match(headerRow, CompanyColumns, minScore: 50);

        // Map string keys back to enum
        var map = new Dictionary<CompanyColumn, int>();
        foreach (var kvp in fuzzyResult)
        {
            if (Enum.TryParse<CompanyColumn>(kvp.Key, out var col))
                map[col] = kvp.Value;
        }
        return map;
    }

    private static string NormalizeHeader(string value) =>
        FuzzyColumnMatcher.NormalizeHeader(value);

    private static string? GetCell(IXLRangeRow row, Dictionary<CompanyColumn, int> map, CompanyColumn column)
    {
        if (!map.TryGetValue(column, out var colIndex))
            return null;

        var cell = row.Cell(colIndex);
        if (cell.DataType == XLDataType.Number)
            return cell.GetDouble().ToString("0");

        var text = cell.GetString();
        return string.IsNullOrWhiteSpace(text) ? null : text.Trim();
    }

    private static bool IsBlankRow(params string?[] values) =>
        values.All(string.IsNullOrWhiteSpace);

    private static string? NullIfWhiteSpace(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();

    private static bool IsValidEmail(string email) =>
        Regex.IsMatch(email.Trim(), @"^[^@\s]+@[^@\s]+\.[^@\s]+$");

    private static bool IsValidUrl(string url) =>
        Uri.TryCreate(url.Trim(), UriKind.Absolute, out var uriResult) &&
        (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
}
