# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["NVHome.API/NVHome.API.csproj", "NVHome.API/"]
COPY ["NVHome.Application/NVHome.Application.csproj", "NVHome.Application/"]
COPY ["NVHome.Domain/NVHome.Domain.csproj", "NVHome.Domain/"]
COPY ["NVHome.Infrastructure/NVHome.Infrastructure.csproj", "NVHome.Infrastructure/"]

RUN dotnet restore "NVHome.API/NVHome.API.csproj"

# Copy the rest of the code and build
COPY . .
WORKDIR "/src/NVHome.API"
RUN dotnet build "NVHome.API.csproj" -c Release -o /app/build

# Stage 2: Publish
FROM build AS publish
RUN dotnet publish "NVHome.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 3: Final Runtime Image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

# Install fonts for ImageSharp.Drawing
RUN apt-get update && apt-get install -y --no-install-recommends fonts-dejavu-core && rm -rf /var/lib/apt/lists/*

COPY --from=publish /app/publish .

# Environment variables
ENV ASPNETCORE_URLS=http://+:5232
EXPOSE 5232

ENTRYPOINT ["dotnet", "NVHome.API.dll"]
