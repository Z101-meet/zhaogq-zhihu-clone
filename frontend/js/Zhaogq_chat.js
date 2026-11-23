/* 姓名：赵国庆 | 学号：24002120201 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash */
/* AI 聊天页逻辑：维护对话上下文，调用后端 /api/Zhaogq/chat，并在控制台输出收发数据 */

(function Zhaogq_initChatPage() {
  const Zhaogq_messagesEl = document.getElementById('Zhaogq_chatMessages');
  const Zhaogq_emptyEl = document.getElementById('Zhaogq_chatEmpty');
  const Zhaogq_inputEl = document.getElementById('Zhaogq_input');
  const Zhaogq_sendBtn = document.getElementById('Zhaogq_sendBtn');
  const Zhaogq_clearBtn = document.getElementById('Zhaogq_clearBtn');
  const Zhaogq_quickEl = document.getElementById('Zhaogq_quick');
  const Zhaogq_apiUrlEl = document.getElementById('Zhaogq_apiUrl');

  if (!Zhaogq_messagesEl) return;

  const Zhaogq_endpoint = Zhaogq_getApiUrl('/Zhaogq/chat');
  const Zhaogq_history = [];
  let Zhaogq_sending = false;

  Zhaogq_apiUrlEl.textContent = Zhaogq_endpoint;

  /* 滚动到底部 */
  function Zhaogq_scrollBottom() {
    Zhaogq_messagesEl.scrollTop = Zhaogq_messagesEl.scrollHeight;
  }

  /* 当前时间 HH:mm:ss */
  function Zhaogq_now() {
    return new Date().toLocaleTimeString('zh-CN', { hour12: false });
  }

  /* 追加一条消息气泡 */
  function Zhaogq_addMessage(Zhaogq_role, Zhaogq_content, Zhaogq_isError) {
    if (Zhaogq_emptyEl && Zhaogq_emptyEl.parentNode) {
      Zhaogq_emptyEl.remove();
    }

    const Zhaogq_isUser = Zhaogq_role === 'user';
    const Zhaogq_wrap = document.createElement('div');
    Zhaogq_wrap.className = 'Zhaogq_msg ' + (Zhaogq_isUser ? 'Zhaogq_msgUser' : 'Zhaogq_msgBot');

    const Zhaogq_avatar = document.createElement('span');
    Zhaogq_avatar.className = 'Zhaogq_msgAvatar ' +
      (Zhaogq_isUser ? 'Zhaogq_msgAvatarUser' : 'Zhaogq_msgAvatarBot');
    Zhaogq_avatar.textContent = Zhaogq_isUser ? '赵' : 'AI';

    const Zhaogq_body = document.createElement('div');
    const Zhaogq_bubble = document.createElement('div');
    Zhaogq_bubble.className = 'Zhaogq_bubble' + (Zhaogq_isError ? ' Zhaogq_bubbleErr' : '');
    Zhaogq_bubble.textContent = Zhaogq_content;

    const Zhaogq_meta = document.createElement('div');
    Zhaogq_meta.className = 'Zhaogq_msgMeta';
    Zhaogq_meta.textContent = (Zhaogq_isUser ? '赵国庆' : 'AI 助手') + ' · ' + Zhaogq_now();

    Zhaogq_body.appendChild(Zhaogq_bubble);
    Zhaogq_body.appendChild(Zhaogq_meta);
    Zhaogq_wrap.appendChild(Zhaogq_avatar);
    Zhaogq_wrap.appendChild(Zhaogq_body);
    Zhaogq_messagesEl.appendChild(Zhaogq_wrap);
    Zhaogq_scrollBottom();
  }

  /* 输入中动画 */
  function Zhaogq_showTyping() {
    const Zhaogq_wrap = document.createElement('div');
    Zhaogq_wrap.className = 'Zhaogq_msg Zhaogq_msgBot';
    Zhaogq_wrap.id = 'Zhaogq_typingMsg';
    Zhaogq_wrap.innerHTML = '<span class="Zhaogq_msgAvatar Zhaogq_msgAvatarBot">AI</span>' +
      '<div class="Zhaogq_bubble"><span class="Zhaogq_typing"><i></i><i></i><i></i></span></div>';
    Zhaogq_messagesEl.appendChild(Zhaogq_wrap);
    Zhaogq_scrollBottom();
  }

  function Zhaogq_hideTyping() {
    const Zhaogq_typingMsg = document.getElementById('Zhaogq_typingMsg');
    if (Zhaogq_typingMsg) Zhaogq_typingMsg.remove();
  }

  /* 发送消息 */
  async function Zhaogq_send(Zhaogq_text) {
    const Zhaogq_content = (Zhaogq_text || '').trim();
    if (!Zhaogq_content || Zhaogq_sending) return;

    Zhaogq_sending = true;
    Zhaogq_sendBtn.disabled = true;
    Zhaogq_inputEl.value = '';
    Zhaogq_inputEl.style.height = 'auto';

    Zhaogq_addMessage('user', Zhaogq_content);
    Zhaogq_history.push({ role: 'user', content: Zhaogq_content });

    const Zhaogq_payload = { messages: Zhaogq_history.slice(-20) };
    console.log('[Zhaogq] 发送给大模型的数据：', Zhaogq_payload);
    Zhaogq_showTyping();

    try {
      const Zhaogq_res = await fetch(Zhaogq_endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Zhaogq_payload)
      });
      const Zhaogq_json = await Zhaogq_res.json();
      console.log('[Zhaogq] 从大模型接收到的数据：', Zhaogq_json);
      Zhaogq_hideTyping();

      if (Zhaogq_json.code === 0 && Zhaogq_json.data) {
        const Zhaogq_reply = Zhaogq_json.data.reply || '（模型未返回内容）';
        Zhaogq_history.push({ role: 'assistant', content: Zhaogq_reply });
        Zhaogq_addMessage('assistant', Zhaogq_reply);
      } else {
        console.error('[Zhaogq] AI 聊天失败：', Zhaogq_json.msg);
        Zhaogq_addMessage('assistant', '请求失败：' + Zhaogq_json.msg, true);
      }
    } catch (Zhaogq_err) {
      console.error('[Zhaogq] AI 聊天请求异常：', Zhaogq_err);
      Zhaogq_hideTyping();
      Zhaogq_addMessage('assistant', '请求异常：' + Zhaogq_err.message + '（请确认后端已启动）', true);
    } finally {
      Zhaogq_sending = false;
      Zhaogq_sendBtn.disabled = false;
      Zhaogq_inputEl.focus();
    }
  }

  /* 发送按钮 */
  Zhaogq_sendBtn.addEventListener('click', () => Zhaogq_send(Zhaogq_inputEl.value));

  /* 回车发送，Shift+回车换行 */
  Zhaogq_inputEl.addEventListener('keydown', (Zhaogq_event) => {
    if (Zhaogq_event.key === 'Enter' && !Zhaogq_event.shiftKey) {
      Zhaogq_event.preventDefault();
      Zhaogq_send(Zhaogq_inputEl.value);
    }
  });

  /* 输入框自适应高度 */
  Zhaogq_inputEl.addEventListener('input', () => {
    Zhaogq_inputEl.style.height = 'auto';
    Zhaogq_inputEl.style.height = Math.min(Zhaogq_inputEl.scrollHeight, 120) + 'px';
  });

  /* 快捷提问 */
  Zhaogq_quickEl.addEventListener('click', (Zhaogq_event) => {
    if (Zhaogq_event.target.tagName === 'BUTTON') {
      Zhaogq_send(Zhaogq_event.target.textContent);
    }
  });

  /* 清空对话 */
  Zhaogq_clearBtn.addEventListener('click', () => {
    Zhaogq_history.length = 0;
    Zhaogq_messagesEl.innerHTML =
      '<div class="Zhaogq_chatEmpty" id="Zhaogq_chatEmpty"><strong>你好，我是 AI 聊天助手</strong>' +
      '输入问题开始对话，例如“请介绍一下你自己”。</div>';
    console.log('[Zhaogq] 对话已清空');
  });
})();
