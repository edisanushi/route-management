using Microsoft.AspNetCore.Mvc.ModelBinding;
using RouteManagement.Application.Common.Models;

namespace RouteManagement.API.Extensions
{
    public static class ValidationErrorResponseExtensions
    {
        public const string ValidationErrorCode = "VALIDATION_ERROR";
        public const string ValidationErrorMessage = "One or more validation errors occurred.";

        public static ErrorResponse ToErrorResponse(this ModelStateDictionary modelState, string traceId)
        {
            var validationErrors = new Dictionary<string, string[]>(StringComparer.OrdinalIgnoreCase);

            if (modelState != null)
            {
                foreach (var entry in modelState)
                {
                    if (entry.Value?.Errors?.Count > 0)
                    {
                        validationErrors[entry.Key] = entry.Value.Errors
                            .Select(e => e.ErrorMessage)
                            .ToArray();
                    }
                }
            }

            return new ErrorResponse
            {
                Message = ValidationErrorMessage,
                Code = ValidationErrorCode,
                StatusCode = 400,
                TraceId = traceId,
                ValidationErrors = validationErrors.Count > 0 ? validationErrors : null
            };
        }
    }
}
