using ChurchPulse.API.DTOs;
using ChurchPulse.API.Interfaces;
using ChurchPulse.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChurchPulse.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MembersController : ControllerBase
{
    private readonly IMemberRepository _repository;

    public MembersController(IMemberRepository repository)
    {
        _repository = repository;
    }

   [HttpPost("register")]
public async Task<IActionResult> Register([FromBody] CreateMemberDto dto)
{
    var exists = await _repository.MemberExistsAsync(dto.MobileNumber);

    if (exists)
    {
        return BadRequest(new
        {
            message = "This mobile number is already registered."
        });
    }

    if (string.IsNullOrWhiteSpace(dto.Password))
    {
        return BadRequest(new
        {
            message = "Password is required."
        });
    }

    if (dto.Password.Length < 6)
    {
        return BadRequest(new
        {
            message = "Password must be at least 6 characters."
        });
    }

    var member = new Member
    {
        FullNames = dto.FullNames,
        Surname = dto.Surname,
        MobileNumber = dto.MobileNumber,
        DateOfBirth = DateTime.SpecifyKind(
            dto.DateOfBirth,
            DateTimeKind.Utc
        ),
        PasswordHash = BCrypt.Net.BCrypt.HashPassword(
            dto.Password
        ),
        Status = "Active",
        JoinedDate = DateTime.UtcNow
    };

    await _repository.AddMemberAsync(member);

    return Ok(new
    {
        message = "Member registered successfully."
    });
}
    [HttpGet]
    public async Task<IActionResult> GetAllMembers()
    {
        var members = await _repository.GetAllMembersAsync();
        return Ok(members);
    }
}