using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NVHome.Infrastructure.Helpers;

namespace NVHome.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Editor")]
public class UploadController : ControllerBase
{
    private readonly IWebHostEnvironment _env;
    private readonly ILogger<UploadController> _logger;

    public UploadController(IWebHostEnvironment env, ILogger<UploadController> logger)
    {
        _env = env;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("Không có file nào được chọn.");

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp", ".gif" };
        var extension = Path.GetExtension(file.FileName).ToLower();

        if (!allowedExtensions.Contains(extension))
            return BadRequest("Định dạng file không được hỗ trợ.");

        try
        {
            // Tạo tên file duy nhất
            var fileName = $"{Guid.NewGuid()}.webp";
            var uploadsFolder = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads");
            var filePath = Path.Combine(uploadsFolder, fileName);

            // Lưu file tạm thời để xử lý
            var tempPath = Path.GetTempFileName();
            using (var stream = new FileStream(tempPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Sử dụng ImageHelper để nén và chuyển đổi sang WebP
            await ImageHelper.ConvertToWebP(tempPath, filePath);

            // Xóa file tạm
            System.IO.File.Delete(tempPath);

            // Trả về URL tương ứng (nguồn qua proxy Nginx)
            var baseUrl = $"{Request.Scheme}://{Request.Host}{Request.PathBase}";
            
            // Vì Nginx proxy /api vào backend, và backend map UseStaticFiles vào /api/uploads
            var fileUrl = $"{baseUrl}/api/uploads/{fileName}";

            return Ok(new { url = fileUrl, fileName = fileName });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi khi upload ảnh.");
            return StatusCode(500, "Đã có lỗi xảy ra khi xử lý hình ảnh.");
        }
    }
}
