# 查询系统前端

基于Vue 3 + Element Plus的现代化前端界面，提供用户查询和管理员管理功能。

## 🚀 技术栈

- **Vue 3** - 渐进式JavaScript框架
- **Vue Router 4** - 官方路由管理器
- **Pinia** - Vue状态管理库
- **Element Plus** - 基于Vue 3的组件库
- **Vite** - 下一代前端构建工具
- **Axios** - HTTP客户端

## ✨ 功能特性

### 用户端功能
- 🎯 课程成绩查询界面
- 🔍 支持模糊搜索
- 📊 查询结果展示
- 🎨 现代化UI设计

### 管理员功能
- 🔐 管理员登录认证
- ➕ 添加新课程成绩
- ✏️ 编辑现有课程信息
- 🗑️ 删除课程记录
- 📈 数据统计展示
- 🔍 课程列表搜索

## 📦 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 构建生产版本

```bash
npm run build
```

### 4. 预览生产版本

```bash
npm run preview
```

## 🌐 访问地址

- **前端地址**: http://localhost:3001
- **后端API**: http://localhost:3000
- **API代理**: 前端自动代理 `/api` 请求到后端

## 🏗️ 项目结构

```
frontend/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API接口
│   │   ├── auth.js        # 认证相关接口
│   │   └── courses.js     # 课程相关接口
│   ├── components/        # 公共组件
│   ├── router/            # 路由配置
│   │   └── index.js
│   ├── stores/            # 状态管理
│   │   └── auth.js
│   ├── utils/             # 工具函数
│   │   └── request.js     # HTTP请求封装
│   ├── views/             # 页面组件
│   │   ├── Home.vue       # 首页（用户查询）
│   │   ├── Login.vue      # 登录页
│   │   └── Admin.vue      # 管理后台
│   ├── App.vue            # 根组件
│   └── main.js            # 入口文件
├── index.html              # HTML模板
├── package.json            # 项目配置
├── vite.config.js          # Vite配置
└── README.md               # 项目说明
```

## 🔧 配置说明

### Vite配置
- 开发服务器端口: 3001
- API代理: `/api` → `http://localhost:3000`
- 路径别名: `@` → `src/`

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

## 🎨 UI组件

### Element Plus组件
- **布局**: Card, Row, Col
- **表单**: Form, Input, Select, InputNumber
- **数据展示**: Table, Tag, Empty
- **反馈**: Message, MessageBox, Loading
- **导航**: Button, Icon

### 自定义样式
- 响应式设计
- 渐变背景
- 卡片阴影效果
- 现代化配色方案

## 🔐 认证流程

1. 用户访问管理页面
2. 检查本地token
3. 验证token有效性
4. 自动跳转登录页（如需要）
5. 登录成功后保存token
6. 请求时自动添加认证头

## 📱 响应式设计

- 移动端适配
- 平板端优化
- 桌面端完整功能
- 弹性布局

## 🚀 快速启动

### 使用启动脚本
```bash
# Windows
start.bat

# 或手动启动
npm install
npm run dev
```

### 开发模式特性
- 热重载
- 源码映射
- 错误提示
- 开发工具

## 🔍 调试技巧

1. **Vue DevTools**: 安装Vue DevTools浏览器扩展
2. **控制台日志**: 查看API请求和响应
3. **网络面板**: 监控HTTP请求
4. **元素检查**: 调试DOM和样式

## 📋 开发规范

- 使用Composition API
- 组件命名: PascalCase
- 文件命名: kebab-case
- 代码注释: 中文注释
- 错误处理: 统一错误提示

## 🐛 常见问题

### 1. 端口冲突
如果3001端口被占用，修改 `vite.config.js` 中的端口配置。

### 2. 后端连接失败
确保后端服务器在3000端口运行，检查网络连接。

### 3. 依赖安装失败
清除npm缓存: `npm cache clean --force`

### 4. 构建失败
检查Node.js版本，确保使用兼容版本。

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

---

**开始开发**: 运行 `npm run dev` 开始前端开发之旅！
"# frontend" 
