/* 姓名：赵国庆 | 学号：24002120201 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash */
/* 文档解析工具：支持 doc / docx / ppt / pptx / pdf / txt / md */

const fs = require('fs');
const path = require('path');
const officeparser = require('officeparser');
const WordExtractor = require('word-extractor');

const Zhaogq_SUPPORT_EXTS = ['.doc', '.docx', '.ppt', '.pptx', '.pdf', '.txt', '.md'];

/* 清理文本中的多余空白 */
function Zhaogq_cleanText(Zhaogq_text) {
  return String(Zhaogq_text || '')
    .replace(/\r/g, '')
    .replace(/[ \t\u00a0]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/* 旧版 .ppt 为 OLE 二进制，做基础 UTF-16LE 文本抽取作为兜底 */
function Zhaogq_extractLegacyPpt(Zhaogq_filePath) {
  const Zhaogq_buffer = fs.readFileSync(Zhaogq_filePath);
  const Zhaogq_text = Zhaogq_buffer.toString('utf16le');
  const Zhaogq_runs = Zhaogq_text.match(/[\u4e00-\u9fa5A-Za-z0-9，。！？、：；（）《》%\-\.\s]{4,}/g) || [];
  const Zhaogq_seen = new Set();
  const Zhaogq_lines = [];
  Zhaogq_runs.forEach((Zhaogq_run) => {
    const Zhaogq_line = Zhaogq_run.replace(/\s+/g, ' ').trim();
    if (Zhaogq_line.length >= 4 && !Zhaogq_seen.has(Zhaogq_line)) {
      Zhaogq_seen.add(Zhaogq_line);
      Zhaogq_lines.push(Zhaogq_line);
    }
  });
  return Zhaogq_lines.join('\n');
}

/* 解析 office 文件（docx / pptx / pdf 等），兼容 officeparser v6 的对象返回 */
async function Zhaogq_parseOffice(Zhaogq_filePath) {
  const Zhaogq_result = await officeparser.parseOffice(Zhaogq_filePath);
  if (typeof Zhaogq_result === 'string') return Zhaogq_result;
  if (Zhaogq_result && typeof Zhaogq_result.to === 'function') {
    const Zhaogq_text = await Zhaogq_result.to('text');
    if (Zhaogq_text && typeof Zhaogq_text.value === 'string') return Zhaogq_text.value;
    if (typeof Zhaogq_text === 'string') return Zhaogq_text;
  }
  return '';
}

/* 按扩展名提取纯文本 */
async function Zhaogq_extractText(Zhaogq_filePath) {
  const Zhaogq_ext = path.extname(Zhaogq_filePath).toLowerCase();
  if (!Zhaogq_SUPPORT_EXTS.includes(Zhaogq_ext)) {
    throw new Error('不支持的文件类型：' + Zhaogq_ext);
  }

  let Zhaogq_text = '';
  if (['.txt', '.md'].includes(Zhaogq_ext)) {
    Zhaogq_text = fs.readFileSync(Zhaogq_filePath, 'utf8');
  } else if (Zhaogq_ext === '.doc') {
    const Zhaogq_doc = await new WordExtractor().extract(Zhaogq_filePath);
    Zhaogq_text = Zhaogq_doc.getBody();
  } else if (Zhaogq_ext === '.ppt') {
    try {
      Zhaogq_text = await Zhaogq_parseOffice(Zhaogq_filePath);
    } catch (Zhaogq_err) {
      Zhaogq_text = Zhaogq_extractLegacyPpt(Zhaogq_filePath);
    }
  } else {
    Zhaogq_text = await Zhaogq_parseOffice(Zhaogq_filePath);
  }

  return Zhaogq_cleanText(Zhaogq_text);
}

/* 文本切分：默认每片 500 字，重叠 80 字 */
function Zhaogq_splitChunks(Zhaogq_text, Zhaogq_size = 500, Zhaogq_overlap = 80) {
  const Zhaogq_clean = Zhaogq_cleanText(Zhaogq_text);
  if (!Zhaogq_clean) return [];

  const Zhaogq_chunks = [];
  let Zhaogq_start = 0;
  while (Zhaogq_start < Zhaogq_clean.length) {
    let Zhaogq_end = Math.min(Zhaogq_start + Zhaogq_size, Zhaogq_clean.length);
    if (Zhaogq_end < Zhaogq_clean.length) {
      const Zhaogq_slice = Zhaogq_clean.slice(Zhaogq_start, Zhaogq_end);
      const Zhaogq_cut = Math.max(Zhaogq_slice.lastIndexOf('\n'), Zhaogq_slice.lastIndexOf('。'));
      if (Zhaogq_cut > Zhaogq_size * 0.6) Zhaogq_end = Zhaogq_start + Zhaogq_cut + 1;
    }

    const Zhaogq_piece = Zhaogq_clean.slice(Zhaogq_start, Zhaogq_end).trim();
    if (Zhaogq_piece) Zhaogq_chunks.push(Zhaogq_piece);
    if (Zhaogq_end >= Zhaogq_clean.length) break;

    Zhaogq_start = Math.max(Zhaogq_end - Zhaogq_overlap, Zhaogq_start + 1);
  }

  return Zhaogq_chunks;
}

module.exports = {
  Zhaogq_SUPPORT_EXTS,
  Zhaogq_extractText,
  Zhaogq_splitChunks,
  Zhaogq_cleanText
};
