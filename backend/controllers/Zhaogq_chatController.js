/* 姓名：赵国庆 | 学号：24002120201 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash */
/* AI 聊天：后端代理调用 SiliconFlow 大模型接口，密钥只保存在 .env */

const Zhaogq_DEFAULT_MODEL = 'deepseek-ai/DeepSeek-V4-Flash';

/* 仅保留合法的对话消息，过滤异常数据 */
function Zhaogq_normalizeMessages(Zhaogq_messages) {
  if (!Array.isArray(Zhaogq_messages)) return [];
  return Zhaogq_messages
    .filter((Zhaogq_item) => Zhaogq_item && typeof Zhaogq_item.content === 'string' &&
      ['system', 'user', 'assistant'].includes(Zhaogq_item.role))
    .map((Zhaogq_item) => ({ role: Zhaogq_item.role, content: Zhaogq_item.content }));
}

/* POST /api/Zhaogq/chat AI 对话 */
async function Zhaogq_chat(Zhaogq_req, Zhaogq_res, Zhaogq_next) {
  try {
    const Zhaogq_apiKey = process.env.SILICONFLOW_API_KEY;
    if (!Zhaogq_apiKey) {
      return Zhaogq_res.json({ code: 2, msg: '未配置 SILICONFLOW_API_KEY，请检查 backend/.env', data: null });
    }

    const Zhaogq_messages = Zhaogq_normalizeMessages(Zhaogq_req.body && Zhaogq_req.body.messages);
    if (!Zhaogq_messages.length) {
      return Zhaogq_res.json({ code: 1, msg: '消息内容不能为空', data: null });
    }

    /* 组装发送给大模型的数据 */
    const Zhaogq_payload = {
      model: (Zhaogq_req.body && Zhaogq_req.body.model) || Zhaogq_DEFAULT_MODEL,
      messages: [{ role: 'system', content: '你是一个有用的助手' }, ...Zhaogq_messages],
      stream: false
    };

    console.log('[Zhaogq] 发送给大模型的数据：', JSON.stringify(Zhaogq_payload, null, 2));

    const Zhaogq_startedAt = Date.now();
    const Zhaogq_upstream = await fetch(
      process.env.SILICONFLOW_API_URL || 'https://api.siliconflow.cn/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + Zhaogq_apiKey
        },
        body: JSON.stringify(Zhaogq_payload),
        signal: AbortSignal.timeout(90000)
      }
    );

    const Zhaogq_json = await Zhaogq_upstream.json().catch(() => null);
    console.log('[Zhaogq] 从大模型接收到的数据：', JSON.stringify(Zhaogq_json, null, 2));

    if (!Zhaogq_upstream.ok || !Zhaogq_json) {
      return Zhaogq_res.json({
        code: Zhaogq_upstream.status || 500,
        msg: (Zhaogq_json && Zhaogq_json.message) || '大模型接口调用失败',
        data: null
      });
    }

    const Zhaogq_choice = Zhaogq_json.choices && Zhaogq_json.choices[0];
    const Zhaogq_reply = Zhaogq_choice && Zhaogq_choice.message ? Zhaogq_choice.message.content : '';

    Zhaogq_res.json({
      code: 0,
      msg: '请求成功',
      data: {
        reply: Zhaogq_reply,
        model: Zhaogq_json.model || Zhaogq_payload.model,
        usage: Zhaogq_json.usage || null,
        Zhaogq_duration: Date.now() - Zhaogq_startedAt
      }
    });
  } catch (Zhaogq_err) {
    Zhaogq_next(Zhaogq_err);
  }
}

module.exports = { Zhaogq_chat };
