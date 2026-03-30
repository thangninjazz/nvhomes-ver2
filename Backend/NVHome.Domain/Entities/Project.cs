namespace NVHome.Domain.Entities;

// Thực thể Dự án tiêu biểu
public class Project : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    
    // Mô tả ngắn
    public string? Description { get; set; }
    
    // Nội dung bài viết chi tiết (Rich text / HTML) lưu lại quá trình thi công
    public string? Content { get; set; }
    
    // Phân loại thẻ (Tags), vd: phòng bếp, phòng khách, chung cư
    public string? Tags { get; set; }
    
    // === MEDIA ===
    // URL Video YouTube hoặc File MP4
    public string? VideoUrl { get; set; }
    
    // Hình ảnh đại diện dự án
    public string? Thumbnail { get; set; }

    // === RELATIONSHIPS ===
    public Guid? CategoryId { get; set; }
    public Category? Category { get; set; }
    
    public ICollection<ProjectImage> ProjectImages { get; set; } = new List<ProjectImage>();
    public ICollection<ProjectProduct> ProjectProducts { get; set; } = new List<ProjectProduct>();
}
