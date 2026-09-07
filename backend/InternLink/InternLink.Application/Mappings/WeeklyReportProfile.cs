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
            .ForMember(d => d.Status, o => o.MapFrom(s => s.Status.ToString()));
    }
}
