using AutoMapper;
using InternLink.Application.DTOs;
using InternLink.Domain.Entities;

namespace InternLink.Application.Mappings;

/// <summary>
/// AutoMapper profile for Company entity mappings
/// </summary>
public class CompanyProfile : Profile
{
    public CompanyProfile()
    {
        CreateMap<Company, CompanyDto>().MaxDepth(64);
        CreateMap<CreateCompanyRequest, Company>().MaxDepth(64);
        CreateMap<UpdateCompanyRequest, Company>().MaxDepth(64);
    }
}
