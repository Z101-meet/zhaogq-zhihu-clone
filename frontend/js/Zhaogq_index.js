/* 姓名：赵国庆 | 学号：24002120201 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash */
/* 首页 canvas 背景动画：粒子星链 + 鼠标交互 */

(function Zhaogq_initCanvas() {
  const Zhaogq_canvas = document.getElementById('Zhaogq_canvas');
  if (!Zhaogq_canvas) return;

  const Zhaogq_ctx = Zhaogq_canvas.getContext('2d');
  let Zhaogq_width = 0;
  let Zhaogq_height = 0;
  let Zhaogq_points = [];
  const Zhaogq_mouse = { Zhaogq_x: -9999, Zhaogq_y: -9999 };
  const Zhaogq_colors = ['77, 208, 255', '124, 108, 255', '143, 230, 255'];

  /* 按屏幕面积生成粒子 */
  function Zhaogq_createPoints() {
    const Zhaogq_count = Math.max(36, Math.min(110, Math.round((Zhaogq_width * Zhaogq_height) / 17000)));
    Zhaogq_points = [];
    for (let Zhaogq_i = 0; Zhaogq_i < Zhaogq_count; Zhaogq_i += 1) {
      Zhaogq_points.push({
        Zhaogq_x: Math.random() * Zhaogq_width,
        Zhaogq_y: Math.random() * Zhaogq_height,
        Zhaogq_vx: (Math.random() - 0.5) * 0.45,
        Zhaogq_vy: (Math.random() - 0.5) * 0.45,
        Zhaogq_r: Math.random() * 1.8 + 0.8,
        Zhaogq_color: Zhaogq_colors[Zhaogq_i % Zhaogq_colors.length]
      });
    }
  }

  function Zhaogq_resize() {
    const Zhaogq_dpr = Math.min(window.devicePixelRatio || 1, 2);
    Zhaogq_width = window.innerWidth;
    Zhaogq_height = window.innerHeight;
    Zhaogq_canvas.width = Math.floor(Zhaogq_width * Zhaogq_dpr);
    Zhaogq_canvas.height = Math.floor(Zhaogq_height * Zhaogq_dpr);
    Zhaogq_canvas.style.width = Zhaogq_width + 'px';
    Zhaogq_canvas.style.height = Zhaogq_height + 'px';
    Zhaogq_ctx.setTransform(Zhaogq_dpr, 0, 0, Zhaogq_dpr, 0, 0);
    Zhaogq_createPoints();
  }

  function Zhaogq_draw() {
    Zhaogq_ctx.clearRect(0, 0, Zhaogq_width, Zhaogq_height);

    for (let Zhaogq_i = 0; Zhaogq_i < Zhaogq_points.length; Zhaogq_i += 1) {
      const Zhaogq_p = Zhaogq_points[Zhaogq_i];
      Zhaogq_p.Zhaogq_x += Zhaogq_p.Zhaogq_vx;
      Zhaogq_p.Zhaogq_y += Zhaogq_p.Zhaogq_vy;

      /* 边界反弹 */
      if (Zhaogq_p.Zhaogq_x < 0 || Zhaogq_p.Zhaogq_x > Zhaogq_width) Zhaogq_p.Zhaogq_vx *= -1;
      if (Zhaogq_p.Zhaogq_y < 0 || Zhaogq_p.Zhaogq_y > Zhaogq_height) Zhaogq_p.Zhaogq_vy *= -1;

      /* 鼠标附近轻微排斥，形成涟漪感 */
      const Zhaogq_dx = Zhaogq_p.Zhaogq_x - Zhaogq_mouse.Zhaogq_x;
      const Zhaogq_dy = Zhaogq_p.Zhaogq_y - Zhaogq_mouse.Zhaogq_y;
      const Zhaogq_dist = Math.hypot(Zhaogq_dx, Zhaogq_dy);
      if (Zhaogq_dist < 130 && Zhaogq_dist > 0) {
        Zhaogq_p.Zhaogq_x += (Zhaogq_dx / Zhaogq_dist) * 0.9;
        Zhaogq_p.Zhaogq_y += (Zhaogq_dy / Zhaogq_dist) * 0.9;
      }

      Zhaogq_ctx.beginPath();
      Zhaogq_ctx.arc(Zhaogq_p.Zhaogq_x, Zhaogq_p.Zhaogq_y, Zhaogq_p.Zhaogq_r, 0, Math.PI * 2);
      Zhaogq_ctx.fillStyle = 'rgba(' + Zhaogq_p.Zhaogq_color + ', 0.85)';
      Zhaogq_ctx.fill();
    }

    /* 粒子之间连线 */
    const Zhaogq_linkDist = 140;
    for (let Zhaogq_i = 0; Zhaogq_i < Zhaogq_points.length; Zhaogq_i += 1) {
      for (let Zhaogq_j = Zhaogq_i + 1; Zhaogq_j < Zhaogq_points.length; Zhaogq_j += 1) {
        const Zhaogq_a = Zhaogq_points[Zhaogq_i];
        const Zhaogq_b = Zhaogq_points[Zhaogq_j];
        const Zhaogq_gap = Math.hypot(Zhaogq_a.Zhaogq_x - Zhaogq_b.Zhaogq_x, Zhaogq_a.Zhaogq_y - Zhaogq_b.Zhaogq_y);
        if (Zhaogq_gap < Zhaogq_linkDist) {
          const Zhaogq_alpha = (1 - Zhaogq_gap / Zhaogq_linkDist) * 0.28;
          Zhaogq_ctx.beginPath();
          Zhaogq_ctx.moveTo(Zhaogq_a.Zhaogq_x, Zhaogq_a.Zhaogq_y);
          Zhaogq_ctx.lineTo(Zhaogq_b.Zhaogq_x, Zhaogq_b.Zhaogq_y);
          Zhaogq_ctx.strokeStyle = 'rgba(90, 170, 255, ' + Zhaogq_alpha.toFixed(3) + ')';
          Zhaogq_ctx.lineWidth = 1;
          Zhaogq_ctx.stroke();
        }
      }
    }

    window.requestAnimationFrame(Zhaogq_draw);
  }

  window.addEventListener('resize', Zhaogq_resize);
  window.addEventListener('mousemove', (Zhaogq_event) => {
    Zhaogq_mouse.Zhaogq_x = Zhaogq_event.clientX;
    Zhaogq_mouse.Zhaogq_y = Zhaogq_event.clientY;
  });
  window.addEventListener('mouseleave', () => {
    Zhaogq_mouse.Zhaogq_x = -9999;
    Zhaogq_mouse.Zhaogq_y = -9999;
  });

  Zhaogq_resize();
  Zhaogq_draw();
})();
