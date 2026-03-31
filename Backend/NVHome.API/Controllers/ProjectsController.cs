using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NVHome.Application.DTOs.Projects;
using NVHome.Domain.Entities;
using NVHome.Infrastructure.Data;
using NVHome.Infrastructure.Services;

namespace NVHome.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IFileService _fileService;

    public ProjectsController(ApplicationDbContext context, IFileService fileService)
    {
        _context = context;
        _fileService = fileService;
    }

    [HttpGet]
    public async Task<IActionResult> GetProjects()
    {
        var projects = await _context.Projects
            .Include(p => p.Category)
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new ProjectResponse
            {
                Id = p.Id, Title = p.Title, Slug = p.Slug,
                Description = p.Description, Content = p.Content,
                Tags = p.Tags, VideoUrl = p.VideoUrl,
                Thumbnail = p.Thumbnail,
                CategoryId = p.CategoryId,
                CategoryName = p.Category != null ? p.Category.Name : null,
                CreatedAt = p.CreatedAt
            })
            .ToListAsync();

        return Ok(projects);
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetProjectBySlug(string slug)
    {
        var p = await _context.Projects
            .Include(x => x.Category)
            .Include(x => x.ProjectImages)
            .Include(x => x.ProjectProducts)
                .ThenInclude(pp => pp.Product)
            .FirstOrDefaultAsync(x => x.Slug == slug);

        if (p == null) return NotFound("Không tìm thấy dự án.");

        return Ok(new ProjectResponse
        {
            Id = p.Id, Title = p.Title, Slug = p.Slug,
            Description = p.Description, Content = p.Content,
            Tags = p.Tags, VideoUrl = p.VideoUrl,
            Thumbnail = p.Thumbnail,
            CategoryId = p.CategoryId,
            CategoryName = p.Category != null ? p.Category.Name : null,
            Gallery = p.ProjectImages.OrderBy(i => i.OrderIndex).Select(i => i.ImageUrl).ToList(),
            RelatedProducts = p.ProjectProducts.Select(pp => new RelatedProductDTO 
            {
                Id = pp.ProductId,
                Name = pp.Product!.Name,
                Slug = pp.Product.Slug,
                Images = pp.Product.Images,
                OriginalPrice = pp.Product.OriginalPrice,
                DiscountPrice = pp.Product.DiscountPrice
            }).ToList(),
            CreatedAt = p.CreatedAt
        });
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPost]
    public async Task<IActionResult> CreateProject([FromBody] CreateProjectRequest request)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try 
        {
            var project = new Project
            {
                Title = request.Title, Slug = request.Slug,
                Description = request.Description, Content = request.Content,
                Tags = request.Tags, VideoUrl = request.VideoUrl,
                Thumbnail = request.Thumbnail,
                CategoryId = request.CategoryId
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            // Save Gallery
            if (request.Gallery != null && request.Gallery.Count > 0)
            {
                var idx = 0;
                foreach (var imgUrl in request.Gallery)
                {
                    _context.ProjectImages.Add(new ProjectImage { ProjectId = project.Id, ImageUrl = imgUrl, OrderIndex = idx++ });
                }
            }

            // Save Related Products
            if (request.RelatedProductIds != null && request.RelatedProductIds.Count > 0)
            {
                foreach (var prodId in request.RelatedProductIds)
                {
                    _context.ProjectProducts.Add(new ProjectProduct { ProjectId = project.Id, ProductId = prodId });
                }
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(new { Message = "Thêm dự án thành công.", Id = project.Id });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return BadRequest("Lỗi khi tạo dự án: " + ex.Message);
        }
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProject(Guid id, [FromBody] CreateProjectRequest request)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try 
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null) return NotFound("Không tìm thấy dự án.");

            // 1. Dọn dẹp ảnh cũ trong Thumbnail nếu bị thay đổi
            if (project.Thumbnail != request.Thumbnail)
            {
                _fileService.DeleteFileFromUrl(project.Thumbnail);
            }

            // 2. Dọn dẹp ảnh cũ trong Gallery nếu bị gỡ bỏ
            var oldGallery = await _context.ProjectImages
                .Where(i => i.ProjectId == id)
                .Select(i => i.ImageUrl)
                .ToListAsync();
            
            var newGalleryStr = request.Gallery != null ? string.Join(',', request.Gallery) : "";
            var oldGalleryStr = string.Join(',', oldGallery);
            _fileService.DeleteOrphanedImages(oldGalleryStr, newGalleryStr);

            project.Title = request.Title; project.Slug = request.Slug;
            project.Description = request.Description; project.Content = request.Content;
            project.Tags = request.Tags; project.VideoUrl = request.VideoUrl;
            project.Thumbnail = request.Thumbnail; 
            project.CategoryId = request.CategoryId;
            project.UpdatedAt = DateTime.UtcNow;

            // Update Gallery (Clear and Re-add)
            var oldImages = _context.ProjectImages.Where(i => i.ProjectId == id);
            _context.ProjectImages.RemoveRange(oldImages);
            
            if (request.Gallery != null)
            {
                var idx = 0;
                foreach (var imgUrl in request.Gallery)
                {
                    _context.ProjectImages.Add(new ProjectImage { ProjectId = id, ImageUrl = imgUrl, OrderIndex = idx++ });
                }
            }

            // Update Related Products
            var oldProducts = _context.ProjectProducts.Where(pp => pp.ProjectId == id);
            _context.ProjectProducts.RemoveRange(oldProducts);

            if (request.RelatedProductIds != null)
            {
                foreach (var prodId in request.RelatedProductIds)
                {
                    _context.ProjectProducts.Add(new ProjectProduct { ProjectId = id, ProductId = prodId });
                }
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
            return Ok(new { Message = "Cập nhật dự án thành công." });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return BadRequest("Lỗi khi cập nhật dự án: " + ex.Message);
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProject(Guid id)
    {
        var project = await _context.Projects
            .Include(p => p.ProjectImages)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (project == null) return NotFound("Không tìm thấy dự án.");

        // 1. Dọn dẹp ảnh vật lý trong Gallery
        if (project.ProjectImages != null && project.ProjectImages.Any())
        {
            var galleryUrls = project.ProjectImages.Select(i => i.ImageUrl).ToList();
            foreach (var url in galleryUrls)
            {
                _fileService.DeleteFileFromUrl(url);
            }
        }

        // 2. Dọn dẹp ảnh đại diện vật lý (Thumbnail)
        if (!string.IsNullOrEmpty(project.Thumbnail))
        {
            _fileService.DeleteFileFromUrl(project.Thumbnail);
        }

        // 3. Dọn dẹp ảnh mồ côi trong HTML Content & Mô tả
        _fileService.DeleteImagesInHtml(project.Content);
        _fileService.DeleteImagesInHtml(project.Description);

        _context.Projects.Remove(project);
        await _context.SaveChangesAsync();
        return Ok(new { Message = "Đã xóa dự án thành công và dọn dẹp các tệp tin ảnh liên quan." });
    }
}

