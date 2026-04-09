using Microsoft.AspNetCore.Mvc;
using PharmacyAPI.DTOs;
using PharmacyAPI.Services;

namespace PharmacyAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ITokenService _tokenService;

    public AuthController(IAuthService authService, ITokenService tokenService)
    {
        _authService = authService;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto registerDto)
    {
        var user = await _authService.Register(registerDto);

        if (user == null)
            return BadRequest(new { message = "Email already exists" });

        var token = _tokenService.GenerateJwtToken(user);

        return Ok(new
        {
            id = user.Id,
            fullName = user.FullName,
            email = user.Email,
            role = user.Role,
            token = token
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto loginDto)
    {
        var user = await _authService.Login(loginDto);

        if (user == null)
            return Unauthorized(new { message = "Invalid email or password" });

        var token = _tokenService.GenerateJwtToken(user);

        return Ok(new
        {
            id = user.Id,
            fullName = user.FullName,
            email = user.Email,
            role = user.Role,
            token = token
        });
    }
}