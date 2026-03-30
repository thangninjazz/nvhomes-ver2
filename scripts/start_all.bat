@echo off
echo ======================================================
echo          KHOI DONG HE THONG NOI THAT NV HOMES
echo ======================================================
echo.

echo [1/2] Dang khoi dong Backend API (Port 5232)...
start /B "" dotnet run --project Backend\NVHome.API\NVHome.API.csproj
timeout /t 5 >nul

echo [2/2] Dang khoi dong Frontend (Port 3000)...
cd frontend
start /B "" npm run dev
timeout /t 5 >nul

echo.
echo ======================================================
echo  HE THONG DA SAN SANG!
echo  - Website: http://localhost:3000
echo  - Admin:   http://localhost:3000/admin
echo  - API Doc: http://localhost:5232/swagger
echo ======================================================
echo.
echo NHAN PHIM BAT KY DE DUNG HE THONG (Kill focus)...
pause >nul
taskkill /F /IM dotnet.exe /T
taskkill /F /IM node.exe /T
