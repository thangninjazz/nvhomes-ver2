using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NVHome.Application.DTOs.Products;
using NVHome.Domain.Entities;
using NVHome.Infrastructure.Data;
using NVHome.Infrastructure.Services;
using System.Text.Json;

namespace NVHome.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IFileService _fileService;

    public ProductsController(ApplicationDbContext context, IFileService fileService)
    {
        _context = context;
        _fileService = fileService;
    }

    // API Nâng cao: Hỗ trợ Filter theo danh mục con, Sorting
    [HttpGet]
    public async Task<IActionResult> GetProducts(
        [FromQuery] Guid? categoryId,
        [FromQuery] string? categorySlug,
        [FromQuery] string? sortOrder)
    {
        var query = _context.Products
            .Include(p => p.Category)
            .ThenInclude(c => c.Parent)
            .AsQueryable();

        // 1. Lọc theo danh mục (Hỗ trợ đệ quy lấy cả con nếu là cha)
        if (categoryId.HasValue || !string.IsNullOrEmpty(categorySlug))
        {
            var category = categoryId.HasValue 
                ? await _context.Categories.FindAsync(categoryId.Value)
                : await _context.Categories.FirstOrDefaultAsync(c => c.Slug == categorySlug);

            if (category != null)
            {
                // Lấy tất cả IDs của các danh mục con (đệ quy đơn giản bằng cách fetch hết về và xử lý)
                var allCategories = await _context.Categories.ToListAsync();
                var descendantIds = new List<Guid> { category.Id };
                
                void AddChildren(Guid parentId)
                {
                    var children = allCategories.Where(c => c.ParentId == parentId).Select(c => c.Id).ToList();
                    foreach (var childId in children)
                    {
                        descendantIds.Add(childId);
                        AddChildren(childId);
                    }
                }
                
                AddChildren(category.Id);
                query = query.Where(p => descendantIds.Contains(p.CategoryId));
            }
        }

        // 2. Sắp xếp (Sorting) dynamic
        query = sortOrder switch
        {
            "price_asc" => query.OrderBy(p => p.DiscountPrice ?? p.OriginalPrice),
            "price_desc" => query.OrderByDescending(p => p.DiscountPrice ?? p.OriginalPrice),
            "newest" => query.OrderByDescending(p => p.CreatedAt),
            // Tương lai: "popular" => sortBy views/sales
            _ => query.OrderByDescending(p => p.CreatedAt) // Mặc định là mới nhất
        };

        var products = await query.Select(p => new ProductResponse
        {
            Id = p.Id,
            Name = p.Name,
            Slug = p.Slug,
            OriginalPrice = p.OriginalPrice,
            DiscountPrice = p.DiscountPrice,
            DiscountPercent = p.DiscountPercent,
            Description = p.Description,
            CategoryId = p.CategoryId,
            CategoryName = p.Category != null ? p.Category.Name : string.Empty,
            CategorySlug = p.Category != null ? p.Category.Slug : string.Empty,
            ParentCategoryName = p.Category?.Parent?.Name,
            ParentCategorySlug = p.Category?.Parent?.Slug,
            Images = p.Images,
            Specifications = SafeDeserialize<List<ProductSpecificationDTO>>(p.Specifications),
            Features = SafeDeserialize<List<string>>(p.Features),
            CustomOptions = p.CustomOptions,
            CreatedAt = p.CreatedAt
        }).ToListAsync();
        return Ok(products);
    }

    private static T SafeDeserialize<T>(string? json) where T : new()
    {
        if (string.IsNullOrEmpty(json)) return new T();
        try { return JsonSerializer.Deserialize<T>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new T(); }
        catch { return new T(); }
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetProduct(Guid id)
    {
        var p = await _context.Products
            .Include(x => x.Category)
            .ThenInclude(c => c.Parent)
            .FirstOrDefaultAsync(x => x.Id == id);
        if (p == null) return NotFound("Không tìm thấy sản phẩm.");

        return Ok(new ProductResponse
        {
            Id = p.Id, Name = p.Name, Slug = p.Slug,
            OriginalPrice = p.OriginalPrice, DiscountPrice = p.DiscountPrice,
            DiscountPercent = p.DiscountPercent, Description = p.Description,
            CategoryId = p.CategoryId,
            CategoryName = p.Category != null ? p.Category.Name : string.Empty,
            CategorySlug = p.Category != null ? p.Category.Slug : string.Empty,
            ParentCategoryName = p.Category?.Parent?.Name,
            ParentCategorySlug = p.Category?.Parent?.Slug,
            Images = p.Images,
            Specifications = SafeDeserialize<List<ProductSpecificationDTO>>(p.Specifications),
            Features = SafeDeserialize<List<string>>(p.Features),
            CustomOptions = p.CustomOptions, CreatedAt = p.CreatedAt
        });
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetProductBySlug(string slug)
    {
        var p = await _context.Products
            .Include(x => x.Category)
            .ThenInclude(c => c.Parent)
            .FirstOrDefaultAsync(x => x.Slug == slug);
        if (p == null) return NotFound("Không tìm thấy sản phẩm.");

        return Ok(new ProductResponse
        {
            Id = p.Id, Name = p.Name, Slug = p.Slug,
            OriginalPrice = p.OriginalPrice, DiscountPrice = p.DiscountPrice,
            DiscountPercent = p.DiscountPercent, Description = p.Description,
            CategoryId = p.CategoryId,
            CategoryName = p.Category != null ? p.Category.Name : string.Empty,
            CategorySlug = p.Category != null ? p.Category.Slug : string.Empty,
            ParentCategoryName = p.Category?.Parent?.Name,
            ParentCategorySlug = p.Category?.Parent?.Slug,
            Images = p.Images,
            Specifications = SafeDeserialize<List<ProductSpecificationDTO>>(p.Specifications),
            Features = SafeDeserialize<List<string>>(p.Features),
            CustomOptions = p.CustomOptions, CreatedAt = p.CreatedAt
        });
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPost]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductRequest request)
    {
        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == request.CategoryId);
        if (!categoryExists) return BadRequest("Danh mục sản phẩm không tồn tại.");

        // Tính % giảm giá tự động nếu có
        double? calcDiscount = null;
        if (request.DiscountPrice.HasValue && request.OriginalPrice > 0)
        {
            calcDiscount = Math.Round((double)(1 - request.DiscountPrice.Value / request.OriginalPrice) * 100, 2);
        }

        var product = new Product
        {
            Name = request.Name,
            Slug = request.Slug,
            OriginalPrice = request.OriginalPrice,
            DiscountPrice = request.DiscountPrice,
            DiscountPercent = calcDiscount,
            Description = System.Net.WebUtility.HtmlDecode(request.Description),
            CategoryId = request.CategoryId,
            Images = request.Images,
            Specifications = request.Specifications != null ? JsonSerializer.Serialize(request.Specifications) : null,
            Features = request.Features != null ? JsonSerializer.Serialize(request.Features) : null,
            CustomOptions = request.CustomOptions
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return Ok(new { Message = "Thêm sản phẩm thành công.", Id = product.Id });
    }

    [Authorize(Roles = "Admin,Editor")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(Guid id, [FromBody] CreateProductRequest request)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound("Không tìm thấy sản phẩm.");

        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == request.CategoryId);
        if (!categoryExists) return BadRequest("Danh mục sản phẩm không tồn tại.");

        double? calcDiscount = null;
        if (request.DiscountPrice.HasValue && request.OriginalPrice > 0)
            calcDiscount = Math.Round((double)(1 - request.DiscountPrice.Value / request.OriginalPrice) * 100, 2);

        // 1. Dọn dẹp ảnh cũ bị gỡ bỏ khỏi thư viện (Gallery)
        _fileService.DeleteOrphanedImages(product.Images, request.Images);

        // 2. Dọn dẹp ảnh cũ bị gỡ bỏ khỏi mô tả chi tiết (HTML Content)
        _fileService.DeleteOrphanedImagesInHtml(product.Description, request.Description);

        product.Name = request.Name; product.Slug = request.Slug;
        product.OriginalPrice = request.OriginalPrice; product.DiscountPrice = request.DiscountPrice;
        product.DiscountPercent = calcDiscount; 
        product.Description = System.Net.WebUtility.HtmlDecode(request.Description);
        product.CategoryId = request.CategoryId; product.Images = request.Images;
        product.Specifications = request.Specifications != null ? JsonSerializer.Serialize(request.Specifications) : null;
        product.Features = request.Features != null ? JsonSerializer.Serialize(request.Features) : null;
        product.CustomOptions = request.CustomOptions; product.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(new { Message = "Cập nhật sản phẩm thành công." });
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(Guid id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound("Không tìm thấy sản phẩm.");

        // 1. Dọn dẹp tệp ảnh vật lý trong thư viện (Gallery)
        if (!string.IsNullOrEmpty(product.Images))
        {
            var images = product.Images.Split(',', StringSplitOptions.RemoveEmptyEntries);
            _fileService.DeleteFiles(images);
        }

        // 2. Dọn dẹp toàn bộ ảnh mồ côi trong phần Mô tả chi tiết (HTML Content)
        _fileService.DeleteImagesInHtml(product.Description);

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return Ok(new { Message = "Đã xóa sản phẩm thành công và dọn dẹp toàn bộ tệp tin ảnh liên quan." });
    }
}
