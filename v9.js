(() => {
  const $ = s => document.querySelector(s);
  const get = k => { try { return JSON.parse(localStorage.getItem(k) || '[]'); } catch { return []; } };
  const esc = s => String(s ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]));

  const boot = () => {
    const cache = (() => { try { return JSON.parse(localStorage.getItem('open-source-explorer-v2') || '{}'); } catch { return {}; } })();
    const repos = cache.items || [];
    const years = [...new Set(repos.map(r => new Date(r.created_at).getFullYear()).filter(Number.isFinite))].sort((a,b)=>b-a);

    // Dynamic year filter: always follows the years actually present in the catalog.
    const bar = $('.filterbar');
    if (bar && !$('#yearFilterV9')) {
      const select = document.createElement('select');
      select.id = 'yearFilterV9';
      select.className = 'v9-select';
      select.innerHTML = '<option value="all">All years</option>' + years.map(y=>`<option value="${y}">${y}</option>`).join('');
      bar.insertBefore(select, $('.active-filter'));
      select.onchange = () => { window.__osYear = select.value; applyYear(); };
    }

    // Saved-only filter.
    if (bar && !$('#savedFilterV9')) {
      const b = document.createElement('button');
      b.id='savedFilterV9'; b.className='filter-chip'; b.textContent='♡ Saved';
      b.onclick=()=>{ window.__osSavedOnly=!window.__osSavedOnly; b.classList.toggle('active',window.__osSavedOnly); applyYear(); };
      bar.insertBefore(b, $('.active-filter'));
    }

    // Live source indicator.
    const stats = $('.stats-strip');
    if (stats && !$('#sourceStatusV9')) {
      const s=document.createElement('div'); s.id='sourceStatusV9'; s.className='v9-source';
      s.innerHTML='<span class="v9-dot"></span><span>Catalog ready</span>';
      stats.appendChild(s);
    }

    const categoryCount = $('#categoryCount'); if (categoryCount) categoryCount.textContent = '8+';
    applyYear();
  };

  function applyYear() {
    const year = window.__osYear || 'all';
    const saved = new Set(get('os-saved').map(Number));
    document.querySelectorAll('[data-repo-id]').forEach(card => {
      const id = Number(card.dataset.repoId);
      const cache = (()=>{try{return JSON.parse(localStorage.getItem('open-source-explorer-v2')||'{}')}catch{return{}}})();
      const r=(cache.items||[]).find(x=>Number(x.id)===id);
      const yearOk = year==='all' || !r || String(new Date(r.created_at).getFullYear())===year;
      const savedOk = !window.__osSavedOnly || saved.has(id);
      card.style.display = yearOk && savedOk ? '' : 'none';
    });
  }

  // Re-apply visual filters whenever the core app redraws the directory.
  new MutationObserver(() => applyYear()).observe(document.body, {subtree:true, childList:true});

  const style=document.createElement('style');
  style.textContent=`
    .v9-select{height:36px;border:1px solid var(--line);border-radius:10px;background:var(--panel2);color:var(--text);padding:0 12px;font:600 12px Inter;outline:none}.v9-select:focus{border-color:rgba(124,92,255,.65)}
    .v9-source{display:flex;align-items:center;justify-content:center;gap:7px}.v9-dot{width:7px;height:7px;border-radius:50%;background:#70d6a0;box-shadow:0 0 0 5px rgba(112,214,160,.09)}
    .filterbar{flex-wrap:wrap}.filterbar .v9-select{margin-left:auto}.filterbar .filter-chip{cursor:pointer}
    @media(max-width:700px){.filterbar .v9-select{margin-left:0;width:100%}.v9-source{grid-column:1/-1}}
  `;
  document.head.appendChild(style);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
