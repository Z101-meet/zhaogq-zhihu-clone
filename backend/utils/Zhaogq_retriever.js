/* 姓名：赵国庆 | 学号：24002120201 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash */
/* 轻量检索工具：中文按二元词、英文按单词计分，实现知识库片段召回 */

/* 分词：英文单词 + 中文二元组 */
function Zhaogq_tokenize(Zhaogq_text) {
  const Zhaogq_lower = String(Zhaogq_text || '').toLowerCase();
  const Zhaogq_tokens = new Set();

  (Zhaogq_lower.match(/[a-z0-9_]{2,}/g) || []).forEach((Zhaogq_word) => Zhaogq_tokens.add(Zhaogq_word));

  (Zhaogq_lower.match(/[\u4e00-\u9fa5]+/g) || []).forEach((Zhaogq_run) => {
    if (Zhaogq_run.length === 1) {
      Zhaogq_tokens.add(Zhaogq_run);
      return;
    }
    for (let Zhaogq_i = 0; Zhaogq_i < Zhaogq_run.length - 1; Zhaogq_i += 1) {
      Zhaogq_tokens.add(Zhaogq_run.slice(Zhaogq_i, Zhaogq_i + 2));
    }
  });

  return Array.from(Zhaogq_tokens);
}

/* 计算单个片段与问题的相关度 */
function Zhaogq_scoreChunk(Zhaogq_chunk, Zhaogq_tokens) {
  const Zhaogq_content = String(Zhaogq_chunk.Zhaogq_content || '').toLowerCase();
  let Zhaogq_score = 0;
  Zhaogq_tokens.forEach((Zhaogq_token) => {
    const Zhaogq_hit = Zhaogq_content.split(Zhaogq_token).length - 1;
    if (Zhaogq_hit > 0) Zhaogq_score += Zhaogq_hit * (Zhaogq_token.length > 1 ? 2 : 1);
  });
  return Zhaogq_score;
}

/* 召回 TopK 相关片段 */
function Zhaogq_retrieve(Zhaogq_chunks, Zhaogq_question, Zhaogq_topK = 4) {
  const Zhaogq_tokens = Zhaogq_tokenize(Zhaogq_question);
  return Zhaogq_chunks
    .map((Zhaogq_chunk) => ({ ...Zhaogq_chunk, Zhaogq_score: Zhaogq_scoreChunk(Zhaogq_chunk, Zhaogq_tokens) }))
    .filter((Zhaogq_chunk) => Zhaogq_chunk.Zhaogq_score > 0)
    .sort((Zhaogq_a, Zhaogq_b) => Zhaogq_b.Zhaogq_score - Zhaogq_a.Zhaogq_score)
    .slice(0, Zhaogq_topK);
}

module.exports = { Zhaogq_tokenize, Zhaogq_retrieve };
