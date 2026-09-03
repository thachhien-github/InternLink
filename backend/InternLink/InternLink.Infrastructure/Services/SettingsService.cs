using System.Text.Json;
using InternLink.Application.DTOs;
using InternLink.Application.Interfaces;
using InternLink.Domain.Entities;
using InternLink.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace InternLink.Infrastructure.Services;

public class SettingsService : ISettingsService
{
    private readonly AppDbContext _db;
    private AdminSettingsDto? _cache;
    private readonly object _lock = new();

    public SettingsService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<AdminSettingsDto> GetSettingsAsync()
    {
        lock (_lock)
        {
            if (_cache != null) return _cache;
        }

        var settings = new AdminSettingsDto();
        var rows = await _db.SystemSettings
            .Where(s => !s.IsDeleted)
            .ToListAsync();

        foreach (var row in rows)
        {
            switch (row.Key)
            {
                case "DepartmentName": settings.DepartmentName = row.Value; break;
                case "SupportEmail": settings.SupportEmail = row.Value; break;
                case "Phone": settings.Phone = row.Value; break;
                case "Address": settings.Address = row.Value; break;
                case "MaxStudentsPerLecturer": int.TryParse(row.Value, out var mspl); settings.MaxStudentsPerLecturer = mspl > 0 ? mspl : 30; break;
                case "DefaultReportDeadlineDay": settings.DefaultReportDeadlineDay = row.Value; break;
                case "MaxFileSizeMb": int.TryParse(row.Value, out var mfs); settings.MaxFileSizeMb = mfs > 0 ? mfs : 25; break;
                case "AllowLateSubmission": settings.AllowLateSubmission = bool.TryParse(row.Value, out var als) && als; break;
                case "AutoLockSemesterEnd": settings.AutoLockSemesterEnd = bool.TryParse(row.Value, out var alse) && alse; break;
            }
            if (row.Key == "LastUpdatedAt" && DateTime.TryParse(row.Value, out var lu))
                settings.LastUpdatedAt = lu;
        }

        lock (_lock)
        {
            _cache = settings;
        }

        return settings;
    }

    public async Task<AdminSettingsDto> UpdateSettingsAsync(UpdateAdminSettingsRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.DepartmentName))
            throw new InvalidOperationException("Tên Khoa / Đơn vị quản lý không được để trống");
        if (string.IsNullOrWhiteSpace(request.SupportEmail))
            throw new InvalidOperationException("Email hỗ trợ không được để trống");

        var now = DateTime.UtcNow;
        var entries = new (string Key, string Value, string? Description)[]
        {
            ("DepartmentName", request.DepartmentName.Trim(), "Tên khoa / đơn vị"),
            ("SupportEmail", request.SupportEmail.Trim(), "Email hỗ trợ"),
            ("Phone", request.Phone?.Trim() ?? string.Empty, "Số điện thoại"),
            ("Address", request.Address?.Trim() ?? string.Empty, "Địa chỉ"),
            ("MaxStudentsPerLecturer", (request.MaxStudentsPerLecturer > 0 ? request.MaxStudentsPerLecturer : 30).ToString(), "Số SV tối đa / GV"),
            ("DefaultReportDeadlineDay", string.IsNullOrWhiteSpace(request.DefaultReportDeadlineDay) ? "Chủ Nhật (23:59)" : request.DefaultReportDeadlineDay.Trim(), "Hạn nộp báo cáo"),
            ("MaxFileSizeMb", (request.MaxFileSizeMb > 0 ? request.MaxFileSizeMb : 25).ToString(), "Dung lượng file tối đa (MB)"),
            ("AllowLateSubmission", request.AllowLateSubmission.ToString(), "Cho phép nộp muộn"),
            ("AutoLockSemesterEnd", request.AutoLockSemesterEnd.ToString(), "Tự động khóa khi hết kỳ"),
            ("LastUpdatedAt", now.ToString("O"), "Thời gian cập nhật"),
        };

        var existingKeys = await _db.SystemSettings
            .Where(s => !s.IsDeleted)
            .Select(s => s.Key)
            .ToListAsync();

        foreach (var (key, value, desc) in entries)
        {
            var existing = await _db.SystemSettings.FirstOrDefaultAsync(s => s.Key == key && !s.IsDeleted);
            if (existing != null)
            {
                existing.Value = value;
                existing.UpdatedAt = now;
            }
            else
            {
                _db.SystemSettings.Add(new SystemSetting
                {
                    Id = Guid.NewGuid(),
                    Key = key,
                    Value = value,
                    Category = "General",
                    Description = desc,
                    CreatedAt = now,
                });
            }
        }

        await _db.SaveChangesAsync();

        lock (_lock)
        {
            _cache = null;
        }

        return await GetSettingsAsync();
    }

    public async Task<AdminSettingsDto> ResetSettingsAsync()
    {
        var now = DateTime.UtcNow;
        var all = await _db.SystemSettings.Where(s => !s.IsDeleted).ToListAsync();
        foreach (var s in all)
        {
            s.IsDeleted = true;
            s.UpdatedAt = now;
        }
        await _db.SaveChangesAsync();

        lock (_lock)
        {
            _cache = null;
        }

        return await GetSettingsAsync();
    }
}
