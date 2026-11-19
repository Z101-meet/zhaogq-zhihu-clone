/* 姓名：赵国庆 | 学号：24002120201 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash */
const Zhaogq_pool = require('../config/Zhaogq_db');

/* 分页查询科技新闻列表（支持关键词、分类筛选） */
async function Zhaogq_findNewsList({ Zhaogq_keyword = '', Zhaogq_category = '', Zhaogq_page = 1, Zhaogq_pageSize = 6 }) {
  const Zhaogq_where = [];
  const Zhaogq_params = [];

  if (Zhaogq_keyword) {
    Zhaogq_where.push('(Zhaogq_title LIKE ? OR Zhaogq_summary LIKE ?)');
    Zhaogq_params.push('%' + Zhaogq_keyword + '%', '%' + Zhaogq_keyword + '%');
  }
  if (Zhaogq_category) {
    Zhaogq_where.push('Zhaogq_category = ?');
    Zhaogq_params.push(Zhaogq_category);
  }

  const Zhaogq_whereSql = Zhaogq_where.length ? ' WHERE ' + Zhaogq_where.join(' AND ') : '';
  const Zhaogq_offset = (Zhaogq_page - 1) * Zhaogq_pageSize;

  const [Zhaogq_countRows] = await Zhaogq_pool.query(
    'SELECT COUNT(*) AS Zhaogq_total FROM Zhaogq_news' + Zhaogq_whereSql,
    Zhaogq_params
  );

  const [Zhaogq_rows] = await Zhaogq_pool.query(
    'SELECT Zhaogq_id, Zhaogq_title, Zhaogq_category, Zhaogq_summary, Zhaogq_author, ' +
      'Zhaogq_source, Zhaogq_publish_time, Zhaogq_views, Zhaogq_cover ' +
      'FROM Zhaogq_news' + Zhaogq_whereSql +
      ' ORDER BY Zhaogq_publish_time DESC LIMIT ? OFFSET ?',
    [...Zhaogq_params, Zhaogq_pageSize, Zhaogq_offset]
  );

  return { Zhaogq_list: Zhaogq_rows, Zhaogq_total: Zhaogq_countRows[0].Zhaogq_total };
}

/* 查询全部分类 */
async function Zhaogq_findCategories() {
  const [Zhaogq_rows] = await Zhaogq_pool.query(
    'SELECT Zhaogq_category FROM Zhaogq_news GROUP BY Zhaogq_category ORDER BY COUNT(*) DESC'
  );
  return Zhaogq_rows.map((Zhaogq_item) => Zhaogq_item.Zhaogq_category);
}

module.exports = { Zhaogq_findNewsList, Zhaogq_findCategories };
