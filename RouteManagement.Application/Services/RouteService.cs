using RouteManagement.Application.DTOs.Route;
using RouteManagement.Application.Interfaces;

namespace RouteManagement.Application.Services
{
    public class RouteService(IRouteRepository routeRepository, IBookingClassRepository bookingClassRepository) : IRouteService
    {
        public async Task<IReadOnlyList<RouteDto>> GetAllAsync(CancellationToken cancellationToken)
        {
            var routes = await routeRepository.GetAllAsync(cancellationToken);
            return routes.Select(MapToDto).ToList();
        }

        public async Task<RouteDto> GetByIdAsync(int id, CancellationToken cancellationToken)
        {
            var route = await routeRepository.GetByIdAsync(id, cancellationToken)
                        ?? throw new KeyNotFoundException($"Route with id {id} was not found.");

            return MapToDto(route);
        }

        public async Task<RouteDto> CreateAsync(RouteFormDto dto, string createdBy, CancellationToken cancellationToken)
        {
            if (await routeRepository.ExistsAsync(dto.Origin, dto.Destination, cancellationToken))
                throw new InvalidOperationException($"A route from {dto.Origin} to {dto.Destination} already exists.");

            var bookingClasses = await bookingClassRepository.GetByIdsAsync(dto.BookingClassIds, cancellationToken);
            if (bookingClasses.Count != dto.BookingClassIds.Count)
                throw new ArgumentException("One or more booking class IDs are invalid.");

            var route = new Domain.Entities.Route
            {
                Origin = dto.Origin,
                Destination = dto.Destination,
                CreatedOn = DateTime.Now,
                CreatedBy = createdBy,
                RouteBookingClasses = dto.BookingClassIds.Select(id => new Domain.Entities.RouteBookingClass
                {
                    BookingClassId = id,
                    CreatedOn = DateTime.Now,
                    CreatedBy = createdBy
                }).ToList()
            };

            var created = await routeRepository.CreateAsync(route, cancellationToken);
            return MapToDto(created);
        }

        public async Task<RouteDto> UpdateAsync(int id, RouteFormDto dto, string updatedBy, CancellationToken cancellationToken)
        {
            var route = await routeRepository.GetByIdForUpdateAsync(id, cancellationToken)
                        ?? throw new KeyNotFoundException($"Route with id {id} was not found.");

            if (await routeRepository.ExistsAsync(dto.Origin, dto.Destination, id, cancellationToken))
                throw new InvalidOperationException($"A route from {dto.Origin} to {dto.Destination} already exists.");

            var bookingClasses = await bookingClassRepository.GetByIdsAsync(dto.BookingClassIds, cancellationToken);
            if (bookingClasses.Count != dto.BookingClassIds.Count)
                throw new ArgumentException("One or more booking class IDs are invalid.");

            route.Origin = dto.Origin;
            route.Destination = dto.Destination;
            route.UpdatedOn = DateTime.Now;
            route.UpdatedBy = updatedBy;

            foreach (var existing in route.RouteBookingClasses)
            {
                if (dto.BookingClassIds.Contains(existing.BookingClassId))
                {
                    existing.IsDeleted = false;
                    existing.DeletedOn = null;
                    existing.UpdatedOn = DateTime.Now;
                    existing.UpdatedBy = updatedBy;
                }
                else
                {
                    existing.IsDeleted = true;
                    existing.DeletedOn = DateTime.Now;
                    existing.UpdatedOn = DateTime.Now;
                    existing.UpdatedBy = updatedBy;
                }
            }

            var existingIds = route.RouteBookingClasses.Select(rbc => rbc.BookingClassId).ToList();
            foreach (var bcId in dto.BookingClassIds.Where(bcId => !existingIds.Contains(bcId)))
            {
                route.RouteBookingClasses.Add(new Domain.Entities.RouteBookingClass
                {
                    RouteId = route.Id,
                    BookingClassId = bcId,
                    CreatedOn = DateTime.Now,
                    CreatedBy = updatedBy
                });
            }

            await routeRepository.UpdateAsync(route, cancellationToken);
            return MapToDto(route);
        }

        public async Task DeleteAsync(int id, string deletedBy, CancellationToken cancellationToken)
        {
            var route = await routeRepository.GetByIdAsync(id, cancellationToken)
              ?? throw new KeyNotFoundException($"Route with id {id} was not found.");

            route.IsDeleted = true;
            route.DeletedOn = DateTime.Now;
            route.UpdatedOn = DateTime.Now;
            route.UpdatedBy = deletedBy;

            await routeRepository.UpdateAsync(route, cancellationToken);
        }

        private static RouteDto MapToDto(Domain.Entities.Route route)
        {
            return new RouteDto
            {
                Id = route.Id,
                Origin = route.Origin,
                Destination = route.Destination,
                BookingClassIds = route.RouteBookingClasses.Select(rbc => rbc.BookingClassId).ToList()
            };
        }

    }
}
