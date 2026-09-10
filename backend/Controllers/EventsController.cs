using ChurchPulse.API.Data;
using ChurchPulse.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChurchPulse.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Requires JWT authentication
    public class EventsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EventsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Events
        [HttpGet]
        public async Task<IActionResult> GetEvents()
        {
            var events = await _context.Events
                .OrderBy(e => e.EventDate)
                .ToListAsync();

            return Ok(events);
        }

        // GET: api/Events/550e8400-e29b-41d4-a716-446655440000
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEvent(Guid id)
        {
            var existingEvent = await _context.Events.FindAsync(id);
            if (existingEvent == null)
                return NotFound(new { message = "Event not found." });

            return Ok(existingEvent);
        }

        // POST: api/Events
        [HttpPost]
        public async Task<IActionResult> CreateEvent([FromBody] Event newEvent)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Events.Add(newEvent);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEvent), new { id = newEvent.Id }, newEvent);
        }

        // PUT: api/Events/550e8400-e29b-41d4-a716-446655440000
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEvent(Guid id, [FromBody] Event updatedEvent)
        {
            var existingEvent = await _context.Events.FindAsync(id);
            if (existingEvent == null)
                return NotFound(new { message = "Event not found." });

            existingEvent.Title = updatedEvent.Title;
            existingEvent.Description = updatedEvent.Description;
            existingEvent.EventDate = updatedEvent.EventDate;
            existingEvent.Location = updatedEvent.Location;
            existingEvent.Category = updatedEvent.Category;

            await _context.SaveChangesAsync();
            return Ok(existingEvent);
        }

        // DELETE: api/Events/550e8400-e29b-41d4-a716-446655440000
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(Guid id)
        {
            var existingEvent = await _context.Events.FindAsync(id);
            if (existingEvent == null)
                return NotFound(new { message = "Event not found." });

            _context.Events.Remove(existingEvent);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Event deleted successfully." });
        }
    }
}