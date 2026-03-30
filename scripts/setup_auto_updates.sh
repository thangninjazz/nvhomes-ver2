#!/bin/bash
# Script thiết lập Tự động cập nhật Bảo mật cho Ubuntu
# NVHome Security Hardening - Automated Updates

echo "[1/4] Đang cài đặt unattended-upgrades..."
sudo apt-get update
sudo apt-get install -y unattended-upgrades apt-listchanges

echo "[2/4] Cấu hình nguồn cập nhật (Chỉ Security)..."
sudo tee /etc/apt/apt.conf.d/50unattended-upgrades <<EOF
Unattended-Upgrade::Allowed-Origins {
    "\${distro_id}:\${distro_codename}-security";
};

// Không tự động reboot để tránh làm gián đoạn dịch vụ
Unattended-Upgrade::Automatic-Reboot "false";

// Tự động dọn dẹp các gói cũ
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Remove-New-Unused-Dependencies "true";
Unattended-Upgrade::Remove-Unused-Kernel-Packages "true";
EOF

echo "[3/4] Thiết lập lịch chạy hàng ngày..."
sudo tee /etc/apt/apt.conf.d/20auto-upgrades <<EOF
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";
EOF

echo "[4/4] Kiểm tra trạng thái dịch vụ..."
sudo systemctl restart unattended-upgrades
sudo systemctl enable unattended-upgrades

echo "✅ Đã thiết lập Tự động cập nhật Bảo mật thành công!"
