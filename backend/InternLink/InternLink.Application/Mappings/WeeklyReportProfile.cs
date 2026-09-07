using AutoMapper;
using InternLink.Application.DTOs;
using InternLink.Domain.Entities;

namespace InternLink.Application.Mappings;

public class WeeklyReportProfile : Profile
{
    public WeeklyReportProfile()
    {
        CreateMap<WeeklyReport, WeeklyReportDto>().MaxDepth(64)
            .ForMember(d => d.Feedbacks, o => o.MapFrom(s => s.Feedbacks.Where(f => !f.IsDeleted)))
            .ForMember(d => d.Versions, o => o.MapFrom(s => s.Versions.OrderByDescending(v => v.Version)))
            .ForMember(d => d.DueDate, o => o.MapFrom(s => s.Internship.Semester != null && s.Internship.Semester.StartDate.HasValue
                ? s.Internship.Semester.StartDate.Value.Date.AddDays((s.WeekNumber * 7) - 1)
                : (DateTime?)null))
            .ForMember(d => d.Status, o => o.MapFrom(s => s.Status.ToString()));

        CreateMap<WeeklyReportVersion, WeeklyReportVersionDto>();
    }
}
