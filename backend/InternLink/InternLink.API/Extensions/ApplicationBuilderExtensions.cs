using InternLink.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace InternLink.API.Extensions;

public static class ApplicationBuilderExtensions
{
    public static async Task MigrateAndSeedDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var services = scope.ServiceProvider;
        var logger = services.GetRequiredService<ILogger<WebApplication>>();

        try
        {
            logger.LogInformation("Applying database migrations and seeding initial data...");
            var context = services.GetRequiredService<AppDbContext>();
            await context.Database.MigrateAsync();
            await SeedData.InitializeAsync(context);
            logger.LogInformation("Database migration and initialization completed successfully.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while migrating or seeding the database: {Message}", ex.Message);
        }
    }
}
