using System.Data;

namespace InternLink.Application.Interfaces;

public interface IExcelService
{
    /// <summary>
    /// Generates a styled Excel workbook byte array with a title header, styled table columns, and formatted data rows.
    /// </summary>
    byte[] ExportToExcel<T>(
        string sheetName,
        string reportTitle,
        IEnumerable<T> data,
        Dictionary<string, Func<T, object?>> columnMappings);

    /// <summary>
    /// Generates a multi-sheet styled Excel workbook.
    /// </summary>
    byte[] ExportMultiSheetToExcel(
        Dictionary<string, (string Title, IEnumerable<object> Data, Dictionary<string, Func<object, object?>> Mappings)> sheets);

    /// <summary>
    /// Reads tabular data from an Excel stream into a DataTable.
    /// </summary>
    DataTable ReadExcelToDataTable(Stream excelStream, string? sheetName = null);
}
