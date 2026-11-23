# Zhaogq_prompt.md — 开发指令记录

> 记录格式：时间 | 提示词全文 | 大模型名称

---

## 2026-11-19 10:00:00

**大模型：DeepSeek-V4.1-Flash**

**提示词全文：**

在当前项目根目录创建 AGENTS.md，写入以下规则。

## 项目结构与技术栈
- 前端：frontend/ 目录
  - 原生 HTML、CSS、JavaScript，禁止使用任何第三方库、框架、CDN 链接
  - 目录结构：frontend/ 下建 css/、js/、fonts/、images/ 子目录；
    fonts/ 存放 iconfont 图标文件（如果有）
- 后端：backend/ 目录，Node.js + Express，RESTful+MVC 风格，
  所有接口以 /api/ 为前缀，端口固定为 8201，
  并以 express.static 托管 frontend/ 目录
  后端支持所有跨域访问。
- 后端依赖安装：优先 cnpm i 包名；失败或超时则使用 npm i 包名
- 数据库：MySQL （用户名 root、密码：123456）：
- 数据库凭据写入 backend/.env（变量名：DB_USER、DB_PASSWORD、
  DB_HOST、DB_NAME），不得出现在代码或 AGENTS.md 中；
  .env 同时加入 .gitignore
- 根据后端的要求自行建立和修改数据库表，每张表建立后，插入至少 8 条有真实业务意义的测试数据

## 命名与注释
- CSS 类名、JS 变量名、JS 函数名、数据库表名（及字段相关命名）
  一律以 Zhaogq_ 开头
- 每个文件头部包含注释块：
  姓名：赵国庆 | 学号：24002120201 | 时间：yyyy-mm-dd | 大模型：{本次使用的大模型名称}

## 记录文件（一律追加写入，禁止覆盖已有内容）
- Zhaogq_prompt.md（项目根目录）：每次向 AI 发出开发指令后，
  追加记录：时间 | 提示词全文 | 大模型名称
- backend/Zhaogq_interface.md：每次创建或修改接口后，追加：
  接口路径 | HTTP 方法 | 请求参数（含示例）|
  响应格式（含 JSON 示例）| 修改时间
- backend/Zhaogq_database.md：每次建表、改表或插入数据后，
  按执行顺序追加对应 SQL 语句（含测试数据的 INSERT），
  要求仅凭此文件即可在新机器上完整重建数据库
- 统一 JSON 响应格式：{ "code": 0, "msg": "提示信息", "data": {...} }，
  code=0 表示成功，非 0 表示失败

## 前端约定
- 服务器返回的数据和错误信息输出到浏览器控制台（console.log / console.error）；
- 新建 HTML 页面后，在 frontend/index.html 中追加超链接入口；
  文件名包含 detail 的页面除外

---

## 2026-11-19 10:20:00

**大模型：DeepSeek-V4.1-Flash**

**提示词全文：**

基于vibe coding的全栈项目的开发基本流程
（零） 安装node.js,24以上版本，尽量已安装cnpm。
（一）创建项目（文件夹），设立规则AGENTS.md
     修改给定提示词，也可自行设置提示词。
（二） 初始化项目。
提示词参考：
请初始化本项目：
1、 git init + .gitignore（排除 node_modules、.env）+ 首次提交
2、按 AGENTS.md 规则创建前后端目录骨架、安装依赖、
3、创建前端首页index.html，包括姓名**、学号**、项目名称、项目类别（自选、模仿），所有完成的html页面的超链接。有canvas背景动画。主体是页面链接导航。页面美观。
4、创建readme.md，在根目录下，包括学号、姓名。 
（三）运行和查看项目。
创建运行后台的bat文件，在根目录下。
（四）测试数据库链接（mysql数据库需要，sqllite不需要）。
创建database.html页面，输入用户名，密码，链接数据库，数据库使用mysql，成功和错误都有提示，默认用户名root，密码root。
（五）完成科技新闻列表页面，新闻的数据存在数据库表里。网页显示后端接口链接和数据内容。
（六）完成图文列表，图片可以使用网络图片或创建图片，创建一个新的表，网页显示后端接口链接和数据内容。。

学号24002120201姓名赵国庆

---

## 2026-11-19 14:30:00

**大模型：DeepSeek-V4.1-Flash**

**用户提示词（改动后原文）：**

