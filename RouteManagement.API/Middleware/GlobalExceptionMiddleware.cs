using System.Net;
using System.Text.Json;
using RouteManagement.Application.Common.Models;

namespace RouteManagement.API.Middleware
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;

        public GlobalExceptionMiddleware(
            RequestDelegate next,
            ILogger<GlobalExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Unhandled exception. TraceId: {TraceId} | Path: {Path} | Method: {Method}",
                    context.TraceIdentifier,
                    context.Request.Path,
                    context.Request.Method);

                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(
            HttpContext context,
            Exception exception)
        {
            var (statusCode, code, message) = exception switch
            {
                UnauthorizedAccessException => (
                    HttpStatusCode.Unauthorized,
                    "UNAUTHORIZED",
                    exception.Message),

                InvalidOperationException => (
                    HttpStatusCode.BadRequest,
                    "BAD_REQUEST",
                    exception.Message),

                KeyNotFoundException => (
                    HttpStatusCode.NotFound,
                    "NOT_FOUND",
                    exception.Message),

                ArgumentException => (
                    HttpStatusCode.BadRequest,
                    "VALIDATION_ERROR",
                    exception.Message),

                _ => (
                    HttpStatusCode.InternalServerError,
                    "INTERNAL_ERROR",
                    "An unexpected error occurred. Please try again later.")
            };

            var response = new ErrorResponse
            {
                Message = message,
                Code = code,
                StatusCode = (int)statusCode,
                TraceId = context.TraceIdentifier
            };

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;

            var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            await context.Response.WriteAsync(json);
        }
    }
}
