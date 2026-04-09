using PharmacyAPI.Data;
using PharmacyAPI.DTOs;
using PharmacyAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace PharmacyAPI.Services;

public interface IAuthService
{
    Task<User?> Register(RegisterDto registerDto);
    Task<User?> Login(LoginDto loginDto);
    string HashPassword(string password);
    bool VerifyPassword(string password, string passwordHash);
}

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly ITokenService _tokenService;

    public AuthService(AppDbContext context, ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    public async Task<User?> Register(RegisterDto registerDto)
    {
        // Check if user exists
        if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
            return null;

        var user = new User
        {
            FullName = registerDto.FullName,
            Email = registerDto.Email,
            PasswordHash = HashPassword(registerDto.Password),
            Phone = registerDto.Phone,
            Role = "Customer"
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return user;
    }

    public async Task<User?> Login(LoginDto loginDto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);

        if (user == null || !VerifyPassword(loginDto.Password, user.PasswordHash))
            return null;

        return user;
    }

    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    public bool VerifyPassword(string password, string passwordHash)
    {
        return BCrypt.Net.BCrypt.Verify(password, passwordHash);
    }
}