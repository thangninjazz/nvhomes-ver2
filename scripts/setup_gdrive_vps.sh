#!/bin/bash
# Script to finalize Rclone GDrive setup
# Usage: ./setup_gdrive_vps.sh "YOUR_RCLONE_TOKEN"

TOKEN=$1

if [ -z "$TOKEN" ]; then
    echo "ERROR: Please provide the Rclone token JSON as an argument."
    echo "Example: ./setup_gdrive_vps.sh '{\"access_token\":\"...\", ...}'"
    exit 1
fi

# Create or Update the remote
rclone config create gdrive drive config_token="$TOKEN" scope=drive --non-interactive

# Test connection
echo "Testing connection to gdrive..."
rclone lsd gdrive:
