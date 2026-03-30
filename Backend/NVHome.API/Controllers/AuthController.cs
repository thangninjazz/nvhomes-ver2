using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.RateLimiting;
using NVHome.Application.DTOs.Auth;
using NVHome.Application.Interfaces;
using NVHome.Domain.Entities;
using NVHome.Infrastructure.Data;

namespace NVHome.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IPasswordHasher _passwordHasher;

    // Sử dụng Dependency Injection để lấy instance của DbContext, TokenGenerator và PasswordHasher
    public AuthController(
        ApplicationDbContext context, 
        IJwtTokenGenerator jwtTokenGenerator, 
        IPasswordHasher passwordHasher)
    {
        _context = context;
        _jwtTokenGenerator = jwtTokenGenerator;
        _passwordHasher = passwordHasher;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        // Kiểm tra xem email đã tồn tại chưa
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            return BadRequest("Email đã được sử dụng.");

        // Tạo người dùng mới và mã hóa mật khẩu
        var user = new User
        {
            Email = request.Email,
            PasswordHash = _passwordHasher.Hash(request.Password),
            Role = UserRole.Sales // Default Rule cho User mới (có thể thay đổi nghiệp vụ sau)
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { Message = "Đăng ký thành công." });
    }

    [EnableRateLimiting("login")]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        // Tìm user theo email
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null)
            return Unauthorized("Email hoặc mật khẩu không chính xác.");

        // Xác minh (Verify) mật khẩu cung cấp với mật khẩu đã mã hóa trong CSDL
        if (!_passwordHasher.Verify(request.Password, user.PasswordHash))
            return Unauthorized("Email hoặc mật khẩu không chính xác.");

        // Tạo JWT Token có thời hạn và role tương ứng
        var token = _jwtTokenGenerator.GenerateToken(user);

        // Lưu Token vào HttpOnly Cookie
        Response.Cookies.Append("access_token", token, new CookieOptions
        {
            HttpOnly = true,
            Secure = true, // Bắt buộc cho HTTPS
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddDays(7) // Tuỳ chỉnh thời hạn theo JWT
        });

        return Ok(new AuthResponse
        {
            UserId = user.Id,
            Email = user.Email,
            Token = null, // Không trả về token qua Body để đảm bảo an toàn
            Role = user.Role.ToString()
        });
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        // Xóa Cookie khi đăng xuất
        Response.Cookies.Delete("access_token");
        return Ok(new { Message = "Đăng xuất thành công." });
    }
}
