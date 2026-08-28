using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using ClosedXML.Excel;

namespace InternLink.Infrastructure.Services;

public static class TemplateHelper
{
    public static string? FindTemplatePath(string templateFileName)
    {
        var roots = new List<string>
        {
            AppContext.BaseDirectory,
            Directory.GetCurrentDirectory()
        };

        // Traverse parent directories for dev/test environments
        var current = new DirectoryInfo(Directory.GetCurrentDirectory());
        for (int i = 0; i < 5 && current != null; i++)
        {
            roots.Add(current.FullName);
            current = current.Parent;
        }

        var baseCurrent = new DirectoryInfo(AppContext.BaseDirectory);
        for (int i = 0; i < 5 && baseCurrent != null; i++)
        {
            roots.Add(baseCurrent.FullName);
            baseCurrent = baseCurrent.Parent;
        }

        var candidateRelativePaths = new[]
        {
            Path.Combine("Templates", "importTemplates", templateFileName),
            Path.Combine("Templates", templateFileName),
            Path.Combine("InternLink.API", "Templates", "importTemplates", templateFileName),
            Path.Combine("InternLink.API", "Templates", templateFileName),
            Path.Combine("backend", "InternLink", "InternLink.API", "Templates", "importTemplates", templateFileName),
            Path.Combine("backend", "InternLink", "InternLink.API", "Templates", templateFileName)
        };

        foreach (var root in roots.Distinct())
        {
            foreach (var rel in candidateRelativePaths)
            {
                var full = Path.Combine(root, rel);
                if (File.Exists(full))
                    return full;
            }
        }

        return null;
    }

    public static byte[] GetTemplateBytes(string templateFileName, Func<byte[]> fallbackGenerator)
    {
        var path = FindTemplatePath(templateFileName);
        if (!string.IsNullOrEmpty(path) && File.Exists(path))
        {
            return File.ReadAllBytes(path);
        }

        return fallbackGenerator();
    }

    public static IXLRangeRow? FindHeaderRow(IXLWorksheet worksheet, Func<IXLRangeRow, bool> isHeaderPredicate, int maxScanRows = 6)
    {
        var usedRange = worksheet.RangeUsed();
        if (usedRange == null) return null;

        var rowCount = Math.Min(maxScanRows, usedRange.RowCount());
        for (int r = 1; r <= rowCount; r++)
        {
            var row = usedRange.Row(r);
            if (isHeaderPredicate(row))
                return row;
        }

        return usedRange.FirstRow();
    }

    public static string NormalizeText(string? text)
    {
        if (string.IsNullOrWhiteSpace(text)) return string.Empty;
        var formD = text.Trim().ToLowerInvariant().Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder(formD.Length);
        foreach (var ch in formD)
        {
            if (CharUnicodeInfo.GetUnicodeCategory(ch) != UnicodeCategory.NonSpacingMark)
                sb.Append(ch);
        }
        var res = sb.ToString().Normalize(NormalizationForm.FormC).Replace('đ', 'd').Replace('Đ', 'D');
        return Regex.Replace(res, @"\s+", " ");
    }

    public static string? CombineFullName(string? ho, string? ten, string? hoTen)
    {
        if (!string.IsNullOrWhiteSpace(hoTen))
            return hoTen.Trim();

        var parts = new[] { ho?.Trim(), ten?.Trim() }.Where(p => !string.IsNullOrWhiteSpace(p));
        var combined = string.Join(" ", parts);
        return string.IsNullOrWhiteSpace(combined) ? null : combined;
    }

    public static string? GetCellString(IXLRangeRow row, int? colIndex)
    {
        if (!colIndex.HasValue || colIndex.Value <= 0) return null;
        var cell = row.Cell(colIndex.Value);
        if (cell.DataType == XLDataType.Number)
            return cell.GetDouble().ToString("0");
        var text = cell.GetString();
        return string.IsNullOrWhiteSpace(text) ? null : text.Trim();
    }
}
