using InternLink.Application.DTOs;

namespace InternLink.Application.Interfaces;

public interface IEmailService
{
    /// <summary>
    /// Sends an educational invitation email (portal link + username + temporary password).
    /// </summary>
    Task<SendEmailResult> SendInvitationAsync(InvitationEmailRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Sends a password reset notification email.
    /// </summary>
    Task<SendEmailResult> SendPasswordResetAsync(PasswordResetEmailRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Sends a forgot-password email with a secure reset link.
    /// </summary>
    Task<SendEmailResult> SendForgotPasswordAsync(ForgotPasswordEmailRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Sends a raw email (HTML + optional plain text).
    /// </summary>
    Task<SendEmailResult> SendAsync(
        string toEmail,
        string subject,
        string htmlBody,
        string? plainTextBody = null,
        CancellationToken cancellationToken = default);
}
