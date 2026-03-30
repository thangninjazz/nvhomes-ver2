using Microsoft.AspNetCore.Mvc;
using NVHome.Domain.Entities;
using NVHome.Infrastructure.Data;

namespace NVHome.API.Controllers;

/// <summary>
/// Chỉ dùng trong Development để seed dữ liệu mẫu
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class SeedController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _env;

    public SeedController(ApplicationDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    [HttpPost]
    public async Task<IActionResult> SeedData()
    {
        if (!_env.IsDevelopment())
            return Forbid();

        // 1. Seed Categories (Menu)
        if (!_context.Categories.Any())
        {
            var catPhongKhach = new Category { Name = "Phòng Khách", Slug = "phong-khach", OrderIndex = 1, IsVisible = true };
            var catPhongNgu = new Category { Name = "Phòng Ngủ", Slug = "phong-ngu", OrderIndex = 2, IsVisible = true };
            var catPhongBep = new Category { Name = "Phòng Bếp", Slug = "phong-bep", OrderIndex = 3, IsVisible = true };
            var catVanPhong = new Category { Name = "Văn Phòng", Slug = "van-phong", OrderIndex = 4, IsVisible = true };

            _context.Categories.AddRange(catPhongKhach, catPhongNgu, catPhongBep, catVanPhong);
            await _context.SaveChangesAsync();

            // 2. Seed Products
            _context.Products.AddRange(
                new Product
                {
                    Name = "Sofa Góc Chữ L Hiện Đại",
                    Slug = "sofa-goc-chu-l-hien-dai",
                    OriginalPrice = 25_000_000,
                    DiscountPrice = 19_800_000,
                    DiscountPercent = 20.8,
                    Description = "Sofa góc chữ L bọc da cao cấp, 5 chỗ ngồi, khung gỗ An Cường, phù hợp phòng khách từ 20m².",
                    CategoryId = catPhongKhach.Id,
                    Images = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800"
                },
                new Product
                {
                    Name = "Bàn Trà Kính Cường Lực",
                    Slug = "ban-tra-kinh-cuong-luc",
                    OriginalPrice = 8_500_000,
                    DiscountPrice = 6_990_000,
                    DiscountPercent = 17.8,
                    Description = "Bàn trà mặt kính cường lực 10mm, chân thép sơn tĩnh điện, kích thước 120x60cm.",
                    CategoryId = catPhongKhach.Id,
                    Images = "https://images.unsplash.com/photo-1567016432779-094069958ea5?q=80&w=800"
                },
                new Product
                {
                    Name = "Giường Ngủ Gỗ MDF Cao Cấp",
                    Slug = "giuong-ngu-go-mdf-cao-cap",
                    OriginalPrice = 15_000_000,
                    DiscountPrice = 12_500_000,
                    DiscountPercent = 16.7,
                    Description = "Giường đôi 1m8x2m, đầu giường bọc da, chân gỗ sồi, hộc kéo tiện lợi.",
                    CategoryId = catPhongNgu.Id,
                    Images = "https://images.unsplash.com/photo-1505693314120-0d443867891c?q=80&w=800"
                },
                new Product
                {
                    Name = "Tủ Quần Áo 4 Cánh Âm Tường",
                    Slug = "tu-quan-ao-4-canh-am-tuong",
                    OriginalPrice = 22_000_000,
                    Description = "Tủ âm tường 4 cánh lùa, gương tích hợp, hệ thống ngăn kéo thông minh, cánh gỗ công nghiệp phủ Melamine.",
                    CategoryId = catPhongNgu.Id,
                    Images = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800"
                },
                new Product
                {
                    Name = "Tủ Bếp Chữ L Acrylic Bóng",
                    Slug = "tu-bep-chu-l-acrylic-bong",
                    OriginalPrice = 45_000_000,
                    DiscountPrice = 38_000_000,
                    DiscountPercent = 15.6,
                    Description = "Tủ bếp chữ L cánh Acrylic bóng gương, ray âm giảm chấn Blum, countertop đá nhân tạo.",
                    CategoryId = catPhongBep.Id,
                    Images = "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?q=80&w=800"
                },
                new Product
                {
                    Name = "Bàn Làm Việc Executive",
                    Slug = "ban-lam-viec-executive",
                    OriginalPrice = 12_000_000,
                    DiscountPrice = 9_500_000,
                    DiscountPercent = 20.8,
                    Description = "Bàn làm việc mặt gỗ tự nhiên sồi Nga, khung thép, có ngăn kéo khóa, kích thước 160x80cm.",
                    CategoryId = catVanPhong.Id,
                    Images = "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=800"
                },
                new Product
                {
                    Name = "Bàn Ăn 6 Ghế Testing",
                    Slug = "ban-an-testing-success",
                    OriginalPrice = 18_000_000,
                    Description = "&lt;p&gt;&lt;h2&gt;Đặc điểm nổi bật&lt;/h2&gt;&lt;ul&gt;&lt;li&gt;Chất liệu gỗ sồi tự nhiên&lt;/li&gt;&lt;li&gt;Thiết kế hiện đại&lt;/li&gt;&lt;/ul&gt;&lt;/p&gt;",
                    Specifications = "[{\"Key\":\"Kích thước\",\"Value\":\"180x90cm\"},{\"Key\":\"Số lượng ghế\",\"Value\":\"6\"}]",
                    CategoryId = catPhongBep.Id,
                    Images = "https://images.unsplash.com/photo-1617806118233-f8e1374a2f9c?q=80&w=800"
                }
            );
            await _context.SaveChangesAsync();
        }

        // 3. Seed Projects
        if (!_context.Projects.Any())
        {
            _context.Projects.AddRange(
                new Project
                {
                    Title = "Biệt Thự Vinhomes Ocean Park - 450m²",
                    Slug = "biet-thu-vinhomes-ocean-park",
                    Description = "Thiết kế và thi công nội thất trọn gói biệt thự song lập 450m² theo phong cách Modern Luxury. Sử dụng toàn bộ vật liệu nhập khẩu từ Ý và Đức.",
                    Content = "Dự án được hoàn thành trong 4 tháng với đội ngũ 25 kỹ sư và thợ lành nghề. Tổng giá trị hợp đồng 2.8 tỉ đồng.",
                    Tags = "Modern Luxury,Biệt Thự,Vinhomes",
                    Thumbnail = "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800"
                },
                new Project
                {
                    Title = "Căn Hộ Penthouse Q7 - 320m²",
                    Slug = "can-ho-penthouse-q7",
                    Description = "Penthouse tầng 38 với view sông Sài Gòn, thiết kế Open Space kết hợp bếp đảo và phòng khách liền mạch.",
                    Content = "Điểm nhấn là hệ thống đèn RGB thông minh điều khiển qua app và cầu thang xoắn ốc nội thất bằng thép nguyên khối.",
                    Tags = "Penthouse,Hiện Đại,Quận 7",
                    Thumbnail = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800"
                },
                new Project
                {
                    Title = "Văn Phòng Công Ty Fintech 200m²",
                    Slug = "van-phong-cong-ty-fintech",
                    Description = "Văn phòng theo concept Industrial Chic với tường gạch mộc, đường ống lộ và không gian làm việc chung (co-working) linh hoạt.",
                    Content = "Thiết kế tối ưu 50 chỗ làm việc trong diện tích 200m², có phòng họp kính riêng và khu bếp/nghỉ ngơi đầy đủ.",
                    Tags = "Văn Phòng,Industrial,Fintech",
                    Thumbnail = "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800"
                }
            );
            await _context.SaveChangesAsync();
        }

        return Ok(new
        {
            Message = "✅ Seed data thành công!",
            Categories = _context.Categories.Count(),
            Products = _context.Products.Count(),
            Projects = _context.Projects.Count()
        });
    }

    [HttpPost("customers")]
    public async Task<IActionResult> SeedCustomers()
    {
        if (!_env.IsDevelopment()) return Forbid();

        if (!_context.Customers.Any())
        {
            _context.Customers.AddRange(
                new Customer { PhoneNumber = "0901234567", Name = "Nguyễn Văn An", Address = "123 Lê Lợi, Quận 1, TP.HCM", Source = CustomerSource.Consultation, Status = CustomerStatus.CAN_LIEN_HE, Note = "Khách hỏi về nội thất phòng khách", CreatedAt = DateTime.UtcNow.AddDays(-10) },
                new Customer { PhoneNumber = "0912345678", Name = "Trần Thị Bình", Address = "456 Nguyễn Huệ, Quận 1, TP.HCM", Source = CustomerSource.Cart, Status = CustomerStatus.DANG_CHAM_SOC, Note = "Đã tư vấn, đang cân nhắc sofa chữ L", CreatedAt = DateTime.UtcNow.AddDays(-8) },
                new Customer { PhoneNumber = "0923456789", Name = "Lê Minh Châu", Address = "789 Cách Mạng Tháng 8, Quận 3, TP.HCM", Source = CustomerSource.Chat, Status = CustomerStatus.DA_CHOT_HOP_DONG, Note = "Đã ký HĐ tủ bếp Acrylic 45 triệu", CreatedAt = DateTime.UtcNow.AddDays(-6) },
                new Customer { PhoneNumber = "0934567890", Name = "Phạm Thị Dung", Address = "101 Hai Bà Trưng, Quận 3, TP.HCM", Source = CustomerSource.Contact, Status = CustomerStatus.CAN_LIEN_HE, Note = "", CreatedAt = DateTime.UtcNow.AddDays(-5) },
                new Customer { PhoneNumber = "0945678901", Name = "Hoàng Văn Em", Address = "202 Võ Văn Kiệt, Quận 1, TP.HCM", Source = CustomerSource.Consultation, Status = CustomerStatus.DANG_CHAM_SOC, Note = "Đang thiết kế phòng ngủ master", CreatedAt = DateTime.UtcNow.AddDays(-3) },
                new Customer { PhoneNumber = "0956789012", Name = "Ngô Thị Phương", Address = "303 Lý Tự Trọng, Quận 1, TP.HCM", Source = CustomerSource.Cart, Status = CustomerStatus.DA_CHOT_HOP_DONG, Note = "HĐ bàn làm việc + kệ sách 25 triệu", CreatedAt = DateTime.UtcNow.AddDays(-2) },
                new Customer { PhoneNumber = "0967890123", Name = "Vũ Đức Giang", Address = "404 Trần Hưng Đạo, Quận 5, TP.HCM", Source = CustomerSource.Chat, Status = CustomerStatus.CAN_LIEN_HE, Note = "", CreatedAt = DateTime.UtcNow.AddDays(-1) },
                new Customer { PhoneNumber = "0978901234", Name = "Đinh Thị Hoa", Address = "505 Nguyễn Tri Phương, Quận 10, TP.HCM", Source = CustomerSource.Contact, Status = CustomerStatus.DANG_CHAM_SOC, Note = "Đang báo giá nội thất toàn nhà 3 tầng", CreatedAt = DateTime.UtcNow }
            );
            await _context.SaveChangesAsync();
        }

        return Ok(new { Message = "✅ Seed customers thành công!", Customers = _context.Customers.Count() });
    }

    [HttpDelete]
    public async Task<IActionResult> ClearData()
    {
        if (!_env.IsDevelopment()) return Forbid();

        _context.Projects.RemoveRange(_context.Projects);
        _context.Products.RemoveRange(_context.Products);
        _context.Categories.RemoveRange(_context.Categories);
        await _context.SaveChangesAsync();

        return Ok(new { Message = "Đã xóa toàn bộ dữ liệu mẫu." });
    }
}
