namespace NVHome.Application.DTOs.Auth;

// DTO chứa thông tin yêu cầu đăng ký
public class RegisterRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
