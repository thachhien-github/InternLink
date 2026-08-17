using System.IdentityModel.Tokens.Jwt;
using FluentAssertions;
using InternLink.Infrastructure.Identity;
using Microsoft.Extensions.Options;
using Xunit;

namespace InternLink.Tests.Services;

public class JwtServiceTests
{
    private static JwtService CreateService()
    {
        var options = Options.Create(new JwtSettings
        {
            Issuer = "InternLinkTest",
            Audience = "InternLinkClientsTest",
            Secret = "InternLink_Dev_Secret_Key_At_Least_32_Characters_Long_2026!",
            ExpiresInMinutes = 60
        });

        return new JwtService(options);
    }

    [Fact]
    public void CreateToken_ValidUserId_ShouldReturnValidJwt()
    {
        var service = CreateService();
        var userId = Guid.NewGuid().ToString();
        var roles = new[] { "Student", "Lecturer" };

        var tokenString = service.CreateToken(userId, roles);

        tokenString.Should().NotBeNullOrWhiteSpace();

        var handler = new JwtSecurityTokenHandler();
        var token = handler.ReadJwtToken(tokenString);

        token.Issuer.Should().Be("InternLinkTest");
        token.Audiences.Should().Contain("InternLinkClientsTest");
        token.Claims.Should().Contain(c => c.Type == JwtRegisteredClaimNames.Sub && c.Value == userId);
    }
}
