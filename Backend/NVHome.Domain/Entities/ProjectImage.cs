using System.ComponentModel.DataAnnotations.Schema;

namespace NVHome.Domain.Entities;

public class ProjectImage : BaseEntity
{
    public Guid ProjectId { get; set; }
    
    [ForeignKey("ProjectId")]
    public Project? Project { get; set; }
    
    public string ImageUrl { get; set; } = string.Empty;
    
    [NotMapped]
    public string? Caption { get; set; }
    
    public int OrderIndex { get; set; } = 0;
}
