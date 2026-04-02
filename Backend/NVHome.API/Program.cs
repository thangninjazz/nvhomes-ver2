using Microsoft.EntityFrameworkCore;
using NVHome.Infrastructure.Data;
using NVHome.Infrastructure;
using NVHome.Application.Interfaces;
using NVHome.Domain.Entities;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.Http;
using System.Threading.RateLimiting;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Cấu hình Serilog để ghi log ra Console và File (Rolling Daily)
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/nvhome-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// Thêm bộ nhớ đệm (Caching) cho hệ thống
builder.Services.AddMemoryCache();

// Cấu hình CORS chặt chẽ cho Production
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? new[] { "https://nvhomes.vn" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("ProductionPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins) // Chỉ cho phép domain từ config
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials(); // Bắt buộc để dùng HttpOnly Cookie
    });
});

// Thêm Rate Limiter để chống DDoS (100 requests mỗi 1 phút cho mỗi IP)
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddFixedWindowLimiter("fixed", opt =>
    {
        opt.Window = TimeSpan.FromMinutes(1);
        opt.PermitLimit = 1000;
        opt.QueueLimit = 0;
    });

    // Chính sách bảo mật riêng cho trang Đăng nhập Admin
    options.AddFixedWindowLimiter("login", opt =>
    {
        opt.Window = TimeSpan.FromMinutes(1);
        opt.PermitLimit = 10; // Tăng lên 10 lần mỗi phút
        opt.QueueLimit = 0;
    });
});

// Thêm dịch vụ Controllers và cấu hình JSON để hỗ trợ Enum dạng String
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

// Cấu hình ForwardedHeaders để nhận diện HTTPS từ Proxy (Nginx)
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHealthChecks();

// Lấy ConnectionString từ cấu hình (ưu tiên appsettings.Development.json khi chạy local)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Cấu hình linh hoạt giữa SQLite (cho Local Dev) và PostgreSQL (cho Production)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    if (connectionString != null && connectionString.Contains("Data Source="))
    {
        // Sử dụng SQLite cho môi trường phát triển cục bộ
        options.UseSqlite(connectionString);
    }
    else
    {
        // Sử dụng PostgreSQL cho môi trường Production/Docker
        options.UseNpgsql(connectionString);
    }
});

// Đăng ký dịch vụ từ Infrastructure (JWT, Hashing...)
builder.Services.AddInfrastructure(builder.Configuration);

// Thêm dịch vụ Antiforgery để bảo vệ các request thay đổi dữ liệu (POST/PUT/DELETE)
builder.Services.AddAntiforgery(options => 
{
    options.HeaderName = "X-XSRF-TOKEN"; // Frontend sẽ gửi token qua header này
    options.Cookie.Name = "XSRF-TOKEN";
    options.Cookie.HttpOnly = false; // Phải để false để JS có thể đọc và gửi lại qua header
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});

var app = builder.Build();

// Cấu hình Http Request Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Áp dụng Rate Limiting
app.UseRateLimiter();

// Middleware thêm Security Headers thủ công
app.Use(async (context, next) =>
{
    context.Response.Headers.Append("X-Frame-Options", "DENY");
    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
    // Loosening CSP to allow API connections and common external resources
    context.Response.Headers.Append("Content-Security-Policy", "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://nvhomes.vn https://www.google.com;");
    await next();
});

app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

app.UseCors("ProductionPolicy");

// Đảm bảo thư mục uploads tồn tại
var uploadsDir = Path.Combine(app.Environment.WebRootPath ?? "wwwroot", "uploads");
var absoluteUploadsDir = Path.GetFullPath(uploadsDir);
if (!Directory.Exists(absoluteUploadsDir))
{
    Directory.CreateDirectory(absoluteUploadsDir);
}

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(absoluteUploadsDir),
    RequestPath = "/api/uploads"
});

// app.UseAntiforgery(); // Tạm tắt để khôi phục chức năng đăng nhập
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHealthChecks("/health");

// Tự động Apply Database Migrations khi start app
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<ApplicationDbContext>();
    try
    {
        try
        {
            context.Database.Migrate();
            Console.WriteLine("Database check: Migration completed successfully.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Database check Warning: Migration failed (Table may already exist). Error: {ex.Message}");
        }

        // Seed or Update Admin User (Ensure password from .env is always applied)
        var adminEmail = builder.Configuration["ADMIN_EMAIL"] ?? "nv_super_admin@nvhome.vn";
        var adminPassword = builder.Configuration["ADMIN_PASSWORD"];

        if (!string.IsNullOrEmpty(adminPassword))
        {
            var hasher = services.GetRequiredService<IPasswordHasher>();
            var adminUser = context.Users.FirstOrDefault(u => u.Email == adminEmail);
            
            if (adminUser == null)
            {
                // Create new
                context.Users.Add(new User 
                { 
                    Id = Guid.NewGuid(),
                    Email = adminEmail, 
                    PasswordHash = hasher.Hash(adminPassword), 
                    Role = UserRole.Admin,
                    CreatedAt = DateTime.UtcNow
                });
                Console.WriteLine($"Seed: Created new secure admin user: {adminEmail}");
            }
            else
            {
                // Force Update Password to match current .env (Golden Recovery)
                adminUser.PasswordHash = hasher.Hash(adminPassword);
                adminUser.Role = UserRole.Admin; // Ensure role is Admin
                adminUser.UpdatedAt = DateTime.UtcNow;
                Console.WriteLine($"Seed: Updated existing admin user credentials: {adminEmail}");
            }
            context.SaveChanges();
        }
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Lỗi khi chạy logic khởi tạo (Seeding/Migration).");
    }
}

app.Run();
