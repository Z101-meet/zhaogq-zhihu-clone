/* 姓名：赵国庆 | 学号：24002120201 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash */
/* 项目通用脚本：接口请求封装、格式化与页面公共逻辑 */

const Zhaogq_API_BASE = '/api';

/* 拼接完整接口地址（用于页面展示） */
function Zhaogq_getApiUrl(Zhaogq_path) {
  return window.location.origin + Zhaogq_API_BASE + Zhaogq_path;
}

/* 统一请求方法，返回响应体中的 data；失败时抛出异常 */
async function Zhaogq_request(Zhaogq_path, Zhaogq_options) {
  const Zhaogq_url = Zhaogq_API_BASE + Zhaogq_path;
  console.log('[Zhaogq] 请求接口：', Zhaogq_url, Zhaogq_options || '');
  const Zhaogq_res = await fetch(Zhaogq_url, Zhaogq_options);
  const Zhaogq_json = await Zhaogq_res.json();
  console.log('[Zhaogq] 接口返回：', Zhaogq_json);
  if (Zhaogq_json.code !== 0) {
    console.error('[Zhaogq] 接口返回错误：', Zhaogq_json.msg);
    throw new Error(Zhaogq_json.msg || '请求失败');
  }
  return Zhaogq_json.data;
}

/* HTML 转义，避免拼接渲染时被注入 */
function Zhaogq_escapeHtml(Zhaogq_text) {
  return String(Zhaogq_text == null ? '' : Zhaogq_text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* 时间格式化：2026-11-18T09:30:00.000Z -> 2026-11-18 09:30 */
function Zhaogq_formatTime(Zhaogq_value) {
  if (!Zhaogq_value) return '';
  const Zhaogq_date = new Date(Zhaogq_value);
  if (Number.isNaN(Zhaogq_date.getTime())) return String(Zhaogq_value);
  const Zhaogq_pad = (Zhaogq_num) => String(Zhaogq_num).padStart(2, '0');
  return Zhaogq_date.getFullYear() + '-' + Zhaogq_pad(Zhaogq_date.getMonth() + 1) + '-' +
    Zhaogq_pad(Zhaogq_date.getDate()) + ' ' + Zhaogq_pad(Zhaogq_date.getHours()) + ':' +
    Zhaogq_pad(Zhaogq_date.getMinutes());
}

/* 顶部状态条：检测后端服务与数据库是否可用 */
async function Zhaogq_checkHealth() {
  const Zhaogq_statusEl = document.getElementById('Zhaogq_status');
  const Zhaogq_textEl = document.getElementById('Zhaogq_statusText');
  if (!Zhaogq_statusEl || !Zhaogq_textEl) return;

  try {
    const Zhaogq_data = await Zhaogq_request('/Zhaogq/health');
    Zhaogq_statusEl.classList.add('isOk');
    Zhaogq_statusEl.classList.remove('isErr');
    Zhaogq_textEl.textContent = '后端服务正常 · ' + Zhaogq_formatTime(Zhaogq_data.Zhaogq_time);
  } catch (Zhaogq_err) {
    console.error('[Zhaogq] 后端健康检查失败：', Zhaogq_err);
    Zhaogq_statusEl.classList.add('isErr');
    Zhaogq_statusEl.classList.remove('isOk');
    Zhaogq_textEl.textContent = '后端服务未连接';
  }
}

Zhaogq_checkHealth();
