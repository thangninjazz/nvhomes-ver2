#!/bin/bash
# Hardening SSH Access
# 1. Disable Password Authentication
# 2. Disable Root Login
# 3. Ensure Pubkey Authentication is enabled

# 1. Safety Check: Ensure the user has at least one SSH key authorized
if [ ! -s "$HOME/.ssh/authorized_keys" ]; then
    echo "ERROR: No authorized keys found in $HOME/.ssh/authorized_keys."
    echo "ABORTING: Disabling password auth now would lock you out!"
    exit 1
fi

echo "Safety check passed. Hardening SSH..."

CONFIG="/etc/ssh/sshd_config"

# Cleanup entries
sed -i "/^#\?PasswordAuthentication/d" "$CONFIG"
sed -i "/^#\?PermitRootLogin/d" "$CONFIG"
sed -i "/^#\?PubkeyAuthentication/d" "$CONFIG"
sed -i "/^#\?ChallengeResponseAuthentication/d" "$CONFIG"

# Add secure ones
echo "PasswordAuthentication no" >> "$CONFIG"
echo "PermitRootLogin no" >> "$CONFIG"
echo "PubkeyAuthentication yes" >> "$CONFIG"
echo "ChallengeResponseAuthentication no" >> "$CONFIG"

# Restart service
systemctl restart ssh
echo "SSH Hardened successfully and service restarted."
