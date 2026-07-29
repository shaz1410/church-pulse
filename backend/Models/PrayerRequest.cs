namespace ChurchPulse.API.Models;

public class PrayerRequest
{
    public Guid Id { get; set; }

    public string RequesterName { get; set; } = string.Empty;

    public string Request { get; set; } = string.Empty;

    public bool IsAnswered { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}