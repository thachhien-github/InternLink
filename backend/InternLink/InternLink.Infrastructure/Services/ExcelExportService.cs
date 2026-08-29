using System.Data;
using ClosedXML.Excel;
using InternLink.Application.DTOs.Export;
using InternLink.Application.Interfaces;
using InternLink.Domain.Entities;
using InternLink.Domain.Enums;
using InternLink.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace InternLink.Infrastructure.Services;

/// <summary>
/// Production-ready Excel export service that loads relational datasets from multiple database tables
/// using optimized LINQ queries and injects them into the institutional Excel template.
/// </summary>
public class ExcelExportService : IExcelExportService
{
    private readonly AppDbContext _db;
    private readonly ILogger<ExcelExportService> _logger;

    public ExcelExportService(AppDbContext db, ILogger<ExcelExportService> logger)
    {
        _db = db;
        _logger = logger;
    }

    /// <inheritdoc />
    public async Task<InternshipExportDataDto> GetExportDataAsync(Guid? semesterId = null, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Retrieving export datasets from relational tables. SemesterId: {SemesterId}", semesterId);

        // ────────────────────────────────────────────────────────────────────
        // 1. Relational Query for Sheet 1: DANH SÁCH THỰC TẬP
        // ────────────────────────────────────────────────────────────────────
        // Join Students with their semester Internship (LEFT JOIN), Company (LEFT JOIN),
        // Lecturer (LEFT JOIN), Evaluation (LEFT JOIN), and WeeklyReports.
        var students = await _db.Students
            .AsNoTracking()
            .Include(s => s.Internships.Where(i => !semesterId.HasValue || i.SemesterId == semesterId.Value))
                .ThenInclude(i => i.Company)
            .Include(s => s.Internships.Where(i => !semesterId.HasValue || i.SemesterId == semesterId.Value))
                .ThenInclude(i => i.Lecturer)
            .Include(s => s.Internships.Where(i => !semesterId.HasValue || i.SemesterId == semesterId.Value))
                .ThenInclude(i => i.WeeklyReports)
            .OrderBy(s => s.Class)
            .ThenBy(s => s.FullName)
            .ToListAsync(cancellationToken);

        var internshipIds = students
            .SelectMany(s => s.Internships)
            .Select(i => i.Id)
            .Distinct()
            .ToList();

        // Load Evaluations via optimized dictionary lookup to avoid N+1 queries
        var evaluations = await _db.Evaluations
            .AsNoTracking()
            .Where(e => internshipIds.Contains(e.InternshipId))
            .ToDictionaryAsync(e => e.InternshipId, cancellationToken);

        var studentExportList = new List<InternshipStudentExportDto>();
        int stt = 1;

        foreach (var student in students)
        {
            var (ho, ten) = SplitFullName(student.FullName);
            var internship = student.Internships.FirstOrDefault();

            var dto = new InternshipStudentExportDto
            {
                Stt = stt++,
                StudentCode = student.StudentCode,
                Ho = ho,
                Ten = ten,
                Lop = student.Class ?? "—",
            };

            if (internship != null)
            {
                dto.PhuTrachCongTy = internship.Company?.CompanyName ?? "Chưa có";
                dto.GvHuongDan = internship.Lecturer?.FullName ?? "Chưa phân công";
                dto.GhiChu = internship.Notes ?? string.Empty;

                // Map scores from Evaluation if available
                if (evaluations.TryGetValue(internship.Id, out var eval))
                {
                    dto.DiemThamGia = eval.InitiativeScore;
                    // DiemQT: average of Technical, Communication, Teamwork
                    dto.DiemQT = Math.Round((eval.TechnicalScore + eval.CommunicationScore + eval.TeamworkScore) / 3.0m, 1);
                    dto.Thi = eval.FinalGrade;
                }

                // Map weekly reports
                var reports = internship.WeeklyReports.OrderBy(r => r.WeekNumber).ToList();
                dto.HdChung = reports.Count >= 6 ? "Đủ" : "Thiếu";
                dto.Tuan1 = FormatWeeklyReportCell(reports.FirstOrDefault(r => r.WeekNumber == 1));
                dto.Tuan2 = FormatWeeklyReportCell(reports.FirstOrDefault(r => r.WeekNumber == 2));
                dto.Tuan3 = FormatWeeklyReportCell(reports.FirstOrDefault(r => r.WeekNumber == 3));
                dto.Tuan4 = FormatWeeklyReportCell(reports.FirstOrDefault(r => r.WeekNumber == 4));
                dto.Tuan5 = FormatWeeklyReportCell(reports.FirstOrDefault(r => r.WeekNumber == 5));
                dto.Tuan6 = FormatWeeklyReportCell(reports.FirstOrDefault(r => r.WeekNumber == 6));

                // Report submission status: "Đã nộp" or "X"
                bool isSubmitted = internship.Status == InternshipStatus.Completed ||
                                   internship.Status == InternshipStatus.Graded ||
                                   reports.Count >= 6;
                dto.NopBc = isSubmitted ? "Đã nộp" : "X";
            }
            else
            {
                dto.PhuTrachCongTy = string.Empty;
                dto.GvHuongDan = string.Empty;
                dto.GhiChu = "Không thực tập";
                dto.HdChung = "Thiếu";
                dto.Tuan1 = "V";
                dto.Tuan2 = "V";
                dto.Tuan3 = "V";
                dto.Tuan4 = "V";
                dto.Tuan5 = "V";
                dto.Tuan6 = "V";
                dto.NopBc = "X";
            }

            studentExportList.Add(dto);
        }

        // ────────────────────────────────────────────────────────────────────
        // 2. Relational Query for Sheet 2: DANH SÁCH DOANH NGHIỆP
        // ────────────────────────────────────────────────────────────────────
        var companies = await _db.Companies
            .AsNoTracking()
            .Where(c => c.IsActive)
            .Select(c => new CompanyExportDto
            {
                CompanyId = c.Id,
                CompanyName = c.CompanyName,
                Address = c.Address ?? "—",
                StudentCount = c.Internships.Count(i => !semesterId.HasValue || i.SemesterId == semesterId.Value),
                ContactInfo = string.IsNullOrWhiteSpace(c.ContactPhone)
                    ? (c.ContactPerson ?? "—")
                    : $"{c.ContactPerson} - {c.ContactPhone}"
            })
            .OrderBy(c => c.CompanyName)
            .ToListAsync(cancellationToken);

        int compStt = 1;
        foreach (var c in companies)
        {
            c.Stt = compStt++;
        }

        // ────────────────────────────────────────────────────────────────────
        // 3. Relational Query for Sheet 3: DANH SÁCH GIẢNG VIÊN PHÂN CÔNG / DATABASE
        // ────────────────────────────────────────────────────────────────────
        var assignments = await _db.Internships
            .AsNoTracking()
            .Where(i => !semesterId.HasValue || i.SemesterId == semesterId.Value)
            .Select(i => new LecturerAssignmentExportDto
            {
                StudentFullName = i.Student.FullName,
                StudentClass = i.Student.Class ?? "—",
                CompanyName = i.Company != null ? i.Company.CompanyName : "Chưa có",
                LecturerName = i.Lecturer != null ? i.Lecturer.FullName : "Chưa phân công",
                LecturerDepartment = i.Lecturer != null ? (i.Lecturer.Department ?? "—") : "—"
            })
            .OrderBy(a => a.StudentClass)
            .ThenBy(a => a.StudentFullName)
            .ToListAsync(cancellationToken);

        int assignStt = 1;
        foreach (var a in assignments)
        {
            a.Stt = assignStt++;
        }

        return new InternshipExportDataDto
        {
            Students = studentExportList,
            Companies = companies,
            LecturerAssignments = assignments
        };
    }

