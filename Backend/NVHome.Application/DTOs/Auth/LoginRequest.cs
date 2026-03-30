namespace NVHome.Application.DTOs.Auth;

// DTO chứa thông tin yêu cầu đăng nhập
public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
