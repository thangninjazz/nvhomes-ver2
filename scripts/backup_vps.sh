#!/bin/bash

# Configuration
PROJECT_NAME="nvhome"
BACKUP_DIR="$HOME/nvhome_backups"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_NAME="${PROJECT_NAME}_backup_${TIMESTAMP}.tar.gz"
RETENTION_DAYS=7

# Create backup directory if not exists
mkdir -p "$BACKUP_DIR"

echo "--- Starting Backup: $TIMESTAMP ---"

# 1. Database Backup (PostgreSQL)
echo "Dumping database..."
docker exec nvhome_db pg_dump -U postgres nvhomedb > "$BACKUP_DIR/db_dump.sql"

# 2. Uploads Backup (Docker Volume)
echo "Packing uploads..."
docker run --rm -v nvhome_backend_uploads:/data -v "$BACKUP_DIR":/backup alpine tar czf /backup/uploads_backup.tar.gz -C /data .

# 3. Code & Config Backup
echo "Packing code and configs..."
tar -czf "$BACKUP_DIR/$BACKUP_NAME" -C "$HOME/nvhome" . -C "$BACKUP_DIR" db_dump.sql uploads_backup.tar.gz

# 4. Cleanup temporary files
rm "$BACKUP_DIR/db_dump.sql"
rm "$BACKUP_DIR/uploads_backup.tar.gz"

# 5. Rclone Upload (If configured)
RCLONE_STATUS=0
RCLONE_OUTPUT=""

if command -v rclone &> /dev/null; then
    if rclone listremotes | grep -q "gdrive:"; then
        echo "Uploading to Google Drive..."
        RCLONE_OUTPUT=$(rclone copy "$BACKUP_DIR/$BACKUP_NAME" gdrive:NVHome_Backups 2>&1)
        RCLONE_STATUS=$?
        if [ $RCLONE_STATUS -eq 0 ]; then
            echo "Upload complete."
        else
            echo "Upload failed with status $RCLONE_STATUS: $RCLONE_OUTPUT"
        fi
    else
        echo "Rclone 'gdrive:' remote not found. Skipping cloud upload."
        RCLONE_STATUS=2
    fi
else
    echo "Rclone not installed. Skipping cloud upload."
    RCLONE_STATUS=3
fi

# 6. Save Status for later notification
STATUS_FILE="$BACKUP_DIR/last_backup_status.tmp"
echo "BACKUP_NAME=$BACKUP_NAME" > "$STATUS_FILE"
echo "FILE_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_NAME" 2>/dev/null | cut -f 1)" >> "$STATUS_FILE"
echo "RCLONE_STATUS=$RCLONE_STATUS" >> "$STATUS_FILE"
echo "RCLONE_OUTPUT=$RCLONE_OUTPUT" >> "$STATUS_FILE"
echo "TIMESTAMP=$(date +'%H:%M:%S %d/%m/%Y')" >> "$STATUS_FILE"

# 7. Cleanup old local backups
echo "Cleaning up local backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -type f -name "${PROJECT_NAME}_backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete

# 8. Telegram Notification (Function)
send_notification() {
    if [ -f "$HOME/nvhome/.env" ]; then
        source "$STATUS_FILE"
        BOT_TOKEN=$(grep '^TELEGRAM_BOT_TOKEN=' "$HOME/nvhome/.env" | cut -d '=' -f 2 | tr -d '\r')
        CHAT_ID=$(grep '^TELEGRAM_CHAT_ID=' "$HOME/nvhome/.env" | cut -d '=' -f 2 | tr -d '\r')
        
        if [ ! -z "$BOT_TOKEN" ] && [ ! -z "$CHAT_ID" ]; then
            if [ -z "$FILE_SIZE" ]; then FILE_SIZE="Unknown"; fi
            
            if [ "$RCLONE_STATUS" -eq 0 ]; then
                CLOUD_STATUS="Google Drive ✅"
                STATUS_TITLE="THÀNH CÔNG"
                ICON="📦"
            else
                CLOUD_STATUS="Lỗi Cloud ❌ (Code: $RCLONE_STATUS)"
                STATUS_TITLE="CẢNH BÁO / LỖI"
                ICON="⚠️"
            fi

            MESSAGE="${ICON} <b>NVHome Backup - ${STATUS_TITLE}</b>%0A---------------------------%0A🕒 Thời gian: ${TIMESTAMP}%0A📄 File: <code>${BACKUP_NAME}</code>%0A⚖️ Dung lượng: <b>${FILE_SIZE}</b>%0A☁️ Cloud: ${CLOUD_STATUS}"

            curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
                -d "chat_id=${CHAT_ID}" \
                -d "text=${MESSAGE}" \
                -d "parse_mode=HTML" > /dev/null
            echo "Telegram notification sent."
        fi
    fi
}

# Handle Arguments
if [[ "$1" == "--notify" ]]; then
    if [ -f "$STATUS_FILE" ]; then
        send_notification
    else
        echo "No status file found to notify."
    fi
else
    echo "--- Backup Completed: $(date) ---"
    # Auto notify if not specifically splitting (optional, but requested to split via cron)
    # send_notification 
fi
