using ChurchPulse.API.Data;
using ChurchPulse.API.DTOs;
using ChurchPulse.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChurchPulse.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EventsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;

        private const long MaxImageSize = 5 * 1024 * 1024; // 5 MB

        private static readonly string[] AllowedExtensions =
        {
            ".jpg",
            ".jpeg",
            ".png",
            ".webp"
        };

        private static readonly string[] AllowedContentTypes =
        {
            "image/jpeg",
            "image/png",
            "image/webp"
        };

        public EventsController(
            ApplicationDbContext context,
            IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
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

        // GET: api/Events/{id}
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
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> CreateEvent([FromForm] EventRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Validate image if supplied
            if (request.Image != null)
            {
                var imageValidation = ValidateImage(request.Image);

                if (imageValidation != null)
                    return BadRequest(new { message = imageValidation });
            }

            var newEvent = new Event
            {
                Title = request.Title,
                Description = request.Description,
                EventDate = request.EventDate,
                Location = request.Location,
                Category = request.Category,
                CreatedAt = DateTime.UtcNow
            };

            // Save image if supplied
            if (request.Image != null)
            {
                newEvent.ImageUrl = await SaveImageAsync(request.Image);
            }

            _context.Events.Add(newEvent);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetEvent),
                new { id = newEvent.Id },
                newEvent
            );
        }

        // PUT: api/Events/{id}
        [HttpPut("{id}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UpdateEvent(
            Guid id,
            [FromForm] EventRequest request)
        {
            var existingEvent = await _context.Events.FindAsync(id);

            if (existingEvent == null)
                return NotFound(new { message = "Event not found." });

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Validate new image if supplied
            if (request.Image != null)
            {
                var imageValidation = ValidateImage(request.Image);

                if (imageValidation != null)
                    return BadRequest(new { message = imageValidation });
            }

            // Update normal event information
            existingEvent.Title = request.Title;
            existingEvent.Description = request.Description;
            existingEvent.EventDate = request.EventDate;
            existingEvent.Location = request.Location;
            existingEvent.Category = request.Category;

            // Replace image only if a new one was selected
            if (request.Image != null)
            {
                var oldImageUrl = existingEvent.ImageUrl;

                existingEvent.ImageUrl = await SaveImageAsync(request.Image);

                // Delete old image after the new image has been saved
                DeleteImage(oldImageUrl);
            }

            await _context.SaveChangesAsync();

            return Ok(existingEvent);
        }

        // DELETE: api/Events/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(Guid id)
        {
            var existingEvent = await _context.Events.FindAsync(id);

            if (existingEvent == null)
                return NotFound(new { message = "Event not found." });

            // Delete associated image
            DeleteImage(existingEvent.ImageUrl);

            _context.Events.Remove(existingEvent);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Event deleted successfully."
            });
        }

        // ---------------------------------------------------------
        // IMAGE HELPERS
        // ---------------------------------------------------------

        private string? ValidateImage(IFormFile image)
        {
            if (image.Length == 0)
                return "The selected image is empty.";

            if (image.Length > MaxImageSize)
                return "Image size cannot exceed 5 MB.";

            var extension = Path.GetExtension(image.FileName).ToLowerInvariant();

            if (!AllowedExtensions.Contains(extension))
                return "Only JPG, JPEG, PNG and WebP images are allowed.";

            if (!AllowedContentTypes.Contains(image.ContentType.ToLowerInvariant()))
                return "Invalid image type.";

            return null;
        }

        private async Task<string> SaveImageAsync(IFormFile image)
        {
            var uploadsFolder = Path.Combine(
                _environment.WebRootPath,
                "uploads",
                "events"
            );

            // Create directory if it doesn't exist
            Directory.CreateDirectory(uploadsFolder);

            var extension = Path.GetExtension(image.FileName).ToLowerInvariant();

            // Generate a completely random filename
            var fileName = $"{Guid.NewGuid()}{extension}";

            var filePath = Path.Combine(uploadsFolder, fileName);

            await using var stream = new FileStream(
                filePath,
                FileMode.Create
            );

            await image.CopyToAsync(stream);

            return $"/uploads/events/{fileName}";
        }

        private void DeleteImage(string? imageUrl)
        {
            if (string.IsNullOrWhiteSpace(imageUrl))
                return;

            // Convert URL into a local filename
            var fileName = Path.GetFileName(imageUrl);

            if (string.IsNullOrWhiteSpace(fileName))
                return;

            var uploadsFolder = Path.Combine(
                _environment.WebRootPath,
                "uploads",
                "events"
            );

            var filePath = Path.Combine(
                uploadsFolder,
                fileName
            );

            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }
        }
    }
}