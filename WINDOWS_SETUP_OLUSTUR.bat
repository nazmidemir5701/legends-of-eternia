@echo off
chcp 65001 >nul
title LEGENDS OF ETERNIA - Windows Kurulum Oluşturucu
echo.
echo ==========================================
echo   LEGENDS OF ETERNIA - SETUP HAZIRLAMA
echo ==========================================
echo.
echo Bu işlem internet bağlantısı gerektirir.
echo Node.js LTS kurulu olmalıdır.
echo.
call npm install
if errorlevel 1 (
  echo.
  echo HATA: npm install tamamlanamadi.
  pause
  exit /b 1
)
echo.
echo Windows Setup.exe hazirlaniyor...
call npm run dist
if errorlevel 1 (
  echo.
  echo HATA: Setup olusturulamadi.
  pause
  exit /b 1
)
echo.
echo TAMAMLANDI!
echo Setup dosyasini dist klasorunde bulabilirsin.
echo.
pause
