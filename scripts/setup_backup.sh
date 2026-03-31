#!/bin/bash

# Configuration
BACKUP_SCRIPT="$HOME/nvhome/scripts/backup_vps.sh"
MONITOR_SCRIPT="$HOME/nvhome/scripts/monitor_vps.sh"

# 3:00 AM VN (20:00 UTC) - Backup & Upload
CRON_BACKUP="0 20 * * * /bin/bash $BACKUP_SCRIPT >> $HOME/nvhome_backups/backup.log 2>&1"
# Every 10 Minutes - Resource Monitoring
CRON_MONITOR="*/10 * * * * /bin/bash $MONITOR_SCRIPT >> $HOME/nvhome/monitor.log 2>&1"

# 1. Install Rclone & BC (Latest version from official script)
if ! command -v rclone &> /dev/null; then
    echo "Installing latest rclone..."
    sudo curl https://rclone.org/install.sh | sudo bash
fi
sudo apt-get install -y bc

# 2. Add Cron Jobs
# Remove old cron jobs for this script first
crontab -l 2>/dev/null | grep -v "$HOME/nvhome/scripts" > mycron
# Add new jobs
echo "$CRON_BACKUP" >> mycron
echo "$CRON_MONITOR" >> mycron
# Install new crontab
crontab mycron
rm mycron

echo "--- Setup Complete ---"
echo "1. Script located at: $BACKUP_SCRIPT"
echo "2. Backup scheduled for 3:00 AM VN Time (8 PM UTC)."
echo "3. Resource monitor scheduled every 10 minutes."
echo "4. Action needed: Run 'rclone config' if not already done."
