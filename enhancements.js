(() => {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const fmt = n => n >= 1e6 ? (n/1e6).toFixed(1)+'M' : n >= 1e3 ? (n/1e3).toFixed(n>=1e5?0:1)+'k' : String(n || 0);
  const score = r => {
    const age = Math.max(1, (Date.now() - new Date(r.created_at || Date.now())) / 864e5);
    const activity = Math.max(0, 1 - Math.min(1, (Date.now() - new Date(r.pushed_at || Date.now())) / (180 * 864e5)));
    const maturity = Math.min(1, Math.log10(1 + Number(r.stargazers_count||0)) / 5);
    const community = Math.min(1, Math.log10(1 + Number(r.forks_count||0)) / 4);
    const attention = Math.min(1, Math.log10(1 + Number(r.watchers_count||0)) / 4);
    const documentation = r.description && (r.topics?.length || r.language) ? 1 : r.description ? .65 : .3;
    return Math.round((maturity*.30 + community*.20 + attention*.10 + activity*.25 + documentation*.15) * 100);
  };
  function renderUseful(){
    const raw = localStorage.getItem('open-source-explorer-v2');
    if(!raw) return;
    let data; try { data = JSON.parse(raw); } catch { return; }
    const repos = (data.items || []).slice().sort((a,b) => score(b)-score(a)).slice(0,4);
    if(!repos.length) return;
    const grid = document.querySelector('.signal-grid');
    if(!grid || document.getElementById('usefulSignal')) return;
    const card = document.createElement('article');
    card.className='signal-card'; card.id='usefulSignal';
    card.innerHTML=`<div class="signal-title"><span>✦</span><div><b>Most useful</b><small>Composite usefulness score</small></div></div><div class="mini-list">${repos.map((r,i)=>`<a class="mini-item" href="${esc(r.html_url)}" target="_blank" rel="noopener"><span class="rank">0${i+1}</span><img class="mini-avatar" src="${esc(r.owner?.avatar_url||'')}" loading="lazy" alt=""><div><b>${esc(r.full_name)}</b><span>Usefulness ${score(r)} · ★ ${fmt(r.stargazers_count)}</span></div></a>`).join('')}</div>`;
    grid.appendChild(card);
  }
  const theme = document.createElement('style');
  theme.textContent = `
    .light{--bg:#f5f7fb;--panel:#fff;--panel2:#eef1f7;--text:#11131a;--muted:#667085;--line:rgba(17,19,26,.10);--shadow:0 24px 70px rgba(31,41,55,.12)}
    .light body{background:radial-gradient(circle at 50% -10%,rgba(124,92,255,.10),transparent 35%),var(--bg);color:var(--text)}
    .light .hero-search,.light .repo-card,.light .signal-card,.light .platform-card,.light .cat{background:rgba(255,255,255,.72)}
    .light .hero-search input{color:#11131a}.light .view-actions select{background:#fff;color:#4b5563}
    .light .float{background:#fff;box-shadow:0 15px 30px rgba(0,0,0,.08)}
    .light .repo-modal{background:rgba(235,238,245,.78)}.light .repo-sheet{background:#fff;color:#11131a}
  `;
  document.head.appendChild(theme);
  window.setTimeout(renderUseful, 500);
  window.addEventListener('storage', renderUseful);
})();
