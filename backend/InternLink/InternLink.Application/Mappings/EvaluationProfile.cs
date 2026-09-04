using AutoMapper;
using InternLink.Application.DTOs;
using InternLink.Domain.Entities;

namespace InternLink.Application.Mappings;

public class EvaluationProfile : Profile
{
    public EvaluationProfile()
    {
        CreateMap<Evaluation, EvaluationListItemDto>().MaxDepth(64)
            .ForMember(dest => dest.StudentName, opt => opt.MapFrom(src => src.Internship.Student.FullName))
            .ForMember(dest => dest.CompanyName, opt => opt.MapFrom(src => src.Internship.Company.CompanyName))
            .ForMember(dest => dest.EvaluatedBy, opt => opt.MapFrom(src => src.EvaluatedBy));

        CreateMap<Evaluation, EvaluationDetailDto>().MaxDepth(64)
            .ForMember(dest => dest.EvaluatedBy, opt => opt.MapFrom(src => src.EvaluatedBy));

        CreateMap<Evaluation, EvaluationScoresSummaryDto>().MaxDepth(64);

        CreateMap<CreateEvaluationRequest, Evaluation>().MaxDepth(64)
            .ForMember(dest => dest.Id, opt => opt.MapFrom(_ => Guid.NewGuid()))
            .ForMember(dest => dest.EvaluatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow));

        CreateMap<UpdateEvaluationRequest, Evaluation>().MaxDepth(64)
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
}
