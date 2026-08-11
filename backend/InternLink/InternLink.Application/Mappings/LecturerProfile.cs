using AutoMapper;
using InternLink.Application.DTOs;
using InternLink.Domain.Entities;

namespace InternLink.Application.Mappings;

public class LecturerProfile : Profile
{
    public LecturerProfile()
    {
        CreateMap<Lecturer, LecturerDto>();
        CreateMap<CreateLecturerRequest, Lecturer>()
            .ForMember(d => d.Id, o => o.Ignore())
            .ForMember(d => d.User, o => o.Ignore())
            .ForMember(d => d.Internships, o => o.Ignore())
            .ForMember(d => d.CreatedAt, o => o.Ignore())
            .ForMember(d => d.UpdatedAt, o => o.Ignore())
            .ForMember(d => d.IsDeleted, o => o.Ignore())
            .ForMember(d => d.CreatedBy, o => o.Ignore())
            .ForMember(d => d.UpdatedBy, o => o.Ignore());

        CreateMap<Student, StudentSummaryDto>();
        CreateMap<Company, CompanySummaryDto>();

        CreateMap<Internship, InternshipDto>()
            .ForMember(d => d.Status, o => o.MapFrom(s => s.Status.ToString()));

        CreateMap<Internship, InternshipDetailDto>()
            .IncludeBase<Internship, InternshipDto>();
    }
}
