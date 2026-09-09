namespace ChurchPulse.API.DTOs;

public class MemberRegisterDto
{
    public string FullNames { get; set; } = string.Empty;

    public string Surname { get; set; } = string.Empty;

    public string MobileNumber { get; set; } = string.Empty;

    public DateTime DateOfBirth { get; set; }

    public string Password { get; set; } = string.Empty;
 }
