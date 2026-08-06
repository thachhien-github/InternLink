using System.Reflection;
// using Microsoft.OpenApi.Models; (disabled due to environment package resolution)
using Serilog;
using InternLink.API.Extensions;
using InternLink.Application;
using InternLink.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .WriteTo.Console()
    .WriteTo.File("Logs/log-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container.
builder.Services.AddControllers();

// Application & Infrastructure layers
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

// Basic Swagger registration. JWT security UI will be enabled once package resolution is confirmed.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Middleware
app.UseApiExceptionHandler();
app.UseSerilogRequestLogging();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || app.Environment.IsStaging() || app.Environment.IsEnvironment("Local"))
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "InternLink API v1"));
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
