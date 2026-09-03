using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using ClosedXML.Excel;

namespace InternLink.Infrastructure.Services;

/// <summary>
/// Smart column matching utility for Excel imports.
/// Supports exact match, contains match, and Levenshtein fuzzy matching
/// to handle various user-created column headers.
/// </summary>
public static class FuzzyColumnMatcher
{
    /// <summary>
    /// Match a header row against expected column definitions.
    /// Returns a dictionary mapping column keys to their column indices.
    /// </summary>
    /// <param name="headerRow">The Excel header row to match</param>
    /// <param name="columnDefinitions">Expected columns with their aliases</param>
    /// <param name="minScore">Minimum match score (0-100) to accept a match. Default 50.</param>
    /// <returns>Dictionary of column key → column index</returns>
    public static Dictionary<string, int> Match(
        IXLRangeRow headerRow,
        Dictionary<string, ColumnDefinition> columnDefinitions,
        int minScore = 50)
    {
        var result = new Dictionary<string, int>();
        var usedColumns = new HashSet<int>();
        var headerCells = new List<(int colIndex, string rawHeader, string normalized)>();

        // Phase 1: Normalize all headers
        foreach (var cell in headerCellsUsed(headerRow))
        {
            var raw = cell.GetString();
            var normalized = NormalizeHeader(raw);
            if (!string.IsNullOrEmpty(normalized))
            {
                headerCells.Add((cell.Address.ColumnNumber, raw, normalized));
            }
        }

        // Phase 2: Score each header against each column definition
        var candidates = new List<MatchCandidate>();

        foreach (var (colKey, colDef) in columnDefinitions)
        {
            foreach (var (colIndex, rawHeader, normalized) in headerCells)
            {
                var score = ScoreMatch(normalized, colDef);
                if (score >= minScore)
                {
                    candidates.Add(new MatchCandidate
                    {
                        ColumnKey = colKey,
                        ColumnIndex = colIndex,
                        Score = score,
                        MatchType = GetMatchType(normalized, colDef)
                    });
                }
            }
        }

        // Phase 3: Greedy assignment - best score wins, each column used once
        foreach (var candidate in candidates.OrderByDescending(c => c.Score))
        {
            if (result.ContainsKey(candidate.ColumnKey))
                continue; // Already matched this column key
            if (usedColumns.Contains(candidate.ColumnIndex))
                continue; // Already used this Excel column

            result[candidate.ColumnKey] = candidate.ColumnIndex;
            usedColumns.Add(candidate.ColumnIndex);
        }

        return result;
    }

    /// <summary>
    /// Convenience overload: match using string arrays of aliases per column.
    /// </summary>
    public static Dictionary<string, int> Match(
        IXLRangeRow headerRow,
        Dictionary<string, string[]> columnAliases,
        int minScore = 50)
    {
        var definitions = columnAliases.ToDictionary(
            kvp => kvp.Key,
            kvp => new ColumnDefinition(kvp.Value));

        return Match(headerRow, definitions, minScore);
    }

    /// <summary>
    /// Score how well a normalized header matches a column definition.
    /// Returns 0-100 where 100 is perfect match.
    /// </summary>
    public static int ScoreMatch(string normalizedHeader, ColumnDefinition columnDef)
    {
        if (string.IsNullOrEmpty(normalizedHeader))
            return 0;

        // 1. Exact match with any alias → 100
        foreach (var alias in columnDef.Aliases)
        {
            if (normalizedHeader == alias)
                return 100;
        }

        // 2. Contains match → 70-90
        foreach (var alias in columnDef.Aliases)
        {
            if (alias.Length >= 3 && normalizedHeader.Contains(alias))
                return 85;
            if (alias.Length >= 2 && normalizedHeader.Contains(alias))
                return 75;
        }

        // Reverse contains: alias contains header
        foreach (var alias in columnDef.Aliases)
        {
            if (normalizedHeader.Length >= 3 && alias.Contains(normalizedHeader))
                return 80;
        }

        // 3. Word-level match → 60-70
        var headerWords = normalizedHeader.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        foreach (var alias in columnDef.Aliases)
        {
            var aliasWords = alias.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            var intersection = headerWords.Intersect(aliasWords).Count();
            var union = headerWords.Union(aliasWords).Count();
            if (union > 0)
            {
                var jaccard = (double)intersection / union;
                if (jaccard >= 0.5)
                    return 65;
            }
        }

        // 4. Levenshtein fuzzy match → 50-60
        foreach (var alias in columnDef.Aliases)
        {
            var distance = LevenshteinDistance(normalizedHeader, alias);
            var maxLen = Math.Max(normalizedHeader.Length, alias.Length);
            if (maxLen == 0) continue;

            var similarity = 1.0 - (double)distance / maxLen;
            if (similarity >= 0.8)
                return 58;
            if (similarity >= 0.7)
                return 53;
        }

        return 0;
    }

