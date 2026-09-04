using AutoMapper;
using InternLink.Application.DTOs;
using InternLink.Domain.Entities;

namespace InternLink.Application.Mappings;

public class NotificationProfile : Profile
{
    public NotificationProfile()
    {
        CreateMap<Notification, NotificationDto>().MaxDepth(64);
    }
}
