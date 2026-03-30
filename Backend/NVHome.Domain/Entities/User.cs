namespace NVHome.Domain.Entities;

// Enum cho vai trò người dùng
public enum UserRole
{
    Admin,
    Sales,
    Editor
}

// Thực thể người dùng trong hệ thống
public class User : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.Sales;
}
