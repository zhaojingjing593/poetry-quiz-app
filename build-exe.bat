@echo off
chcp 65001 >nul
echo ============================================
echo   古诗词抽取智能体 - 构建安装包
echo ============================================
echo.

echo [1/3] 安装依赖...
call npm install
if %errorlevel% neq 0 (
    echo 安装依赖失败！
    pause
    exit /b 1
)

echo [2/3] 构建前端...
call npx vite build
if %errorlevel% neq 0 (
    echo 前端构建失败！
    pause
    exit /b 1
)

echo [3/3] 打包Electron安装包...
call npx electron-builder
if %errorlevel% neq 0 (
    echo 打包失败！
    echo.
    echo 常见问题：
    echo 1. 确保安装了Visual Studio Build Tools
    echo 2. 或运行：npm install --save-dev @electron-builder/builder
    pause
    exit /b 1
)

echo.
echo ============================================
echo   构建成功！安装包在 release 目录中
echo ============================================
pause
