//using ChurchPulse.API.DTOs;
//using ChurchPulse.API.Services;
//using Microsoft.AspNetCore.Mvc;
//
//namespace ChurchPulse.API.Controllers;
//
//[ApiController]
//[Route("api/[controller]")]
//public class AuthController : ControllerBase
//{
//    private readonly AuthService _authService;
//
//    public AuthController(AuthService authService)
//    {
//        _authService = authService;
//    }
//
//    [HttpPost("register")]
//    public async Task<IActionResult> Register(RegisterDto dto)
//    {
//        try
//        {
//            var user = await _authService.RegisterAsync(dto);
//
//            return Ok(new
//            {
//                message = "User registered successfully.",
//                user.Id,
//                user.FullName,
//                user.Email,
//                user.Role
//            });
//        }
//        catch (Exception ex)
//        {
//            return BadRequest(new
//            {
//                message = ex.Message
//            });
//        }
//    }
//
//    [HttpPost("login")]
//    public async Task<IActionResult> Login(LoginDto dto)
//    {
//        var token = await _authService.LoginAsync(dto);
//
//        if (token == null)
//        {
//            return Unauthorized(new
//            {
//                message = "Invalid email or password."
//            });
//        }
//
//        return Ok(new
//        {
//            token
//        });
//    }
//}

using ChurchPulse.API.DTOs;
using ChurchPulse.API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ChurchPulse.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        try
        {
            var user = await _authService.RegisterAsync(dto);

            return Ok(new
            {
                message = "User registered successfully.",
                user.Id,
                user.FullName,
                user.Email,
                user.Role
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var token = await _authService.LoginAsync(dto);

        if (token == null)
        {
            return Unauthorized(new
            {
                message = "Invalid email or password."
            });
        }

        return Ok(new
        {
            token
        });
    }
}