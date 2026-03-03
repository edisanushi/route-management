using System;
using System.Collections.Generic;
using System.Text;

namespace RouteManagement.Application.DTOs.Auth
{
    public class RegisterResponse
    {
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }
}
