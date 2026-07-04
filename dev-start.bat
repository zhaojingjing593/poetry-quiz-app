@echo off
chcp 65001 >nul
echo ============================================
echo   古诗词抽取智能体 - 开发模式
echo ============================================
echo.
echo 启动 Vite 开发服务器 + Electron...
echo 首次启动请稍候...
echo.
call npx concurrently "npx vite --host" "npx wait-on http://localhost:5173 && npx electron ."
pause
