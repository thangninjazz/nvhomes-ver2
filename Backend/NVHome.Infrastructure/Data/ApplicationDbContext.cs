using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using NVHome.Domain.Entities;

namespace NVHome.Infrastructure.Data;

// Lớp DbContext đại diện cho phiên làm việc với CSDL
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        // EF Core 9: Bỏ qua cảnh báo model thay đổi chưa được tạo migration khi chạy tự động
        optionsBuilder.ConfigureWarnings(w => w.Ignore(RelationalEventId.PendingModelChangesWarning));
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<ProjectImage> ProjectImages { get; set; }
    public DbSet<ProjectProduct> ProjectProducts { get; set; }
    public DbSet<BlogPost> BlogPosts { get; set; }
    public DbSet<Customer> Customers { get; set; }

    // Tùy chỉnh các quan hệ hoặc tên bảng (nếu cần) khi tạo model
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Đảm bảo Email của User là duy nhất
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();
            
        // Quan hệ Product thuộc về Category
        modelBuilder.Entity<Product>()
            .HasOne(p => p.Category)
            .WithMany(c => c.Products)
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.Cascade);
            
        // Bài Blog liên kết tới User (Tác giả)
        modelBuilder.Entity<BlogPost>()
            .HasOne(b => b.Author)
            .WithMany()
            .HasForeignKey(b => b.AuthorId)
            .OnDelete(DeleteBehavior.Restrict);

        // Danh mục đa cấp (Multi-level menu) liên kết Self-Referencing
        modelBuilder.Entity<Category>()
            .HasOne(c => c.Parent)
            .WithMany(c => c.Children)
            .HasForeignKey(c => c.ParentId)
            .OnDelete(DeleteBehavior.Restrict);

        // Mỗi dự án thuộc về một danh mục (Hạng mục)
        modelBuilder.Entity<Project>()
            .HasOne(p => p.Category)
            .WithMany()
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
