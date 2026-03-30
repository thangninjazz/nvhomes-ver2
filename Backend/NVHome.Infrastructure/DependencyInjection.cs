using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using NVHome.Application.Interfaces;
using NVHome.Infrastructure.Authentication;
using NVHome.Infrastructure.Services;

namespace NVHome.Infrastructure;

public static class DependencyInjection
{
    // Mở rộng IServiceCollection để đăng ký các dịch vụ của lớp Infrastructure
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Đăng ký dịch vụ JWT và Hashing
        services.AddSingleton<IJwtTokenGenerator, JwtTokenGenerator>();
        services.AddSingleton<IPasswordHasher, PasswordHasher>();
        
        // Đăng ký ReCaptcha Service và HttpClient
        services.AddHttpClient<IReCaptchaService, ReCaptchaService>();
        
        // Đăng ký Telegram Service để gửi thông báo cho Lead mới
        services.AddHttpClient<ITelegramService, TelegramService>();

        // Đăng ký File Service để dọn dẹp ảnh khi xóa dữ liệu
        services.AddScoped<IFileService, FileService>();

        var jwtSettings = configuration.GetSection("JwtSettings");
        var secret = jwtSettings["Secret"];

        // Cấu hình Authentication & JWT Bearer
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings["Issuer"],
                    ValidAudience = jwtSettings["Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret!))
                };

                // Cấu hình để lấy Token từ HttpOnly Cookie
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        context.Token = context.Request.Cookies["access_token"];
                        return Task.CompletedTask;
                    }
                };
            });

        return services;
    }
}
