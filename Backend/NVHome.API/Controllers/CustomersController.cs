using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NVHome.Domain.Entities;
using NVHome.Infrastructure.Data;
using System.Text;
using NVHome.Infrastructure.Services;
using NVHome.Application.Interfaces;

namespace NVHome.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IReCaptchaService _reCaptchaService;
    private readonly ITelegramService _telegramService;
    private readonly ILogger<CustomersController> _logger;

    public CustomersController(ApplicationDbContext context, IReCaptchaService reCaptchaService, ITelegramService telegramService, ILogger<CustomersController> logger)
    {
        _context = context;
        _reCaptchaService = reCaptchaService;
        _telegramService = telegramService;
        _logger = logger;
    }

    // GET: api/customers - Lấy danh sách khách hàng cho CRM (Phân trang & Tìm kiếm)
    [HttpGet]
    public async Task<IActionResult> GetCustomers([FromQuery] string? search, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var query = _context.Customers.AsQueryable();

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(c => c.PhoneNumber.Contains(search) || (c.Name != null && c.Name.Contains(search)));
        }

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(c => c.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new { items, total });
    }

    // GET: api/customers/export - Xuất file CSV
    [HttpGet("export")]
    public async Task<IActionResult> ExportCsv()
    {
        var customers = await _context.Customers.ToListAsync();
        var builder = new StringBuilder();
        builder.AppendLine("Id,Name,Phone,Address,Note,Status,CreatedAt");
        foreach (var c in customers)
        {
            builder.AppendLine($"{c.Id},{c.Name},{c.PhoneNumber},{c.Address},{c.Note},{c.Status},{c.CreatedAt}");
        }
        return File(Encoding.UTF8.GetBytes(builder.ToString()), "text/csv", "customers.csv");
    }

    // POST: api/customers
    [HttpPost]
    public async Task<ActionResult<Customer>> CreateCustomer([FromBody] CustomerRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        // 1. Verify ReCaptcha Token (nếu có)
        if (!string.IsNullOrEmpty(request.ReCaptchaToken))
        {
            var isValid = await _reCaptchaService.VerifyToken(request.ReCaptchaToken);
            if (!isValid)
            {
                // Thay vì chặn (BadRequest), chúng ta chỉ log cảnh báo để không làm gián đoạn người dùng
                 _logger.LogWarning("Xác thực reCAPTCHA thất bại cho khách hàng {Phone}, nhưng vẫn cho phép tiếp tục.", request.PhoneNumber);
            }
        }

        // 2. Sanitize dữ liệu trước khi lưu (Chống XSS/Injection)
        var sanitizedName = SanitizeInput(request.Name ?? "");
        var sanitizedNote = SanitizeInput(request.Note ?? "");
        var sanitizedAddress = SanitizeInput(request.Address ?? "");
        var sanitizedPhone = SanitizeInput(request.PhoneNumber);

        var customer = new Customer
        {
            PhoneNumber = sanitizedPhone,
            Name = sanitizedName,
            Note = sanitizedNote,
            Address = sanitizedAddress,
            Source = CustomerSource.Consultation, 
            Status = CustomerStatus.CAN_LIEN_HE,
            CreatedAt = DateTime.UtcNow
        };

        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();

        // 3. Gửi thông báo Telegram cho Admin (Chạy bất đồng bộ)
        var vietnamTime = DateTime.UtcNow.AddHours(7);
        var message = $"<b>🔥 LEAD MỚI TỪ NVHOME</b>\n\n" +
                      $"👤 <b>Tên:</b> {sanitizedName}\n" +
                      $"📞 <b>SĐT:</b> {sanitizedPhone}\n" +
                      $"📍 <b>Địa chỉ:</b> {sanitizedAddress}\n" +
                      $"📝 <b>Ghi chú:</b> {sanitizedNote}\n" +
                      $"⏰ <b>Thời gian:</b> {vietnamTime:dd/MM/yyyy HH:mm}";
        
        _ = _telegramService.SendMessageAsync(message);

        return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id }, customer);
    }

    private string SanitizeInput(string input)
    {
        if (string.IsNullOrEmpty(input)) return input;
        
        // Loại bỏ các tag HTML nguy hiểm (Chống XSS đơn giản)
        var sanitized = System.Net.WebUtility.HtmlEncode(input);
        
        // Hạn chế độ dài để tránh spam buffer (SQL Injection phòng ngừa bằng EF Core tham số hóa sẵn)
        if (sanitized.Length > 2000) sanitized = sanitized.Substring(0, 2000);
        
        return sanitized;
    }

    // GET: api/customers/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Customer>> GetCustomer(Guid id)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer == null) return NotFound();
        return customer;
    }

    // PUT: api/customers/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCustomer(Guid id, [FromBody] UpdateCustomerRequest request)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer == null) return NotFound();

        customer.PhoneNumber = request.PhoneNumber;
        customer.Name = request.Name ?? customer.Name;
        customer.Status = request.Status;
        customer.Note = request.Note;
        customer.Address = request.Address;

        await _context.SaveChangesAsync();
        return NoContent();
    }
    // DELETE: api/customers/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCustomer(Guid id)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer == null) return NotFound();

        _context.Customers.Remove(customer);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

public class CustomerRequest
{
    public string PhoneNumber { get; set; } = string.Empty;
    public string? Name { get; set; }
    public string? Note { get; set; }
    public string? Address { get; set; }
    public string? ReCaptchaToken { get; set; } // Thêm token từ frontend
}

public class UpdateCustomerRequest
{
    public string PhoneNumber { get; set; } = string.Empty;
    public string? Name { get; set; }
    public CustomerStatus Status { get; set; }
    public string? Note { get; set; }
    public string? Address { get; set; }
}
