/* 姓名：赵国庆 | 学号：24002120201 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash */
const Zhaogq_galleryModel = require('../models/Zhaogq_galleryModel');

/* GET /api/Zhaogq/gallery 图文资讯列表 */
async function Zhaogq_getGalleryList(Zhaogq_req, Zhaogq_res, Zhaogq_next) {
  try {
    const Zhaogq_list = await Zhaogq_galleryModel.Zhaogq_findGalleryList();
    Zhaogq_res.json({ code: 0, msg: '查询成功', data: { Zhaogq_list, Zhaogq_total: Zhaogq_list.length } });
  } catch (Zhaogq_err) {
    Zhaogq_next(Zhaogq_err);
  }
}

module.exports = { Zhaogq_getGalleryList };
