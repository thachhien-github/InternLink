using AutoMapper;
using InternLink.Application.DTOs;
using InternLink.Domain.Entities;

namespace InternLink.Application.Mappings;

public class DocumentProfile : Profile
{
    public DocumentProfile()
    {
        CreateMap<Document, DocumentListItemDto>()
            .ForMember(dest => dest.UploadedBy, opt => opt.MapFrom(src => MapUploadedBy(src.UploadedBy)));

        CreateMap<Document, DocumentDetailDto>()
            .ForMember(dest => dest.UploadedBy, opt => opt.MapFrom(src => MapUploadedBy(src.UploadedBy)));

        CreateMap<CreateDocumentRequest, Document>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(_ => Guid.NewGuid()))
            .ForMember(dest => dest.UploadedAt, opt => opt.MapFrom(_ => DateTime.UtcNow))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow));

        CreateMap<UpdateDocumentRequest, Document>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }

    private static UserSummaryDto? MapUploadedBy(Lecturer? lecturer)
    {
        if (lecturer == null)
            return null;

        return new UserSummaryDto
        {
            Id = lecturer.Id,
            FullName = lecturer.FullName,
            Email = lecturer.Email
        };
    }
}
