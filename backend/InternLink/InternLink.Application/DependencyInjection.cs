using System.Reflection;
using AutoMapper;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.Extensions.DependencyInjection;

namespace InternLink.Application;

public static class DependencyInjection
{
    /// <summary>
    /// Registers Application layer services: AutoMapper, FluentValidation and application services.
    /// </summary>
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // Recursion guard for GHSA-rvv3-g6hj-g44x (CVE-2026-32933): AutoMapper < 15 has
        // no default MaxDepth, which is the DoS vector of that advisory. Every map in the
        // Mapping profiles is registered with .MaxDepth(64) (see Mappings/*.cs) to cap
        // recursion depth, so upgrading to the paid AutoMapper 15+ is not required.
        services.AddAutoMapper(cfg => { }, Assembly.GetExecutingAssembly());

        services.AddFluentValidationAutoValidation();
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        return services;
    }
}
