namespace ChurchPulse.API.DTOs;

public class AdminRegisterDto
{
    public string FullName { get; set; } = string.Empty;

    public string Surname { get; set; } = string.Empty;

    public string MobileNumber { get; set; } = string.Empty;

    public DateTime DateOfBirth { get; set; }

    public string Email { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;
}