基于vibe coding的全栈项目的开发基本流程
（零） 安装node.js,24以上版本，尽量已安装cnpm。
（一）创建项目（文件夹），设立规则AGENTS.md
（二） 初始化项目。提示词参考：
1、 git init + .gitignore（排除 node_modules、.env）+ 首次提交
2、按 AGENTS.md 规则创建前后端目录骨架、安装依赖、
3、创建前端首页index.html，包括姓名赵国庆、学号24002120201、项目名称知乎制作和模仿、项目类别：模仿，所有完成的html页面的超链接。有canvas背景动画。主体是页面链接导航。页面美观。
4、创建readme.md，在根目录下，包括学号、姓名。
（三）运行和查看项目。创建运行后台的bat文件，在根目录下。
（四）测试数据库链接。创建database.html页面，输入用户名，密码，链接数据库，数据库使用mysql，成功和错误都有提示，默认用户名root，密码123456。
（五）完成科技新闻列表页面，新闻的数据存在数据库表里。网页显示后端接口链接和数据内容。
（六）完成图文列表，图片可以使用网络图片或创建图片，创建一个新的表，网页显示后端接口链接和数据内容。
提示词稍有改动，你优化一下吧

**优化后的提示词（记录备查）：**

（零）环境准备
- 安装 Node.js 24 及以上版本；建议安装 cnpm，依赖安装优先使用 cnpm，失败或超时再回退 npm。

（一）创建项目与规则
- 新建项目文件夹，编写 AGENTS.md，明确：前端 frontend/（原生 HTML/CSS/JS，禁止第三方库、框架、CDN；含 css/js/fonts/images 子目录）、后端 backend/（Node.js + Express，RESTful + MVC，接口统一 /api 前缀，端口 8201，支持跨域，express.static 托管 frontend/）、MySQL 数据库（凭据写入 backend/.env 并加入 .gitignore）、命名统一 Zhaogq_ 前缀、每个文件头注释（姓名/学号/时间/大模型）、三份记录文件（Zhaogq_prompt.md、backend/Zhaogq_interface.md、backend/Zhaogq_database.md）只追加不覆盖、统一响应格式 {code,msg,data}。

（二）初始化项目
请初始化本项目：
1. 执行 git init，创建 .gitignore（排除 node_modules、.env），完成首次提交；
2. 按 AGENTS.md 创建前后端目录骨架并安装依赖（cnpm 优先，失败用 npm）；
3. 创建前端首页 index.html：展示姓名赵国庆、学号24002120201、项目名称“知乎制作和模仿”、项目类别“模仿”，包含 canvas 背景动画、页面链接导航，并列出所有已完成 HTML 页面的超链接；整体仿知乎视觉风格，页面美观；
4. 在根目录创建 readme.md，包含学号、姓名、项目简介、启动方式与接口说明。

（三）运行项目
- 在根目录创建启动后端的 bat 文件，双击后自动检测依赖并启动服务；
- 浏览器访问 http://localhost:8201 验证首页。

（四）数据库连接测试
- 创建 database.html：输入主机、端口、用户名、密码（默认 root / 123456）、数据库名，调用后端接口测试 MySQL 连接，成功与失败均有清晰提示，并展示接口地址与控制台日志。

（五）科技新闻列表
- 新闻数据存入 MySQL 数据表 Zhaogq_news（不少于 8 条真实业务数据），页面展示后端接口链接与数据内容，支持分页、关键词搜索与分类筛选。

（六）图文列表
- 新建数据表 Zhaogq_gallery（不少于 8 条测试数据），图片可使用网络图片或本地创建；页面展示后端接口链接与图文数据内容，卡片样式参考知乎「想法」。

---

## 2026-11-23 14:40:00

**大模型：DeepSeek-V4.1-Flash**

**提示词全文：**

前提：完成之前的全栈项目，没完成的先完成全栈项目。在全栈项目完成的基础上进行此项。
提示词：创建AI聊天页面。
Api-key：sk-****（安全要求已脱敏，实际密钥仅保存在 backend/.env）
curl --request POST \
  --url `https://api.siliconflow.cn/v1/chat/completions` \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "deepseek-ai/DeepSeek-V4-Flash",
    "messages": [
      {"role": "system", "content": "你是一个有用的助手"},
      {"role": "user", "content": "你好，请介绍一下你自己"}
    ]
  }'
在控制台里输出发送给大模型的数据和从大模型接收到的数据。

**实现说明：** API Key 写入 `backend/.env`（`SILICONFLOW_API_KEY`），前端只调用后端代理接口 `/api/Zhaogq/chat`；服务端控制台与浏览器控制台均输出收发数据。

---

