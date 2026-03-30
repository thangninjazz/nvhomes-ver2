using System.ComponentModel.DataAnnotations.Schema;

namespace NVHome.Domain.Entities;

public class ProjectProduct : BaseEntity
{
    public Guid ProjectId { get; set; }
    
    [ForeignKey("ProjectId")]
    public Project? Project { get; set; }
    
    public Guid ProductId { get; set; }
    
    [ForeignKey("ProductId")]
    public Product? Product { get; set; }
}
