/* 姓名：赵国庆 | 学号：24002120201 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash */
const Zhaogq_newsModel = require('../models/Zhaogq_newsModel');

/* GET /api/Zhaogq/news 科技新闻列表 */
async function Zhaogq_getNewsList(Zhaogq_req, Zhaogq_res, Zhaogq_next) {
  try {
    const Zhaogq_page = Math.max(1, parseInt(Zhaogq_req.query.page, 10) || 1);
    const Zhaogq_pageSize = Math.min(20, Math.max(1, parseInt(Zhaogq_req.query.pageSize, 10) || 6));
    const Zhaogq_keyword = (Zhaogq_req.query.keyword || '').trim();
    const Zhaogq_category = (Zhaogq_req.query.category || '').trim();

    const Zhaogq_result = await Zhaogq_newsModel.Zhaogq_findNewsList({
      Zhaogq_keyword,
      Zhaogq_category,
      Zhaogq_page,
      Zhaogq_pageSize
    });

    Zhaogq_res.json({
      code: 0,
      msg: '查询成功',
      data: {
        Zhaogq_list: Zhaogq_result.Zhaogq_list,
        Zhaogq_total: Zhaogq_result.Zhaogq_total,
        Zhaogq_page,
        Zhaogq_pageSize
      }
    });
  } catch (Zhaogq_err) {
    Zhaogq_next(Zhaogq_err);
  }
}

/* GET /api/Zhaogq/news/categories 新闻分类 */
async function Zhaogq_getCategories(Zhaogq_req, Zhaogq_res, Zhaogq_next) {
  try {
    const Zhaogq_list = await Zhaogq_newsModel.Zhaogq_findCategories();
    Zhaogq_res.json({ code: 0, msg: '查询成功', data: { Zhaogq_list } });
  } catch (Zhaogq_err) {
    Zhaogq_next(Zhaogq_err);
  }
}

module.exports = { Zhaogq_getNewsList, Zhaogq_getCategories };
