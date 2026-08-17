using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using InternLink.Application.DTOs;

namespace InternLink.Application.Interfaces;

public interface ISemesterService
{
    Task<IEnumerable<SemesterDto>> GetAllSemestersAsync();
    Task<SemesterDto?> GetSemesterByIdAsync(Guid id);
    Task<SemesterDto> CreateSemesterAsync(CreateSemesterDto dto);
    Task<SemesterDto?> UpdateSemesterAsync(Guid id, UpdateSemesterDto dto);
    Task<bool> CloseSemesterAsync(Guid id);
    Task<bool> DeleteSemesterAsync(Guid id);
}
