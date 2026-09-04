using AutoMapper;
using InternLink.Application.DTOs;
using InternLink.Domain.Entities;

namespace InternLink.Application.Mappings;

public class AuthProfile : Profile
{
    public AuthProfile()
    {
        CreateMap<User, CurrentUserResponse>().MaxDepth(64)
            .ForMember(d => d.Role, o => o.MapFrom(s => s.Role.ToString()));
    }
}
