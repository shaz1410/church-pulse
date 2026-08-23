using ChurchPulse.API.DTOs;
using ChurchPulse.API.Interfaces;
using ChurchPulse.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace ChurchPulse.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MembersController : ControllerBase
{
    private readonly IMemberRepository _repository;

    public MembersController(IMemberRepository repository)
    {
        _repository = repository;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(
        [FromBody] CreateMemberDto dto)
    {
        var exists = await _repository.MemberExistsAsync(
            dto.MobileNumber);

        if (exists)
        {
            return BadRequest(new
            {
                message =
                    "This mobile number is already registered."
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
        Status = "Active",
        JoinedDate = DateTime.UtcNow
    };


        await _repository.AddMemberAsync(member);

        return Ok(new
        {
            message = "Member registered successfully."
        });
    }
}