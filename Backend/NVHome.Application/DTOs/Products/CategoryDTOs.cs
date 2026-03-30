namespace NVHome.Application.DTOs.Products;

public class CreateCategoryRequest
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Type { get; set; } = "Product"; // "Product" hoặc "Project"
    public Guid? ParentId { get; set; }
    public int OrderIndex { get; set; } = 0;
    public bool IsVisible { get; set; } = true;
}

public class CategoryResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Type { get; set; } = "Product";
    public Guid? ParentId { get; set; }
    public string? ParentName { get; set; }
    public string? ParentSlug { get; set; }
    public int OrderIndex { get; set; }
    public bool IsVisible { get; set; }
    
    // Thuộc tính để render thành cấu trúc Multi-level Tree trên Frontend
    public List<CategoryResponse> Children { get; set; } = new List<CategoryResponse>();
}
