using Microsoft.AspNetCore.Http;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace InternLink.API.Filters;

/// <summary>
/// Ensures endpoints that accept <see cref="IFormFile"/> are documented as multipart/form-data uploads.
/// </summary>
public sealed class FileUploadOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        var hasFile = context.ApiDescription.ParameterDescriptions
            .Any(p => p.Type == typeof(IFormFile) || p.Type == typeof(IFormFile[]));

        if (!hasFile)
            return;

        var content = new Dictionary<string, OpenApiMediaType>
        {
            ["multipart/form-data"] = new OpenApiMediaType
            {
                Schema = new OpenApiSchema
                {
                    Type = JsonSchemaType.Object
                }
            }
        };

        // Microsoft.OpenApi v2 exposes IOpenApiRequestBody with read-only Content/Required;
        // replace the concrete RequestBody instead of mutating interface setters.
        operation.RequestBody = new OpenApiRequestBody
        {
            Required = true,
            Content = content
        };
    }
}
