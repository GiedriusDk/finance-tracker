using AuthService.DTOs;
using AuthService.Models;

namespace AuthService.Services.Interfaces;

public interface IAuthService
{
    Task RegisterAsync(RegisterDto dto);
    Task<User?> LoginAsync(LoginDto dto);
}