using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Text.Json.Serialization;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace NVHome.Infrastructure.Services
{
    public interface IReCaptchaService
    {
        Task<bool> VerifyToken(string token);
    }

    public class ReCaptchaService : IReCaptchaService
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;
        private readonly Microsoft.Extensions.Logging.ILogger<ReCaptchaService> _logger;

        public ReCaptchaService(IConfiguration configuration, HttpClient httpClient, Microsoft.Extensions.Logging.ILogger<ReCaptchaService> logger)
        {
            _configuration = configuration;
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task<bool> VerifyToken(string token)
        {
            var secretKey = _configuration["ReCaptcha:SecretKey"];
            if (string.IsNullOrEmpty(secretKey))
            {
                _logger.LogWarning("reCAPTCHA SecretKey is missing in configuration.");
                return true; 
            }

            // Safety checks for logging to prevent crash if token is null or short
            var safeSecret = !string.IsNullOrEmpty(secretKey) && secretKey.Length >= 5 ? secretKey.Substring(0, 5) : "***";
            var safeToken = !string.IsNullOrEmpty(token) && token.Length >= 10 ? token.Substring(0, 10) : (token ?? "null");

            _logger.LogInformation("Verifying reCAPTCHA. Secret starts with: {PartialSecret}... Token starts with: {PartialToken}...", 
                safeSecret, safeToken);

            try 
            {
                var content = new FormUrlEncodedContent(new[]
                {
                    new KeyValuePair<string, string>("secret", secretKey!),
                    new KeyValuePair<string, string>("response", token ?? "")
                });

                var response = await _httpClient.PostAsync("https://www.google.com/recaptcha/api/siteverify", content);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("reCAPTCHA API returned non-success status: {Status}", response.StatusCode);
                    return false;
                }

                var jsonString = await response.Content.ReadAsStringAsync();
                _logger.LogInformation("reCAPTCHA Response from Google: {Json}", jsonString);
                
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var result = JsonSerializer.Deserialize<ReCaptchaResponse>(jsonString, options);

                if (result == null || !result.Success)
                {
                    _logger.LogWarning("reCAPTCHA Verification Failed. Full Response: {Json}", jsonString);
                    return false; 
                }

                _logger.LogInformation("reCAPTCHA Verified Successfully. Score: {Score}", result.Score);
                return result.Score >= 0.3f; 
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi gọi API reCAPTCHA. Có thể do lỗi mạng hoặc cấu hình.");
                return false; // Fail-safe: Vẫn cho phép ghi nhận khách hàng nếu API gặp lỗi kỹ thuật
            }
        }

        private class ReCaptchaResponse
        {
            public bool Success { get; set; }
            public float Score { get; set; } // For v3
            [JsonPropertyName("error-codes")]
            public string[]? ErrorCodes { get; set; }
        }
    }
}
