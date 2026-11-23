/* 姓名：赵国庆 | 学号：24002120201 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash */
/* 知识库数据模型 */

const Zhaogq_pool = require('../config/Zhaogq_db');

const Zhaogq_CREATE_FILE_SQL = `
CREATE TABLE IF NOT EXISTS Zhaogq_kb_file (
  Zhaogq_id INT AUTO_INCREMENT PRIMARY KEY,
  Zhaogq_name VARCHAR(255) NOT NULL COMMENT '文件名',
  Zhaogq_ext VARCHAR(16) NOT NULL COMMENT '扩展名',
  Zhaogq_size INT NOT NULL DEFAULT 0 COMMENT '字节数',
  Zhaogq_path VARCHAR(512) NOT NULL DEFAULT '' COMMENT '存储路径',
  Zhaogq_chunk_count INT NOT NULL DEFAULT 0 COMMENT '片段数',
  Zhaogq_create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_Zhaogq_create_time (Zhaogq_create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='知识库文件表'`;

const Zhaogq_CREATE_CHUNK_SQL = `
CREATE TABLE IF NOT EXISTS Zhaogq_kb_chunk (
  Zhaogq_id INT AUTO_INCREMENT PRIMARY KEY,
  Zhaogq_file_id INT NOT NULL COMMENT '所属文件ID',
  Zhaogq_chunk_index INT NOT NULL COMMENT '片段序号',
  Zhaogq_content TEXT NOT NULL COMMENT '片段内容',
  Zhaogq_create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_Zhaogq_file_id (Zhaogq_file_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='知识库片段表'`;

async function Zhaogq_ensureTables() {
  await Zhaogq_pool.query(Zhaogq_CREATE_FILE_SQL);
  await Zhaogq_pool.query(Zhaogq_CREATE_CHUNK_SQL);
}

/* 写入文件与片段（事务） */
async function Zhaogq_saveFile(Zhaogq_file, Zhaogq_chunks) {
  const Zhaogq_conn = await Zhaogq_pool.getConnection();
  try {
    await Zhaogq_conn.beginTransaction();
    const [Zhaogq_result] = await Zhaogq_conn.query(
      'INSERT INTO Zhaogq_kb_file (Zhaogq_name, Zhaogq_ext, Zhaogq_size, Zhaogq_path, Zhaogq_chunk_count) VALUES (?, ?, ?, ?, ?)',
      [Zhaogq_file.name, Zhaogq_file.ext, Zhaogq_file.size, Zhaogq_file.path, Zhaogq_chunks.length]
    );
    const Zhaogq_fileId = Zhaogq_result.insertId;
    if (Zhaogq_chunks.length) {
      const Zhaogq_values = Zhaogq_chunks.map((Zhaogq_content, Zhaogq_index) => [Zhaogq_fileId, Zhaogq_index + 1, Zhaogq_content]);
      await Zhaogq_conn.query(
        'INSERT INTO Zhaogq_kb_chunk (Zhaogq_file_id, Zhaogq_chunk_index, Zhaogq_content) VALUES ?',
        [Zhaogq_values]
      );
    }
    await Zhaogq_conn.commit();
    return Zhaogq_fileId;
  } catch (Zhaogq_err) {
    await Zhaogq_conn.rollback();
    throw Zhaogq_err;
  } finally {
    Zhaogq_conn.release();
  }
}

async function Zhaogq_listFiles() {
  const [Zhaogq_rows] = await Zhaogq_pool.query(
    'SELECT Zhaogq_id, Zhaogq_name, Zhaogq_ext, Zhaogq_size, Zhaogq_chunk_count, Zhaogq_create_time FROM Zhaogq_kb_file ORDER BY Zhaogq_id DESC'
  );
  return Zhaogq_rows;
}

async function Zhaogq_getFile(Zhaogq_id) {
  const [Zhaogq_rows] = await Zhaogq_pool.query('SELECT * FROM Zhaogq_kb_file WHERE Zhaogq_id = ?', [Zhaogq_id]);
  return Zhaogq_rows[0] || null;
}

async function Zhaogq_getChunks(Zhaogq_fileId) {
  const [Zhaogq_rows] = await Zhaogq_pool.query(
    'SELECT Zhaogq_id, Zhaogq_chunk_index, Zhaogq_content FROM Zhaogq_kb_chunk WHERE Zhaogq_file_id = ? ORDER BY Zhaogq_chunk_index ASC',
    [Zhaogq_fileId]
  );
  return Zhaogq_rows;
}

async function Zhaogq_getAllChunks() {
  const [Zhaogq_rows] = await Zhaogq_pool.query(
    `SELECT c.Zhaogq_id, c.Zhaogq_file_id, c.Zhaogq_chunk_index, c.Zhaogq_content, f.Zhaogq_name
     FROM Zhaogq_kb_chunk c
     INNER JOIN Zhaogq_kb_file f ON f.Zhaogq_id = c.Zhaogq_file_id
     ORDER BY c.Zhaogq_id ASC`
  );
  return Zhaogq_rows;
}

async function Zhaogq_deleteFile(Zhaogq_id) {
  const Zhaogq_conn = await Zhaogq_pool.getConnection();
  try {
    await Zhaogq_conn.beginTransaction();
    await Zhaogq_conn.query('DELETE FROM Zhaogq_kb_chunk WHERE Zhaogq_file_id = ?', [Zhaogq_id]);
    await Zhaogq_conn.query('DELETE FROM Zhaogq_kb_file WHERE Zhaogq_id = ?', [Zhaogq_id]);
    await Zhaogq_conn.commit();
  } catch (Zhaogq_err) {
    await Zhaogq_conn.rollback();
    throw Zhaogq_err;
  } finally {
    Zhaogq_conn.release();
  }
}

module.exports = {
  Zhaogq_ensureTables,
  Zhaogq_saveFile,
  Zhaogq_listFiles,
  Zhaogq_getFile,
  Zhaogq_getChunks,
  Zhaogq_getAllChunks,
  Zhaogq_deleteFile,
  Zhaogq_CREATE_FILE_SQL,
  Zhaogq_CREATE_CHUNK_SQL
};
