using AuthService.Data;
using AuthService.DTOs;
using AuthService.Models;
using AuthService.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Services.Implementations;

public class AuthServiceImpl : IAuthService
{
    private readonly AuthDbContext _context;

    public AuthServiceImpl(AuthDbContext context)
    {
        _context = context;
    }

    public async Task RegisterAsync(RegisterDto dto)
    {
        var exists = await _context.Users.AnyAsync(u => u.Email == dto.Email);

        if (exists)
            throw new Exception("User already exists.");

        var user = new User
        {
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
    }

    public async Task<User?> LoginAsync(LoginDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user == null)
            return null;

        var validPassword = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

        if (!validPassword)
            return null;

        return user;
    }
}