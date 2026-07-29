using Microsoft.EntityFrameworkCore;
using ChurchPulse.API.Models;

namespace ChurchPulse.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Church> Churches => Set<Church>();
    public DbSet<Member> Members => Set<Member>();
    public DbSet<Attendance> Attendances => Set<Attendance>();
    public DbSet<Event> Events => Set<Event>();
    public DbSet<PrayerRequest> PrayerRequests => Set<PrayerRequest>();
}