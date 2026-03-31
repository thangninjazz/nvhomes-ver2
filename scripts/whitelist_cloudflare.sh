#!/bin/bash
# -------------------------------------------------------------------------
# 🏠 NVHome Cloudflare UFW Whitelist Script
# Tác giả: Antigravity
# Chức năng: Tự động cập nhật danh sách IP của Cloudflare và cấu hình UFW
# -------------------------------------------------------------------------

echo "--- 🔄 Đang tải danh sách IP mới nhất từ Cloudflare ---"

# Tải danh sách IPv4 và IPv6
IPS_V4=$(curl -s https://www.cloudflare.com/ips-v4)
IPS_V6=$(curl -s https://www.cloudflare.com/ips-v6)

if [ -z "$IPS_V4" ] || [ -z "$IPS_V6" ]; then
    echo "❌ LỖI: Không thể tải danh sách IP. Vui lòng kiểm tra kết nối mạng."
    exit 1
fi

echo "--- 🛡️ Đang cấu hình luật UFW cho Cloudflare ---"

# 1. Đặt mặc định là chặn truy cập cổng 80/443 nếu không khớp luật
# (Đảm bảo các truy cập trực tiếp bằng IP sẽ bị chặn)
# Lưu ý: Lệnh này không ảnh hưởng đến các cổng khác như 22 (SSH)
# ufw default deny incoming # Thông thường UFW đã mặc định là deny incoming

# 2. Xóa các luật cũ liên quan đến 80/443 để tránh bị lặp (Tùy chọn)
# ufw delete allow 80/tcp
# ufw delete allow 443/tcp

# 3. Cho phép từng dải IPv4 của Cloudflare truy cập cổng 80 và 443
for ip in $IPS_V4; do
    ufw allow from $ip to any port 80,443 proto tcp comment 'Cloudflare IPv4'
done

# 4. Cho phép từng dải IPv6 của Cloudflare truy cập cổng 80 và 443
for ip in $IPS_V6; do
    ufw allow from $ip to any port 80,443 proto tcp comment 'Cloudflare IPv6'
done

# 5. Đảm bảo cổng SSH (22) vẫn mở để không bị khóa server
ufw allow 22/tcp comment 'SSH Port'

# 6. Tải lại cấu hình UFW
ufw reload

echo "--- ✅ Đã cập nhật danh sách IP Cloudflare thành công! ---"
echo "Bây giờ chỉ các truy cập thông qua Cloudflare mới có thể vào được website."
