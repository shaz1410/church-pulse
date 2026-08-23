namespace ChurchPulse.API.DTOs;

public class CreateMemberDto
{
    public string FullNames { get; set; } = string.Empty;

    public string Surname { get; set; } = string.Empty;

    public string MobileNumber { get; set; } = string.Empty;

    public DateTime DateOfBirth { get; set; }
}