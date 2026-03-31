#!/bin/bash
# Adding Fail2Ban Jails for Nginx Protection

# 1. Create Nginx-404 filter
# This blocks IPs searching for non-existent files too many times
cat <<EOF > /etc/fail2ban/filter.d/nginx-404.conf
[Definition]
failregex = ^<HOST> - .* \"GET .* HTTP/.*\" 404 .*
ignoreregex =
EOF

# 2. Add Jail configuration
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

# Restart Fail2Ban
systemctl restart fail2ban
echo "Fail2Ban Custom Jails (SSH & Nginx) configured successfully."
