/* 姓名：赵国庆 | 学号：24002120201 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash */
const express = require('express');
const Zhaogq_newsController = require('../controllers/Zhaogq_newsController');
const Zhaogq_galleryController = require('../controllers/Zhaogq_galleryController');
const Zhaogq_dbController = require('../controllers/Zhaogq_dbController');
const Zhaogq_chatController = require('../controllers/Zhaogq_chatController');

const Zhaogq_router = express.Router();

/* 健康检查 */
Zhaogq_router.get('/Zhaogq/health', (Zhaogq_req, Zhaogq_res) => {
  Zhaogq_res.json({ code: 0, msg: '服务运行正常', data: { Zhaogq_time: new Date().toISOString() } });
});

/* 数据库连接测试 */
Zhaogq_router.post('/Zhaogq/db/test', Zhaogq_dbController.Zhaogq_testDatabase);

/* 科技新闻 */
Zhaogq_router.get('/Zhaogq/news', Zhaogq_newsController.Zhaogq_getNewsList);
Zhaogq_router.get('/Zhaogq/news/categories', Zhaogq_newsController.Zhaogq_getCategories);

/* 图文资讯 */
Zhaogq_router.get('/Zhaogq/gallery', Zhaogq_galleryController.Zhaogq_getGalleryList);

/* AI 聊天（代理 SiliconFlow） */
Zhaogq_router.post('/Zhaogq/chat', Zhaogq_chatController.Zhaogq_chat);

module.exports = Zhaogq_router;
