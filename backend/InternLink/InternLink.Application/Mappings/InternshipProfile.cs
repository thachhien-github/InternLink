using AutoMapper;
using InternLink.Application.DTOs;
using InternLink.Domain.Entities;

namespace InternLink.Application.Mappings;

/// <summary>
/// AutoMapper profile for Internship entity mappings
/// </summary>
public class InternshipProfile : Profile
{
    public InternshipProfile()
    {
        CreateMap<Internship, InternshipDetailFullDto>().MaxDepth(64)
            .ForMember(d => d.Status, o => o.MapFrom(s => s.Status.ToString()));

        CreateMap<Internship, InternshipListItemDto>().MaxDepth(64)
            .ForMember(d => d.StudentName, o => o.MapFrom(s => s.Student.FullName))
            .ForMember(d => d.CompanyName, o => o.MapFrom(s => s.Company.CompanyName))
            .ForMember(d => d.Status, o => o.MapFrom(s => s.Status.ToString()))
            .ForMember(d => d.SubmissionCount, o => o.MapFrom(s => s.Submissions.Count));

        CreateMap<CreateInternshipRequest, Internship>().MaxDepth(64);
        CreateMap<UpdateInternshipRequest, Internship>().MaxDepth(64);
    }
}
