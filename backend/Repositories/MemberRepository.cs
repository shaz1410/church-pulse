using ChurchPulse.API.Data;
using ChurchPulse.API.Interfaces;
using ChurchPulse.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ChurchPulse.API.Repositories;

public class MemberRepository : IMemberRepository
{
    private readonly ApplicationDbContext _context;

    public MemberRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> MemberExistsAsync(
        string mobileNumber
    )
    {
        return await _context.Members.AnyAsync(
            m => m.MobileNumber == mobileNumber
        );
    }

    public async Task<Member> AddMemberAsync(
        Member member
    )
    {
        _context.Members.Add(member);

        await _context.SaveChangesAsync();

        return member;
    }
}