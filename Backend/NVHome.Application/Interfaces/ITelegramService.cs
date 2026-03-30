namespace NVHome.Application.Interfaces;

public interface ITelegramService
{
    Task SendMessageAsync(string message);
}
