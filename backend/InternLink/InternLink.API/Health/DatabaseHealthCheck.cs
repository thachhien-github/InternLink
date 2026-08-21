using System.Diagnostics;
using InternLink.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace InternLink.API.Health;

/// <summary>
/// Health check implementation verifying active connectivity to the SQL Server database.
/// </summary>
public class DatabaseHealthCheck : IHealthCheck
{
    private readonly AppDbContext _dbContext;
    private readonly ILogger<DatabaseHealthCheck> _logger;

    public DatabaseHealthCheck(AppDbContext dbContext, ILogger<DatabaseHealthCheck> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        var stopwatch = Stopwatch.StartNew();

        try
        {
            // Verify actual database connectivity
            var canConnect = await _dbContext.Database.CanConnectAsync(cancellationToken);
            stopwatch.Stop();

            if (!canConnect)
            {
                _logger.LogWarning("Health Check: Unable to establish connection with SQL Server. Latency: {LatencyMs}ms", stopwatch.ElapsedMilliseconds);
                return HealthCheckResult.Unhealthy(
                    description: "Cannot connect to SQL Server database.",
                    data: new Dictionary<string, object>
                    {
                        ["latency_ms"] = stopwatch.ElapsedMilliseconds,
                        ["provider"] = _dbContext.Database.ProviderName ?? "Unknown"
                    });
            }

            return HealthCheckResult.Healthy(
                description: "SQL Server connection is active and responsive.",
                data: new Dictionary<string, object>
                {
                    ["latency_ms"] = stopwatch.ElapsedMilliseconds,
                    ["provider"] = _dbContext.Database.ProviderName ?? "Unknown"
                });
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            _logger.LogError(ex, "Health Check: Exception occurred while checking SQL Server health. Latency: {LatencyMs}ms", stopwatch.ElapsedMilliseconds);

            return HealthCheckResult.Unhealthy(
                description: $"SQL Server health check threw an exception: {ex.Message}",
                exception: ex,
                data: new Dictionary<string, object>
                {
                    ["latency_ms"] = stopwatch.ElapsedMilliseconds,
                    ["error"] = ex.Message
                });
        }
    }
}
