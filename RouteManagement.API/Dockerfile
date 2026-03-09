FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["RouteManagement.API/RouteManagement.API.csproj", "RouteManagement.API/"]
COPY ["RouteManagement.Application/RouteManagement.Application.csproj", "RouteManagement.Application/"]
COPY ["RouteManagement.Domain/RouteManagement.Domain.csproj", "RouteManagement.Domain/"]
COPY ["RouteManagement.Infrastructure/RouteManagement.Infrastructure.csproj", "RouteManagement.Infrastructure/"]
RUN dotnet restore "RouteManagement.API/RouteManagement.API.csproj"
COPY . .
WORKDIR "/src/RouteManagement.API"
RUN dotnet build "RouteManagement.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "RouteManagement.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "RouteManagement.API.dll"]