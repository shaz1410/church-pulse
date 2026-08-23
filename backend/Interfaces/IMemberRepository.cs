using ChurchPulse.API.Models;

namespace ChurchPulse.API.Interfaces;

public interface IMemberRepository
{
    Task<bool> MemberExistsAsync(string mobileNumber);

    Task<Member> AddMemberAsync(Member member);
}