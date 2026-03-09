# Route Fare Management Platform

A full-stack platform (Angular + .NET) that allows:
- Administrators to manage routes, seasons, tour operators, and pricing.
- Tour operator users to configure their classes, routes, and seasonal fares.
- Both roles to export pricing data with real-time progress tracking.

---

## Tech Stack

**Backend**
- .NET 10, ASP.NET Core Web API
- Clean Architecture (Domain, Application, Infrastructure, API layers)
- Entity Framework Core + SQL Server
- ASP.NET Core Identity + JWT Authentication
- SignalR (real-time export progress)
- Serilog logging
- EPPlus (Excel export)

**Frontend**
- Angular 21
- NgRx (state management)
- Angular Material UI
- SignalR client (`@microsoft/signalr`)

**Infrastructure**
- Docker + Docker Compose
- SQL Server 2022
- Seq (structured log viewer)
- Nginx (reverse proxy for Angular in production)

---

## Running with Docker (Recommended)

The easiest way to run the application. Requires only [Docker Desktop](https://www.docker.com/products/docker-desktop/).

```bash
git clone https://github.com/edisanushi/route-management.git
cd RouteManagement
docker-compose up --build
```

Once all containers are healthy, open:

| Service | URL |
|---|---|
| Application | http://localhost:4200 |
| API (Swagger) | http://localhost:8080/swagger |
| Seq (logs) | http://localhost:5341 |

> **Note:** In the first run the database initializes. The API will automatically apply migrations and seed initial data.

### Default Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@example.com | Admin123! |

The admin account is seeded automatically on first run. Tour operator accounts are created by the admin through the application.

### Stopping the Application

```bash
docker-compose down
```

To also remove all data volumes (full reset):

```bash
docker-compose down -v
```

---

## Running Locally (Without Docker)

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 22+](https://nodejs.org/)
- [SQL Server](https://www.microsoft.com/en-us/sql-server) or SQL Server LocalDB
- [Seq](https://datalust.co/seq) (optional, for structured log viewing)

### Backend

1. Update the connection string in `RouteManagement.API/appsettings.json` if needed (defaults to LocalDB):
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=RouteManagementDb;Integrated Security=True;TrustServerCertificate=True;"
   }
   ```

2. Add a JWT secret key in `appsettings.json` or user secrets:
   ```json
   "JwtSettings": {
     "SecretKey": "your-secret-key-at-least-32-characters-long"
   }
   ```

3. Run the API:
   ```bash
   cd RouteManagement.API
   dotnet run
   ```
   
   The API will start at `https://localhost:7072`. Migrations and seeding run automatically on startup.

  

### Frontend

```bash
cd route-management-client
npm install
ng serve
```

The application will be available at `http://localhost:4200`.

---

## Project Structure

```
RouteManagement/
├── RouteManagement.Domain/          # Entities, enumns, domain constants
├── RouteManagement.Application/     # Interfaces, DTOs, service contracts
├── RouteManagement.Infrastructure/  # EF Core, repositories, services, identity
├── RouteManagement.API/             # Controllers, middleware, hubs
├── route-management-client/         # Angular 21 frontend
├── docker-compose.yml
└── README.md
```

---

## Architecture

The backend follows **Clean Architecture** with strict layer separation:

- **Domain** — core entities (`TourOperator`, `Route`, `Season`, `Pricing`, etc.), no external dependencies
- **Application** — interfaces and DTOs; defines contracts that Infrastructure implements
- **Infrastructure** — EF Core `DbContext`, repository implementations, Identity, JWT, Excel export
- **API** — ASP.NET Core controllers, SignalR hubs, global exception middleware

All entities use **soft deletes** (`IsDeleted` flag) and **audit fields** (`CreatedAt`, `CreatedBy`, `ModifiedAt`, `ModifiedBy`).

The frontend follows a **feature module structure**, using NgRx for state management across all features.

---

## Features by Role

### Admin
- Manage **routes** (origin/destination, booking class assignments)
- Manage **seasons** (Summer/Winter, year, date range)
- Manage **tour operators** (create accounts, update or delete them)
- View pricing tables for any tour operator
- Export pricing data to Excel for any route-season assignment

### Tour Operator
- View and update own profile
- Configure **booking classes** they support (select from available classes)
- Configure **route-season assignments** (select which routes and seasons to operate)
- Manage **pricing** — set price and seat allocation per booking class, per day, across a season
- Use **bulk fill** to apply pricing by booking class, date range, or day of week
- Export own pricing data to Excel

---

## API Reference

All endpoints require a `Bearer` JWT token in the `Authorization` header. The full interactive API documentation is available at `/swagger` when the application is running.

### Authentication — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Login and receive JWT token |

### Booking Classes — `/api/bookingclasses`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/bookingclasses` | Any | Get all booking classes |

### Routes — `/api/routes`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/routes` | Any | Get all routes |
| GET | `/api/routes/{id}` | Any | Get route by ID |
| POST | `/api/routes` | Admin | Create a route |
| PUT | `/api/routes/{id}` | Admin | Update a route |
| DELETE | `/api/routes/{id}` | Admin | Soft delete a route |

### Seasons — `/api/seasons`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/seasons` | Any | Get all seasons |
| GET | `/api/seasons/{id}` | Any | Get season by ID |
| POST | `/api/seasons` | Admin | Create a season |
| PUT | `/api/seasons/{id}` | Admin | Update a season |
| DELETE | `/api/seasons/{id}` | Admin | Soft delete a season |

### Tour Operators — `/api/touroperators`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/touroperators` | Admin | Get all tour operators |
| GET | `/api/touroperators/{id}` | Admin | Get tour operator by ID |
| GET | `/api/touroperators/me` | Tour Operator | Get own profile |
| POST | `/api/touroperators` | Admin | Create a tour operator |
| PUT | `/api/touroperators/{id}` | Admin | Update tour operator (all fields) |
| PUT | `/api/touroperators/{id}/profile` | Tour Operator | Update own contact details |
| DELETE | `/api/touroperators/{id}` | Admin | Soft delete a tour operator |
| GET | `/api/touroperators/{id}/bookingclasses` | Tour Operator | Get assigned booking class IDs |
| PUT | `/api/touroperators/{id}/bookingclasses` | Tour Operator | Update booking class assignments |
| GET | `/api/touroperators/{id}/seasons/{seasonId}/routes` | Tour Operator | Get assigned route IDs for a season |
| PUT | `/api/touroperators/{id}/seasons/{seasonId}/routes` | Tour Operator | Update route assignments for a season |
| GET | `/api/touroperators/{id}/routes/{routeId}/seasons` | Tour Operator | Get assigned season IDs for a route |
| PUT | `/api/touroperators/{id}/routes/{routeId}/seasons` | Tour Operator | Update season assignments for a route |

### Pricing — `/api/pricing`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/pricing/assigned-routes` | Tour Operator | Get own route-season assignments |
| GET | `/api/pricing/assigned-routes/{tourOperatorId}` | Admin | Get assignments for a specific operator |
| GET | `/api/pricing/{operatorSeasonRouteId}` | Any | Get pricing table for a route-season assignment |
| PUT | `/api/pricing/{operatorSeasonRouteId}` | Tour Operator | Save pricing table (upsert all entries) |

### Export — `/api/export`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/export/pricing/{operatorSeasonRouteId}?connectionId={id}` | Any | Export pricing data to Excel with real-time SignalR progress |

### Real-time Hub

| Hub | Endpoint | Description |
|---|---|---|
| ExportHub | `/hubs/export` | SignalR hub for Excel export progress updates |

---

## Error Handling

All API errors follow a consistent response format:

```json
{
  "status": 404,
  "message": "Tour operator not found.",
  "traceId": "00-abc123..."
}
```

Handled globally via `GlobalExceptionMiddleware`. Validation errors return `400` with field-level details.

---

## Logging

Structured logging via Serilog with three sinks:
- **Console** — for Docker/terminal output
- **Rolling file** — `logs/routemanagement-{date}.txt`
- **Seq** — structured log viewer at `http://localhost:5341` (admin / `Admin_2026!` in Docker)

---

## Design Decisions

- **Soft deletes** are used across all entities to preserve historical pricing data integrity.
- **Secrets in `docker-compose.yml`** are included for evaluation convenience. In a production environment these would be managed via environment-specific secret management (e.g. Azure Key Vault, Docker Secrets, or CI/CD environment variables).