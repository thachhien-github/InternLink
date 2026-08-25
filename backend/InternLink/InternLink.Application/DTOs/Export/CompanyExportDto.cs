namespace InternLink.Application.DTOs.Export;

/// <summary>
/// DTO representing a company entry in Sheet 2 (DANH SÁCH DOANH NGHIỆP / TÊN CÔNG TY).
/// </summary>
public class CompanyExportDto
{
    public int Stt { get; set; }
    public Guid CompanyId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public int StudentCount { get; set; }
    public string ContactInfo { get; set; } = string.Empty;
}
