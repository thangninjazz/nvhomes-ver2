using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NVHome.Infrastructure.Data;
using NVHome.Domain.Entities;

namespace NVHome.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SearchController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SearchController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GlobalSearch([FromQuery] string q)
    {
        if (string.IsNullOrWhiteSpace(q))
        {
            return Ok(new { products = new List<object>(), projects = new List<object>() });
        }

        var keyword = q.ToLower();

        // Tìm kiếm sản phẩm (Bao gồm cả theo tên Danh mục)
        var products = await _context.Products
            .Include(p => p.Category)
            .Where(p => p.Name.ToLower().Contains(keyword) 
                || p.Slug.ToLower().Contains(keyword) 
                || (p.Description != null && p.Description.ToLower().Contains(keyword))
                || (p.Category != null && p.Category.Name.ToLower().Contains(keyword)))
            .Select(p => new {
                p.Id,
                p.Name,
                p.Slug,
                p.OriginalPrice,
                p.DiscountPrice,
                p.Images,
                Type = "product"
            })
            .Take(10)
            .ToListAsync();

        // Tìm kiếm dự án
        var projects = await _context.Projects
            .Where(p => p.Title.ToLower().Contains(keyword) || p.Slug.ToLower().Contains(keyword) || (p.Description != null && p.Description.ToLower().Contains(keyword)))
            .Select(p => new {
                p.Id,
                Title = p.Title,
                p.Slug,
                Thumbnail = p.Thumbnail ?? "",
                p.Tags,
                Type = "project"
            })
            .Take(10)
            .ToListAsync();

        return Ok(new { products, projects });
    }
}
