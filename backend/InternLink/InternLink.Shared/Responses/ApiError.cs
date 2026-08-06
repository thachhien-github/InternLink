using System.Collections.Generic;

namespace InternLink.Shared.Responses;

/// <summary>
/// Standard API error details
/// </summary>
public sealed class ApiError
{
    public string? Title { get; init; }
    public string? Detail { get; init; }
    public int? Status { get; init; }
    public IDictionary<string, string[]>? Errors { get; init; }

    public static ApiError From(string title, string? detail = null, int? status = null)
        => new() { Title = title, Detail = detail, Status = status };
}
