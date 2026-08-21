FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Disable telemetry and optimize network restore
ENV DOTNET_CLI_TELEMETRY_OPTOUT=1
ENV DOTNET_SKIP_FIRST_TIME_EXPERIENCE=1

# Copy project files
COPY ["InternLink.API/InternLink.API.csproj", "InternLink.API/"]
COPY ["InternLink.Application/InternLink.Application.csproj", "InternLink.Application/"]
COPY ["InternLink.Domain/InternLink.Domain.csproj", "InternLink.Domain/"]
COPY ["InternLink.Infrastructure/InternLink.Infrastructure.csproj", "InternLink.Infrastructure/"]
COPY ["InternLink.Shared/InternLink.Shared.csproj", "InternLink.Shared/"]

# Restore with explicit NuGet source
RUN dotnet restore "InternLink.API/InternLink.API.csproj" --source https://api.nuget.org/v3/index.json

# Copy all code and build
COPY . .
WORKDIR "/src/InternLink.API"
RUN dotnet publish "InternLink.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Install curl for container healthcheck probes
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

# Create uploads directory
RUN mkdir -p /app/uploads/documents

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "InternLink.API.dll"]
