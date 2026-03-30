namespace NVHome.Application.Interfaces;

// Interface đóng gói chức năng mã hóa mật khẩu để đảm bảo bảo mật
public interface IPasswordHasher
{
    string Hash(string password);
    bool Verify(string password, string hash);
}
