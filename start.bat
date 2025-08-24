@echo off
echo 查询系统前端启动脚本
echo =================================

echo.
echo 正在检查Node.js环境...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未找到Node.js，请先安装Node.js
    pause
    exit /b 1
)

echo Node.js版本: 
node --version

echo.
echo 正在安装依赖包...
npm install

if %errorlevel% neq 0 (
    echo 错误: 依赖安装失败
    pause
    exit /b 1
)

echo.
echo 依赖安装完成，正在启动前端开发服务器...
echo 前端将在 http://localhost:3001 启动
echo 后端API地址: http://localhost:3000
echo 按 Ctrl+C 停止服务器
echo.

npm run dev

pause
