using ChurchPulse.API.Models;

namespace ChurchPulse.API.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user);
}