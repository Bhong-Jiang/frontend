# 课程成绩查询系统前端

本项目为课程成绩查询系统的前端部分，基于 Vue3 + Vite + Element Plus 构建。后端服务已部署在 Render，前端可部署在 Vercel 或其他静态托管平台。

## 功能简介

- 用户登录、登出
- 课程列表与成绩查询
- 管理员功能入口

## 技术栈

- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Element Plus](https://element-plus.org/)
- [Pinia](https://pinia.vuejs.org/)
- [Axios](https://axios-http.com/)

## 快速开始

1. 克隆仓库

   ```bash
   git clone https://github.com/Bhong-Jiang/frontend.git
   cd frontend
   ```

2. 安装依赖

   ```bash
   npm install
   ```

3. 配置环境变量

   新建 `.env.local` 或 `.env.production`，参考 `.env.example`：

   ```
   VITE_APP_API_URL=https://backend-2r0q.onrender.com
   ```

4. 启动开发环境

   ```bash
   npm run dev
   ```

5. 构建生产环境

   ```bash
   npm run build
   ```

## 部署说明

- 推荐使用 [Vercel](https://vercel.com/) 部署，自动识别 Vite 项目。
- 部署时请在平台环境变量设置 `VITE_APP_API_URL`，指向你的后端服务地址。

## 其他说明

- 本项目无任何敏感信息，所有密钥、密码等请通过环境变量配置。
- 如需后端代码，请访问 [后端仓库](https://github.com/Bhong-Jiang/backend)。

## License

MIT
