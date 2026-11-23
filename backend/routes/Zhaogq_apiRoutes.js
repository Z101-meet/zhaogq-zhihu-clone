/* 姓名：赵国庆 | 学号：24002120201 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash */
const express = require('express');
const Zhaogq_newsController = require('../controllers/Zhaogq_newsController');
const Zhaogq_galleryController = require('../controllers/Zhaogq_galleryController');
const Zhaogq_dbController = require('../controllers/Zhaogq_dbController');
const Zhaogq_chatController = require('../controllers/Zhaogq_chatController');
const Zhaogq_kbController = require('../controllers/Zhaogq_kbController');
const Zhaogq_qiniuController = require('../controllers/Zhaogq_qiniuController');

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

/* 七牛云 AI 在线客服（OpenAI 兼容接口） */
Zhaogq_router.post('/Zhaogq/qiniu/chat', Zhaogq_qiniuController.Zhaogq_qiniuChat);

/* 知识库（RAG）：上传解析、管理、问答 */
Zhaogq_router.post('/Zhaogq/kb/upload', Zhaogq_kbController.Zhaogq_uploadMiddleware, Zhaogq_kbController.Zhaogq_uploadFile);
Zhaogq_router.get('/Zhaogq/kb/files', Zhaogq_kbController.Zhaogq_getFiles);
Zhaogq_router.get('/Zhaogq/kb/files/:id/chunks', Zhaogq_kbController.Zhaogq_getFileChunks);
Zhaogq_router.delete('/Zhaogq/kb/files/:id', Zhaogq_kbController.Zhaogq_deleteFile);
Zhaogq_router.post('/Zhaogq/kb/ask', Zhaogq_kbController.Zhaogq_ask);

module.exports = Zhaogq_router;
