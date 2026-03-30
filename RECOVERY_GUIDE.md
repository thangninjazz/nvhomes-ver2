# 🛡️ NVHome - Stable Production Recovery Guide (v2026.03.30)

Đây là tài liệu hướng dẫn khôi phục và bảo trì hệ thống NVHome ở trạng thái ổn định nhất (Đã sửa lỗi phông chữ và lỗi 500). Hãy lưu giữ tài liệu này cẩn thận.

## 📦 Các tệp tin quan trọng (Golden Evidence)
- **Database Backup**: [backups/nvhome_production_stable_20260328.sql](file:///c:/Users/Admin/Desktop/NVHome/backups/nvhome_production_stable_20260328.sql) - Chứa toàn bộ dữ liệu sạch và phông chữ chuẩn.
- **Docker Config**: [docker-compose.yml](file:///c:/Users/Admin/Desktop/NVHome/docker-compose.yml)
- **Nginx Proxy**: [nginx.conf](file:///c:/Users/Admin/Desktop/NVHome/nginx.conf)

---

## 🚀 Quy trình khôi phục nhanh (Quick Recovery)

Nếu website gặp sự cố hoặc chuyển sang VPS mới, hãy thực hiện theo các bước sau từ máy tính này:

### Bước 1: Khởi động lại hạ tầng Docker
Truy cập VPS qua SSH và chạy lệnh:
```bash
docker compose -f ~/nvhome/docker-compose.yml down
docker compose -f ~/nvhome/docker-compose.yml up -d
```

### Bước 2: Khôi phục Dữ liệu Sạch (Hết lỗi phông chữ)
Từ máy tính Windows hiện tại, mở PowerShell tại thư mục dự án và chạy lệnh sau (đã kiểm tra chuẩn):
```powershell
# 1. Làm sạch schema cũ
ssh -i c:\Users\Admin\.ssh\google_compute_engine -o StrictHostKeyChecking=no thang_dv220620002@34.124.166.196 "docker exec -i nvhome_db psql -U postgres -d nvhomedb -c 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;'"

# 2. Nạp bản backup Vàng
cmd /c "type backups\backups/nvhome_production_stable_20260328.sql | ssh -i c:\Users\Admin\.ssh\google_compute_engine -o StrictHostKeyChecking=no thang_dv220620002@34.124.166.196 \"docker exec -i nvhome_db psql -U postgres -d nvhomedb\""

# 3. Khởi động lại Backend để đồng bộ
ssh -i c:\Users\Admin\.ssh\google_compute_engine -o StrictHostKeyChecking=no thang_dv220620002@34.124.166.196 "docker restart nvhome_backend"
```

---

## 🛡️ Kiểm tra sức khỏe hệ thống (Health Check)
Nếu website bị lỗi, hãy kiểm tra theo thứ tự:
1. **Kiểm tra Logs Backend**: `docker logs nvhome_backend --tail 100`
   - Nếu thấy lỗi `Column "X" does not exist`: Chạy lại bước khôi phục dữ liệu ở trên.
2. **Kiểm tra Logs DB**: `docker logs nvhome_db`
3. **Kiểm tra Nginx**: `docker logs nvhome_nginx`

---

## 📌 Thông tin hệ thống
- **VPS IP**: `34.124.166.196`
- **Tài khoản**: `thang_dv220620002`
- **PostgreSQL**: DB `nvhomedb`, User `postgres`

**Người thực hiện**: Antigravity AI (Google Deepmind)
**Ngày lưu**: 30/03/2026
