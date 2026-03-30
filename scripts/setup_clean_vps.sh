#!/bin/bash
# 🛡️ NVHome - Secure Final Server Setup (v2026.03.30)
# Use this script for the new CLEAN VPS (34.124.166.196)

# 1. Update & Install Core Infrastructure
echo "Updating system and installing base infrastructure..."
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y docker.io docker-compose nginx certbot python3-certbot-nginx git curl fail2ban ufw

# 2. Configure Firewall (CRITICAL STEP)
echo "Configuring UFW (Firewall)..."
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw --force enable
echo "Firewall active: Allowed (22, 80, 443). Blocked all others."

# 3. Docker Permissions
sudo groupadd docker 2>/dev/null
sudo usermod -aG docker $USER
sudo systemctl enable --now docker
sudo systemctl enable --now nginx

# 4. SSH Hardening (Recommend Manual Check)
echo "Hardening SSH..."
# Prevent root login and password auth (if user has key)
# sudo sed -i 's/PermitRootLogin yes/PermitRootLogin prohibit-password/g' /etc/ssh/sshd_config
# sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/g' /etc/ssh/sshd_config
# sudo systemctl restart ssh

# 5. Fail2Ban Setup (Prevent Brute Force)
sudo systemctl enable --now fail2ban

echo "--------------------------------------------------"
echo "CLEAN INFRASTRUCTURE READY!"
echo "Server IP: 34.124.166.196"
echo "Next Steps: Run 'docker-compose up -d' after cloning code."
echo "--------------------------------------------------"
