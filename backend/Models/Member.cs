namespace ChurchPulse.API.Models;

public class Member
{
    public Guid Id { get; set; }

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PhoneNumber { get; set; } = string.Empty;

    public DateTime JoinedDate { get; set; } = DateTime.UtcNow;
}