namespace ChurchPulse.API.Models;

public class Member
{
    public Guid Id { get; set; }

    public string FullNames { get; set; } = string.Empty;

    public string Surname { get; set; } = string.Empty;

    public string MobileNumber { get; set; } = string.Empty;

    public DateTime DateOfBirth { get; set; }

    public DateTime JoinedDate { get; set; } = DateTime.UtcNow;

    public string Status { get; set; } = "Active";

    public string PasswordHash { get; set; } = string.Empty;
}