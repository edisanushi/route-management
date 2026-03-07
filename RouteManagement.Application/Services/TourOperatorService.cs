using RouteManagement.Application.DTOs.TourOperator;
using RouteManagement.Application.Interfaces;
using RouteManagement.Domain.Common;
using RouteManagement.Domain.Entities;

namespace RouteManagement.Application.Services
{
    public class TourOperatorService(ITourOperatorRepository tourOperatorRepository, IIdentityService identityService) : ITourOperatorService
    {
        public async Task<TourOperatorDto> CreateAsync(TourOperatorFormDto dto, string createdBy, CancellationToken cancellationToken)
        {
            if (await tourOperatorRepository.ExistsAsync(dto.Name, cancellationToken))
                throw new InvalidOperationException($"A tour operator with name '{dto.Name}' already exists.");

            var (succeeded, errors) = await identityService.CreateUserAsync(dto.Email, dto.Password, Roles.TourOperatorMember, createdBy);
            if (!succeeded)
                throw new InvalidOperationException(string.Join(", ", errors));

            var userId = await identityService.GetUserIdByEmailAsync(dto.Email);

            var tourOperator = new TourOperator
            {
                Name = dto.Name,
                UserId = userId,
                ContactPerson = dto.ContactPerson,
                ContactEmail = dto.ContactEmail,
                PhoneNumber = dto.PhoneNumber,
                CreatedOn = DateTime.Now,
                CreatedBy = createdBy
            };

            var created = await tourOperatorRepository.CreateAsync(tourOperator, cancellationToken);
            return MapToDto(created, dto.Email);
        }


        public async Task<IReadOnlyList<TourOperatorDto>> GetAllAsync(CancellationToken cancellationToken)
        {
            var results = await tourOperatorRepository.GetAllWithEmailsAsync(cancellationToken);
            return results.Select(r => MapToDto(r.Operator, r.Email)).ToList();
        }


        public async Task<TourOperatorDto> GetByIdAsync(int id, CancellationToken cancellationToken)
        {
            var tourOperator = await tourOperatorRepository.GetByIdAsync(id, cancellationToken)
                               ?? throw new KeyNotFoundException($"Tour operator with id {id} was not found.");

            var email = tourOperator.UserId != null ? await identityService.GetEmailByUserIdAsync(tourOperator.UserId) : null;
            
            return MapToDto(tourOperator, email);
        }


        public async Task<TourOperatorDto> GetByUserIdAsync(string userId, CancellationToken cancellationToken)
        {
            var tourOperator = await tourOperatorRepository.GetByUserIdAsync(userId, cancellationToken)
                               ?? throw new KeyNotFoundException($"Tour operator for user {userId} was not found.");

            var email = await identityService.GetEmailByUserIdAsync(userId);
            
            return MapToDto(tourOperator, email);
        }


        public async Task<TourOperatorDto> UpdateAsync(int id, TourOperatorUpdateDto dto, string updatedBy, CancellationToken cancellationToken)
        {
            var tourOperator = await tourOperatorRepository.GetByIdAsync(id, cancellationToken)
                               ?? throw new KeyNotFoundException($"Tour operator with id {id} was not found.");

            if (await tourOperatorRepository.ExistsAsync(dto.Name, id, cancellationToken))
                throw new InvalidOperationException($"A tour operator with name '{dto.Name}' already exists.");

            tourOperator.Name = dto.Name;
            tourOperator.ContactPerson = dto.ContactPerson;
            tourOperator.ContactEmail = dto.ContactEmail;
            tourOperator.PhoneNumber = dto.PhoneNumber;
            tourOperator.UpdatedOn = DateTime.Now;
            tourOperator.UpdatedBy = updatedBy;

            await tourOperatorRepository.UpdateAsync(tourOperator, cancellationToken);

            var email = tourOperator.UserId != null ? await identityService.GetEmailByUserIdAsync(tourOperator.UserId) : null;
            
            return MapToDto(tourOperator, email);
        }


        public async Task<TourOperatorDto> UpdateProfileAsync(int id, TourOperatorProfileDto dto, string userId, CancellationToken cancellationToken)
        {
            var tourOperator = await tourOperatorRepository.GetByIdAsync(id, cancellationToken)
                               ?? throw new KeyNotFoundException($"Tour operator with id {id} was not found.");

            if (tourOperator.UserId != userId)
                throw new UnauthorizedAccessException("You can only edit your own profile.");

            tourOperator.ContactPerson = dto.ContactPerson;
            tourOperator.ContactEmail = dto.ContactEmail;
            tourOperator.PhoneNumber = dto.PhoneNumber;
            tourOperator.UpdatedOn = DateTime.Now;
            tourOperator.UpdatedBy = userId;

            await tourOperatorRepository.UpdateAsync(tourOperator, cancellationToken);

            var email = await identityService.GetEmailByUserIdAsync(userId);
            
            return MapToDto(tourOperator, email);
        }


        public async Task DeleteAsync(int id, string deletedBy, CancellationToken cancellationToken)
        {
            var tourOperator = await tourOperatorRepository.GetByIdAsync(id, cancellationToken)
                               ?? throw new KeyNotFoundException($"Tour operator with id {id} was not found.");

            tourOperator.IsDeleted = true;
            tourOperator.DeletedOn = DateTime.Now;
            tourOperator.UpdatedOn = DateTime.Now;
            tourOperator.UpdatedBy = deletedBy;

            await tourOperatorRepository.UpdateAsync(tourOperator, cancellationToken);
        }


