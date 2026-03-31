#!/bin/bash
# 🔍 NVHome Cloud Diagnostic Tool

echo "--- Bắt đầu kiểm tra hệ thống ---"

# 1. Kiểm tra Rclone
if command -v rclone &> /dev/null; then
    echo "✅ Rclone đã được cài đặt."
    if rclone listremotes | grep -q "gdrive:"; then
        echo "✅ Remote 'gdrive:' đã tồn tại."
        echo "⏳ Đang thử kết nối tới Google Drive..."
        if rclone about gdrive: &> /dev/null; then
            echo "✅ Kết nối Google Drive THÀNH CÔNG."
        else
            echo "❌ Kết nối Google Drive THẤT BẠI. (Có thể Token đã hết hạn, hãy chạy 'rclone config' để refresh)."
        fi
    else
        echo "❌ Chưa cấu hình remote 'gdrive:'. Hãy chạy 'rclone config' để thiết lập."
    fi
else
    echo "❌ Rclone chưa được cài đặt."
fi

# 2. Kiểm tra Telegram
ENV_FILE="$HOME/nvhome/.env"
if [ -f "$ENV_FILE" ]; then
    echo "✅ Tìm thấy file .env."
    BOT_TOKEN=$(grep '^TELEGRAM_BOT_TOKEN=' "$ENV_FILE" | cut -d '=' -f 2 | tr -d '\r')
    CHAT_ID=$(grep '^TELEGRAM_CHAT_ID=' "$ENV_FILE" | cut -d '=' -f 2 | tr -d '\r')
    
    if [ ! -z "$BOT_TOKEN" ] && [ ! -z "$CHAT_ID" ]; then
        echo "✅ Đã cấu hình Telegram Bot."
        echo "⏳ Đang gửi tin nhắn thử nghiệm..."
        RESPONSE=$(curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
            -d "chat_id=${CHAT_ID}" \
            -d "text=🔍 NVHome: Test kết nối từ VPS thành công!" \
            -d "parse_mode=HTML")
        
        if echo "$RESPONSE" | grep -q '"ok":true'; then
            echo "✅ Gửi thông báo Telegram THÀNH CÔNG."
        else
            echo "❌ Gửi thông báo Telegram THẤT BẠI. Phản hồi: $RESPONSE"
        fi
    else
        echo "❌ Thiếu cấu hình TELEGRAM_BOT_TOKEN hoặc TELEGRAM_CHAT_ID trong .env."
    fi
else
    echo "❌ Không tìm thấy file $ENV_FILE."
fi

echo "--- Kết thúc kiểm tra ---"
