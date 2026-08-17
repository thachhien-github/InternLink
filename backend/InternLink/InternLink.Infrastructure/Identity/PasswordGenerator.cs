using System.Security.Cryptography;
using System.Text;

namespace InternLink.Infrastructure.Identity;

public static class PasswordGenerator
{
    private const string Chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#";

    public static string GenerateTemporaryPassword(int length = 8)
    {
        var bytes = RandomNumberGenerator.GetBytes(length);
        var sb = new StringBuilder(length);
        foreach (var b in bytes)
            sb.Append(Chars[b % Chars.Length]);
        return sb.ToString();
    }
}
