using BCrypt.Net;
using ChurchPulse.API.Data;
using ChurchPulse.API.DTOs;
using ChurchPulse.API.Interfaces;
using ChurchPulse.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ChurchPulse.API.Services;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IJwtService _jwtService;

    public AuthService(
        ApplicationDbContext context,
        IJwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    public async Task<User> RegisterAsync(RegisterDto dto)
    {
        if (await _context.Users.AnyAsync(x => x.Email == dto.Email))
            throw new Exception("Email already exists.");

        var user = new User
        {
            Id = Guid.NewGuid(),
            FullName = dto.FullName,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = "Member",
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        return user;
    }

    public async Task<User> AdminRegisterAsync(AdminRegisterDto dto)
{
    if (await _context.Users.AnyAsync(x => x.Email == dto.Email))
        throw new Exception("Email already exists.");

    if (await _context.Users.AnyAsync(x => x.Role == "Admin"))
        throw new Exception("An administrator account already exists.");

    var admin = new User
    {
        Id = Guid.NewGuid(),
        FullName = dto.FullName,
        Surname = dto.Surname,
        MobileNumber = dto.MobileNumber,
        DateOfBirth = DateTime.SpecifyKind(dto.DateOfBirth, DateTimeKind.Utc),
        Email = dto.Email,
        PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
        Role = "Admin",
        CreatedAt = DateTime.UtcNow
    };

    _context.Users.Add(admin);

    await _context.SaveChangesAsync();

    return admin;
}

    public async Task<string?> LoginAsync(LoginDto dto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.Email == dto.Email);

        if (user == null)
            return null;

        var validPassword = BCrypt.Net.BCrypt.Verify(
            dto.Password,
            user.PasswordHash);

        if (!validPassword)
            return null;

        return _jwtService.GenerateToken(user);
    }

 public async Task<string?> AdminLoginAsync(AdminLoginDto dto)
{
    var user = await _context.Users
        .FirstOrDefaultAsync(x =>
            x.Email == dto.Email &&
            x.Role == "Admin");

    if (user == null)
        return null;

    var validPassword = BCrypt.Net.BCrypt.Verify(
        dto.Password,
        user.PasswordHash);

    if (!validPassword)
        return null;

    return _jwtService.GenerateToken(user);
}
}

