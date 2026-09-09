using ChurchPulse.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChurchPulse.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DashboardController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var totalMembers = await _context.Members.CountAsync();
        var activeMembers = await _context.Members.CountAsync(m => m.Status == "Active");
        
        // Count members registered in the last 30 days
        var thirtyDaysAgo = DateTime.UtcNow.AddDays(-30);
        var newMembers = await _context.Members.CountAsync(m => m.JoinedDate >= thirtyDaysAgo);

        // Fetch 5 most recent registrations
        var recentRegistrations = await _context.Members
            .OrderByDescending(m => m.JoinedDate)
            .Take(5)
            .Select(m => new
            {
                m.Id,
                Name = $"{m.FullNames} {m.Surname}",
                JoinedDate = m.JoinedDate
            })
            .ToListAsync();

        return Ok(new
        {
            totalMembers,
            newMembers,
            activeMembers,
            visitors = 0,
            recentRegistrations
        });
    }
}