    /// <inheritdoc />
    public async Task<byte[]> GenerateInternshipExportExcelAsync(Guid? semesterId = null, CancellationToken cancellationToken = default)
    {
        var data = await GetExportDataAsync(semesterId, cancellationToken);
        return GenerateFromData(data);
    }

    /// <inheritdoc />
    public byte[] GenerateFromData(InternshipExportDataDto data, string? templatePath = null)
    {
        var templateFile = ResolveTemplatePath(templatePath);

        XLWorkbook workbook;
        if (!string.IsNullOrEmpty(templateFile) && File.Exists(templateFile))
        {
            _logger.LogInformation("Loading Excel template from {Path}", templateFile);
            var templateBytes = File.ReadAllBytes(templateFile);
            var templateStream = new MemoryStream(templateBytes);
            workbook = new XLWorkbook(templateStream);
        }
        else
        {
            _logger.LogWarning("Excel template not found on disk. Building workbook programmatically with template layout.");
            workbook = CreateFallbackWorkbook();
        }

        using (workbook)
        {
            ExportStudents(workbook, data.Students);
            ExportCompanies(workbook, data.Companies);
            ExportLecturerAssignments(workbook, data.LecturerAssignments);

            using var ms = new MemoryStream();
            workbook.SaveAs(ms);
            return ms.ToArray();
        }
    }

