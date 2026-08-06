namespace InternLink.Shared.Interfaces
{
    /// <summary>
    /// JWT helper service contract used across layers
    /// </summary>
    public interface IJwtService
    {
        string CreateToken(string userId, IEnumerable<string>? roles = null);
    }
}
