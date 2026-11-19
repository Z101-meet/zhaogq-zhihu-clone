/* 姓名：赵国庆 | 学号：24002120201 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash */
const mysql = require('mysql2/promise');

/* POST /api/Zhaogq/db/test 测试 MySQL 数据库连接 */
async function Zhaogq_testDatabase(Zhaogq_req, Zhaogq_res) {
  const Zhaogq_body = Zhaogq_req.body || {};
  const Zhaogq_host = (Zhaogq_body.host || 'localhost').trim();
  const Zhaogq_user = (Zhaogq_body.user || 'root').trim();
  const Zhaogq_password = Zhaogq_body.password || '';
  const Zhaogq_database = (Zhaogq_body.database || '').trim();
  const Zhaogq_port = Number(Zhaogq_body.port) || 3306;

  if (!Zhaogq_user) {
    return Zhaogq_res.json({ code: 1, msg: '用户名不能为空', data: null });
  }

  let Zhaogq_conn = null;
  try {
    Zhaogq_conn = await mysql.createConnection({
      host: Zhaogq_host,
      port: Zhaogq_port,
      user: Zhaogq_user,
      password: Zhaogq_password,
      database: Zhaogq_database || undefined,
      connectTimeout: 5000
    });

    const [Zhaogq_versionRows] = await Zhaogq_conn.query('SELECT VERSION() AS Zhaogq_version');
    const [Zhaogq_tableRows] = await Zhaogq_conn.query('SHOW TABLES');

    const Zhaogq_tables = Zhaogq_tableRows.map((Zhaogq_row) => Object.values(Zhaogq_row)[0]);

    Zhaogq_res.json({
      code: 0,
      msg: '数据库连接成功',
      data: {
        Zhaogq_host,
        Zhaogq_port,
        Zhaogq_user,
        Zhaogq_database: Zhaogq_database || '(未指定)',
        Zhaogq_version: Zhaogq_versionRows[0].Zhaogq_version,
        Zhaogq_tableCount: Zhaogq_tables.length,
        Zhaogq_tables
      }
    });
  } catch (Zhaogq_err) {
    Zhaogq_res.json({
      code: 2,
      msg: '数据库连接失败：' + Zhaogq_err.message,
      data: { Zhaogq_errorCode: Zhaogq_err.code || 'UNKNOWN' }
    });
  } finally {
    if (Zhaogq_conn) {
      try {
        await Zhaogq_conn.end();
      } catch (Zhaogq_closeErr) {
        /* 关闭失败无需处理 */
      }
    }
  }
}

module.exports = { Zhaogq_testDatabase };