        public async Task<List<int>> GetBookingClassIdsAsync(int tourOperatorId, CancellationToken cancellationToken)
        {
            var records = await tourOperatorRepository.GetBookingClassesByTourOperatorIdAsync(tourOperatorId, cancellationToken);
            return records.Where(r => !r.IsDeleted).Select(r => r.BookingClassId).ToList();
        }


        public async Task UpdateBookingClassesAsync(int tourOperatorId, List<int> bookingClassIds, string updatedBy, CancellationToken cancellationToken)
        {
            var existing = await tourOperatorRepository.GetBookingClassesByTourOperatorIdAsync(tourOperatorId, cancellationToken);
            var existingIds = existing.Select(r => r.BookingClassId).ToList();

            foreach (var record in existing)
            {
                record.IsDeleted = !bookingClassIds.Contains(record.BookingClassId);
                record.DeletedOn = record.IsDeleted ? DateTime.Now : null;
                record.UpdatedOn = DateTime.Now;
                record.UpdatedBy = updatedBy;
            }

            var toAdd = bookingClassIds
                .Where(id => !existingIds.Contains(id))
                .Select(id => new TourOperatorBookingClass
                {
                    TourOperatorId = tourOperatorId,
                    BookingClassId = id,
                    CreatedOn = DateTime.Now,
                    CreatedBy = updatedBy
                }).ToList();

            await tourOperatorRepository.UpdateBookingClassesAsync(existing, toAdd, cancellationToken);
        }


        public async Task<List<int>> GetSeasonRouteIdsAsync(int tourOperatorId, int seasonId, CancellationToken cancellationToken)
        {
            var records = await tourOperatorRepository.GetSeasonRoutesByOperatorAndSeasonAsync(tourOperatorId, seasonId, cancellationToken);
            return records.Where(r => !r.IsDeleted).Select(r => r.RouteId).ToList();
        }


        public async Task UpdateSeasonRoutesAsync(int tourOperatorId, int seasonId, List<int> routeIds, string updatedBy, CancellationToken cancellationToken)
        {
            var existing = await tourOperatorRepository.GetSeasonRoutesByOperatorAndSeasonAsync(tourOperatorId, seasonId, cancellationToken);
            var existingRouteIds = existing.Select(r => r.RouteId).ToList();

            foreach (var record in existing)
            {
                record.IsDeleted = !routeIds.Contains(record.RouteId);
                record.DeletedOn = record.IsDeleted ? DateTime.Now : null;
                record.UpdatedOn = DateTime.Now;
                record.UpdatedBy = updatedBy;
            }

            var toAdd = routeIds
                .Where(id => !existingRouteIds.Contains(id))
                .Select(id => new OperatorSeasonRoute
                {
                    TourOperatorId = tourOperatorId,
                    SeasonId = seasonId,
                    RouteId = id,
                    CreatedOn = DateTime.Now,
                    CreatedBy = updatedBy
                }).ToList();

            await tourOperatorRepository.UpdateSeasonRoutesAsync(existing, toAdd, cancellationToken);
        }


        public async Task<List<int>> GetRouteSeasonIdsAsync(int tourOperatorId, int routeId, CancellationToken cancellationToken)
        {
            var records = await tourOperatorRepository.GetSeasonRoutesByOperatorAndRouteAsync(tourOperatorId, routeId, cancellationToken);
            return records.Where(r => !r.IsDeleted).Select(r => r.SeasonId).ToList();
        }


        public async Task UpdateRouteReasonsAsync(int tourOperatorId, int routeId, List<int> seasonIds, string updatedBy, CancellationToken cancellationToken)
        {
            var existing = await tourOperatorRepository.GetSeasonRoutesByOperatorAndRouteAsync(tourOperatorId, routeId, cancellationToken);
            var existingSeasonIds = existing.Select(r => r.SeasonId).ToList();

            foreach (var record in existing)
            {
                record.IsDeleted = !seasonIds.Contains(record.SeasonId);
                record.DeletedOn = record.IsDeleted ? DateTime.Now : null;
                record.UpdatedOn = DateTime.Now;
                record.UpdatedBy = updatedBy;
            }

            var toAdd = seasonIds
                .Where(id => !existingSeasonIds.Contains(id))
                .Select(id => new OperatorSeasonRoute
                {
                    TourOperatorId = tourOperatorId,
                    SeasonId = id,
                    RouteId = routeId,
                    CreatedOn = DateTime.Now,
                    CreatedBy = updatedBy
                }).ToList();

            await tourOperatorRepository.UpdateSeasonRoutesAsync(existing, toAdd, cancellationToken);
        }

        private static TourOperatorDto MapToDto(TourOperator tourOp, string? userEmail = null)
        {
            return new TourOperatorDto
            {
                Id = tourOp.Id,
                Name = tourOp.Name,
                UserId = tourOp.UserId,
                UserEmail = userEmail,
                ContactPerson = tourOp.ContactPerson,
                ContactEmail = tourOp.ContactEmail,
                PhoneNumber = tourOp.PhoneNumber
            };
        }
    }
}
