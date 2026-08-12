using AutoMapper;
using FluentAssertions;
using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Application.Mappings;
using InternLink.Domain.Entities;
using InternLink.Infrastructure.Persistence;
using InternLink.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace InternLink.Tests.Services;

public class CompanyServiceTests
{
    private readonly IMapper _mapper;

    public CompanyServiceTests()
    {
        var config = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile<CompanyProfile>();
        });
        _mapper = config.CreateMapper();
    }

    private AppDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task CreateCompanyAsync_WithValidData_ShouldCreateCompany()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var service = new CompanyService(db, _mapper);
        var request = new CreateCompanyRequest
        {
            CompanyName = "Tech Corp",
            Industry = "Software",
            Address = "123 Main St",
            Website = "https://techcorp.com",
            ContactPerson = "John Doe",
            ContactEmail = "john@techcorp.com",
            Capacity = 10
        };

        // Act
        var result = await service.CreateCompanyAsync(request);

        // Assert
        result.Should().NotBeNull();
        result.CompanyName.Should().Be("Tech Corp");
        result.Industry.Should().Be("Software");
        result.IsActive.Should().BeTrue();
        result.Id.Should().NotBeEmpty();
    }

    [Fact]
    public async Task CreateCompanyAsync_WithDuplicateName_ShouldThrowException()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var service = new CompanyService(db, _mapper);

        var request1 = new CreateCompanyRequest { CompanyName = "Tech Corp" };
        var request2 = new CreateCompanyRequest { CompanyName = "Tech Corp" };

        // Act
        await service.CreateCompanyAsync(request1);
        var act = async () => await service.CreateCompanyAsync(request2);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*already exists*");
    }

    [Fact]
    public async Task GetCompanyByIdAsync_WithValidId_ShouldReturnCompany()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var service = new CompanyService(db, _mapper);
        var company = new Company
        {
            Id = Guid.NewGuid(),
            CompanyName = "Tech Corp",
            Industry = "Software",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        db.Companies.Add(company);
        await db.SaveChangesAsync();

        // Act
        var result = await service.GetCompanyByIdAsync(company.Id);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(company.Id);
        result.CompanyName.Should().Be("Tech Corp");
    }

    [Fact]
    public async Task GetCompanyByIdAsync_WithInvalidId_ShouldReturnNull()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var service = new CompanyService(db, _mapper);

        // Act
        var result = await service.GetCompanyByIdAsync(Guid.NewGuid());

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task UpdateCompanyAsync_WithValidData_ShouldUpdateCompany()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var service = new CompanyService(db, _mapper);
        var company = new Company
        {
            Id = Guid.NewGuid(),
            CompanyName = "Tech Corp",
            Industry = "Software",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        db.Companies.Add(company);
        await db.SaveChangesAsync();

        var updateRequest = new UpdateCompanyRequest
        {
            CompanyName = "Tech Corp Updated",
            Industry = "IT Services",
            IsActive = false
        };

        // Act
        var result = await service.UpdateCompanyAsync(company.Id, updateRequest);

        // Assert
        result.Should().NotBeNull();
        result!.CompanyName.Should().Be("Tech Corp Updated");
        result.Industry.Should().Be("IT Services");
        result.IsActive.Should().BeFalse();
    }

    [Fact]
    public async Task DeleteCompanyAsync_WithValidId_ShouldDeleteCompany()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var service = new CompanyService(db, _mapper);
        var company = new Company
        {
            Id = Guid.NewGuid(),
            CompanyName = "Tech Corp",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        db.Companies.Add(company);
        await db.SaveChangesAsync();

        // Act
        var result = await service.DeleteCompanyAsync(company.Id);

        // Assert
        result.Should().BeTrue();
        var deletedCompany = await db.Companies.FindAsync(company.Id);
        deletedCompany.Should().NotBeNull();
        deletedCompany!.IsDeleted.Should().BeTrue();
    }

    [Fact]
    public async Task CompanyNameExistsAsync_WithExistingName_ShouldReturnTrue()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var service = new CompanyService(db, _mapper);
        var company = new Company
        {
            Id = Guid.NewGuid(),
            CompanyName = "Tech Corp",
            CreatedAt = DateTime.UtcNow
        };
        db.Companies.Add(company);
        await db.SaveChangesAsync();

        // Act
        var result = await service.CompanyNameExistsAsync("Tech Corp");

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public async Task GetActiveCompaniesAsync_ShouldReturnOnlyActiveCompanies()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var service = new CompanyService(db, _mapper);

        db.Companies.AddRange(new[]
        {
            new Company { Id = Guid.NewGuid(), CompanyName = "Company 1", IsActive = true, CreatedAt = DateTime.UtcNow },
            new Company { Id = Guid.NewGuid(), CompanyName = "Company 2", IsActive = false, CreatedAt = DateTime.UtcNow },
            new Company { Id = Guid.NewGuid(), CompanyName = "Company 3", IsActive = true, CreatedAt = DateTime.UtcNow }
        });
        await db.SaveChangesAsync();

        // Act
        var result = await service.GetActiveCompaniesAsync(skip: 0, take: 100);

        // Assert
        result.Should().HaveCount(2);
        result.Should().AllSatisfy(c => c.IsActive.Should().BeTrue());
    }

    [Fact]
    public async Task GetAllCompaniesAsync_ShouldReturnPaginatedResults()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var service = new CompanyService(db, _mapper);

        for (int i = 1; i <= 5; i++)
        {
            db.Companies.Add(new Company
            {
                Id = Guid.NewGuid(),
                CompanyName = $"Company {i}",
                CreatedAt = DateTime.UtcNow
            });
        }
        await db.SaveChangesAsync();

        // Act
        var result = await service.GetAllCompaniesAsync(skip: 0, take: 3);

        // Assert
        result.Should().HaveCount(3);
    }

    [Fact]
    public async Task GetCompaniesWithFilterAsync_ShouldFilterByIndustry()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var service = new CompanyService(db, _mapper);

        db.Companies.AddRange(new[]
        {
            new Company { Id = Guid.NewGuid(), CompanyName = "Company 1", Industry = "Software", CreatedAt = DateTime.UtcNow },
            new Company { Id = Guid.NewGuid(), CompanyName = "Company 2", Industry = "Hardware", CreatedAt = DateTime.UtcNow },
            new Company { Id = Guid.NewGuid(), CompanyName = "Company 3", Industry = "Software", CreatedAt = DateTime.UtcNow }
        });
        await db.SaveChangesAsync();

        var filter = new CompanyFilterRequest
        {
            Industry = "Software"
        };

        // Act
        var result = await service.GetCompaniesWithFilterAsync(filter);

        // Assert
        result.Items.Should().HaveCount(2);
        result.Total.Should().Be(2);
        result.Items.Should().AllSatisfy(c => c.Industry.Should().Be("Software"));
    }

    [Fact]
    public async Task GetCompaniesWithFilterAsync_ShouldFilterBySearchTerm()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var service = new CompanyService(db, _mapper);

        db.Companies.AddRange(new[]
        {
            new Company { Id = Guid.NewGuid(), CompanyName = "Tech Corp", ContactPerson = "John", CreatedAt = DateTime.UtcNow },
            new Company { Id = Guid.NewGuid(), CompanyName = "Finance Inc", ContactPerson = "Jane", CreatedAt = DateTime.UtcNow },
            new Company { Id = Guid.NewGuid(), CompanyName = "Tech Solutions", ContactPerson = "Bob", CreatedAt = DateTime.UtcNow }
        });
        await db.SaveChangesAsync();

        var filter = new CompanyFilterRequest
        {
            SearchTerm = "Tech"
        };

        // Act
        var result = await service.GetCompaniesWithFilterAsync(filter);

        // Assert
        result.Items.Should().HaveCount(2);
        result.Items.Should().AllSatisfy(c => c.CompanyName.Should().Contain("Tech"));
    }

    [Fact]
    public async Task GetCompaniesByIndustryAsync_ShouldFilterByIndustry()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var service = new CompanyService(db, _mapper);

        db.Companies.AddRange(new[]
        {
            new Company { Id = Guid.NewGuid(), CompanyName = "Company 1", Industry = "Software", CreatedAt = DateTime.UtcNow },
            new Company { Id = Guid.NewGuid(), CompanyName = "Company 2", Industry = "Hardware", CreatedAt = DateTime.UtcNow },
            new Company { Id = Guid.NewGuid(), CompanyName = "Company 3", Industry = "Software", CreatedAt = DateTime.UtcNow }
        });
        await db.SaveChangesAsync();

        // Act
        var result = await service.GetCompaniesByIndustryAsync("Software", skip: 0, take: 100);

        // Assert
        result.Should().HaveCount(2);
        result.Should().AllSatisfy(c => c.Industry.Should().Be("Software"));
    }

    [Fact]
    public async Task ImportCompaniesFromExcelAsync_WithValidRows_ShouldCreateCompanies()
    {
        var db = GetInMemoryDbContext();
        var service = new CompanyService(db, _mapper);

        using var stream = CreateCompanyExcel(
            ("FPT Software", "CNTT", "Ms. Linh", "linh@fpt.com", "0901111111", "Q7 HCMC", "https://fpt.com", "10"),
            ("Viettel Digital", "Vien thong", "Mr. Hoang", "hoang@viettel.vn", "0902222222", "Tan Binh", null, "8"));

        var result = await service.ImportCompaniesFromExcelAsync(stream);

        result.SuccessCount.Should().Be(2);
        result.FailedCount.Should().Be(0);
        result.CreatedCompanies.Should().Contain(c => c.CompanyName == "FPT Software");
        (await db.Companies.CountAsync(c => !c.IsDeleted)).Should().Be(2);
    }

    [Fact]
    public async Task ImportCompaniesFromExcelAsync_WithDuplicateName_ShouldReportError()
    {
        var db = GetInMemoryDbContext();
        var service = new CompanyService(db, _mapper);
        db.Companies.Add(new Company
        {
            Id = Guid.NewGuid(),
            CompanyName = "FPT Software",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        });
        await db.SaveChangesAsync();

        using var stream = CreateCompanyExcel(
            ("FPT Software", "CNTT", null, null, null, null, null, null));

        var result = await service.ImportCompaniesFromExcelAsync(stream);

        result.SuccessCount.Should().Be(0);
        result.SkippedDuplicateCount.Should().Be(1);
        result.Errors.Should().Contain(e => e.CompanyName == "FPT Software");
    }

    [Fact]
    public void GetCompanyImportTemplate_ShouldReturnXlsxBytes()
    {
        var db = GetInMemoryDbContext();
        var service = new CompanyService(db, _mapper);

        var bytes = service.GetCompanyImportTemplate();

        bytes.Should().NotBeEmpty();
        bytes[0].Should().Be(0x50);
        bytes[1].Should().Be(0x4B);
    }

    private static MemoryStream CreateCompanyExcel(
        params (string Name, string? Industry, string? Contact, string? Email, string? Phone, string? Address, string? Website, string? Capacity)[] rows)
    {
        using var workbook = new ClosedXML.Excel.XLWorkbook();
        var sheet = workbook.Worksheets.Add("Companies");
        sheet.Cell(1, 1).Value = "TenDN";
        sheet.Cell(1, 2).Value = "Nganh";
        sheet.Cell(1, 3).Value = "NguoiLienHe";
        sheet.Cell(1, 4).Value = "Email";
        sheet.Cell(1, 5).Value = "SDT";
        sheet.Cell(1, 6).Value = "DiaChi";
        sheet.Cell(1, 7).Value = "Website";
        sheet.Cell(1, 8).Value = "SucChua";

        for (var i = 0; i < rows.Length; i++)
        {
            var row = rows[i];
            var excelRow = i + 2;
            sheet.Cell(excelRow, 1).Value = row.Name;
            if (row.Industry != null) sheet.Cell(excelRow, 2).Value = row.Industry;
            if (row.Contact != null) sheet.Cell(excelRow, 3).Value = row.Contact;
            if (row.Email != null) sheet.Cell(excelRow, 4).Value = row.Email;
            if (row.Phone != null) sheet.Cell(excelRow, 5).Value = row.Phone;
            if (row.Address != null) sheet.Cell(excelRow, 6).Value = row.Address;
            if (row.Website != null) sheet.Cell(excelRow, 7).Value = row.Website;
            if (row.Capacity != null) sheet.Cell(excelRow, 8).Value = row.Capacity;
        }

        var stream = new MemoryStream();
        workbook.SaveAs(stream);
        stream.Position = 0;
        return stream;
    }
}
