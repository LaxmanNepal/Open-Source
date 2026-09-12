// V11: keep the browser's GitHub API fetch path live. The application already
// falls back to data/catalog.json when GitHub is unavailable, so this file no
// longer hijacks API requests and accidentally turns live search into OR search.
(() => {
  window.__openSourceBootstrap = {version:'v11', liveApi:true};
})();
