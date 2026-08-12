namespace InternLink.Application.DTOs;

public class UserDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = null!;
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public string Role { get; set; } = null!;
    public bool IsActive { get; set; }
    public bool MustChangePassword { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? LinkedStudentCode { get; set; }
    public string? LinkedStaffCode { get; set; }
}

public class UserFilterRequest : PaginationRequest
{
    public string? Role { get; set; }
    public bool? IsActive { get; set; }
    public string? SearchTerm { get; set; }
}

public class CreateUserRequest
{
    public string Username { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public string? Email { get; set; }
    public string Role { get; set; } = null!;
    /// <summary>Link to existing student profile by MSSV.</summary>
    public string? StudentCode { get; set; }
    /// <summary>Link to existing lecturer profile by staff code.</summary>
    public string? StaffCode { get; set; }
}

public class UpdateUserRequest
{
    public string FullName { get; set; } = null!;
    public string? Email { get; set; }
    public bool IsActive { get; set; } = true;
}

public class ResetPasswordResultDto
{
    public Guid UserId { get; set; }
    public string Username { get; set; } = null!;
    public bool EmailSent { get; set; }
    public string? EmailMessage { get; set; }
}