    // ────────────────────────────────────────────────────────────────────────
    // Modular Sheet Exporters
    // ────────────────────────────────────────────────────────────────────────

    /// <summary>
    /// Populates Sheet 1 (DANH SÁCH / DANH SÁCH THỰC TẬP) with dynamic rows, formulas, and preserved formatting.
    /// </summary>
    private void ExportStudents(XLWorkbook workbook, List<InternshipStudentExportDto> students)
    {
        var ws = FindWorksheet(workbook, "DANH SÁCH (2)", "DANH SÁCH THỰC TẬP", "DANH SÁCH");
        if (ws == null) return;

        const int dataStartRow = 3;
        const int defaultTemplateCapacity = 50; // Rows 3 to 52 in template
        int recordCount = students.Count;

        // 1. Locate or determine the Lookup & Statistics section
        // In the original template, Rows 64-71 are the lookup table, and Row 72 is the total row.
        int originalLookupStartRow = 65;
        int originalLookupEndRow = 71;
        int originalSumRow = 72;

        int extraRows = 0;
        if (recordCount > defaultTemplateCapacity)
        {
            extraRows = recordCount - defaultTemplateCapacity;
            int insertPosition = dataStartRow + defaultTemplateCapacity; // Row 53
            ws.Row(insertPosition).InsertRowsAbove(extraRows);

            // Copy style from template data row (Row 3) to newly inserted rows
            var templateRow = ws.Row(dataStartRow);
            for (int i = 0; i < extraRows; i++)
            {
                int targetRow = insertPosition + i;
                CopyTemplateRowStyle(templateRow, ws.Row(targetRow));
            }
        }

        int lastDataRow = Math.Max(dataStartRow, dataStartRow + recordCount - 1);
        int currentLookupStartRow = originalLookupStartRow + extraRows;
        int currentLookupEndRow = originalLookupEndRow + extraRows;
        int currentSumRow = originalSumRow + extraRows;

        // 2. Populate student data rows
        for (int i = 0; i < recordCount; i++)
        {
            int r = dataStartRow + i;
            var s = students[i];
            MapStudentToRow(ws, r, s, currentLookupStartRow, currentLookupEndRow);
        }

        // 3. Clear unused template placeholder rows (if fewer than 50 records)
        if (recordCount < defaultTemplateCapacity)
        {
            for (int r = dataStartRow + recordCount; r < dataStartRow + defaultTemplateCapacity; r++)
            {
                ClearUnusedRow(ws, r);
            }
        }

        // 4. Update Lookup Table & Statistics Formulas
        UpdateLookupAndStatisticFormulas(ws, dataStartRow, lastDataRow, currentLookupStartRow, currentLookupEndRow, currentSumRow);
    }

    /// <summary>
    /// Populates Sheet 2 (TÊN CÔNG TY / DANH SÁCH DOANH NGHIỆP).
    /// </summary>
    private void ExportCompanies(XLWorkbook workbook, List<CompanyExportDto> companies)
    {
        var ws = FindWorksheet(workbook, "TÊN CÔNG TY (2)", "TÊN CÔNG TY", "DANH SÁCH DOANH NGHIỆP");
        if (ws == null) return;

        const int dataStartRow = 2;
        int recordCount = companies.Count;

        // Populate rows
        for (int i = 0; i < recordCount; i++)
        {
            int r = dataStartRow + i;
            var c = companies[i];
            MapCompanyToRow(ws, r, c);
        }

        // Clear any excess existing template rows beyond record count
        int maxRow = ws.LastRowUsed()?.RowNumber() ?? (dataStartRow + recordCount);
        for (int r = dataStartRow + recordCount; r <= maxRow; r++)
        {
            ws.Row(r).Clear();
        }

        ws.Columns(1, 6).AdjustToContents();
    }

    /// <summary>
    /// Populates Sheet 3 (DATABASE / DANH SÁCH GIẢNG VIÊN PHÂN CÔNG).
    /// </summary>
    private void ExportLecturerAssignments(XLWorkbook workbook, List<LecturerAssignmentExportDto> assignments)
    {
        var ws = FindWorksheet(workbook, "DATABASE", "DANH SÁCH GIẢNG VIÊN PHÂN CÔNG");
        if (ws == null) return;

        const int dataStartRow = 3;
        int recordCount = assignments.Count;

        for (int i = 0; i < recordCount; i++)
        {
            int r = dataStartRow + i;
            var a = assignments[i];
            MapLecturerAssignmentToRow(ws, r, a);
        }

        int maxRow = ws.LastRowUsed()?.RowNumber() ?? (dataStartRow + recordCount);
        for (int r = dataStartRow + recordCount; r <= maxRow; r++)
        {
            ws.Row(r).Clear();
        }

        ws.Columns(1, 5).AdjustToContents();
    }

