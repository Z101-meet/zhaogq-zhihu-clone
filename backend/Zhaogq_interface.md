# Zhaogq_interface.md — 接口记录

> 统一响应格式：`{ "code": 0, "msg": "提示信息", "data": {...} }`，`code=0` 表示成功，非 0 表示失败。

---

## 2026-11-19 · 后端基础服务

### 接口路径：`/api/Zhaogq/health`

- HTTP 方法：GET
- 请求参数：无
- 请求示例：`GET http://localhost:8201/api/Zhaogq/health`
- 响应格式（JSON 示例）：

```json
{
  "code": 0,
  "msg": "服务运行正常",
  "data": {
    "Zhaogq_time": "2026-11-19T02:30:00.000Z"
  }
}
```

- 修改时间：2026-11-19 10:40:00

---

## 2026-11-19 · 数据库连接测试

### 接口路径：`/api/Zhaogq/db/test`

- HTTP 方法：POST（Content-Type: application/json）
- 请求参数（含示例）：

```json
{
  "host": "localhost",
  "port": 3306,
  "user": "root",
  "password": "123456",
  "database": "zhaogq_tech_news"
}
```

- 响应格式（成功示例）：

```json
{
  "code": 0,
  "msg": "数据库连接成功",
  "data": {
    "Zhaogq_host": "localhost",
    "Zhaogq_port": 3306,
    "Zhaogq_user": "root",
    "Zhaogq_database": "zhaogq_tech_news",
    "Zhaogq_version": "8.0.30",
    "Zhaogq_tableCount": 2,
    "Zhaogq_tables": ["Zhaogq_gallery", "Zhaogq_news"]
  }
}
```

- 响应格式（失败示例）：

```json
{
  "code": 2,
  "msg": "数据库连接失败：Access denied for user 'root'@'localhost' (using password: YES)",
  "data": {
    "Zhaogq_errorCode": "ER_ACCESS_DENIED_ERROR"
  }
}
```

- 修改时间：2026-11-19 10:40:00

---

## 2026-11-19 · 科技新闻列表

### 接口路径：`/api/Zhaogq/news`

- HTTP 方法：GET
- 请求参数（Query，均为可选）：

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| page | number | 1 | 页码 |
| pageSize | number | 6 | 每页条数，最大 20 |
| keyword | string | - | 按标题/摘要模糊搜索 |
| category | string | - | 分类精确筛选 |

- 请求示例：`GET http://localhost:8201/api/Zhaogq/news?page=1&pageSize=6&keyword=量子`
- 响应格式（JSON 示例）：

```json
{
  "code": 0,
  "msg": "查询成功",
  "data": {
    "Zhaogq_list": [
      {
        "Zhaogq_id": 3,
        "Zhaogq_title": "量子计算原型机完成千比特级纠错实验",
        "Zhaogq_category": "前沿科技",
        "Zhaogq_summary": "研究团队实现表面码逻辑量子比特稳定运行，为容错量子计算提供了新的工程路径。",
        "Zhaogq_author": "陈子墨",
        "Zhaogq_source": "粒子科学周刊",
        "Zhaogq_publish_time": "2026-11-16T02:05:00.000Z",
        "Zhaogq_views": 9640,
        "Zhaogq_cover": "images/Zhaogq_img_3.svg"
      }
    ],
    "Zhaogq_total": 1,
    "Zhaogq_page": 1,
    "Zhaogq_pageSize": 6
  }
}
```

- 修改时间：2026-11-19 10:40:00

---

## 2026-11-19 · 新闻分类

### 接口路径：`/api/Zhaogq/news/categories`

- HTTP 方法：GET
- 请求参数：无
- 请求示例：`GET http://localhost:8201/api/Zhaogq/news/categories`
- 响应格式（JSON 示例）：

```json
{
  "code": 0,
  "msg": "查询成功",
  "data": {
    "Zhaogq_list": ["人工智能", "前沿科技", "消费电子", "云计算", "智能汽车"]
  }
}
```

- 修改时间：2026-11-19 10:40:00

---

## 2026-11-19 · 图文资讯列表

### 接口路径：`/api/Zhaogq/gallery`

- HTTP 方法：GET
- 请求参数：无
- 请求示例：`GET http://localhost:8201/api/Zhaogq/gallery`
- 响应格式（JSON 示例）：

```json
{
  "code": 0,
  "msg": "查询成功",
  "data": {
    "Zhaogq_list": [
      {
        "Zhaogq_id": 1,
        "Zhaogq_title": "神经网络可视化实验室",
        "Zhaogq_image": "images/Zhaogq_img_1.svg",
        "Zhaogq_description": "研究团队将千层网络的计算过程转化为可交互的三维图谱，帮助工程师定位训练瓶颈。",
        "Zhaogq_tech": "人工智能",
        "Zhaogq_create_time": "2026-11-19T02:30:00.000Z"
      }
    ],
    "Zhaogq_total": 8
  }
}
```

- 修改时间：2026-11-19 10:40:00
