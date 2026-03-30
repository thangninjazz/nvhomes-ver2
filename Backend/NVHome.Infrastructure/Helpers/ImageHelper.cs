using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.Fonts;
using SixLabors.ImageSharp.Drawing.Processing;
using Microsoft.Extensions.Logging;
using System.IO;
using System.Threading.Tasks;

namespace NVHome.Infrastructure.Helpers
{
    public static class ImageHelper
    {
        private static Font? _cachedFont;
        private static readonly object _fontLock = new object();

        private static Font GetWatermarkFont(float imageWidth)
        {
            if (_cachedFont == null)
            {
                lock (_fontLock)
                {
                    if (_cachedFont == null)
                    {
                        // Thử tìm font hệ thống phổ biến
                        var fontNames = new[] { "DejaVu Sans", "Arial", "Verdana", "FreeSans", "Liberation Sans" };
                        FontFamily family = SystemFonts.Families.FirstOrDefault();
                        
                        foreach (var name in fontNames)
                        {
                            if (SystemFonts.TryGet(name, out var foundFamily))
                            {
                                family = foundFamily;
                                break;
                            }
                        }
                        
                        _cachedFont = family.CreateFont(12, FontStyle.Bold);
                    }
                }
            }

            // Scale font size based on image width (approx 2.5% of width)
            float fontSize = Math.Max(16, imageWidth * 0.025f);
            return _cachedFont.Family.CreateFont(fontSize, FontStyle.Bold);
        }

        /// <summary>
        /// Nén, đóng dấu watermark và chuyển đổi hình ảnh sang định dạng WebP.
        /// </summary>
        public static async Task ConvertToWebP(string inputPath, string outputPath, int maxWidth = 1920, int quality = 75)
        {
            using (var image = await Image.LoadAsync(inputPath))
            {
                // 1. Resize nếu ảnh quá lớn
                if (image.Width > maxWidth)
                {
                    image.Mutate(x => x.Resize(new ResizeOptions
                    {
                        Size = new Size(maxWidth, 0),
                        Mode = ResizeMode.Max
                    }));
                }

                // 2. Thêm Watermark (Centered: Phục vụ tận tâm / nvhomes.vn - 0966.245.396)
                // Font size lớn hơn khi đặt ở giữa (khoảng 3.5% chiều rộng)
                var font = GetWatermarkFont(image.Width);
                float fontSize = Math.Max(20, image.Width * 0.035f);
                font = font.Family.CreateFont(fontSize, FontStyle.Bold);
                
                string line1 = "Phục vụ tận tâm";
                string line2 = "nvhomes.vn - 0966.245.396";
                
                // Tính toán vị trí trung tâm (ước tính)
                float text1Width = line1.Length * fontSize * 0.55f;
                float text2Width = line2.Length * fontSize * 0.55f;
                
                var pos1 = new PointF(image.Width / 2f - text1Width / 2f, image.Height / 2f - fontSize);
                var pos2 = new PointF(image.Width / 2f - text2Width / 2f, image.Height / 2f + fontSize * 0.2f);

                image.Mutate(x => {
                    x.DrawText(line1, font, Color.White.WithAlpha(0.15f), pos1);
                    x.DrawText(line2, font, Color.White.WithAlpha(0.15f), pos2);
                });

                // 3. Lưu ảnh dưới định dạng WebP
                var encoder = new WebpEncoder
                {
                    Quality = quality,
                    Method = WebpEncodingMethod.BestQuality
                };

                await image.SaveAsync(outputPath, encoder);
            }
        }
    }
}
