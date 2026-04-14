using System.Reflection;
using AuthService.Data;
using AuthService.DTOs;
using AuthService.Services;
using AuthService.Services.Implementations;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Xunit;

namespace FinanceTracker.Tests.Auth;

public class AuthServiceTests
{
    [Fact]
    public async Task Register_Should_Create_User_When_Data_Is_Valid()
    {
        var options = new DbContextOptionsBuilder<AuthDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var context = new AuthDbContext(options);

        var configData = new Dictionary<string, string?>
        {
            ["Jwt:Key"] = "super_secret_test_key_123456789",
            ["Jwt:Issuer"] = "TestIssuer",
            ["Jwt:Audience"] = "TestAudience"
        };

        IConfiguration configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(configData)
            .Build();

        var jwtService = new JwtService(configuration);

        var authService = new AuthServiceImpl(context);

        var dto = new RegisterDto
        {
            Email = "test@example.com",
            Password = "123456"
        };

        await authService.RegisterAsync(dto);

        var savedUser = await context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

        Assert.NotNull(savedUser);
        Assert.Equal(dto.Email, savedUser!.Email);
        Assert.False(string.IsNullOrWhiteSpace(savedUser.PasswordHash));
    }

    [Fact]
    public async Task Login_Should_Return_Token_When_Credentials_Are_Valid()
    {
        var options = new DbContextOptionsBuilder<AuthDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var context = new AuthDbContext(options);

        var configData = new Dictionary<string, string?>
        {
            ["Jwt:Key"] = "super_secret_test_key_123456789",
            ["Jwt:Issuer"] = "TestIssuer",
            ["Jwt:Audience"] = "TestAudience"
        };

        IConfiguration configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(configData)
            .Build();

        var jwtService = new JwtService(configuration);

        var authService = new AuthServiceImpl(context);

        var dto = new RegisterDto
        {
            Email = "test@example.com",
            Password = "123456"
        };

        await authService.RegisterAsync(dto);

        var loginDto = new LoginDto
        {
            Email = dto.Email,
            Password = dto.Password
        };

        var user = await authService.LoginAsync(loginDto);

        Assert.NotNull(user);
        Assert.Equal(dto.Email, user.Email);
    }
}