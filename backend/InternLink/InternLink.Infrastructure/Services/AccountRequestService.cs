using System.Text.Json;
using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Domain.Entities;
using InternLink.Domain.Enums;
using InternLink.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace InternLink.Infrastructure.Services;

public class AccountRequestService : IAccountRequestService
{
    private readonly AppDbContext _db;

    public AccountRequestService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<AccountRequestDto>> GetAllAsync(
        string? status = null, string? role = null, int skip = 0, int take = 100)
    {
        take = Math.Clamp(take, 1, 500);
        skip = Math.Max(0, skip);

        var query = _db.AccountRequests
            .Where(r => !r.IsDeleted)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status))
        {
            if (Enum.TryParse<AccountRequestStatus>(status, true, out var statusEnum))
                query = query.Where(r => r.Status == statusEnum);
        }

        if (!string.IsNullOrWhiteSpace(role))
        {
            if (Enum.TryParse<Role>(role, true, out var roleEnum))
                query = query.Where(r => r.RequesterRole == roleEnum);
        }

        var items = await query
            .OrderByDescending(r => r.CreatedAt)
            .Skip(skip)
            .Take(take)
            .ToListAsync();

        return items.Select(MapToDto).ToList();
    }

    public async Task<AccountRequestDto?> GetByIdAsync(Guid id)
    {
        var item = await _db.AccountRequests
            .FirstOrDefaultAsync(r => r.Id == id && !r.IsDeleted);
        return item == null ? null : MapToDto(item);
    }

    public async Task<AccountRequestDto> CreateAsync(CreateAccountRequestRequest request)
    {
        var role = Role.Student;
        if (!string.IsNullOrWhiteSpace(request.RequesterRole))
            Enum.TryParse(request.RequesterRole, true, out role);

        var entity = new AccountRequest
        {
            Id = Guid.NewGuid(),
            RequesterCode = request.RequesterCode.Trim(),
            RequesterName = request.RequesterName.Trim(),
            RequesterEmail = request.RequesterEmail?.Trim(),
            RequesterPhone = request.RequesterPhone?.Trim(),
            RequesterRole = role,
            DepartmentOrClass = request.DepartmentOrClass?.Trim(),
            RequestType = request.RequestType.Trim(),
            Description = request.Description?.Trim(),
            Priority = request.Priority?.Trim() ?? "medium",
            Status = AccountRequestStatus.Pending,
            RequestedChangesJson = request.RequestedChanges != null
                ? JsonSerializer.Serialize(request.RequestedChanges)
                : null,
            CreatedAt = DateTime.UtcNow,
        };

        _db.AccountRequests.Add(entity);
        await _db.SaveChangesAsync();

        return MapToDto(entity);
    }

    public async Task<AccountRequestDto?> ProcessAsync(Guid id, ProcessAccountRequestRequest request)
    {
        var entity = await _db.AccountRequests
            .FirstOrDefaultAsync(r => r.Id == id && !r.IsDeleted);

        if (entity == null) return null;

        if (entity.Status != AccountRequestStatus.Pending)
            throw new InvalidOperationException("Chỉ có thể xử lý yêu cầu đang chờ.");

        if (!Enum.TryParse<AccountRequestStatus>(request.Status, true, out var newStatus))
            throw new InvalidOperationException("Trạng thái không hợp lệ. Dùng: approved, rejected, need_info");

        entity.Status = newStatus;
        entity.ProcessorName = request.ProcessorName?.Trim() ?? "SuperAdmin";
        entity.ProcessedAt = DateTime.UtcNow;
        entity.AdminNote = request.AdminNote?.Trim();
        entity.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return MapToDto(entity);
    }

    public async Task<int> GetPendingCountAsync()
    {
        return await _db.AccountRequests
            .CountAsync(r => !r.IsDeleted && r.Status == AccountRequestStatus.Pending);
    }

    private static AccountRequestDto MapToDto(AccountRequest entity)
    {
        List<RequestedChangeDto>? changes = null;
        if (!string.IsNullOrWhiteSpace(entity.RequestedChangesJson))
        {
            try
            {
                changes = JsonSerializer.Deserialize<List<RequestedChangeDto>>(entity.RequestedChangesJson);
            }
            catch { /* ignore parse errors */ }
        }

        return new AccountRequestDto
        {
            Id = entity.Id,
            RequesterCode = entity.RequesterCode,
            RequesterName = entity.RequesterName,
            RequesterEmail = entity.RequesterEmail,
            RequesterPhone = entity.RequesterPhone,
            RequesterRole = entity.RequesterRole.ToString(),
            DepartmentOrClass = entity.DepartmentOrClass,
            RequestType = entity.RequestType,
            Description = entity.Description,
            Priority = entity.Priority,
            Status = entity.Status.ToString(),
            ProcessorName = entity.ProcessorName,
            ProcessedAt = entity.ProcessedAt,
            AdminNote = entity.AdminNote,
            AttachmentName = entity.AttachmentName,
            RequestedChanges = changes,
            CreatedAt = entity.CreatedAt,
        };
    }
}
