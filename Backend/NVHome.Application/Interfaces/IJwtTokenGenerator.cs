using NVHome.Domain.Entities;

namespace NVHome.Application.Interfaces;

// Interface định nghĩa hàm tạo JWT Token cho Backend
public interface IJwtTokenGenerator
{
    string GenerateToken(User user);
}
