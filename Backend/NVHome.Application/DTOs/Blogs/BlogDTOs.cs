namespace NVHome.Application.DTOs.Blogs;

// DTO yêu cầu đăng bài viết mới
public class CreateBlogRequest
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty; // Chứa HTML Editor
    public string? Thumbnail { get; set; }
}

// DTO trả về thông tin bài viết
public class BlogResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? Thumbnail { get; set; }
    public Guid AuthorId { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
