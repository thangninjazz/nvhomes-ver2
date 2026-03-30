using NVHome.Application.Interfaces;

namespace NVHome.Infrastructure.Authentication;

public class PasswordHasher : IPasswordHasher
{
    public string Hash(string password)
    {
        // Hash mật khẩu dùng thuật toán BCrypt
        return BCrypt.Net.BCrypt.EnhancedHashPassword(password, 13);
    }

    public bool Verify(string password, string hash)
    {
        // Xác minh mật khẩu
        return BCrypt.Net.BCrypt.EnhancedVerify(password, hash);
    }
}
