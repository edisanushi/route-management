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
