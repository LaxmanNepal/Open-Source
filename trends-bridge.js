(() => {
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const fmt=n=>Math.abs(n)>=1e6?(n/1e6).toFixed(1)+'M':Math.abs(n)>=1e3?(n/1e3).toFixed(Math.abs(n)>=1e5?0:1)+'k':String(n||0);
  let trend=null;
  const original=window.renderSignals;
  async function load(){try{const r=await fetch('data/trending.json',{cache:'no-store'});if(!r.ok)throw 0;trend=await r.json();if(typeof original==='function')original();renderMonthly();}catch{}}
  function renderMonthly(){const host=document.querySelector('#monthlyList');if(!host||!trend)return;const rows=(trend.trending||[]).filter(r=>(r.stars_30d||0)>0).slice(0,4);if(!rows.length)return;host.innerHTML=rows.map((r,i)=>`<a class="mini-item" href="tool.html?repo=${encodeURIComponent(r.full_name)}"><span class="rank">0${i+1}</span><div><b>${esc(r.full_name)}</b><span>↗ +${fmt(r.stars_30d)} ★ this month · ${fmt(r.stars)} total</span></div></a>`).join('');const card=host.closest('.signal-card');if(card){const small=card.querySelector('.signal-title small');if(small)small.textContent='30-day growth';}}
  window.renderSignals=()=>{if(typeof original==='function')original();renderMonthly()};
  load();
})();
