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

        /// <summary>
        /// Quét nội dung HTML và xóa tất cả các tệp tin ảnh thuộc thư mục uploads.
        /// </summary>
        void DeleteImagesInHtml(string? htmlContent);

        /// <summary>
        /// So sánh 2 danh sách URL ảnh (cũ và mới) và xóa các tệp tin không còn sử dụng.
        /// </summary>
        void DeleteOrphanedImages(string? oldUrls, string? newUrls);

        /// <summary>
        /// So sánh nội dung HTML cũ và mới, xóa các ảnh có trong nội dung cũ nhưng không còn trong nội dung mới.
        /// </summary>
        void DeleteOrphanedImagesInHtml(string? oldHtml, string? newHtml);
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

        public void DeleteImagesInHtml(string? htmlContent)
        {
            if (string.IsNullOrWhiteSpace(htmlContent)) return;

            try
            {
                // Regex tìm các tệp tin trong thư mục uploads (ví dụ: /api/uploads/guid.webp)
                var regex = new System.Text.RegularExpressions.Regex(@"/api/uploads/([a-zA-Z0-9\-\.]+)", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
                var matches = regex.Matches(htmlContent);

                foreach (System.Text.RegularExpressions.Match match in matches)
                {
                    if (match.Groups.Count > 1)
                    {
                        var fileName = match.Groups[1].Value;
                        DeleteFile(fileName);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi quét ảnh trong HTML để xóa.");
            }
        }

        public void DeleteOrphanedImages(string? oldUrls, string? newUrls)
        {
            if (string.IsNullOrWhiteSpace(oldUrls)) return;

            var oldList = oldUrls.Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries);
            var newList = string.IsNullOrWhiteSpace(newUrls) 
                ? new List<string>() 
                : new List<string>(newUrls.Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries));

            foreach (var oldUrl in oldList)
            {
                // Nếu URL cũ không còn nằm trong danh sách mới, xóa file vật lý
                if (!newList.Contains(oldUrl))
                {
                    DeleteFileFromUrl(oldUrl.Trim());
                }
            }
        }

        public void DeleteOrphanedImagesInHtml(string? oldHtml, string? newHtml)
        {
            if (string.IsNullOrWhiteSpace(oldHtml)) return;

            var regex = new System.Text.RegularExpressions.Regex(@"/api/uploads/([a-zA-Z0-9\-\.]+)", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
            
            // Lấy danh sách ảnh từ nội dung cũ
            var oldMatches = regex.Matches(oldHtml);
            var oldImages = new HashSet<string>();
            foreach (System.Text.RegularExpressions.Match m in oldMatches)
            {
                if (m.Groups.Count > 1) oldImages.Add(m.Groups[1].Value);
            }

            if (oldImages.Count == 0) return;

            // Lấy danh sách ảnh từ nội dung mới
            var newImages = new HashSet<string>();
            if (!string.IsNullOrWhiteSpace(newHtml))
            {
                var newMatches = regex.Matches(newHtml);
                foreach (System.Text.RegularExpressions.Match m in newMatches)
                {
                    if (m.Groups.Count > 1) newImages.Add(m.Groups[1].Value);
                }
            }

            // Xóa những ảnh có trong cũ nhưng không có trong mới
            foreach (var img in oldImages)
            {
                if (!newImages.Contains(img))
                {
                    DeleteFile(img);
                }
            }
        }
    }
}
