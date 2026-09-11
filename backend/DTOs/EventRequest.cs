using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace ChurchPulse.API.DTOs
{
    public class EventRequest
    {
        [Required]
        [MaxLength(150)]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        public DateTime EventDate { get; set; }

        [MaxLength(100)]
        public string Location { get; set; } = "Main Church Auditorium";

        [MaxLength(50)]
        public string Category { get; set; } = "General";

        public IFormFile? Image { get; set; }
    }
}