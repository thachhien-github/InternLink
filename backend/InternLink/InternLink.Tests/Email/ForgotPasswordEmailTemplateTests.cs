using FluentAssertions;
using InternLink.Application.DTOs;
using InternLink.Infrastructure.Email;

namespace InternLink.Tests.Email;

public class ForgotPasswordEmailTemplateTests
{
    private static EmailSettings CreateSettings() => new()
    {
        PortalUrl = "https://internlink.demo.edu.vn",
        PasswordResetPath = "/reset-password",
        PasswordResetTokenExpiryHours = 24,
        InstitutionName = "Trường Đại học Demo",
        SupportEmail = "daotao@demo.edu.vn"
    };

    [Fact]
    public void Build_ContainsResetLinkAndNoPassword()
    {
        var request = new ForgotPasswordEmailRequest
        {
            ToEmail = "sv@demo.edu.vn",
            FullName = "Nguyen Van A",
            ResetLink = "https://internlink.demo.edu.vn/reset-password?token=abc123"
        };

        var rendered = ForgotPasswordEmailTemplate.Build(request, CreateSettings());

        rendered.Subject.Should().Contain("đặt lại mật khẩu");
        rendered.PlainTextBody.Should().Contain("Nguyen Van A");
        rendered.PlainTextBody.Should().Contain("https://internlink.demo.edu.vn/reset-password?token=abc123");
        rendered.PlainTextBody.Should().NotContain("Mật khẩu mới");
        rendered.HtmlBody.Should().Contain("abc123");
    }

    [Fact]
    public void Build_HtmlEncodesUserInput()
    {
        var request = new ForgotPasswordEmailRequest
        {
            ToEmail = "x@demo.edu.vn",
            FullName = "<script>alert(1)</script>",
            ResetLink = "https://example.com/reset?token=a&b=c"
        };

        var rendered = ForgotPasswordEmailTemplate.Build(request, CreateSettings());

        rendered.HtmlBody.Should().NotContain("<script>");
        rendered.HtmlBody.Should().Contain("&lt;script&gt;");
    }
}
