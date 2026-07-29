namespace ChurchPulse.API.Models;

public class Attendance
{
    public Guid Id { get; set; }

    public Guid MemberId { get; set; }

    public DateTime Date { get; set; }

    public bool Present { get; set; }
}