using Microsoft.AspNetCore.Builder;
using InternLink.API.Middlewares;

namespace InternLink.API.Extensions;

public static class ExceptionMiddlewareExtensions
{
    public static IApplicationBuilder UseApiExceptionHandler(this IApplicationBuilder app)
    {
        return app.UseMiddleware<ExceptionMiddleware>();
    }
}
