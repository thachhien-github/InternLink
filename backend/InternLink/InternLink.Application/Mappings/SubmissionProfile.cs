using AutoMapper;
using InternLink.Application.DTOs;
using InternLink.Domain.Entities;

namespace InternLink.Application.Mappings;

public class SubmissionProfile : Profile
{
    public SubmissionProfile()
    {
        CreateMap<Feedback, FeedbackDto>().MaxDepth(64)
            .ForMember(d => d.LecturerName, o => o.MapFrom(s => s.Lecturer != null ? s.Lecturer.FullName : null));

        CreateMap<Submission, SubmissionDto>().MaxDepth(64)
            .ForMember(d => d.Type, o => o.MapFrom(s => s.Type.ToString()))
            .ForMember(d => d.Status, o => o.MapFrom(s => s.Status.ToString()))
            .ForMember(d => d.Feedbacks, o => o.MapFrom(s => s.Feedbacks.Where(f => !f.IsDeleted)));
    }
}
