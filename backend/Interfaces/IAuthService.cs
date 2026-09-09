using ChurchPulse.API.DTOs;
using ChurchPulse.API.Models;

namespace ChurchPulse.API.Interfaces;

public interface IAuthService
{
    Task<User> RegisterAsync(RegisterDto registerDto);

    Task<string?> LoginAsync(LoginDto loginDto);

    Task<string?> AdminLoginAsync(AdminLoginDto adminLoginDto);

    Task<User> AdminRegisterAsync(AdminRegisterDto adminRegisterDto);

    Task<string?> MemberLoginAsync(MemberLoginDto memberLoginDto);
}