using System.ComponentModel.DataAnnotations;

namespace NVHome.Domain.Entities;

public enum CustomerSource
{
    Cart,           // Đến từ giỏ hàng
    Consultation,    // Đến từ yêu cầu tư vấn thiết kế
    Contact,        // Đến từ form liên hệ
    Chat            // Đến từ chatbox
}

public enum CustomerStatus
{
    CAN_LIEN_HE,        // Cần liên hệ (mặc định)
    DANG_CHAM_SOC,      // Đang chăm sóc
    DA_CHOT_HOP_DONG    // Đã chốt hợp đồng
}

public class Customer : BaseEntity
{
    [Required]
    [Phone]
    public string PhoneNumber { get; set; } = string.Empty;
    
    public string Name { get; set; } = string.Empty;
    
    [Required]
    public CustomerSource Source { get; set; }
    
    public CustomerStatus Status { get; set; } = CustomerStatus.CAN_LIEN_HE;
    
    public string? Note { get; set; }

    public string? Address { get; set; }
}
