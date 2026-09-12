// V11 compatibility layer. Core filtering, saved state and URL state live in app.js.
// This file only exposes a lightweight source-status marker for older cached pages.
(() => {
  const mark = () => {
    const stats = document.querySelector('.stats-strip');
    if (!stats || document.getElementById('sourceStatusV9')) return;
    const s = document.createElement('div');
    s.id = 'sourceStatusV9';
    s.className = 'v9-source';
    s.innerHTML = '<span class="v9-dot"></span><span>Discovery engine ready</span>';
    stats.appendChild(s);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mark); else mark();
  const style = document.createElement('style');
  style.textContent = '.v9-source{display:flex;align-items:center;justify-content:center;gap:7px}.v9-dot{width:7px;height:7px;border-radius:50%;background:#70d6a0;box-shadow:0 0 0 5px rgba(112,214,160,.09)}';
  document.head.appendChild(style);
})();
