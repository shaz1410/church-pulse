using System.ComponentModel.DataAnnotations;

namespace ChurchPulse.API.Models
{
    public class Event
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

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

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}