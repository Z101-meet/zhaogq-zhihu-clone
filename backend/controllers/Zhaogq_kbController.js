/* 姓名：赵国庆 | 学号：24002120201 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash */
/* 知识库控制器：文件上传解析、知识库管理、基于知识库的问答（RAG） */

const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Zhaogq_kbModel = require('../models/Zhaogq_kbModel');
const Zhaogq_docParser = require('../utils/Zhaogq_docParser');
const Zhaogq_retriever = require('../utils/Zhaogq_retriever');

const Zhaogq_UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'Zhaogq_kb');
fs.mkdirSync(Zhaogq_UPLOAD_DIR, { recursive: true });

const Zhaogq_storage = multer.diskStorage({
  destination: (Zhaogq_req, Zhaogq_file, Zhaogq_cb) => Zhaogq_cb(null, Zhaogq_UPLOAD_DIR),
  filename: (Zhaogq_req, Zhaogq_file, Zhaogq_cb) => {
    const Zhaogq_ext = path.extname(Zhaogq_file.originalname).toLowerCase();
    Zhaogq_cb(null, 'Zhaogq_kb_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8) + Zhaogq_ext);
  }
});

const Zhaogq_uploader = multer({
  storage: Zhaogq_storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (Zhaogq_req, Zhaogq_file, Zhaogq_cb) => {
    const Zhaogq_ext = path.extname(Zhaogq_file.originalname).toLowerCase();
    if (!Zhaogq_docParser.Zhaogq_SUPPORT_EXTS.includes(Zhaogq_ext)) {
      Zhaogq_cb(new Error('仅支持 doc / docx / ppt / pptx / pdf / txt / md 文件'));
      return;
    }
    Zhaogq_cb(null, true);
  }
});

/* 上传中间件：统一把错误转成 JSON */
function Zhaogq_uploadMiddleware(Zhaogq_req, Zhaogq_res, Zhaogq_next) {
  Zhaogq_uploader.single('file')(Zhaogq_req, Zhaogq_res, (Zhaogq_err) => {
    if (Zhaogq_err) {
      const Zhaogq_msg = Zhaogq_err.code === 'LIMIT_FILE_SIZE' ? '文件不能超过 20MB' : Zhaogq_err.message;
      Zhaogq_res.json({ code: 1, msg: Zhaogq_msg, data: null });
      return;
    }
    Zhaogq_next();
  });
}

/* POST /api/Zhaogq/kb/upload 上传并解析知识库文件 */
async function Zhaogq_uploadFile(Zhaogq_req, Zhaogq_res, Zhaogq_next) {
  const Zhaogq_file = Zhaogq_req.file;
  if (!Zhaogq_file) {
    Zhaogq_res.json({ code: 1, msg: '请选择要上传的文件', data: null });
    return;
  }

  try {
    /* multer 以 latin1 解析文件名，这里还原中文 */
    const Zhaogq_originalName = Buffer.from(Zhaogq_file.originalname, 'latin1').toString('utf8');
    const Zhaogq_ext = path.extname(Zhaogq_originalName).toLowerCase();
    const Zhaogq_text = await Zhaogq_docParser.Zhaogq_extractText(Zhaogq_file.path);
    const Zhaogq_chunks = Zhaogq_docParser.Zhaogq_splitChunks(Zhaogq_text);

    if (!Zhaogq_chunks.length) {
      fs.unlinkSync(Zhaogq_file.path);
      Zhaogq_res.json({ code: 2, msg: '未能从文件中解析出文本内容', data: null });
      return;
    }

    const Zhaogq_fileId = await Zhaogq_kbModel.Zhaogq_saveFile({
      name: Zhaogq_originalName,
      ext: Zhaogq_ext.replace('.', ''),
      size: Zhaogq_file.size,
      path: 'uploads/Zhaogq_kb/' + path.basename(Zhaogq_file.path)
    }, Zhaogq_chunks);

    const Zhaogq_data = {
      Zhaogq_id: Zhaogq_fileId,
      Zhaogq_name: Zhaogq_originalName,
      Zhaogq_ext: Zhaogq_ext.replace('.', ''),
      Zhaogq_size: Zhaogq_file.size,
      Zhaogq_chunkCount: Zhaogq_chunks.length,
      Zhaogq_textLength: Zhaogq_text.length
    };
    console.log('[Zhaogq] 知识库文件入库：', JSON.stringify(Zhaogq_data));
    Zhaogq_res.json({ code: 0, msg: '上传并解析成功', data: Zhaogq_data });
  } catch (Zhaogq_err) {
    if (Zhaogq_file && fs.existsSync(Zhaogq_file.path)) fs.unlinkSync(Zhaogq_file.path);
    console.error('[Zhaogq] 知识库文件解析失败：', Zhaogq_err.message);
    Zhaogq_res.json({ code: 2, msg: '文件解析失败：' + Zhaogq_err.message, data: null });
  }
}

/* GET /api/Zhaogq/kb/files 知识库文件列表 */
async function Zhaogq_getFiles(Zhaogq_req, Zhaogq_res, Zhaogq_next) {
  try {
    const Zhaogq_list = await Zhaogq_kbModel.Zhaogq_listFiles();
    Zhaogq_res.json({ code: 0, msg: '查询成功', data: { Zhaogq_list, Zhaogq_total: Zhaogq_list.length } });
  } catch (Zhaogq_err) {
    Zhaogq_next(Zhaogq_err);
  }
}

/* GET /api/Zhaogq/kb/files/:id/chunks 查看片段 */
async function Zhaogq_getFileChunks(Zhaogq_req, Zhaogq_res, Zhaogq_next) {
  try {
    const Zhaogq_id = Number(Zhaogq_req.params.id);
    const Zhaogq_file = await Zhaogq_kbModel.Zhaogq_getFile(Zhaogq_id);
    if (!Zhaogq_file) {
      Zhaogq_res.json({ code: 404, msg: '文件不存在', data: null });
      return;
    }
    const Zhaogq_list = await Zhaogq_kbModel.Zhaogq_getChunks(Zhaogq_id);
    Zhaogq_res.json({
      code: 0,
      msg: '查询成功',
      data: { Zhaogq_file: { id: Zhaogq_file.Zhaogq_id, name: Zhaogq_file.Zhaogq_name }, Zhaogq_list }
    });
  } catch (Zhaogq_err) {
    Zhaogq_next(Zhaogq_err);
  }
}

/* DELETE /api/Zhaogq/kb/files/:id 删除文件及片段 */
async function Zhaogq_deleteFile(Zhaogq_req, Zhaogq_res, Zhaogq_next) {
  try {
    const Zhaogq_id = Number(Zhaogq_req.params.id);
    const Zhaogq_file = await Zhaogq_kbModel.Zhaogq_getFile(Zhaogq_id);
    if (!Zhaogq_file) {
      Zhaogq_res.json({ code: 404, msg: '文件不存在', data: null });
      return;
    }
    await Zhaogq_kbModel.Zhaogq_deleteFile(Zhaogq_id);
    const Zhaogq_absolute = path.join(__dirname, '..', Zhaogq_file.Zhaogq_path || '');
    if (Zhaogq_file.Zhaogq_path && fs.existsSync(Zhaogq_absolute)) fs.unlinkSync(Zhaogq_absolute);
    console.log('[Zhaogq] 知识库文件已删除：', Zhaogq_file.Zhaogq_name);
    Zhaogq_res.json({ code: 0, msg: '删除成功', data: { Zhaogq_id } });
  } catch (Zhaogq_err) {
    Zhaogq_next(Zhaogq_err);
  }
}

/* POST /api/Zhaogq/kb/ask 基于知识库的问答 */
async function Zhaogq_ask(Zhaogq_req, Zhaogq_res, Zhaogq_next) {
  try {
    const Zhaogq_question = String((Zhaogq_req.body && Zhaogq_req.body.question) || '').trim();
    if (!Zhaogq_question) {
      Zhaogq_res.json({ code: 1, msg: '请输入问题', data: null });
      return;
    }

    const Zhaogq_apiKey = process.env.SILICONFLOW_API_KEY;
    if (!Zhaogq_apiKey) {
      Zhaogq_res.json({ code: 2, msg: '未配置 SILICONFLOW_API_KEY，请检查 backend/.env', data: null });
      return;
    }

    const Zhaogq_chunks = await Zhaogq_kbModel.Zhaogq_getAllChunks();
    if (!Zhaogq_chunks.length) {
      Zhaogq_res.json({ code: 3, msg: '知识库为空，请先上传文件', data: null });
      return;
    }

    const Zhaogq_hits = Zhaogq_retriever.Zhaogq_retrieve(Zhaogq_chunks, Zhaogq_question, 4);
    console.log('[Zhaogq] 知识库检索结果：', JSON.stringify(Zhaogq_hits.map((Zhaogq_hit) => ({
      Zhaogq_file: Zhaogq_hit.Zhaogq_name,
      Zhaogq_chunkIndex: Zhaogq_hit.Zhaogq_chunk_index,
      Zhaogq_score: Zhaogq_hit.Zhaogq_score
    })), null, 2));

    if (!Zhaogq_hits.length) {
      Zhaogq_res.json({
        code: 0,
        msg: '知识库中未检索到相关内容',
        data: {
          answer: '根据现有知识库暂未找到答案，建议联系人工客服 400-880-2020（服务时间 9:00-21:00）。',
          sources: []
        }
      });
      return;
    }

    const Zhaogq_context = Zhaogq_hits.map((Zhaogq_hit, Zhaogq_index) =>
      '【资料' + (Zhaogq_index + 1) + '】来源：' + Zhaogq_hit.Zhaogq_name + '（片段' + Zhaogq_hit.Zhaogq_chunk_index + '）\n' + Zhaogq_hit.Zhaogq_content
    ).join('\n\n');

    const Zhaogq_payload = {
      model: 'deepseek-ai/DeepSeek-V4-Flash',
      messages: [
        {
          role: 'system',
          content: '你是星图智能科技的智能客服。请严格依据【参考资料】回答用户问题，不要编造资料以外的内容；如果资料中没有答案，请明确说明“根据现有知识库暂未找到答案”，并建议联系人工客服 400-880-2020。回答使用简洁的中文。'
        },
        {
          role: 'user',
          content: '【参考资料】\n' + Zhaogq_context + '\n\n【用户问题】\n' + Zhaogq_question
        }
      ],
      temperature: 0.2,
      stream: false
    };

    console.log('[Zhaogq] 发送给大模型的数据：', JSON.stringify(Zhaogq_payload, null, 2));

    const Zhaogq_upstream = await fetch(
      process.env.SILICONFLOW_API_URL || 'https://api.siliconflow.cn/v1/chat/completions',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + Zhaogq_apiKey },
        body: JSON.stringify(Zhaogq_payload),
        signal: AbortSignal.timeout(90000)
      }
    );
    const Zhaogq_json = await Zhaogq_upstream.json().catch(() => null);
    console.log('[Zhaogq] 从大模型接收到的数据：', JSON.stringify(Zhaogq_json, null, 2));

    if (!Zhaogq_upstream.ok || !Zhaogq_json) {
      Zhaogq_res.json({ code: Zhaogq_upstream.status || 500, msg: (Zhaogq_json && Zhaogq_json.message) || '大模型接口调用失败', data: null });
      return;
    }

    const Zhaogq_reply = Zhaogq_json.choices && Zhaogq_json.choices[0] && Zhaogq_json.choices[0].message
      ? Zhaogq_json.choices[0].message.content
      : '';

    Zhaogq_res.json({
      code: 0,
      msg: '问答成功',
      data: {
        answer: Zhaogq_reply,
        model: Zhaogq_json.model || Zhaogq_payload.model,
        usage: Zhaogq_json.usage || null,
        sources: Zhaogq_hits.map((Zhaogq_hit) => ({
          Zhaogq_fileId: Zhaogq_hit.Zhaogq_file_id,
          Zhaogq_file: Zhaogq_hit.Zhaogq_name,
          Zhaogq_chunkIndex: Zhaogq_hit.Zhaogq_chunk_index,
          Zhaogq_score: Zhaogq_hit.Zhaogq_score,
          Zhaogq_content: Zhaogq_hit.Zhaogq_content
        }))
      }
    });
  } catch (Zhaogq_err) {
    Zhaogq_next(Zhaogq_err);
  }
}

module.exports = {
  Zhaogq_uploadMiddleware,
  Zhaogq_uploadFile,
  Zhaogq_getFiles,
  Zhaogq_getFileChunks,
  Zhaogq_deleteFile,
  Zhaogq_ask
};
