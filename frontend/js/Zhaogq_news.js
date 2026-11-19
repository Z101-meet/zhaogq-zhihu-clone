/* 姓名：赵国庆 | 学号：24002120201 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash */
/* 科技新闻列表页逻辑：搜索、分类筛选、分页 */

(function Zhaogq_initNewsPage() {
  const Zhaogq_listEl = document.getElementById('Zhaogq_newsList');
  const Zhaogq_apiUrlEl = document.getElementById('Zhaogq_apiUrl');
  const Zhaogq_keywordEl = document.getElementById('Zhaogq_keyword');
  const Zhaogq_categoryEl = document.getElementById('Zhaogq_category');
  const Zhaogq_searchBtn = document.getElementById('Zhaogq_searchBtn');
  const Zhaogq_prevBtn = document.getElementById('Zhaogq_prevBtn');
  const Zhaogq_nextBtn = document.getElementById('Zhaogq_nextBtn');
  const Zhaogq_pagerInfo = document.getElementById('Zhaogq_pagerInfo');

  if (!Zhaogq_listEl) return;

  const Zhaogq_pageSize = 6;
  const Zhaogq_state = { Zhaogq_page: 1, Zhaogq_totalPage: 1 };

  Zhaogq_apiUrlEl.textContent = Zhaogq_getApiUrl('/Zhaogq/news');
  Zhaogq_apiUrlEl.href = Zhaogq_getApiUrl('/Zhaogq/news?page=1&pageSize=6');

  /* 渲染新闻卡片 */
  function Zhaogq_render(Zhaogq_list) {
    if (!Zhaogq_list.length) {
      Zhaogq_listEl.innerHTML = '<div class="Zhaogq_empty">没有找到匹配的新闻，请调整关键词或分类。</div>';
      return;
    }

    Zhaogq_listEl.innerHTML = Zhaogq_list.map((Zhaogq_item) => {
      const Zhaogq_cover = Zhaogq_item.Zhaogq_cover || 'images/Zhaogq_img_1.svg';
      return '<article class="Zhaogq_newsCard">' +
        '<img class="Zhaogq_newsCover" src="' + Zhaogq_escapeHtml(Zhaogq_cover) + '" alt="' +
        Zhaogq_escapeHtml(Zhaogq_item.Zhaogq_title) + '" loading="lazy" />' +
        '<div class="Zhaogq_newsBody">' +
        '<span class="Zhaogq_tag">' + Zhaogq_escapeHtml(Zhaogq_item.Zhaogq_category) + '</span>' +
        '<h3>' + Zhaogq_escapeHtml(Zhaogq_item.Zhaogq_title) + '</h3>' +
        '<p class="Zhaogq_summary">' + Zhaogq_escapeHtml(Zhaogq_item.Zhaogq_summary) + '</p>' +
        '<div class="Zhaogq_metaRow">' +
        '<span>作者：' + Zhaogq_escapeHtml(Zhaogq_item.Zhaogq_author) + '</span>' +
        '<span>来源：' + Zhaogq_escapeHtml(Zhaogq_item.Zhaogq_source) + '</span>' +
        '<span>发布：' + Zhaogq_formatTime(Zhaogq_item.Zhaogq_publish_time) + '</span>' +
        '<span>浏览：' + Zhaogq_escapeHtml(Zhaogq_item.Zhaogq_views) + '</span>' +
        '</div></div></article>';
    }).join('');
  }

  /* 加载新闻数据 */
  async function Zhaogq_loadNews() {
    Zhaogq_listEl.innerHTML = '<div class="Zhaogq_loading">正在加载新闻数据…</div>';
    const Zhaogq_query = new URLSearchParams();
    Zhaogq_query.set('page', Zhaogq_state.Zhaogq_page);
    Zhaogq_query.set('pageSize', Zhaogq_pageSize);
    if (Zhaogq_keywordEl.value.trim()) Zhaogq_query.set('keyword', Zhaogq_keywordEl.value.trim());
    if (Zhaogq_categoryEl.value) Zhaogq_query.set('category', Zhaogq_categoryEl.value);

    try {
      const Zhaogq_data = await Zhaogq_request('/Zhaogq/news?' + Zhaogq_query.toString());
      Zhaogq_state.Zhaogq_totalPage = Math.max(1, Math.ceil(Zhaogq_data.Zhaogq_total / Zhaogq_pageSize));
      Zhaogq_render(Zhaogq_data.Zhaogq_list);
      Zhaogq_pagerInfo.textContent = '第 ' + Zhaogq_state.Zhaogq_page + ' / ' +
        Zhaogq_state.Zhaogq_totalPage + ' 页 · 共 ' + Zhaogq_data.Zhaogq_total + ' 条';
      Zhaogq_prevBtn.disabled = Zhaogq_state.Zhaogq_page <= 1;
      Zhaogq_nextBtn.disabled = Zhaogq_state.Zhaogq_page >= Zhaogq_state.Zhaogq_totalPage;
    } catch (Zhaogq_err) {
      console.error('[Zhaogq] 新闻列表加载失败：', Zhaogq_err);
      Zhaogq_listEl.innerHTML = '<div class="Zhaogq_error">新闻数据加载失败：' +
        Zhaogq_escapeHtml(Zhaogq_err.message) + '（请确认后端已启动且数据库可连接）</div>';
      Zhaogq_pagerInfo.textContent = '第 1 / 1 页';
      Zhaogq_prevBtn.disabled = true;
      Zhaogq_nextBtn.disabled = true;
    }
  }

  /* 加载分类下拉项 */
  async function Zhaogq_loadCategories() {
    try {
      const Zhaogq_data = await Zhaogq_request('/Zhaogq/news/categories');
      Zhaogq_data.Zhaogq_list.forEach((Zhaogq_name) => {
        const Zhaogq_option = document.createElement('option');
        Zhaogq_option.value = Zhaogq_name;
        Zhaogq_option.textContent = Zhaogq_name;
        Zhaogq_categoryEl.appendChild(Zhaogq_option);
      });
    } catch (Zhaogq_err) {
      console.error('[Zhaogq] 新闻分类加载失败：', Zhaogq_err);
    }
  }

  Zhaogq_searchBtn.addEventListener('click', () => {
    Zhaogq_state.Zhaogq_page = 1;
    Zhaogq_loadNews();
  });

  Zhaogq_keywordEl.addEventListener('keydown', (Zhaogq_event) => {
    if (Zhaogq_event.key === 'Enter') {
      Zhaogq_state.Zhaogq_page = 1;
      Zhaogq_loadNews();
    }
  });

  Zhaogq_categoryEl.addEventListener('change', () => {
    Zhaogq_state.Zhaogq_page = 1;
    Zhaogq_loadNews();
  });

  Zhaogq_prevBtn.addEventListener('click', () => {
    if (Zhaogq_state.Zhaogq_page > 1) {
      Zhaogq_state.Zhaogq_page -= 1;
      Zhaogq_loadNews();
    }
  });

  Zhaogq_nextBtn.addEventListener('click', () => {
    if (Zhaogq_state.Zhaogq_page < Zhaogq_state.Zhaogq_totalPage) {
      Zhaogq_state.Zhaogq_page += 1;
      Zhaogq_loadNews();
    }
  });

  Zhaogq_loadCategories();
  Zhaogq_loadNews();
})();
