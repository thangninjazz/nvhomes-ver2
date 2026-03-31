#!/bin/bash
# 🛡️ NVHome: Thiết lập Fail2Ban bảo vệ Nginx & SSH
# 
# Fail2Ban sẽ theo dõi log và tự động khóa IP nếu phát hiện hành vi:
# 1. Quét tìm các tệp không tồn tại (Lỗi 404)
# 2. Thử đăng nhập SSH sai quá nhiều lần

# 1. Tạo bộ lọc theo dõi lỗi 404 cho Nginx
# Giúp chặn các robot dò tìm lỗ hổng website
cat <<EOF > /etc/fail2ban/filter.d/nginx-404.conf
[Definition]
failregex = ^<HOST> - .* \"GET .* HTTP/.*\" 404 .*
ignoreregex =
EOF

# 2. Cấu hình các "nhà tù" (Jails) để thực thi việc khóa IP
# SSH: Khóa 1 ngày nếu thử sai 10 lần
# Nginx-404: Khóa 1 giờ nếu gặp 50 lỗi 404 trong 10 phút
cat <<EOF > /etc/fail2ban/jail.d/custom.local
[sshd]
enabled = true
port    = ssh
logpath = %(sshd_log)s
backend = %(sshd_backend)s
maxretry = 10
findtime = 600
bantime  = 86400

[nginx-404]
enabled = true
port    = http,https
filter  = nginx-404
logpath = /var/log/nginx/access.log
maxretry = 50
findtime = 600
bantime  = 3600

[nginx-botsearch]
enabled  = true
port     = http,https
filter   = nginx-botsearch
logpath  = /var/log/nginx/access.log
maxretry = 5
bantime  = 86400
EOF

# Khởi động lại dịch vụ Fail2Ban để áp dụng cấu hình
systemctl restart fail2ban
echo "--- ✅ Đã cấu hình Fail2Ban bảo vệ SSH & Nginx thành công! ---"
