# Sequence — Forgot / Reset Password

**Use cases:** UC-03, UC-04  
**Actors:** User → Auth API → Email → User (reset)

```mermaid
sequenceDiagram
  autonumber
  actor U as User
  participant API as AuthController
  participant Auth as AuthService
  participant DB as SQL Server
  participant Mail as EmailService

  rect rgb(245,245,245)
    Note over U,Mail: 1) Forgot password
    U->>API: POST /api/Auth/forgot-password<br/>{ email }
    API->>Auth: ForgotPasswordAsync(email)
    Auth->>DB: Find active User by email
    alt Email not found / inactive
      Auth-->>API: (silent OK)
      API-->>U: 200 OK
      Note over U: Không lộ email có tồn tại hay không
    else User found
      Auth->>Auth: Generate raw token<br/>SHA-256 → TokenHash
      Auth->>DB: Invalidate old tokens (IsDeleted)
      Auth->>DB: INSERT PasswordResetTokens<br/>ExpiresAt = now+24h
      Auth->>Mail: SendForgotPasswordAsync<br/>(reset link, NO password)
      Mail-->>Auth: Sent / Logged
      Auth-->>API: done
      API-->>U: 200 OK
    end
  end

  rect rgb(245,245,245)
    Note over U,DB: 2) Reset password
    U->>U: Open email link<br/>/reset-password?token=...
    U->>API: POST /api/Auth/reset-password<br/>{ token, newPassword }
    API->>Auth: ResetPasswordAsync
    Auth->>DB: Find by TokenHash<br/>UsedAt IS NULL AND ExpiresAt > now
    alt Invalid / expired / used
      Auth-->>API: Unauthorized
      API-->>U: 401
    else Valid
      Auth->>DB: UPDATE Users.PasswordHash<br/>MustChangePassword=false
      Auth->>DB: SET UsedAt = now<br/>invalidate other tokens
      Auth-->>API: OK
      API-->>U: 200 OK
    end
  end

  U->>API: POST /api/Auth/login<br/>(new password)
  API-->>U: JWT + MustChangePassword=false
```

## Security notes

- Token lưu **hash** trong DB, không lưu plaintext.
- One-time use (`UsedAt`) + expiry 24h.
- Khác UC-A07 (Admin reset): admin gửi **mật khẩu tạm** qua email; self-service chỉ gửi **link**.
