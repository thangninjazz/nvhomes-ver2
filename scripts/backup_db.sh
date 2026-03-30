#!/bin/bash

# Configuration
DB_CONTAINER="nvhome_db"
DB_NAME="nvhomedb"
DB_USER="postgres"
BACKUP_DIR="/home/thang_dv220620002/backups"
REMOTE_NAME="gdrive"
REMOTE_DIR="NVHome_Backups"
DATE=$(date +%Y%m%d_%H%M%S)
FILE_NAME="nvhome_db_$DATE.sql"

# Create backup directory if not exists
mkdir -p $BACKUP_DIR

# 1. Dump Database
echo "Starting database dump..."
docker exec $DB_CONTAINER pg_dump -U $DB_USER $DB_NAME > $BACKUP_DIR/$FILE_NAME

# 2. Upload to Google Drive using rclone
echo "Uploading to Google Drive..."
rclone copy $BACKUP_DIR/$FILE_NAME $REMOTE_NAME:$REMOTE_DIR

# 3. Cleanup local backup (optional - keep 7 days)
find $BACKUP_DIR -type f -name "*.sql" -mtime +7 -delete

echo "Backup completed successfully: $FILE_NAME"
