namespace NVHome.Application.DTOs.Products;

public class CreateProductRequest
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public decimal OriginalPrice { get; set; }
    public decimal? DiscountPrice { get; set; }
    public string? Description { get; set; }
    public Guid CategoryId { get; set; }
    public string? Images { get; set; } // Mảng JSON
    public List<ProductSpecificationDTO>? Specifications { get; set; }
    public List<string>? Features { get; set; }
    public string? CustomOptions { get; set; }
}

public class ProductSpecificationDTO
{
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
}

public class ProductResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public decimal OriginalPrice { get; set; }
    public decimal? DiscountPrice { get; set; }
    public double? DiscountPercent { get; set; }
    public string? Description { get; set; }
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string? Images { get; set; }
    public List<ProductSpecificationDTO>? Specifications { get; set; }
    public List<string>? Features { get; set; }
    public string? CustomOptions { get; set; }
    public DateTime CreatedAt { get; set; }
}
