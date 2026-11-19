/* 姓名：赵国庆 | 学号：24002120201 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash */
/* 数据库连接测试页逻辑 */

(function Zhaogq_initDatabasePage() {
  const Zhaogq_form = document.getElementById('Zhaogq_dbForm');
  const Zhaogq_apiUrlEl = document.getElementById('Zhaogq_apiUrl');
  const Zhaogq_result = document.getElementById('Zhaogq_result');
  const Zhaogq_resultTitle = document.getElementById('Zhaogq_resultTitle');
  const Zhaogq_resultBody = document.getElementById('Zhaogq_resultBody');
  const Zhaogq_testBtn = document.getElementById('Zhaogq_testBtn');

  if (!Zhaogq_form) return;

  const Zhaogq_endpoint = Zhaogq_getApiUrl('/Zhaogq/db/test');
  Zhaogq_apiUrlEl.textContent = Zhaogq_endpoint;

  /* 渲染结果面板 */
  function Zhaogq_showResult(Zhaogq_isOk, Zhaogq_title, Zhaogq_items) {
    Zhaogq_result.classList.add('isShow');
    Zhaogq_result.classList.toggle('isOk', Zhaogq_isOk);
    Zhaogq_result.classList.toggle('isErr', !Zhaogq_isOk);
    Zhaogq_resultTitle.textContent = Zhaogq_title;

    Zhaogq_resultBody.innerHTML = '';
    Zhaogq_items.forEach((Zhaogq_item) => {
      const Zhaogq_dt = document.createElement('dt');
      Zhaogq_dt.textContent = Zhaogq_item.Zhaogq_label;
      const Zhaogq_dd = document.createElement('dd');
      Zhaogq_dd.textContent = Zhaogq_item.Zhaogq_value;
      Zhaogq_resultBody.appendChild(Zhaogq_dt);
      Zhaogq_resultBody.appendChild(Zhaogq_dd);
    });
  }

  /* 提交表单，调用后端测试接口 */
  Zhaogq_form.addEventListener('submit', async (Zhaogq_event) => {
    Zhaogq_event.preventDefault();

    const Zhaogq_payload = {
      host: document.getElementById('Zhaogq_host').value.trim(),
      port: Number(document.getElementById('Zhaogq_port').value) || 3306,
      user: document.getElementById('Zhaogq_user').value.trim(),
      password: document.getElementById('Zhaogq_password').value,
      database: document.getElementById('Zhaogq_database').value.trim()
    };

    Zhaogq_testBtn.disabled = true;
    Zhaogq_testBtn.textContent = '连接中…';

    try {
      console.log('[Zhaogq] 发起数据库连接测试：', Zhaogq_endpoint, Zhaogq_payload);
      const Zhaogq_res = await fetch(Zhaogq_endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Zhaogq_payload)
      });
      const Zhaogq_json = await Zhaogq_res.json();
      console.log('[Zhaogq] 数据库测试接口返回：', Zhaogq_json);

      if (Zhaogq_json.code === 0) {
        const Zhaogq_data = Zhaogq_json.data;
        Zhaogq_showResult(true, Zhaogq_json.msg, [
          { Zhaogq_label: '主机', Zhaogq_value: Zhaogq_data.Zhaogq_host + ':' + Zhaogq_data.Zhaogq_port },
          { Zhaogq_label: '用户', Zhaogq_value: Zhaogq_data.Zhaogq_user },
          { Zhaogq_label: '数据库', Zhaogq_value: Zhaogq_data.Zhaogq_database },
          { Zhaogq_label: 'MySQL 版本', Zhaogq_value: Zhaogq_data.Zhaogq_version },
          { Zhaogq_label: '数据表数量', Zhaogq_value: String(Zhaogq_data.Zhaogq_tableCount) },
          { Zhaogq_label: '数据表', Zhaogq_value: Zhaogq_data.Zhaogq_tables.join('、') || '（空）' }
        ]);
      } else {
        console.error('[Zhaogq] 数据库连接失败：', Zhaogq_json.msg);
        Zhaogq_showResult(false, Zhaogq_json.msg, [
          { Zhaogq_label: '主机', Zhaogq_value: Zhaogq_payload.host + ':' + Zhaogq_payload.port },
          { Zhaogq_label: '用户', Zhaogq_value: Zhaogq_payload.user },
          { Zhaogq_label: '错误码', Zhaogq_value: (Zhaogq_json.data && Zhaogq_json.data.Zhaogq_errorCode) || 'UNKNOWN' }
        ]);
      }
    } catch (Zhaogq_err) {
      console.error('[Zhaogq] 数据库测试请求异常：', Zhaogq_err);
      Zhaogq_showResult(false, '请求失败：' + Zhaogq_err.message, [
        { Zhaogq_label: '接口地址', Zhaogq_value: Zhaogq_endpoint },
        { Zhaogq_label: '提示', Zhaogq_value: '请确认后端服务已启动（端口 8201）' }
      ]);
    } finally {
      Zhaogq_testBtn.disabled = false;
      Zhaogq_testBtn.textContent = '测试连接';
    }
  });

  /* 重置时隐藏上一次结果 */
  Zhaogq_form.addEventListener('reset', () => {
    Zhaogq_result.classList.remove('isShow', 'isOk', 'isErr');
  });
})();