    // ────────────────────────────────────────────────────────────────────────
    // Row Mapping & Formula Helpers
    // ────────────────────────────────────────────────────────────────────────

    private static void MapStudentToRow(
        IXLWorksheet ws,
        int row,
        InternshipStudentExportDto s,
        int lookupStartRow,
        int lookupEndRow)
    {
        ws.Cell(row, 1).Value = s.Stt;
        ws.Cell(row, 2).Value = s.Ho;
        ws.Cell(row, 3).Value = s.Ten;
        ws.Cell(row, 4).Value = s.Lop;
        ws.Cell(row, 5).Value = s.PhuTrachCongTy;
        ws.Cell(row, 6).Value = s.GvHuongDan;
        ws.Cell(row, 7).Value = s.GhiChu;

        // Scores (Cols H, I, J)
        if (s.DiemThamGia.HasValue) ws.Cell(row, 8).Value = s.DiemThamGia.Value;
        else ws.Cell(row, 8).Clear(XLClearOptions.Contents);

        if (s.DiemQT.HasValue) ws.Cell(row, 9).Value = s.DiemQT.Value;
        else ws.Cell(row, 9).Clear(XLClearOptions.Contents);

        if (s.Thi.HasValue) ws.Cell(row, 10).Value = s.Thi.Value;
        else ws.Cell(row, 10).Clear(XLClearOptions.Contents);

        // K: Điểm TB Formula
        ws.Cell(row, 11).FormulaA1 = $"I{row}*0.4+J{row}*0.6";

        // L: Xếp loại Formula via dynamic VLOOKUP
        ws.Cell(row, 12).FormulaA1 = $"VLOOKUP(K{row},$I${lookupStartRow}:$L${lookupEndRow},4,1)";

        // Progress (Cols M to S)
        ws.Cell(row, 13).Value = s.HdChung;
        ws.Cell(row, 14).Value = s.Tuan1;
        ws.Cell(row, 15).Value = s.Tuan2;
        ws.Cell(row, 16).Value = s.Tuan3;
        ws.Cell(row, 17).Value = s.Tuan4;
        ws.Cell(row, 18).Value = s.Tuan5;
        ws.Cell(row, 19).Value = s.Tuan6;

        // T: Nộp báo cáo
        ws.Cell(row, 20).Value = s.NopBc;

        // U: Final eligibility dynamic formula
        ws.Cell(row, 21).FormulaA1 = $"IF(OR(T{row}=\"X\",(COUNTIF(N{row}:S{row},\"V\")>=2)),\"Không đủ điều kiện\",\"\")";

        // Formatting styles
        for (int c = 1; c <= 21; c++)
        {
            var cell = ws.Cell(row, c);
            cell.Style.Font.FontName = "Times New Roman";
            cell.Style.Font.FontSize = 10;
            cell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            cell.Style.Border.OutsideBorderColor = XLColor.FromHtml("#D1D5DB");
            cell.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
        }

        // Alignments
        ws.Cell(row, 1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        ws.Cell(row, 4).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        ws.Cell(row, 8).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
        ws.Cell(row, 9).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
        ws.Cell(row, 10).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
        ws.Cell(row, 11).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
        ws.Cell(row, 12).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        for (int c = 13; c <= 21; c++)
        {
            ws.Cell(row, c).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        }
    }

    private static void MapCompanyToRow(IXLWorksheet ws, int row, CompanyExportDto c)
    {
        ws.Cell(row, 1).Value = c.Stt;
        ws.Cell(row, 2).Value = c.CompanyName;
        ws.Cell(row, 3).Value = c.Address;
        ws.Cell(row, 4).Value = c.StudentCount;
        ws.Cell(row, 6).Value = c.ContactInfo;

        for (int col = 1; col <= 6; col++)
        {
            var cell = ws.Cell(row, col);
            cell.Style.Font.FontName = "Times New Roman";
            cell.Style.Font.FontSize = 10;
            cell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            cell.Style.Border.OutsideBorderColor = XLColor.FromHtml("#D1D5DB");
            cell.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
        }
        ws.Cell(row, 1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        ws.Cell(row, 4).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
    }

    private static void MapLecturerAssignmentToRow(IXLWorksheet ws, int row, LecturerAssignmentExportDto a)
    {
        ws.Cell(row, 1).Value = a.Stt;
        ws.Cell(row, 2).Value = a.StudentFullName;
        ws.Cell(row, 3).Value = a.StudentClass;
        ws.Cell(row, 4).Value = a.CompanyName;
        ws.Cell(row, 5).Value = a.CompanyName;

        for (int col = 1; col <= 5; col++)
        {
            var cell = ws.Cell(row, col);
            cell.Style.Font.FontName = "Times New Roman";
            cell.Style.Font.FontSize = 10;
            cell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            cell.Style.Border.OutsideBorderColor = XLColor.FromHtml("#D1D5DB");
            cell.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
        }
        ws.Cell(row, 1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        ws.Cell(row, 3).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
    }

    private static void ClearUnusedRow(IXLWorksheet ws, int row)
    {
        for (int c = 1; c <= 21; c++)
        {
            var cell = ws.Cell(row, c);
            cell.Clear(XLClearOptions.Contents | XLClearOptions.DataValidation);
        }
    }

    private static void CopyTemplateRowStyle(IXLRow sourceRow, IXLRow targetRow)
    {
        targetRow.Height = sourceRow.Height;
        for (int c = 1; c <= 21; c++)
        {
            var src = sourceRow.Cell(c);
            var tgt = targetRow.Cell(c);
            tgt.Style.Font.FontName = src.Style.Font.FontName;
            tgt.Style.Font.FontSize = src.Style.Font.FontSize;
            tgt.Style.Alignment.Horizontal = src.Style.Alignment.Horizontal;
            tgt.Style.Alignment.Vertical = src.Style.Alignment.Vertical;
            tgt.Style.Border.TopBorder = src.Style.Border.TopBorder;
            tgt.Style.Border.BottomBorder = src.Style.Border.BottomBorder;
            tgt.Style.Border.LeftBorder = src.Style.Border.LeftBorder;
            tgt.Style.Border.RightBorder = src.Style.Border.RightBorder;
            tgt.Style.Border.TopBorderColor = src.Style.Border.TopBorderColor;
            tgt.Style.Border.BottomBorderColor = src.Style.Border.BottomBorderColor;
            tgt.Style.Border.LeftBorderColor = src.Style.Border.LeftBorderColor;
            tgt.Style.Border.RightBorderColor = src.Style.Border.RightBorderColor;
        }
    }

    private static void UpdateLookupAndStatisticFormulas(
        IXLWorksheet ws,
        int dataStartRow,
        int lastDataRow,
        int lookupStartRow,
        int lookupEndRow,
        int sumRow)
    {
        // For each rating row in the conversion table (rows lookupStartRow..lookupEndRow)
        for (int r = lookupStartRow; r <= lookupEndRow; r++)
        {
            // Col M (Col 13): count how many students received rating in Col L
            ws.Cell(r, 13).FormulaA1 = $"COUNTIF($L${dataStartRow}:$L${lastDataRow},L{r})";
            // Col N (Col 14): percentage of total
            ws.Cell(r, 14).FormulaA1 = $"M{r}/$M${sumRow}";
        }

        // Sum row: Col M (Col 13) = SUM(M{lookupStartRow}:M{lookupEndRow})
        ws.Cell(sumRow, 13).FormulaA1 = $"SUM(M{lookupStartRow}:M{lookupEndRow})";
    }

    // ────────────────────────────────────────────────────────────────────────
    // Fallback Workbook Builder (if template file is missing)
    // ────────────────────────────────────────────────────────────────────────

    private static XLWorkbook CreateFallbackWorkbook()
    {
        var wb = new XLWorkbook();
        var ws1 = wb.Worksheets.Add("DANH SÁCH (2)");
        ws1.Cell(1, 1).Value = "DANH SÁCH SINH VIÊN THỰC TẬP TẠI DOANH NGHIỆP";
        ws1.Range(1, 1, 1, 21).Merge();
        ws1.Cell(1, 1).Style.Font.Bold = true;
        ws1.Cell(1, 1).Style.Font.FontSize = 14;
        ws1.Cell(1, 1).Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

        var headers = new[]
        {
            "STT", "HỌ", "TÊN", "LỚP", "PHỤ TRÁCH CÔNG TY", "GV HƯỚNG DẪN THỰC TẬP",
            "GHI CHÚ", "Điểm tham gia", "Điểm QT", "Thi", "Điểm TB", "Kết quả xếp loại",
            "HD CHUNG", "TUẦN 1", "TUẦN 2", "TUẦN 3", "TUẦN 4", "TUẦN 5", "TUẦN 6", "NỘP BC", "TỔNG"
        };
        for (int i = 0; i < headers.Length; i++)
        {
            var cell = ws1.Cell(2, i + 1);
            cell.Value = headers[i];
            cell.Style.Font.Bold = true;
            cell.Style.Fill.BackgroundColor = XLColor.FromHtml("#E2E8F0");
            cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        }

        // Seed default conversion lookup table at rows 65-71
        ws1.Cell(63, 9).Value = "BẢNG THỐNG KÊ THEO THANG ĐIỂM QUY ĐỔI";
        ws1.Cell(64, 9).Value = "Hệ 10"; ws1.Cell(64, 10).Value = "Hệ 4"; ws1.Cell(64, 11).Value = "Điểm chữ"; ws1.Cell(64, 12).Value = "Xếp loại"; ws1.Cell(64, 13).Value = "kết quả";

        var lookupData = new (double Score10, double Score4, string Letter, string Rating)[]
        {
            (0.0, 0.0, "F", "không thực tập"),
            (4.0, 1.0, "D", "yếu"),
            (5.0, 2.0, "C", "Trung bình"),
            (6.5, 2.5, "C+", "Trung bình khá"),
            (7.0, 3.0, "B", "Khá"),
            (8.0, 3.5, "B+", "Giỏi"),
            (8.5, 4.0, "A", "Xuất sắc")
        };

        for (int i = 0; i < lookupData.Length; i++)
        {
            int r = 65 + i;
            ws1.Cell(r, 9).Value = lookupData[i].Score10;
            ws1.Cell(r, 10).Value = lookupData[i].Score4;
            ws1.Cell(r, 11).Value = lookupData[i].Letter;
            ws1.Cell(r, 12).Value = lookupData[i].Rating;
        }

        var ws2 = wb.Worksheets.Add("DATABASE");
        ws2.Cell(2, 1).Value = "STT"; ws2.Cell(2, 2).Value = "HỌ TÊN"; ws2.Cell(2, 3).Value = "LỚP"; ws2.Cell(2, 4).Value = "CÔNG TY THỰC TẬP";

        var ws3 = wb.Worksheets.Add("TÊN CÔNG TY (2)");
        ws3.Cell(1, 1).Value = "STT"; ws3.Cell(1, 2).Value = "Tên Công Ty"; ws3.Cell(1, 3).Value = "Địa Chỉ"; ws3.Cell(1, 4).Value = "Số Lượng"; ws3.Cell(1, 6).Value = "Liên Hệ";

        return wb;
    }

    // ────────────────────────────────────────────────────────────────────────
    // Utilities
    // ────────────────────────────────────────────────────────────────────────

    private static IXLWorksheet? FindWorksheet(XLWorkbook workbook, params string[] candidateNames)
    {
        foreach (var name in candidateNames)
        {
            var ws = workbook.Worksheets.FirstOrDefault(w => w.Name.Equals(name, StringComparison.OrdinalIgnoreCase));
            if (ws != null) return ws;
        }
        return workbook.Worksheets.FirstOrDefault();
    }

    private static string? ResolveTemplatePath(string? customPath)
    {
        if (!string.IsNullOrEmpty(customPath) && File.Exists(customPath))
            return customPath;

        return TemplateHelper.FindTemplatePath("InternshipExportTemplate.xlsx")
            ?? TemplateHelper.FindTemplatePath("DANH SACH THUC TAP C23.xlsx");
    }

    private static (string Ho, string Ten) SplitFullName(string fullName)
    {
        if (string.IsNullOrWhiteSpace(fullName))
            return (string.Empty, string.Empty);

        var parts = fullName.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length <= 1)
            return (string.Empty, fullName.Trim());

        var ten = parts[^1];
        var ho = string.Join(' ', parts[..^1]);
        return (ho, ten);
    }

    private static string FormatWeeklyReportCell(WeeklyReport? report)
    {
        if (report == null) return "V"; // Vắng / Chưa nộp
        return report.Status switch
        {
            WeeklyReportStatus.Approved => "✓",
            WeeklyReportStatus.Reviewed => "✓",
            WeeklyReportStatus.Submitted => "Đã nộp",
            WeeklyReportStatus.Draft => "Nháp",
            _ => "V"
        };
    }
}
