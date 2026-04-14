using AuthService.DTOs;
using AuthService.Services;
using AuthService.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AuthService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly JwtService _jwtService;

    public AuthController(IAuthService authService, JwtService jwtService)
    {
        _authService = authService;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        try
        {
            await _authService.RegisterAsync(dto);
            return Ok(new { message = "User registered successfully." });
        }
        catch (Exception ex)
        {
            // Most common case: user already exists -> return 409 instead of 500
            if (ex.Message.Contains("already exists", StringComparison.OrdinalIgnoreCase))
                return Conflict(new { message = ex.Message });

            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _authService.LoginAsync(dto);

        if (user == null)
            return Unauthorized("Invalid email or password.");

        var token = _jwtService.GenerateToken(user.Id, user.Email);

        return Ok(new { token });
    }
}