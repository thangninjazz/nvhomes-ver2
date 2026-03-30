using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NVHome.Application.DTOs.Products;
using NVHome.Domain.Entities;
using NVHome.Infrastructure.Data;
using Microsoft.Extensions.Caching.Memory;

namespace NVHome.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IMemoryCache _cache;
    private const string CategoryTreeCacheKey = "CategoryTree_";
    private const string CategoryCacheVersionKey = "Category_Version";

    public CategoriesController(ApplicationDbContext context, IMemoryCache cache)
    {
        _context = context;
        _cache = cache;
    }

    private void ClearCategoryCache()
    {
        // Tăng version của cache để vô hiệu hóa tất cả cache cũ cùng lúc (Versioning strategy)
        _cache.TryGetValue(CategoryCacheVersionKey, out int currentVersion);
        _cache.Set(CategoryCacheVersionKey, currentVersion + 1);
    }

    // Lấy Menu theo dạng Tree (Đa cấp) đệ quy
    [HttpGet("tree")]
    public async Task<IActionResult> GetMenuTree([FromQuery] string type = "product", [FromQuery] bool includeHidden = false)
    {
        // Lấy version hiện tại của cache
        _cache.TryGetValue(CategoryCacheVersionKey, out int currentVersion);

        var normalizedType = (type ?? "product").ToLowerInvariant();
        var cacheKey = $"{CategoryTreeCacheKey}{normalizedType}_{includeHidden}_v{currentVersion}";
        
        if (_cache.TryGetValue(cacheKey, out List<CategoryResponse>? cachedTree))
        {
            return Ok(cachedTree);
        }

        // Chuyển đổi string sang Enum
        if (!Enum.TryParse<CategoryType>(normalizedType, true, out var catType))
        {
            catType = CategoryType.Product;
        }

        // Lấy tất cả các Category thuộc Type tương ứng (Lọc theo IsVisible nếu không includeHidden)
        var query = _context.Categories.Where(c => c.Type == catType);
        
        if (!includeHidden)
        {
            query = query.Where(c => c.IsVisible);
        }

        var allCategories = await query
            .OrderBy(c => c.OrderIndex)
            .ToListAsync();

        var lookup = allCategories.ToLookup(c => c.ParentId);

        // Hàm đệ quy xây dựng cây
        List<CategoryResponse> BuildTree(Guid? parentId)
        {
            return lookup[parentId].Select(c => new CategoryResponse
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                ParentId = c.ParentId,
                OrderIndex = c.OrderIndex,
                IsVisible = c.IsVisible,
                Type = c.Type.ToString(),
                Children = BuildTree(c.Id)
            }).ToList();
        }

        var result = BuildTree(null);

        // Lưu vào cache trong 30 phút
        _cache.Set(cacheKey, result, TimeSpan.FromMinutes(30));

        return Ok(result);
    }

    // Flat list cho Admin (không cần auth để admin page load được)
    [HttpGet]
    public async Task<IActionResult> GetCategories([FromQuery] string? type)
    {
        IQueryable<Category> query = _context.Categories;

        if (!string.IsNullOrEmpty(type) && Enum.TryParse<CategoryType>(type, true, out var catType))
        {
            query = query.Where(c => c.Type == catType);
        }

        var categories = await query
            .OrderBy(c => c.OrderIndex)
            .ToListAsync();

        var response = categories.Select(c => new CategoryResponse
        {
            Id = c.Id,
            Name = c.Name,
            Slug = c.Slug,
            ParentId = c.ParentId,
            OrderIndex = c.OrderIndex,
            IsVisible = c.IsVisible,
            Type = c.Type.ToString()
        }).ToList();

        return Ok(response);
    }

    [HttpGet("byslug/{slug}")]
    public async Task<IActionResult> GetCategoryBySlug(string slug)
    {
        var category = await _context.Categories
            .Include(c => c.Parent)
            .FirstOrDefaultAsync(c => c.Slug == slug);

        if (category == null) return NotFound("Không tìm thấy danh mục.");

        return Ok(new CategoryResponse
        {
            Id = category.Id,
            Name = category.Name,
            Slug = category.Slug,
            ParentId = category.ParentId,
            ParentName = category.Parent?.Name,
            ParentSlug = category.Parent?.Slug,
            OrderIndex = category.OrderIndex,
            IsVisible = category.IsVisible,
            Type = category.Type.ToString()
        });
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPost]
    public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryRequest request)
    {
        var category = new Category
        {
            Name = request.Name,
            Slug = request.Slug,
            ParentId = request.ParentId,
            OrderIndex = request.OrderIndex,
            IsVisible = request.IsVisible,
            Type = Enum.TryParse<CategoryType>(request.Type, true, out var catType) ? catType : CategoryType.Product
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        ClearCategoryCache();

        return Ok(new { Message = "Đã tạo danh mục thành công.", Id = category.Id });
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCategory(Guid id, [FromBody] CreateCategoryRequest request)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null) return NotFound("Không tìm thấy danh mục.");

        category.Name = request.Name;
        category.Slug = request.Slug;
        category.ParentId = request.ParentId;
        category.OrderIndex = request.OrderIndex;
        category.IsVisible = request.IsVisible;
        category.Type = Enum.TryParse<CategoryType>(request.Type, true, out var catType) ? catType : category.Type;
        category.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        
        ClearCategoryCache();
        
        return Ok(new { Message = "Cập nhật danh mục thành công." });
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(Guid id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null) return NotFound("Không tìm thấy danh mục.");

        // 1. Kiểm tra xem có danh mục con không (Ngăn xóa cha khi còn con)
        var hasChildren = await _context.Categories.AnyAsync(c => c.ParentId == id);
        if (hasChildren)
        {
            return BadRequest(new { message = "Không thể xóa vì danh mục này có chứa các danh mục con. Hãy xóa hoặc chuyển các danh mục con trước." });
        }

        // 2. Kiểm tra xem có sản phẩm thuộc danh mục này không
        var hasProducts = await _context.Products.AnyAsync(p => p.CategoryId == id);
        if (hasProducts)
        {
            return BadRequest(new { message = "Không thể xóa vì vẫn còn sản phẩm đang thuộc danh mục này. Hãy đổi danh mục cho sản phẩm trước." });
        }

        // 3. Kiểm tra xem có dự án thuộc danh mục này không (Nếu là type Project)
        var hasProjects = await _context.Projects.AnyAsync(p => p.CategoryId == id);
        if (hasProjects)
        {
            return BadRequest(new { message = "Không thể xóa vì vẫn còn dự án đang thuộc danh mục này." });
        }

        // Xóa hoàn toàn khỏi database (Clean hard delete)
        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();
        
        ClearCategoryCache();
        
        return Ok(new { message = "Đã xóa danh mục thành công và làm sạch database." });
    }
}
