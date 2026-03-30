namespace NVHome.Domain.Entities;

public enum CategoryType
{
    Product,
    Project
}

// Thực thể Danh mục (Đóng vai trò làm Menu động nhiều cấp trên Frontend)
public class Category : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;

    // Loại hạng mục để phân biệt giữa Sản phẩm và Dự án
    public CategoryType Type { get; set; } = CategoryType.Product;
    
    // === MULTI-LEVEL MENU ===
    // ID của danh mục cha (nếu là null thì đây là danh mục gốc/menu cấp 1)
    public Guid? ParentId { get; set; }
    public Category? Parent { get; set; }
    
    // Danh sách các danh mục con (Sub-menu)
    public ICollection<Category> Children { get; set; } = new List<Category>();

    // === CMS DISPLAY CONTROLS ===
    // Sắp xếp thứ tự hiển thị menu
    public int OrderIndex { get; set; } = 0;
    
    // Hiển thị hay ẩn menu này
    public bool IsVisible { get; set; } = true;
    
    // Danh sách sản phẩm thuộc danh mục
    public ICollection<Product> Products { get; set; } = new List<Product>();
}
