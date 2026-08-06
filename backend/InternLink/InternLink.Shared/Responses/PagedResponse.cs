using System.Collections.Generic;

namespace InternLink.Shared.Responses;

/// <summary>
/// Paged response for collections
/// </summary>
public sealed class PagedResponse<T>
{
    public IEnumerable<T> Items { get; init; } = Array.Empty<T>();
    public int Page { get; init; }
    public int PageSize { get; init; }
    public int TotalCount { get; init; }
    public int TotalPages => PageSize == 0 ? 0 : (int)Math.Ceiling(TotalCount / (double)PageSize);
}
