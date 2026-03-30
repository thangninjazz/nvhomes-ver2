using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NVHome.Domain.Entities;
using NVHome.Infrastructure.Data;
using System.Text;

namespace NVHome.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class CrmController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CrmController(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// GET /api/crm/dashboard - Trả về thống kê CRM từ database thực
    /// </summary>
    [HttpGet("dashboard")]
    public async Task<ActionResult> GetDashboard()
    {
        var totalCustomers = await _context.Customers.CountAsync();
        var newLeads = await _context.Customers.CountAsync(c => c.Status == CustomerStatus.CAN_LIEN_HE);
        var inProgress = await _context.Customers.CountAsync(c => c.Status == CustomerStatus.DANG_CHAM_SOC);
        var closedDeals = await _context.Customers.CountAsync(c => c.Status == CustomerStatus.DA_CHOT_HOP_DONG);

        return Ok(new
        {
            totalCustomers,
            newLeads,
            inProgress,
            closedDeals
        });
    }
}
