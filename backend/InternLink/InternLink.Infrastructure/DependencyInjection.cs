using System.Text;
using InternLink.Infrastructure.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace InternLink.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // DbContext
        var connection = configuration.GetConnectionString("DefaultConnection");
        services.AddDbContext<Persistence.AppDbContext>(options =>
            options.UseSqlServer(connection));

        // Jwt settings
        var jwtSection = configuration.GetSection("Jwt");
        services.Configure<JwtSettings>(jwtSection);
        var jwtSettings = jwtSection.Get<JwtSettings>() ?? new JwtSettings();

        // Authentication
        var key = Encoding.UTF8.GetBytes(jwtSettings.Secret ?? string.Empty);
        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.RequireHttpsMetadata = true;
            options.SaveToken = true;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtSettings.Issuer,
                ValidAudience = jwtSettings.Audience,
                IssuerSigningKey = new SymmetricSecurityKey(key)
            };
        });

        // JwtService (interface moved to Shared project)
        services.AddScoped<InternLink.Shared.Interfaces.IJwtService, Identity.JwtService>();

        // Password hasher for User
        services.AddScoped<Microsoft.AspNetCore.Identity.PasswordHasher<InternLink.Domain.Entities.User>>();

        // Auth service
        services.AddScoped<InternLink.Application.Interfaces.IAuthService, InternLink.Infrastructure.Services.AuthService>();

        // Lecturer workflow service
        services.AddScoped<InternLink.Application.Interfaces.ILecturerService, InternLink.Infrastructure.Services.LecturerService>();

        // Lecturer profile CRUD / import / overview
        services.AddScoped<InternLink.Application.Interfaces.ILecturerProfileService, InternLink.Infrastructure.Services.LecturerProfileService>();

        // Student management service
        services.AddScoped<InternLink.Application.Interfaces.IStudentService, InternLink.Infrastructure.Services.StudentService>();

        // Company management service
        services.AddScoped<InternLink.Application.Interfaces.ICompanyService, InternLink.Infrastructure.Services.CompanyService>();

        // Internship management service
        services.AddScoped<InternLink.Application.Interfaces.IInternshipService, InternLink.Infrastructure.Services.InternshipService>();

        // Document management service
        services.AddScoped<InternLink.Application.Interfaces.IDocumentService, InternLink.Infrastructure.Services.DocumentService>();

        // Evaluation and grading service
        services.AddScoped<InternLink.Application.Interfaces.IEvaluationService, InternLink.Infrastructure.Services.EvaluationService>();

        // Submission and feedback service
        services.AddScoped<InternLink.Application.Interfaces.ISubmissionService, InternLink.Infrastructure.Services.SubmissionService>();

        // Weekly report service
        services.AddScoped<InternLink.Application.Interfaces.IWeeklyReportService, InternLink.Infrastructure.Services.WeeklyReportService>();

        // Notification service
        services.AddScoped<InternLink.Application.Interfaces.INotificationService, InternLink.Infrastructure.Services.NotificationService>();

        // Authorization policies for roles
        services.AddAuthorization(options =>
        {
            options.AddPolicy("RequireSuperAdmin", p => p.RequireRole("SuperAdmin"));
            options.AddPolicy("RequireLecturer", p => p.RequireRole("Lecturer"));
            options.AddPolicy("RequireStudent", p => p.RequireRole("Student"));
        });

        return services;
    }
}