    /// <summary>
    /// Remove diacritics, lowercase, normalize whitespace.
    /// </summary>
    public static string NormalizeHeader(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return string.Empty;

        var normalized = value.Trim().ToLowerInvariant();
        normalized = RemoveDiacritics(normalized);
        normalized = Regex.Replace(normalized, @"\s+", " ").Trim();
        return normalized;
    }

    /// <summary>
    /// Levenshtein edit distance between two strings.
    /// </summary>
    public static int LevenshteinDistance(string s, string t)
    {
        if (string.IsNullOrEmpty(s)) return t?.Length ?? 0;
        if (string.IsNullOrEmpty(t)) return s.Length;

        var n = s.Length;
        var m = t.Length;
        var d = new int[n + 1, m + 1];

        for (var i = 0; i <= n; i++) d[i, 0] = i;
        for (var j = 0; j <= m; j++) d[0, j] = j;

        for (var i = 1; i <= n; i++)
        {
            for (var j = 1; j <= m; j++)
            {
                var cost = s[i - 1] == t[j - 1] ? 0 : 1;
                d[i, j] = Math.Min(
                    Math.Min(d[i - 1, j] + 1, d[i, j - 1] + 1),
                    d[i - 1, j - 1] + cost);
            }
        }

        return d[n, m];
    }

    private static string RemoveDiacritics(string text)
    {
        var formD = text.Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder(formD.Length);
        foreach (var ch in formD)
        {
            var category = CharUnicodeInfo.GetUnicodeCategory(ch);
            if (category != UnicodeCategory.NonSpacingMark)
                sb.Append(ch);
        }

        return sb.ToString()
            .Normalize(NormalizationForm.FormC)
            .Replace('đ', 'd')
            .Replace('Đ', 'D');
    }

    private static string GetMatchType(string normalized, ColumnDefinition def)
    {
        foreach (var alias in def.Aliases)
        {
            if (normalized == alias) return "exact";
        }
        foreach (var alias in def.Aliases)
        {
            if (normalized.Contains(alias) || alias.Contains(normalized))
                return "contains";
        }
        return "fuzzy";
    }

    private static IEnumerable<IXLCell> headerCellsUsed(IXLRangeRow row)
    {
        foreach (var cell in row.CellsUsed())
        {
            yield return cell;
        }
    }
}

/// <summary>
/// Definition of an expected column with multiple accepted aliases.
/// </summary>
public class ColumnDefinition
{
    public string[] Aliases { get; }

    public ColumnDefinition(params string[] aliases)
    {
        Aliases = aliases.Select(a => FuzzyColumnMatcher.NormalizeHeader(a)).ToArray();
    }

    public ColumnDefinition(IEnumerable<string> aliases)
    {
        Aliases = aliases.Select(a => FuzzyColumnMatcher.NormalizeHeader(a)).ToArray();
    }
}

/// <summary>
/// Internal candidate for column matching.
/// </summary>
internal class MatchCandidate
{
    public string ColumnKey { get; set; } = "";
    public int ColumnIndex { get; set; }
    public int Score { get; set; }
    public string MatchType { get; set; } = "";
}
