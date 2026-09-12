(() => {
  // Prefer the scheduled static catalog when available. The existing app still
  // falls back to the public GitHub API when the catalog is unavailable.
  const CATALOG = 'data/catalog.json';
  const originalFetch = window.fetch.bind(window);
  let catalogPromise;
  const loadCatalog = () => catalogPromise || (catalogPromise = originalFetch(CATALOG, {cache:'no-store'}).then(r => r.ok ? r.json() : null).catch(() => null));

  window.fetch = async (input, init) => {
    const url = typeof input === 'string' ? input : input?.url || '';
    if (url.startsWith('https://api.github.com/search/repositories')) {
      try {
        const catalog = await loadCatalog();
        if (catalog?.repositories?.length) {
          const parsed = new URL(url);
          const q = (parsed.searchParams.get('q') || '').toLowerCase();
          const sort = parsed.searchParams.get('sort') || 'stars';
          const order = parsed.searchParams.get('order') || 'desc';
          const per = Number(parsed.searchParams.get('per_page') || 30);
          const terms = q.split(/\s+/).filter(t => t && !t.includes(':') && !['is','public','archived','stars','forks'].includes(t));
          let items = catalog.repositories.filter(r => {
            const hay = `${r.full_name} ${r.name} ${r.description || ''} ${(r.topics || []).join(' ')} ${r.language || ''}`.toLowerCase();
            return terms.length ? terms.some(t => hay.includes(t.replace(/[><=].*$/,''))) : true;
          });
          const num = k => Number(k || 0);
          items.sort((a,b) => {
            const av = sort === 'forks' ? num(a.forks_count) : sort === 'updated' ? new Date(a.pushed_at || 0) : sort === 'watchers' ? num(a.watchers_count) : num(a.stargazers_count);
            const bv = sort === 'forks' ? num(b.forks_count) : sort === 'updated' ? new Date(b.pushed_at || 0) : sort === 'watchers' ? num(b.watchers_count) : num(b.stargazers_count);
            return (av > bv ? 1 : av < bv ? -1 : 0) * (order === 'asc' ? 1 : -1);
          });
          const body = JSON.stringify({total_count: items.length, incomplete_results:false, items:items.slice(0,per)});
          return new Response(body, {status:200, headers:{'Content-Type':'application/json'}});
        }
      } catch (_) {}
    }
    return originalFetch(input, init);
  };
})();
