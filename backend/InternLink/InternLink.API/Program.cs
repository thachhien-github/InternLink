using InternLink.API.Extensions;
using InternLink.API.Filters;
using InternLink.API.Hubs;
using InternLink.Application;
using InternLink.Infrastructure;
using Microsoft.OpenApi;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .WriteTo.Console()
    .WriteTo.File("Logs/log-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

builder.Services.AddControllers();

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? Array.Empty<string>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        if (allowedOrigins.Length > 0)
        {
            policy.WithOrigins(allowedOrigins)
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        }
        else if (builder.Environment.IsDevelopment())
        {
            policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        }
        else
        {
            policy.WithOrigins(Array.Empty<string>())
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
    });
});

builder.Services.AddSignalR();
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddScoped<InternLink.Application.Interfaces.IRealtimeNotificationService, InternLink.Infrastructure.Services.RealtimeNotificationService<NotificationHub>>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddCustomHealthChecks();
builder.Services.AddSwaggerGen(c =>
{
    c.OperationFilter<FileUploadOperationFilter>();

    c.AddSecurityDefinition("bearer", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Description = "Paste JWT from /api/Auth/login. Example: eyJhbGciOi..."
    });

    c.AddSecurityRequirement(document => new OpenApiSecurityRequirement
    {
        [new OpenApiSecuritySchemeReference("bearer", document)] = []
    });
});

var app = builder.Build();

// Fail-fast validation: Ensure strong JWT Secret is configured
var jwtSecret = builder.Configuration["Jwt:Secret"];
if (string.IsNullOrWhiteSpace(jwtSecret) || jwtSecret.Length < 32)
{
    throw new InvalidOperationException(
        "Critical Security Error: 'Jwt:Secret' is missing, empty, or shorter than 32 characters. " +
        "Please configure a strong secret (>= 32 characters) via environment variable (Jwt__Secret), " +
        "User Secrets (dotnet user-secrets set \"Jwt:Secret\" \"<your-secret>\"), or appsettings.Development.json.");
}

app.UseApiExceptionHandler();
app.UseSerilogRequestLogging();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "InternLink API v1");
    c.RoutePrefix = "swagger";
});

// CORS must come before HTTPS redirection to avoid 307 on OPTIONS preflight
app.UseCors("Frontend");
// Skip HTTPS redirect in development to allow HTTP frontend → HTTP API calls
if (app.Environment.IsProduction())
{
    app.UseHttpsRedirection();
}
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<NotificationHub>("/hubs/notifications");
app.MapCustomHealthChecks();

await app.MigrateAndSeedDatabaseAsync();

app.Run();
