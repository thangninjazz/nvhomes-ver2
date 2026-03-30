namespace NVHome.Domain.Entities;

// Thực thể Sản phẩm
public class Product : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    
    // === PRICING ===
    public decimal OriginalPrice { get; set; } // Giá gốc (sẽ bị gạch ngang nếu có giảm giá)
    public decimal? DiscountPrice { get; set; } // Giá sau khi giảm
    public double? DiscountPercent { get; set; } // % Giảm giá (có thể auto calc)
    
    // === DETAILS ===
    public string? Description { get; set; } // Bổ sung mô tả chi tiết sản phẩm
    
    // Khóa ngoại liên kết tới Category
    public Guid CategoryId { get; set; }
    public Category? Category { get; set; }
    
    // Hình ảnh (Lưu dưới dạng mảng JSON string cho multiple images)
    public string? Images { get; set; }
    
    // === STRUCTURED DETAILS ===
    public string? Specifications { get; set; } // JSON [{key, value}]
    public string? Features { get; set; }       // JSON [string]
    
    // Tùy chọn (Màu sắc, kích thước...)
    public string? CustomOptions { get; set; }

    public ICollection<ProjectProduct> ProjectProducts { get; set; } = new List<ProjectProduct>();
}
