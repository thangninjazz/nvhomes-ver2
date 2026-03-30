namespace NVHome.Domain.Entities;

// Thực thể Bài viết chia sẻ kiến thức (Blog) / SEO
public class BlogPost : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    
    // Nội dung bài viết - có thể lưu dạng HTML từ Rich Text Editor
    public string Content { get; set; } = string.Empty;
    
    // Hình thu nhỏ
    public string? Thumbnail { get; set; }
    
    // Người viết (Khóa ngoại)
    public Guid AuthorId { get; set; }
    public User? Author { get; set; }
}
