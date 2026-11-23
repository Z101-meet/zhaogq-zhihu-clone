/* 姓名：赵国庆 | 学号：24002120201 | 时间：2026-11-23 | 大模型：DeepSeek-V4.1-Flash */
/* 知识库管理页：文件上传/解析、文件列表、片段查看、基于知识库问答 */

(function Zhaogq_initKbPage() {
  const Zhaogq_fileListEl = document.getElementById('Zhaogq_fileList');
  const Zhaogq_fileCountEl = document.getElementById('Zhaogq_fileCount');
  const Zhaogq_uploadZone = document.getElementById('Zhaogq_uploadZone');
  const Zhaogq_fileInput = document.getElementById('Zhaogq_fileInput');
  const Zhaogq_uploadStatus = document.getElementById('Zhaogq_uploadStatus');
  const Zhaogq_previewEl = document.getElementById('Zhaogq_chunkPreview');
  const Zhaogq_previewTitle = document.getElementById('Zhaogq_chunkPreviewTitle');
  const Zhaogq_previewBody = document.getElementById('Zhaogq_chunkPreviewBody');
  const Zhaogq_previewClose = document.getElementById('Zhaogq_chunkClose');
  const Zhaogq_questionEl = document.getElementById('Zhaogq_question');
  const Zhaogq_askBtn = document.getElementById('Zhaogq_askBtn');
  const Zhaogq_answerEl = document.getElementById('Zhaogq_qaAnswer');
  const Zhaogq_sourcesEl = document.getElementById('Zhaogq_qaSources');
  const Zhaogq_quickEl = document.getElementById('Zhaogq_kbQuick');

  if (!Zhaogq_fileListEl) return;

  const Zhaogq_filesApi = Zhaogq_getApiUrl('/Zhaogq/kb/files');
  const Zhaogq_uploadApi = Zhaogq_getApiUrl('/Zhaogq/kb/upload');
  const Zhaogq_askApi = Zhaogq_getApiUrl('/Zhaogq/kb/ask');

  document.getElementById('Zhaogq_askApiUrl').textContent = Zhaogq_askApi;
  document.getElementById('Zhaogq_uploadApiUrl').textContent = Zhaogq_uploadApi;

  let Zhaogq_asking = false;

  function Zhaogq_formatSize(Zhaogq_bytes) {
    if (Zhaogq_bytes >= 1024 * 1024) return (Zhaogq_bytes / 1024 / 1024).toFixed(1) + ' MB';
    if (Zhaogq_bytes >= 1024) return (Zhaogq_bytes / 1024).toFixed(1) + ' KB';
    return Zhaogq_bytes + ' B';
  }

  function Zhaogq_formatTime(Zhaogq_value) {
    const Zhaogq_date = new Date(Zhaogq_value);
    if (Number.isNaN(Zhaogq_date.getTime())) return '-';
    return Zhaogq_date.toLocaleString('zh-CN', { hour12: false });
  }

  /* 文件列表 */
  async function Zhaogq_loadFiles() {
    try {
      const Zhaogq_res = await fetch(Zhaogq_filesApi);
      const Zhaogq_json = await Zhaogq_res.json();
      console.log('[Zhaogq] 知识库文件列表：', Zhaogq_json);
      if (Zhaogq_json.code !== 0) throw new Error(Zhaogq_json.msg);

      const Zhaogq_list = Zhaogq_json.data.Zhaogq_list || [];
      Zhaogq_fileCountEl.textContent = Zhaogq_list.length + ' 个文件';
      Zhaogq_fileListEl.innerHTML = '';

      Zhaogq_list.forEach((Zhaogq_file) => {
        const Zhaogq_li = document.createElement('li');
        Zhaogq_li.className = 'Zhaogq_fileItem';

        const Zhaogq_main = document.createElement('div');
        Zhaogq_main.className = 'Zhaogq_fileMain';

        const Zhaogq_icon = document.createElement('span');
        Zhaogq_icon.className = 'Zhaogq_fileIcon';
        Zhaogq_icon.textContent = String(Zhaogq_file.Zhaogq_ext || '').toUpperCase();

        const Zhaogq_info = document.createElement('div');
        Zhaogq_info.className = 'Zhaogq_fileInfo';

        const Zhaogq_name = document.createElement('div');
        Zhaogq_name.className = 'Zhaogq_fileName';
        Zhaogq_name.textContent = Zhaogq_file.Zhaogq_name;

        const Zhaogq_meta = document.createElement('div');
        Zhaogq_meta.className = 'Zhaogq_fileMeta';
        Zhaogq_meta.textContent = Zhaogq_file.Zhaogq_chunk_count + ' 个片段 · ' +
          Zhaogq_formatSize(Zhaogq_file.Zhaogq_size) + ' · ' + Zhaogq_formatTime(Zhaogq_file.Zhaogq_create_time);

        Zhaogq_info.appendChild(Zhaogq_name);
        Zhaogq_info.appendChild(Zhaogq_meta);

        const Zhaogq_actions = document.createElement('div');
        Zhaogq_actions.className = 'Zhaogq_fileActions';

        const Zhaogq_viewBtn = document.createElement('button');
        Zhaogq_viewBtn.type = 'button';
        Zhaogq_viewBtn.textContent = '查看片段';
        Zhaogq_viewBtn.addEventListener('click', () => Zhaogq_viewChunks(Zhaogq_file));

        const Zhaogq_delBtn = document.createElement('button');
        Zhaogq_delBtn.type = 'button';
        Zhaogq_delBtn.className = 'isDanger';
        Zhaogq_delBtn.textContent = '删除';
        Zhaogq_delBtn.addEventListener('click', () => Zhaogq_deleteFile(Zhaogq_file));

        Zhaogq_actions.appendChild(Zhaogq_viewBtn);
        Zhaogq_actions.appendChild(Zhaogq_delBtn);

        Zhaogq_main.appendChild(Zhaogq_icon);
        Zhaogq_main.appendChild(Zhaogq_info);
        Zhaogq_main.appendChild(Zhaogq_actions);
        Zhaogq_li.appendChild(Zhaogq_main);
        Zhaogq_fileListEl.appendChild(Zhaogq_li);
      });
    } catch (Zhaogq_err) {
      console.error('[Zhaogq] 获取知识库文件失败：', Zhaogq_err);
      Zhaogq_fileCountEl.textContent = '加载失败';
    }
  }

  /* 查看片段 */
  async function Zhaogq_viewChunks(Zhaogq_file) {
    try {
      const Zhaogq_res = await fetch(Zhaogq_filesApi + '/' + Zhaogq_file.Zhaogq_id + '/chunks');
      const Zhaogq_json = await Zhaogq_res.json();
      console.log('[Zhaogq] 文件片段数据：', Zhaogq_json);
      if (Zhaogq_json.code !== 0) throw new Error(Zhaogq_json.msg);

      Zhaogq_previewTitle.textContent = Zhaogq_file.Zhaogq_name + ' · ' + Zhaogq_json.data.Zhaogq_list.length + ' 个片段';
      Zhaogq_previewBody.innerHTML = '';
      Zhaogq_json.data.Zhaogq_list.forEach((Zhaogq_chunk) => {
        const Zhaogq_item = document.createElement('div');
        Zhaogq_item.className = 'Zhaogq_chunkItem';

        const Zhaogq_index = document.createElement('span');
        Zhaogq_index.className = 'Zhaogq_chunkIndex';
        Zhaogq_index.textContent = '片段 ' + Zhaogq_chunk.Zhaogq_chunk_index;

        const Zhaogq_text = document.createElement('p');
        Zhaogq_text.textContent = Zhaogq_chunk.Zhaogq_content;

        Zhaogq_item.appendChild(Zhaogq_index);
        Zhaogq_item.appendChild(Zhaogq_text);
        Zhaogq_previewBody.appendChild(Zhaogq_item);
      });
      Zhaogq_previewEl.hidden = false;
    } catch (Zhaogq_err) {
      console.error('[Zhaogq] 获取片段失败：', Zhaogq_err);
    }
  }

  Zhaogq_previewClose.addEventListener('click', () => {
    Zhaogq_previewEl.hidden = true;
  });

  /* 删除文件 */
  async function Zhaogq_deleteFile(Zhaogq_file) {
    if (!window.confirm('确定删除「' + Zhaogq_file.Zhaogq_name + '」及其全部片段吗？')) return;
    try {
      const Zhaogq_res = await fetch(Zhaogq_filesApi + '/' + Zhaogq_file.Zhaogq_id, { method: 'DELETE' });
      const Zhaogq_json = await Zhaogq_res.json();
      console.log('[Zhaogq] 删除文件结果：', Zhaogq_json);
      if (Zhaogq_json.code !== 0) throw new Error(Zhaogq_json.msg);
      Zhaogq_uploadStatus.textContent = '已删除：' + Zhaogq_file.Zhaogq_name;
      Zhaogq_previewEl.hidden = true;
      Zhaogq_loadFiles();
    } catch (Zhaogq_err) {
      console.error('[Zhaogq] 删除失败：', Zhaogq_err);
      Zhaogq_uploadStatus.textContent = '删除失败：' + Zhaogq_err.message;
    }
  }

  /* 上传文件（支持多选） */
  async function Zhaogq_uploadFiles(Zhaogq_files) {
    if (!Zhaogq_files || !Zhaogq_files.length) return;
    for (const Zhaogq_file of Zhaogq_files) {
      const Zhaogq_form = new FormData();
      Zhaogq_form.append('file', Zhaogq_file);
      Zhaogq_uploadStatus.textContent = '正在上传并解析：' + Zhaogq_file.name + ' …';
      console.log('[Zhaogq] 上传文件：', Zhaogq_file.name, Zhaogq_file.size + ' 字节');
      try {
        const Zhaogq_res = await fetch(Zhaogq_uploadApi, { method: 'POST', body: Zhaogq_form });
        const Zhaogq_json = await Zhaogq_res.json();
        console.log('[Zhaogq] 上传解析结果：', Zhaogq_json);
        if (Zhaogq_json.code === 0) {
          Zhaogq_uploadStatus.textContent = '上传成功：' + Zhaogq_json.data.Zhaogq_name +
            '，生成 ' + Zhaogq_json.data.Zhaogq_chunkCount + ' 个片段';
        } else {
          Zhaogq_uploadStatus.textContent = '上传失败：' + Zhaogq_json.msg;
        }
      } catch (Zhaogq_err) {
        console.error('[Zhaogq] 上传失败：', Zhaogq_err);
        Zhaogq_uploadStatus.textContent = '上传失败：' + Zhaogq_err.message;
      }
      Zhaogq_loadFiles();
    }
    Zhaogq_fileInput.value = '';
  }

  Zhaogq_uploadZone.addEventListener('click', () => Zhaogq_fileInput.click());
  Zhaogq_uploadZone.addEventListener('keydown', (Zhaogq_event) => {
    if (Zhaogq_event.key === 'Enter' || Zhaogq_event.key === ' ') Zhaogq_fileInput.click();
  });
  Zhaogq_fileInput.addEventListener('change', () => Zhaogq_uploadFiles(Zhaogq_fileInput.files));

  ['dragenter', 'dragover'].forEach((Zhaogq_type) => {
    Zhaogq_uploadZone.addEventListener(Zhaogq_type, (Zhaogq_event) => {
      Zhaogq_event.preventDefault();
      Zhaogq_uploadZone.classList.add('isDrag');
    });
  });
  ['dragleave', 'drop'].forEach((Zhaogq_type) => {
    Zhaogq_uploadZone.addEventListener(Zhaogq_type, (Zhaogq_event) => {
      Zhaogq_event.preventDefault();
      Zhaogq_uploadZone.classList.remove('isDrag');
    });
  });
  Zhaogq_uploadZone.addEventListener('drop', (Zhaogq_event) => {
    Zhaogq_uploadFiles(Zhaogq_event.dataTransfer.files);
  });

  /* 知识库问答 */
  async function Zhaogq_ask(Zhaogq_text) {
    const Zhaogq_question = String(Zhaogq_text || '').trim();
    if (!Zhaogq_question || Zhaogq_asking) return;

    Zhaogq_asking = true;
    Zhaogq_askBtn.disabled = true;
    Zhaogq_questionEl.value = '';
    Zhaogq_questionEl.style.height = 'auto';
    Zhaogq_answerEl.innerHTML = '<p class="Zhaogq_qaEmpty">正在检索知识库并生成回答…</p>';
    Zhaogq_sourcesEl.innerHTML = '';

    const Zhaogq_payload = { question: Zhaogq_question };
    console.log('[Zhaogq] 发送给大模型的数据：', Zhaogq_payload);

    try {
      const Zhaogq_res = await fetch(Zhaogq_askApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Zhaogq_payload)
      });
      const Zhaogq_json = await Zhaogq_res.json();
      console.log('[Zhaogq] 从大模型接收到的数据：', Zhaogq_json);

      if (Zhaogq_json.code !== 0) throw new Error(Zhaogq_json.msg);

      const Zhaogq_answer = document.createElement('p');
      Zhaogq_answer.className = 'Zhaogq_qaText';
      Zhaogq_answer.textContent = Zhaogq_json.data.answer || '（模型未返回内容）';
      Zhaogq_answerEl.innerHTML = '';
      Zhaogq_answerEl.appendChild(Zhaogq_answer);

      const Zhaogq_sources = Zhaogq_json.data.sources || [];
      if (Zhaogq_sources.length) {
        const Zhaogq_title = document.createElement('div');
        Zhaogq_title.className = 'Zhaogq_qaSourcesTitle';
        Zhaogq_title.textContent = '命中资料（' + Zhaogq_sources.length + ' 条）';
        Zhaogq_sourcesEl.appendChild(Zhaogq_title);

        Zhaogq_sources.forEach((Zhaogq_source, Zhaogq_i) => {
          const Zhaogq_details = document.createElement('details');
          Zhaogq_details.className = 'Zhaogq_sourceItem';

          const Zhaogq_summary = document.createElement('summary');
          Zhaogq_summary.textContent = '资料 ' + (Zhaogq_i + 1) + '：' + Zhaogq_source.Zhaogq_file +
            ' · 片段 ' + Zhaogq_source.Zhaogq_chunkIndex + ' · 得分 ' + Zhaogq_source.Zhaogq_score;

          const Zhaogq_content = document.createElement('p');
          Zhaogq_content.textContent = Zhaogq_source.Zhaogq_content;

          Zhaogq_details.appendChild(Zhaogq_summary);
          Zhaogq_details.appendChild(Zhaogq_content);
          Zhaogq_sourcesEl.appendChild(Zhaogq_details);
        });
      }
    } catch (Zhaogq_err) {
      console.error('[Zhaogq] 知识库问答失败：', Zhaogq_err);
      Zhaogq_answerEl.innerHTML = '';
      const Zhaogq_error = document.createElement('p');
      Zhaogq_error.className = 'Zhaogq_qaText isError';
      Zhaogq_error.textContent = '提问失败：' + Zhaogq_err.message;
      Zhaogq_answerEl.appendChild(Zhaogq_error);
    } finally {
      Zhaogq_asking = false;
      Zhaogq_askBtn.disabled = false;
      Zhaogq_questionEl.focus();
    }
  }

  Zhaogq_askBtn.addEventListener('click', () => Zhaogq_ask(Zhaogq_questionEl.value));

  Zhaogq_questionEl.addEventListener('keydown', (Zhaogq_event) => {
    if (Zhaogq_event.key === 'Enter' && !Zhaogq_event.shiftKey) {
      Zhaogq_event.preventDefault();
      Zhaogq_ask(Zhaogq_questionEl.value);
    }
  });

  Zhaogq_questionEl.addEventListener('input', () => {
    Zhaogq_questionEl.style.height = 'auto';
    Zhaogq_questionEl.style.height = Math.min(Zhaogq_questionEl.scrollHeight, 120) + 'px';
  });

  Zhaogq_quickEl.addEventListener('click', (Zhaogq_event) => {
    if (Zhaogq_event.target.tagName === 'BUTTON') Zhaogq_ask(Zhaogq_event.target.textContent);
  });

  Zhaogq_loadFiles();
})();
