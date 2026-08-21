using System.Text.Json;
using InternLink.API.Health;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace InternLink.API.Extensions;

public static class HealthCheckExtensions
{
    public static IServiceCollection AddCustomHealthChecks(this IServiceCollection services)
    {
        services.AddHealthChecks()
            .AddCheck<DatabaseHealthCheck>(
                name: "sqlserver",
                failureStatus: HealthStatus.Unhealthy,
                tags: new[] { "db", "ready" });

        return services;
    }

    public static WebApplication MapCustomHealthChecks(this WebApplication app)
    {
        var jsonOptions = new HealthCheckOptions
        {
            ResponseWriter = WriteJsonResponse
        };

        // Full health status endpoint (summary + all components)
        app.MapHealthChecks("/health", jsonOptions);

        // Liveness probe (Kubernetes / Docker: Is the API container alive?)
        app.MapHealthChecks("/health/live", new HealthCheckOptions
        {
            Predicate = _ => false, // Only checks process responsiveness, does not query external dependencies
            ResponseWriter = WriteJsonResponse
        });

        // Readiness probe (Kubernetes / Docker: Is the system ready to serve traffic including DB?)
        app.MapHealthChecks("/health/ready", new HealthCheckOptions
        {
            Predicate = check => check.Tags.Contains("ready"),
            ResponseWriter = WriteJsonResponse
        });

        return app;
    }

    private static async Task WriteJsonResponse(HttpContext context, HealthReport report)
    {
        context.Response.ContentType = "application/json; charset=utf-8";

        var response = new
        {
            status = report.Status.ToString(),
            totalDurationMs = report.TotalDuration.TotalMilliseconds,
            timestampUtc = DateTime.UtcNow,
            entries = report.Entries.Select(e => new
            {
                name = e.Key,
                status = e.Value.Status.ToString(),
                description = e.Value.Description,
                durationMs = e.Value.Duration.TotalMilliseconds,
                data = e.Value.Data,
                error = e.Value.Exception?.Message
            })
        };

        var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            WriteIndented = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(json);
    }
}
