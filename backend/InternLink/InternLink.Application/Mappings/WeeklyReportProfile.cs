using AutoMapper;
using InternLink.Application.DTOs;
using InternLink.Domain.Entities;

namespace InternLink.Application.Mappings;

public class WeeklyReportProfile : Profile
{
    public WeeklyReportProfile()
    {
        CreateMap<WeeklyReport, WeeklyReportDto>()
            .ForMember(d => d.Status, o => o.MapFrom(s => s.Status.ToString()));
    }
}
