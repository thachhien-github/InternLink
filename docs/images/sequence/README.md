# Sequence Diagrams — InternLink

Luồng tương tác quan trọng (Mermaid). Linked từ [`04-Use-Case-Specification.md`](../../04-Use-Case-Specification.md).

| File | Use Case | Mô tả |
|------|----------|--------|
| [`invitation-email.md`](invitation-email.md) | UC-A02 / A04 | Admin tạo TK → gửi email mời |
| [`bulk-assign.md`](bulk-assign.md) | UC-A08 | Admin gán SV → GV |
| [`forgot-password.md`](forgot-password.md) | UC-03 / UC-04 | Quên MK → reset bằng link |

## Khi nào thêm sequence mới

Chỉ khi luồng có nhiều bước / nhiều hệ thống (email, token, multi-role) và dễ hiểu sai nếu chỉ đọc API list.
