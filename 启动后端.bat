@echo off
chcp 65001 >nul
title Zhaogq Tech News Backend - Port 8201
echo ==========================================
echo   赵国庆 24002120201 - 科技新闻聚合平台
echo   正在启动后端服务（端口 8201）...
echo ==========================================
cd /d "%~dp0backend"
if not exist node_modules (
  echo [提示] 未检测到依赖，正在执行 npm install ...
  call npm install
)
call npm start
pause
