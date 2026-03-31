#!/bin/bash
# 🛡️ NVHome: Thắt chặt bảo mật SSH
# 1. Vô hiệu hóa đăng nhập bằng mật khẩu
# 2. Vô hiệu hóa quyền truy cập trực tiếp của root
# 3. Đảm bảo chỉ đăng nhập qua Public Key Authentication

# 1. Kiểm tra an toàn: Đảm bảo người dùng hiện tại đã cài đặt ít nhất một SSH Key
if [ ! -s "$HOME/.ssh/authorized_keys" ]; then
    echo "❌ LỖI: Không tìm thấy authorized_keys trong $HOME/.ssh/"
    echo "DỪNG LẠI: Tắt đăng nhập bằng mật khẩu bây giờ sẽ khiến bạn không thể vào server!"
    exit 1
fi

echo "✅ Kiểm tra an toàn đạt yêu cầu. Đang thắt chặt bảo mật SSH..."

CONFIG="/etc/ssh/sshd_config"

# Xóa các dòng cấu hình cũ để tránh bị trùng lặp
sed -i "/^#\?PasswordAuthentication/d" "$CONFIG"
sed -i "/^#\?PermitRootLogin/d" "$CONFIG"
sed -i "/^#\?PubkeyAuthentication/d" "$CONFIG"
sed -i "/^#\?ChallengeResponseAuthentication/d" "$CONFIG"

# Thêm cấu hình bảo mật mới
echo "PasswordAuthentication no" >> "$CONFIG"
echo "PermitRootLogin no" >> "$CONFIG"
echo "PubkeyAuthentication yes" >> "$CONFIG"
echo "ChallengeResponseAuthentication no" >> "$CONFIG"

# Khởi động lại dịch vụ SSH để áp dụng thay đổi
systemctl restart ssh
echo "--- ✅ Đã thắt chặt bảo mật SSH thành công! ---"
