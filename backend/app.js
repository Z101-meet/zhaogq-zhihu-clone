/* 姓名：赵国庆 | 学号：24002120201 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const Zhaogq_apiRoutes = require('./routes/Zhaogq_apiRoutes');

const Zhaogq_app = express();
const Zhaogq_PORT = Number(process.env.PORT) || 8201;

/* 支持所有跨域访问 */
Zhaogq_app.use(cors());
Zhaogq_app.use(express.json());
Zhaogq_app.use(express.urlencoded({ extended: true }));

/* 接口统一以 /api 为前缀 */
Zhaogq_app.use('/api', Zhaogq_apiRoutes);

/* 托管前端静态目录 */
Zhaogq_app.use(express.static(path.join(__dirname, '..', 'frontend')));

/* 未匹配到的接口统一返回 JSON */
Zhaogq_app.use('/api', (Zhaogq_req, Zhaogq_res) => {
  Zhaogq_res.status(404).json({ code: 404, msg: '接口不存在：' + Zhaogq_req.originalUrl, data: null });
});

/* 全局异常处理 */
Zhaogq_app.use((Zhaogq_err, Zhaogq_req, Zhaogq_res, Zhaogq_next) => {
  console.error('[Zhaogq] 服务器异常：', Zhaogq_err.message);
  Zhaogq_res.status(500).json({ code: 500, msg: '服务器内部错误：' + Zhaogq_err.message, data: null });
});

Zhaogq_app.listen(Zhaogq_PORT, () => {
  console.log('[Zhaogq] 服务已启动：http://localhost:' + Zhaogq_PORT);
  console.log('[Zhaogq] 接口地址：http://localhost:' + Zhaogq_PORT + '/api');
});
