using ChurchPulse.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChurchPulse.API.Controllers;

[ApiController]
[Route("api/member-events")]
[Authorize(Roles = "Member")]
public class MemberEventsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public MemberEventsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetUpcomingEvents()
    {
        var events = await _context.Events
            .Where(e => e.EventDate >= DateTime.UtcNow)
            .OrderBy(e => e.EventDate)
            .Select(e => new
            {
                e.Id,
                e.Title,
                e.Description,
                e.EventDate
            })
            .ToListAsync();

        return Ok(events);
    }
}
