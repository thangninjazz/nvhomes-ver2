#!/bin/bash
# 🛡️ NVHome VPS Resource Monitor & Telegram Alerter
# Checks CPU, RAM, and Disk usage. Sends alert if threshold exceeded.

# Configuration
CPU_THRESHOLD=80
RAM_THRESHOLD=80
DISK_THRESHOLD=90

# Get current usage
# CPU usage: 100 - idle
CPU_IDLE=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print $1}')
CPU_USAGE=$(echo "100 - $CPU_IDLE" | bc 2>/dev/null || awk "BEGIN {print 100 - $CPU_IDLE}")

# RAM usage: (Used/Total)*100
RAM_USAGE=$(free | grep Mem | awk '{print $3/$2 * 100.0}')

# Disk usage: Root partition
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')

HOSTNAME=$(hostname)
IP_ADDR=$(curl -s ifconfig.me || echo "Unknown IP")

# Helper function for float comparison
check_alert() {
    local val=$1
    local threshold=$2
    # Simple check that works even if bc is missing
    python3 -c "import sys; sys.exit(0 if float($val) > float($threshold) else 1)" 2>/dev/null
    return $?
}

# Check thresholds
ALERT=""
if check_alert "$CPU_USAGE" "$CPU_THRESHOLD"; then
    ALERT="${ALERT}⚠️ <b>CPU Usage HIGH: $(printf \"%.1f\" $CPU_USAGE)%</b> (Threshold: ${CPU_THRESHOLD}%)%0A"
fi

if check_alert "$RAM_USAGE" "$RAM_THRESHOLD"; then
    ALERT="${ALERT}⚠️ <b>RAM Usage HIGH: $(printf \"%.1f\" $RAM_USAGE)%</b> (Threshold: ${RAM_THRESHOLD}%)%0A"
fi

if [ "$DISK_USAGE" -gt "$DISK_THRESHOLD" ]; then
    ALERT="${ALERT}⚠️ <b>Disk Usage HIGH: ${DISK_USAGE}%</b> (Threshold: ${DISK_THRESHOLD}%)%0A"
fi

# Send Telegram alert if any threshold triggered
if [ ! -z "$ALERT" ]; then
    ENV_FILE="$HOME/nvhome/.env"
    if [ -f "$ENV_FILE" ]; then
        BOT_TOKEN=$(grep '^TELEGRAM_BOT_TOKEN=' "$ENV_FILE" | cut -d '=' -f 2 | tr -d '\r')
        CHAT_ID=$(grep '^TELEGRAM_CHAT_ID=' "$ENV_FILE" | cut -d '=' -f 2 | tr -d '\r')
        
        if [ ! -z "$BOT_TOKEN" ] && [ ! -z "$CHAT_ID" ]; then
            MESSAGE="🚨 <b>NVHome VPS ALERT - ${HOSTNAME}</b>%0A---------------------------%0A🌐 Host: ${HOSTNAME} (${IP_ADDR})%0A${ALERT}%0A🕒 Time: $(date +'%H:%M:%S %d/%m/%Y')"
            
            curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
                -d "chat_id=${CHAT_ID}" \
                -d "text=${MESSAGE}" \
                -d "parse_mode=HTML" > /dev/null
        fi
    fi
fi
