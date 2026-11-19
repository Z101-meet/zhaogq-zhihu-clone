# 科技新闻聚合平台

- 姓名：赵国庆
- 学号：24002120201
- 项目名称：科技新闻聚合平台
- 项目类别：自选（原创）
- 技术栈：原生 HTML / CSS / JavaScript + Node.js / Express + MySQL

## 启动方式

1. 双击根目录的 `启动后端.bat`（等价于进入 `backend/` 执行 `npm start`）。
2. 浏览器访问 <http://localhost:8201>，后端已在 8201 端口用 `express.static` 托管前端页面。

## 目录结构

```
├── backend/              Express 后端（RESTful + MVC）
│   ├── config/           MySQL 连接池
│   ├── controllers/      控制器
│   ├── models/           数据模型（SQL）
│   ├── routes/           /api 路由
│   ├── .env              数据库凭据（不提交到仓库）
│   ├── Zhaogq_init.sql   数据库重建脚本
│   ├── Zhaogq_interface.md  接口记录
│   └── Zhaogq_database.md   数据库变更记录
├── frontend/             前端静态页面
│   ├── css/ js/ images/ fonts/
│   ├── index.html        首页（canvas 粒子背景）
│   ├── database.html     数据库连接测试
│   ├── news.html         科技新闻列表
│   └── gallery.html      图文资讯列表
├── AGENTS.md             项目开发规则
├── Zhaogq_prompt.md      开发指令记录
└── 启动后端.bat          后端启动脚本
```

## 接口一览（前缀 /api）

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/Zhaogq/health` | 健康检查 |
| POST | `/api/Zhaogq/db/test` | 测试 MySQL 连接 |
| GET | `/api/Zhaogq/news` | 科技新闻分页列表 |
| GET | `/api/Zhaogq/news/categories` | 新闻分类 |
| GET | `/api/Zhaogq/gallery` | 图文资讯列表 |

统一响应格式：`{ "code": 0, "msg": "提示信息", "data": {...} }`，`code=0` 表示成功。

## 数据库

- 数据库名：`zhaogq_tech_news`
- 数据表：`Zhaogq_news`（科技新闻，8 条测试数据）、`Zhaogq_gallery`（科技图文，8 条测试数据）
- 凭据配置在 `backend/.env`；重建脚本为 `backend/Zhaogq_init.sql`，执行记录见 `backend/Zhaogq_database.md`。
