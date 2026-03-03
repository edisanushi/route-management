
namespace RouteManagement.Application.Common.Models
{
    public class ErrorResponse
    {
        public string Message { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string TraceId { get; set; } = string.Empty;
        public int StatusCode { get; set; }
        public IDictionary<string, string[]>? ValidationErrors { get; set; }
    }
}
