using System.Collections.Generic;

namespace NVHome.Application.DTOs.Projects;

public class CreateProjectRequest
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Content { get; set; } // Rich text HTML
    public string? Tags { get; set; }
    public string? VideoUrl { get; set; } // YouTube / File MP4
    public string? Thumbnail { get; set; }
    public Guid? CategoryId { get; set; }
    public List<string> Gallery { get; set; } = new();
    public List<Guid> RelatedProductIds { get; set; } = new();
}

public class ProjectResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Content { get; set; }
    public string? Tags { get; set; }
    public string? VideoUrl { get; set; }
    public string? Thumbnail { get; set; }
    public Guid? CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public List<string> Gallery { get; set; } = new();
    public List<RelatedProductDTO> RelatedProducts { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

public class RelatedProductDTO
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Images { get; set; }
    public decimal OriginalPrice { get; set; }
    public decimal? DiscountPrice { get; set; }
}
