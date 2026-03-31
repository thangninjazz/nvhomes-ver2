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
    # Check if gdrive is configured and alive
    if rclone listremotes | grep -q "gdrive:"; then
        echo "Checking Google Drive connection..."
        if rclone about gdrive: &> /dev/null; then
            echo "Uploading to Google Drive..."
            RCLONE_OUTPUT=$(rclone copy "$BACKUP_DIR/$BACKUP_NAME" gdrive:NVHome_Backups 2>&1)
            RCLONE_STATUS=$?
        else
            RCLONE_OUTPUT="Gdrive remote exists but connection test failed (Check token/auth)."
            RCLONE_STATUS=4
        fi
    else
        echo "Rclone 'gdrive:' remote not found. Skipping cloud upload."
        RCLONE_STATUS=2
    fi
else
    echo "Rclone not installed. Skipping cloud upload."
    RCLONE_STATUS=3
fi

# 6. Save Status for notification
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
    ENV_FILE="$HOME/nvhome/.env"
    if [ -f "$ENV_FILE" ]; then
        source "$STATUS_FILE"
        BOT_TOKEN=$(grep '^TELEGRAM_BOT_TOKEN=' "$ENV_FILE" | cut -d '=' -f 2 | tr -d '\r')
        CHAT_ID=$(grep '^TELEGRAM_CHAT_ID=' "$ENV_FILE" | cut -d '=' -f 2 | tr -d '\r')
        
        if [ ! -z "$BOT_TOKEN" ] && [ ! -z "$CHAT_ID" ]; then
            FILE_SIZE=${FILE_SIZE:-"Unknown"}
            
            if [ "$RCLONE_STATUS" -eq 0 ]; then
                CLOUD_STATUS="Google Drive ✅"
                STATUS_TITLE="THÀNH CÔNG"
                ICON="📦"
            else
                CLOUD_STATUS="Lỗi Cloud ❌ (Code: $RCLONE_STATUS)"
                [ "$RCLONE_STATUS" -eq 4 ] && CLOUD_STATUS="Lỗi Connect Gdrive ❌ (Check Token)"
                STATUS_TITLE="CẢNH BÁO"
                ICON="⚠️"
            fi

            MESSAGE="${ICON} <b>NVHome Backup - ${STATUS_TITLE}</b>%0A---------------------------%0A🕒 Thời gian: ${TIMESTAMP}%0A📄 File: <code>${BACKUP_NAME}</code>%0A⚖️ Dung lượng: <b>${FILE_SIZE}</b>%0A☁️ Cloud: ${CLOUD_STATUS}"

            # If rclone failed, add error output to message (limit length)
            if [ "$RCLONE_STATUS" -ne 0 ] && [ ! -z "$RCLONE_OUTPUT" ]; then
                CLEAN_OUTPUT=$(echo "$RCLONE_OUTPUT" | head -c 100)
                MESSAGE="${MESSAGE}%0A📝 Lỗi: <code>${CLEAN_OUTPUT}...</code>"
            fi

            curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
                -d "chat_id=${CHAT_ID}" \
                -d "text=${MESSAGE}" \
                -d "parse_mode=HTML" > /dev/null
            echo "Telegram notification sent."
        fi
    fi
}

# Auto notify
send_notification

echo "--- Backup Completed: $(date) ---"
