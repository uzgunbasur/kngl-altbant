@echo off
chcp 65001 > nul
title KNGL Son Dakika Haber Bandi - OBS & Kick Servisi
cls
echo =================================================================
echo        KNGL SON DAKIKA HABER BANDI (OBS & KICK SERVISI)
echo =================================================================
echo.
echo [1/2] Sunucu baslatiliyor...
echo.
echo =================================================================
echo  [1] YAYIN EKRANI (OBS Browser Source Linki):
echo      - http://localhost:3000/overlay
echo.
echo  [2] KONTROL PANELI (Uzaktan Yonetim Linki):
echo      - http://localhost:3000/control
echo =================================================================
echo.
echo OBS Ayari:
echo - OBS'e "Tarayici" (Browser Source) kaynagi ekleyin.
echo - URL kismina: http://localhost:3000/overlay yapistirin.
echo - Genislik: 1920, Yukseklik: 1080 yapin.
echo.
echo Tarayicida Kontrol Paneli aciliyor...
start http://localhost:3000/control
node server.js
pause