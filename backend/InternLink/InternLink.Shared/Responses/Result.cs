namespace InternLink.Shared.Responses;

/// <summary>
/// Lightweight result type
/// </summary>
public sealed class Result
{
    public bool Succeeded { get; init; }
    public string? Message { get; init; }

    public static Result Success(string? message = null) => new() { Succeeded = true, Message = message };
    public static Result Failure(string? message = null) => new() { Succeeded = false, Message = message };
}
