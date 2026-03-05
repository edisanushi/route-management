using RouteManagement.Application.DTOs.Season;
using RouteManagement.Application.Interfaces;
using RouteManagement.Domain.Entities;
using RouteManagement.Domain.Enums;

namespace RouteManagement.Application.Services
{
    public class SeasonService(ISeasonRepository seasonRepository) : ISeasonService
    {

        public async Task<SeasonDto> CreateAsync(SeasonFormDto dto, string createdBy, CancellationToken cancellationToken)
        {
            ValidateDates(dto);

            if (await seasonRepository.ExistsAsync(dto.Year, dto.SeasonType, cancellationToken))
                throw new InvalidOperationException($"A {dto.SeasonType} season for {dto.Year} already exists.");

            var season = new Season
            {
                Year = dto.Year,
                SeasonType = dto.SeasonType,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                CreatedOn = DateTime.Now,
                CreatedBy = createdBy
            };

            var created = await seasonRepository.CreateAsync(season, cancellationToken);
            return MapToDto(created);
        }


        public async Task<IReadOnlyList<SeasonDto>> GetAllAsync(CancellationToken cancellationToken)
        {
            var seasons = await seasonRepository.GetAllAsync(cancellationToken);
            return seasons.Select(MapToDto).ToList();
        }

        private static SeasonDto MapToDto(Season season)
        {
            return new SeasonDto
            {
                Id = season.Id,
                Year = season.Year,
                SeasonType = season.SeasonType,
                SeasonTypeName = season.SeasonType.ToString(),
                StartDate = season.StartDate,
                EndDate = season.EndDate
            };
        }

        public async Task<SeasonDto> GetByIdAsync(int id, CancellationToken cancellationToken)
        {
            var season = await seasonRepository.GetByIdAsync(id, cancellationToken)
                         ?? throw new KeyNotFoundException($"Season with id {id} was not found.");
            return MapToDto(season);
        }

        public async Task<SeasonDto> UpdateAsync(int id, SeasonFormDto dto, string updatedBy, CancellationToken cancellationToken)
        {
            var season = await seasonRepository.GetByIdAsync(id, cancellationToken)
              ?? throw new KeyNotFoundException($"Season with id {id} was not found.");

            ValidateDates(dto);

            if (await seasonRepository.ExistsAsync(dto.Year, dto.SeasonType, id, cancellationToken))
                throw new InvalidOperationException($"A {dto.SeasonType} season for {dto.Year} already exists.");

            season.Year = dto.Year;
            season.SeasonType = dto.SeasonType;
            season.StartDate = dto.StartDate;
            season.EndDate = dto.EndDate;
            season.UpdatedOn = DateTime.Now;
            season.UpdatedBy = updatedBy;

            await seasonRepository.UpdateAsync(season, cancellationToken);
            return MapToDto(season);
        }

        private static void ValidateDates(SeasonFormDto dto)
        {
            if (dto.EndDate <= dto.StartDate)
                throw new ArgumentException("End date must be after start date.");

            if (dto.SeasonType == SeasonType.Winter)
            {
                if (dto.StartDate.Month < 1 || dto.StartDate.Month > 6 ||
                    dto.EndDate.Month < 1 || dto.EndDate.Month > 6)
                    throw new ArgumentException("Winter season dates must fall within January to June.");
            }
            else
            {
                if (dto.StartDate.Month < 7 || dto.StartDate.Month > 12 ||
                    dto.EndDate.Month < 7 || dto.EndDate.Month > 12)
                    throw new ArgumentException("Summer season dates must fall within July to December.");
            }
        }

        public async Task DeleteAsync(int id, string deletedBy, CancellationToken cancellationToken)
        {
            var season = await seasonRepository.GetByIdAsync(id, cancellationToken)
                         ?? throw new KeyNotFoundException($"Season with id {id} was not found.");

            season.IsDeleted = true;
            season.DeletedOn = DateTime.Now;
            season.UpdatedOn = DateTime.Now;
            season.UpdatedBy = deletedBy;

            await seasonRepository.UpdateAsync(season, cancellationToken);
        }

    }
}
