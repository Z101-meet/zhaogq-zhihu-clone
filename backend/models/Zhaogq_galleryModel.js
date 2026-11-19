/* 姓名：赵国庆 | 学号：24002120201 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash */
const Zhaogq_pool = require('../config/Zhaogq_db');

/* 查询图文资讯列表 */
async function Zhaogq_findGalleryList() {
  const [Zhaogq_rows] = await Zhaogq_pool.query(
    'SELECT Zhaogq_id, Zhaogq_title, Zhaogq_image, Zhaogq_description, Zhaogq_tech, Zhaogq_create_time ' +
      'FROM Zhaogq_gallery ORDER BY Zhaogq_id ASC'
  );
  return Zhaogq_rows;
}

module.exports = { Zhaogq_findGalleryList };
