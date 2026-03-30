using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;

namespace NVHome.Infrastructure.Services
{
    public interface IFileService
    {
        /// <summary>
        /// Xóa một tệp tin dựa trên tên tệp trong thư mục uploads.
        /// </summary>
        void DeleteFile(string? fileName);

        /// <summary>
        /// Xóa danh sách các tệp tin.
        /// </summary>
        void DeleteFiles(IEnumerable<string>? fileNames);

        /// <summary>
        /// Xóa tệp tin dựa trên URL (tự động bóc tách tên tệp).
        /// </summary>
        void DeleteFileFromUrl(string? fileUrl);
    }

    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<FileService> _logger;
        private const string UploadsFolder = "uploads";

        public FileService(IWebHostEnvironment env, ILogger<FileService> logger)
        {
            _env = env;
            _logger = logger;
        }

        public void DeleteFile(string? fileName)
        {
            if (string.IsNullOrWhiteSpace(fileName)) return;

            try
            {
                // Đảm bảo đường dẫn an toàn bằng cách kết hợp với WebRootPath
                var rootPath = _env.WebRootPath ?? "wwwroot";
                var filePath = Path.Combine(rootPath, UploadsFolder, fileName.Trim());

                // Chỉ thực hiện xóa nếu tệp tồn tại
                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                    _logger.LogInformation("Đã xóa tệp vật lý thành công: {FilePath}", filePath);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cố gắng xóa tệp: {FileName}", fileName);
            }
        }

        public void DeleteFiles(IEnumerable<string>? fileNames)
        {
            if (fileNames == null) return;
            foreach (var fileName in fileNames)
            {
                DeleteFile(fileName);
            }
        }

        public void DeleteFileFromUrl(string? fileUrl)
        {
            if (string.IsNullOrWhiteSpace(fileUrl)) return;

            try 
            {
                // Bóc tách tên tệp từ URL (ví dụ: /api/uploads/abc.webp -> abc.webp)
                var fileName = Path.GetFileName(fileUrl);
                DeleteFile(fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi bóc tách tên tệp từ URL: {Url}", fileUrl);
            }
        }
    }
}
