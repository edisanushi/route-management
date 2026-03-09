using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using RouteManagement.Application.Interfaces;

namespace RouteManagement.API.Hubs
{
    [Authorize]
    public class ExportHub : Hub
    {
        public async Task<string> JoinExportGroup()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, Context.ConnectionId);
            return Context.ConnectionId;
        }
    }

    public class ExportProgressService(IHubContext<ExportHub> hubContext) : IExportProgressService
    {
        public async Task SendProgressAsync(string connectionId, int percent, string message)
        {
            await hubContext.Clients.Group(connectionId).SendAsync("ExportProgress", percent, message);
        }
    }
}
