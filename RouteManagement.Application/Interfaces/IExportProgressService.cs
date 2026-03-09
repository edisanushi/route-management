
namespace RouteManagement.Application.Interfaces
{
    public interface IExportProgressService
    {
        Task SendProgressAsync(string connectionId, int percent, string message);
    }
}
