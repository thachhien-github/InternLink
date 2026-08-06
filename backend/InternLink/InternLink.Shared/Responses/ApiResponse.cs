namespace InternLink.Shared.Responses;

/// <summary>
/// Standard API response wrapper
/// </summary>
public sealed class ApiResponse<T>
{
    public bool Success { get; init; }
    public T? Data { get; init; }
    public ApiError? Error { get; init; }

    public static ApiResponse<T> Ok(T? data) => new() { Success = true, Data = data };
    public static ApiResponse<T> Fail(ApiError error) => new() { Success = false, Error = error };
}
