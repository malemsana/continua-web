/* ==========================================================================
   Search Results — extensible, backend-agnostic template
   Replace/override window.ContinuaSearchProvider to connect real data.
   ========================================================================== */
(function(){
  const els = {
    form: document.getElementById('searchForm'),
    input: document.getElementById('searchInput'),
    clearBtn: document.getElementById('clearBtn'),
    classSel: document.getElementById('classFilter'),
    subjectSel: document.getElementById('subjectFilter'),
    active: document.getElementById('activeFilters'),
    meta: document.getElementById('resultsMeta'),
    container: document.getElementById('resultsContainer'),
    section: document.querySelector('.results-section')
  };

  // Mobile + header search -> this page (authoritative)
  function wireGlobalSearch(){
    const headerInput = document.getElementById('headerSearchInput');
    const mobileInput = document.getElementById('mobileSearchInput');
    const heroInput = document.getElementById('heroSearchInput'); // may not exist on this page but keep for reuse
    const headerSearch = document.querySelector('.header-search');
    const mobileWrapper = document.querySelector('.mobile-search-wrapper');

    function go(q){
      const trimmed = (q||'').trim();
      // Even empty query goes to search page (shows empty state) — do not open resource directly
      const url = '/continua-web/search.html?q=' + encodeURIComponent(trimmed);
      location.href = url;
    }
    if(headerInput){
      headerInput.addEventListener('keydown', e=>{ if(e.key==='Enter'){ e.preventDefault(); go(headerInput.value); }});
      if(headerSearch){
        headerSearch.addEventListener('click', ()=> headerInput.focus());
      }
    }
    if(mobileInput){
      mobileInput.addEventListener('keydown', e=>{ if(e.key==='Enter'){ e.preventDefault(); go(mobileInput.value); }});
    }
    // For any page that includes a hero search form, intercept to route to search page
    const heroForm = document.querySelector('.hero-search-form');
    if(heroForm && heroInput){
      heroForm.addEventListener('submit', e=>{ e.preventDefault(); go(heroInput.value); });
    }
  }

  // ——— URL state helpers ———
  function readState(){
    const p = new URLSearchParams(location.search);
    return {
      q: (p.get('q')||'').trim(),
      cls: (p.get('class')||'').trim(),
      subject: (p.get('subject')||'').trim().toLowerCase()
    };
  }
  function writeState(state, replace){
    const p = new URLSearchParams();
    if(state.q) p.set('q', state.q);
    if(state.cls) p.set('class', state.cls);
    if(state.subject) p.set('subject', state.subject);
    const qs = p.toString();
    const url = '/continua-web/search.html' + (qs ? '?' + qs : '');
    // keep path as /search when served via routing; search.html works for file protocol
    const displayUrl = qs ? '/continua-web/search.html?' + qs : '/continua-web/search.html';
    // Also support /search? when history API is available — use search.html for now
    if(replace) history.replaceState(null,'', displayUrl);
    else history.pushState(null,'', displayUrl);
  }
  function buildShareUrl(state){
    const p = new URLSearchParams();
    if(state.q) p.set('q', state.q);
    if(state.cls) p.set('class', state.cls);
    if(state.subject) p.set('subject', state.subject);
    return location.pathname + (p.toString() ? '?' + p.toString() : '');
  }

  // ——— Clean data interface — backend-agnostic ———
  // Each result: { title, description?, excerpt?, class, subject, chapter?, type, typeLabel?, url }
  // type examples: chapter | note | solution | example | formulae | pyq | mock-test | question | reference
  // url must be the permanent/canonical page (e.g. /class-10/mathematics/real-numbers/ncert-solutions)
  // Do NOT invent metadata beyond what architecture already supports.
  const DefaultProvider = {
    async search({q, cls, subject}){
      // TEMPLATE STUB — no fake backend. Real implementation replaces this.
      // Simulate async latency so loading state is visible, then return empty.
      await new Promise(r=>setTimeout(r, 280));
      // To demo error state, add ?q=__error__ in manual testing — not user-facing fake data.
      if(q === '__error__') throw new Error('Simulated search failure');
      return { results: [], total: 0 };
    }
  };
  // Allow later injection: window.ContinuaSearchProvider = { search: async (params) => {...} }
  function getProvider(){
    return (window.ContinuaSearchProvider && typeof window.ContinuaSearchProvider.search === 'function')
      ? window.ContinuaSearchProvider
      : DefaultProvider;
  }
  // Expose for extensibility
  window.ContinuaSearch = {
    setProvider(provider){ window.ContinuaSearchProvider = provider; },
    // Exposed so future search system can upgrade without redesigning page
    renderResults,
    readState
  };

  // ——— Render helpers ———
  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
  }
  function getTypeBadge(type){
    const map = {
      'chapter':'Chapter','note':'Note','solution':'NCERT Solutions','ncert-solutions':'NCERT Solutions',
      'example':'Example','examples':'Chapter Examples','formulae':'Formulae','pyq':'PYQ','mock-test':'Mock Test','mock-tests':'Mock Tests',
      'question':'Question','reference':'Reference','default': type ? type.replace(/[-_]/g,' ').replace(/\b\w/g,c=>c.toUpperCase()) : 'Resource'
    };
    return map[type] || map['default'];
  }
  function getIconForType(type){
    // reuse single book icon — keep visual family, avoid per-type illustration sprawl
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>';
  }

  function renderActiveFilters(state){
    const pills = [];
    if(state.cls) pills.push('<span class="active-filter-pill">Class ' + escapeHtml(state.cls) + ' <button type="button" data-clear="class" aria-label="Remove class filter">×</button></span>');
    if(state.subject) {
      const label = state.subject.charAt(0).toUpperCase()+state.subject.slice(1);
      pills.push('<span class="active-filter-pill">' + escapeHtml(label) + ' <button type="button" data-clear="subject" aria-label="Remove subject filter">×</button></span>');
    }
    if(pills.length){
      els.active.innerHTML = pills.join('') + ' <button type="button" class="clear-all" data-clear="all">Clear filters</button>';
      els.active.querySelectorAll('[data-clear]').forEach(b=>{
        b.addEventListener('click', ()=>{
          const k = b.getAttribute('data-clear');
          const next = {...state};
          if(k==='all'){ next.cls=''; next.subject='';}
          else if(k==='class') next.cls='';
          else if(k==='subject') next.subject='';
          syncForm(next);
          writeState(next,false);
          doSearch(next);
        });
      });
    } else {
      els.active.innerHTML = '';
    }
  }

  function renderSkeletons(){
    els.meta.textContent = '';
    els.meta.setAttribute('aria-busy','true');
    let h = '';
    for(let i=0;i<3;i++){
      h += '<div class="skeleton-item" aria-hidden="true"><div class="skeleton-icon skeleton skeleton-block"></div><div class="skeleton-lines"><div class="skeleton-line w85 skeleton skeleton-block"></div><div class="skeleton-line w60 skeleton skeleton-block"></div><div class="skeleton-meta skeleton skeleton-block"></div></div></div>';
    }
    els.container.innerHTML = '<div class="skeleton" aria-label="Loading results">' + h + '</div>';
    els.section.setAttribute('aria-busy','true');
  }

  function renderEmptyInitial(){
    els.meta.textContent = '';
    els.container.innerHTML =
      '<div class="state-box">' +
        '<div class="state-kicker">Search</div>' +
        '<h2 class="state-title">Search Continua</h2>' +
        '<p class="state-desc">Enter a topic, chapter, or question above to find notes, solutions, formulae, PYQs, mock tests and other study material.</p>' +
        '<p class="state-desc" style="font-size:0.86rem;color:var(--color-text-muted)">Try “quadratic equations”, “real numbers”, or “photosynthesis”. Combine with Class and Subject filters to narrow results.</p>' +
        '<div class="state-actions" style="margin-top:1.1rem"><a href="resources/navigate.html?resource=ncert-solutions" class="btn-ghost">Browse by Resource</a><a href="index.html" class="btn-ghost">Browse Classes</a></div>' +
      '</div>';
  }

  function renderNoResults(state){
    const qLabel = state.q ? '“' + escapeHtml(state.q) + '”' : 'your search';
    const hasFilters = !!(state.cls || state.subject);
    els.meta.innerHTML = 'No results for <em>' + escapeHtml(qLabel) + '</em>' + (hasFilters ? ' with current filters' : '');
    let actions = '';
    if(hasFilters){
      actions += '<button type="button" class="suggest-chip" data-action="clear-filters">Remove filters</button>';
      if(state.cls) actions += '<button type="button" class="suggest-chip" data-action="all-classes">Search across all classes</button>';
      if(state.subject) actions += '<button type="button" class="suggest-chip" data-action="all-subjects">Search across all subjects</button>';
    }
    actions += '<button type="button" class="suggest-chip" data-action="edit-query">Try a different search</button>';
    els.container.innerHTML =
      '<div class="state-box">' +
        '<div class="state-kicker">No results</div>' +
        '<h2 class="state-title">No results found</h2>' +
        '<p class="state-desc">We couldn’t find anything matching ' + escapeHtml(qLabel) + (hasFilters ? ' with the selected filters.' : '.') + '</p>' +
        (state.q ? '<div class="state-query">Searched for <em>' + escapeHtml(qLabel) + '</em>' + (state.cls ? ' · Class ' + escapeHtml(state.cls) : '') + (state.subject ? ' · ' + escapeHtml(state.subject) : '') + '</div>' : '') +
        '<p class="state-desc" style="font-size:0.85rem">Suggestions:</p>' +
        '<div class="suggest-row">' + actions + '</div>' +
        '<div class="state-actions"><a href="index.html" class="btn-ghost">Browse Classes</a><a href="resources/navigate.html?resource=ncert-solutions" class="btn-ghost">Browse by Resource</a></div>' +
      '</div>';

    els.container.querySelectorAll('[data-action]').forEach(b=>{
      b.addEventListener('click', ()=>{
        const a = b.getAttribute('data-action');
        if(a==='clear-filters'){ const n={...state, cls:'', subject:''}; syncForm(n); writeState(n,false); doSearch(n); }
        else if(a==='all-classes'){ const n={...state, cls:''}; syncForm(n); writeState(n,false); doSearch(n); }
        else if(a==='all-subjects'){ const n={...state, subject:''}; syncForm(n); writeState(n,false); doSearch(n); }
        else if(a==='edit-query'){ els.input.focus(); els.input.select(); }
      });
    });
  }

  function renderError(state, err){
    els.meta.textContent = '';
    els.container.innerHTML =
      '<div class="error-box" role="alert">' +
        '<div class="error-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg></div>' +
        '<div class="error-body"><div class="error-title">Something went wrong</div><p class="error-desc">We couldn’t complete your search' + (state.q ? ' for “' + escapeHtml(state.q) + '”' : '') + '. Please check your connection and try again.</p><div style="display:flex;gap:0.6rem;flex-wrap:wrap"><button type="button" class="btn-primary" id="retryBtn">Retry</button><button type="button" class="btn-ghost" id="clearSearchBtn">Clear search</button></div></div>' +
      '</div>';
    document.getElementById('retryBtn').addEventListener('click', ()=> doSearch(state));
    document.getElementById('clearSearchBtn').addEventListener('click', ()=>{
      const n={q:'', cls:'', subject:''}; syncForm(n); writeState(n,false); renderEmptyInitial(); els.meta.textContent=''; els.input.focus();
    });
    console.warn('Search error', err);
  }

  function renderResults(state, data){
    const total = typeof data.total === 'number' ? data.total : data.results.length;
    const qLabel = state.q ? '“' + escapeHtml(state.q) + '”' : '';
    const filterPart = [ state.cls ? 'Class ' + escapeHtml(state.cls) : null, state.subject ? escapeHtml(state.subject) : null ].filter(Boolean).join(' · ');
    els.meta.innerHTML = '<strong>' + total + '</strong> result' + (total!==1 ? 's' : '') + (state.q ? ' for ' + escapeHtml(qLabel) : '') + (filterPart ? ' in ' + escapeHtml(filterPart) : '');

    if(total===0){
      renderNoResults(state);
      return;
    }

    let html = '<div class="results-list" role="list">';
    data.results.forEach(r=>{
      const title = escapeHtml(r.title || 'Untitled');
      const desc = r.description ? '<div class="result-desc">' + escapeHtml(r.description) + '</div>' : '';
      const excerpt = r.excerpt ? '<div class="result-excerpt">' + r.excerpt + '</div>' : ''; // excerpt may contain <mark> — allow if provider sanitizes; we escape by default unless it contains mark
      // If excerpt contains <mark>, preserve it safely: escape then re-allow mark
      let excerptHtml = '';
      if(r.excerpt){
        const safe = escapeHtml(r.excerpt).replace(/&lt;mark&gt;/g,'<mark>').replace(/&lt;\/mark&gt;/g,'</mark>');
        excerptHtml = '<div class="result-excerpt">' + safe + '</div>';
      }
      const typeLabel = escapeHtml(r.typeLabel || getTypeBadge(r.type));
      const clsLabel = r.class ? 'Class ' + escapeHtml(String(r.class)) : '';
      const subjLabel = r.subject ? escapeHtml(String(r.subject).charAt(0).toUpperCase()+String(r.subject).slice(1)) : '';
      const chapterLabel = r.chapter ? escapeHtml(r.chapter) : '';
      const metaParts = [ clsLabel, subjLabel, chapterLabel ].filter(Boolean);
      const metaHtml = metaParts.map((m,i)=> '<span>' + m + '</span>' + (i < metaParts.length-1 ? '<span class="result-meta-sep" aria-hidden="true"></span>' : '')).join('');
      const url = r.url || '#';
      html +=
        '<a href="' + escapeHtml(url) + '" class="result-item" role="listitem">' +
          '<span class="result-icon" aria-hidden="true">' + getIconForType(r.type) + '</span>' +
          '<span class="result-body">' +
            '<span class="result-title-row"><span class="result-title">' + title + '</span><span class="result-badge">' + typeLabel + '</span></span>' +
            desc + excerptHtml +
            '<span class="result-meta">' + metaHtml + '</span>' +
          '</span>' +
          '<span class="result-arrow" aria-hidden="true">→</span>' +
        '</a>';
    });
    html += '</div>';
    els.container.innerHTML = html;
  }

  function syncForm(state){
    els.input.value = state.q || '';
    els.classSel.value = state.cls || '';
    els.subjectSel.value = state.subject || '';
    els.clearBtn.classList.toggle('visible', !!(state.q && state.q.length));
    renderActiveFilters(state);
  }

  let currentSearchId = 0;
  async function doSearch(state){
    syncForm(state);
    // Empty query -> initial state, do not call provider
    if(!state.q){
      els.meta.textContent = '';
      renderEmptyInitial();
      els.section.setAttribute('aria-busy','false');
      return;
    }
    renderSkeletons();
    const thisId = ++currentSearchId;
    const provider = getProvider();
    try{
      const data = await provider.search({q: state.q, class: state.cls, subject: state.subject});
      if(thisId !== currentSearchId) return; // stale
      els.section.setAttribute('aria-busy','false');
      // Normalize: ensure results is array
      const normalized = {
        results: Array.isArray(data.results) ? data.results : [],
        total: typeof data.total === 'number' ? data.total : (Array.isArray(data.results) ? data.results.length : 0)
      };
      renderResults(state, normalized);
    } catch(err){
      if(thisId !== currentSearchId) return;
      els.section.setAttribute('aria-busy','false');
      renderError(state, err);
    }
  }

  // Init
  function init(){
    wireGlobalSearch();

    const initial = readState();
    syncForm(initial);

    // Header search on this page should also route via this page's form
    const headerInput = document.getElementById('headerSearchInput');
    if(headerInput){
      headerInput.addEventListener('keydown', e=>{
        if(e.key==='Enter'){
          e.preventDefault();
          const q = headerInput.value.trim();
          const cur = readState();
          const next = {q, cls: cur.cls, subject: cur.subject};
          writeState(next,false);
          doSearch(next);
          // move focus to main input for accessibility
          els.input.focus();
        }
      });
    }
    const mobileInput = document.getElementById('mobileSearchInput');
    if(mobileInput){
      mobileInput.addEventListener('keydown', e=>{
        if(e.key==='Enter'){
          e.preventDefault();
          const q = mobileInput.value.trim();
          const cur = readState();
          const next = {q, cls: cur.cls, subject: cur.subject};
          writeState(next,false);
          doSearch(next);
          els.input.focus();
        }
      });
    }

    els.form.addEventListener('submit', e=>{
      e.preventDefault();
      const state = {
        q: els.input.value.trim(),
        cls: els.classSel.value.trim(),
        subject: els.subjectSel.value.trim().toLowerCase()
      };
      writeState(state,false);
      doSearch(state);
    });
    els.classSel.addEventListener('change', ()=>{
      const state = { q: els.input.value.trim(), cls: els.classSel.value.trim(), subject: els.subjectSel.value.trim().toLowerCase() };
      // Only auto-search if a query exists; otherwise just update URL quietly
      if(state.q){
        writeState(state,false);
        doSearch(state);
      } else {
        writeState(state,true);
        renderActiveFilters(state);
      }
    });
    els.subjectSel.addEventListener('change', ()=>{
      const state = { q: els.input.value.trim(), cls: els.classSel.value.trim(), subject: els.subjectSel.value.trim().toLowerCase() };
      if(state.q){
        writeState(state,false);
        doSearch(state);
      } else {
        writeState(state,true);
        renderActiveFilters(state);
      }
    });
    els.clearBtn.addEventListener('click', ()=>{
      const cur = readState();
      const next = {q:'', cls: cur.cls, subject: cur.subject};
      syncForm(next);
      writeState(next,false);
      doSearch(next);
      els.input.focus();
    });
    els.input.addEventListener('input', ()=>{
      els.clearBtn.classList.toggle('visible', !!els.input.value.trim().length);
    });

    window.addEventListener('popstate', ()=>{
      const s = readState();
      syncForm(s);
      doSearch(s);
    });

    // Mobile hamburger
    const btn=document.getElementById('mobileMenuBtn');
    const nav=document.getElementById('mobileNav');
    if(btn&&nav){
      btn.addEventListener('click',()=>{
        const o=nav.classList.toggle('open');
        btn.setAttribute('aria-expanded',o);
        nav.setAttribute('aria-hidden',!o);
      });
    }

    // First render based on URL
    if(!initial.q){
      // No query -> show empty state, but preserve filters in UI if present
      renderEmptyInitial();
      renderActiveFilters(initial);
    } else {
      doSearch(initial);
    }
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();