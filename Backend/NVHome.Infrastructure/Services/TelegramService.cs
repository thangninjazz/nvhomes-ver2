using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NVHome.Application.Interfaces;
using System.Net.Http;

namespace NVHome.Infrastructure.Services;

public class TelegramService : ITelegramService
{
    private readonly HttpClient _httpClient;
    private readonly string? _botToken;
    private readonly string? _chatId;
    private readonly ILogger<TelegramService> _logger;

    public TelegramService(HttpClient httpClient, IConfiguration configuration, ILogger<TelegramService> logger)
    {
        _httpClient = httpClient;
        _botToken = configuration["TELEGRAM_BOT_TOKEN"] ?? configuration["Telegram:BotToken"];
        _chatId = configuration["TELEGRAM_CHAT_ID"] ?? configuration["Telegram:ChatId"];
        _logger = logger;
    }

    public async Task SendMessageAsync(string message)
    {
        if (string.IsNullOrEmpty(_botToken) || string.IsNullOrEmpty(_chatId))
        {
            _logger.LogWarning("Telegram BotToken hoặc ChatId chưa được cấu hình. Bỏ qua gửi thông báo.");
            return;
        }

        try
        {
            // Sử dụng parse_mode=HTML để tin nhắn chuyên nghiệp hơn
            var url = $"https://api.telegram.org/bot{_botToken}/sendMessage?chat_id={_chatId}&text={Uri.EscapeDataString(message)}&parse_mode=HTML";
            
            var response = await _httpClient.GetAsync(url);
            
            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                _logger.LogError("Gửi tin nhắn Telegram thất bại. Status: {Status}, Error: {Error}", response.StatusCode, error);
            }
            else
            {
                _logger.LogInformation("Đã gửi thông báo Telegram thành công cho lead mới.");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Lỗi nghiêm trọng khi gọi API Telegram.");
        }
    }
}
