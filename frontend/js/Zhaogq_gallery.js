/* 姓名：赵国庆 | 学号：24002120201 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash */
/* 图文资讯列表页逻辑 */

(function Zhaogq_initGalleryPage() {
  const Zhaogq_galleryEl = document.getElementById('Zhaogq_gallery');
  const Zhaogq_apiUrlEl = document.getElementById('Zhaogq_apiUrl');

  if (!Zhaogq_galleryEl) return;

  Zhaogq_apiUrlEl.textContent = Zhaogq_getApiUrl('/Zhaogq/gallery');
  Zhaogq_apiUrlEl.href = Zhaogq_getApiUrl('/Zhaogq/gallery');

  /* 渲染图文卡片 */
  function Zhaogq_render(Zhaogq_list) {
    if (!Zhaogq_list.length) {
      Zhaogq_galleryEl.innerHTML = '<div class="Zhaogq_empty">暂无图文资讯数据。</div>';
      return;
    }

    Zhaogq_galleryEl.innerHTML = Zhaogq_list.map((Zhaogq_item) => {
      return '<article class="Zhaogq_galleryCard">' +
        '<img class="Zhaogq_galleryImg" src="' + Zhaogq_escapeHtml(Zhaogq_item.Zhaogq_image) +
        '" alt="' + Zhaogq_escapeHtml(Zhaogq_item.Zhaogq_title) + '" loading="lazy" />' +
        '<div class="Zhaogq_galleryBody">' +
        '<span class="Zhaogq_tag">' + Zhaogq_escapeHtml(Zhaogq_item.Zhaogq_tech) + '</span>' +
        '<h3>' + Zhaogq_escapeHtml(Zhaogq_item.Zhaogq_title) + '</h3>' +
        '<p>' + Zhaogq_escapeHtml(Zhaogq_item.Zhaogq_description) + '</p>' +
        '</div></article>';
    }).join('');
  }

  /* 加载图文数据 */
  async function Zhaogq_loadGallery() {
    Zhaogq_galleryEl.innerHTML = '<div class="Zhaogq_loading">正在加载图文数据…</div>';
    try {
      const Zhaogq_data = await Zhaogq_request('/Zhaogq/gallery');
      Zhaogq_render(Zhaogq_data.Zhaogq_list);
    } catch (Zhaogq_err) {
      console.error('[Zhaogq] 图文列表加载失败：', Zhaogq_err);
      Zhaogq_galleryEl.innerHTML = '<div class="Zhaogq_error">图文数据加载失败：' +
        Zhaogq_escapeHtml(Zhaogq_err.message) + '（请确认后端已启动且数据库可连接）</div>';
    }
  }

  Zhaogq_loadGallery();
})();
