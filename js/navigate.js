document.addEventListener('DOMContentLoaded', () => {
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    if (mobileBtn && mobileNav) {
      mobileBtn.addEventListener('click', () => {
        const o = mobileNav.classList.toggle('open');
        mobileBtn.setAttribute('aria-expanded', o);
        mobileNav.setAttribute('aria-hidden', !o);
      });
    }

    const RESOURCE_CONFIG = {
      'formulae': { name: 'Formulae', description: 'Concise, exam-ready formula sheets organized by chapter for quick revision.', suffix: 'formulae' },
      'ncert-solutions': { name: 'NCERT Solutions', description: 'Step-by-step textbook solutions with clear workings for every exercise.', suffix: 'ncert-solutions' },
      'examples': { name: 'Chapter Examples', description: 'Worked examples that illustrate key ideas and problem-solving approaches.', suffix: 'examples' },
      'reference': { name: 'Reference Material', description: 'Supplementary notes, diagrams, and handouts to deepen understanding.', suffix: 'reference' },
      'mock-tests': { name: 'Mock Tests & Sample Papers', description: 'Timed practice papers and sample tests with marking schemes.', suffix: 'mock-tests' }
    };

    const SUBJECT_META = {
      'mathematics': { label: 'Mathematics', icon: '/continua-web/assets/maths_icon-opt.webp' },
      'physics': { label: 'Physics', icon: '/continua-web/assets/physics_icon-opt.webp' },
      'chemistry': { label: 'Chemistry', icon: '/continua-web/assets/chemistry_icon-opt.webp' },
      'biology': { label: 'Biology', icon: '/continua-web/assets/biology_icon-opt.webp' },
      'science': { label: 'Science', icon: '/continua-web/assets/science_icon-opt.webp' }
    };

    // Sample availability — prototype only. Builder will later populate from manifests.
    // Structure: resource -> class -> subject -> chapters[]
    const AVAILABILITY = {
      'formulae': {
        '12': {
          'mathematics': [ {num:'01', name:'Relations and Functions', slug:'relations-and-functions'}, {num:'02', name:'Inverse Trigonometric Functions', slug:'inverse-trigonometric-functions'}, {num:'03', name:'Matrices', slug:'matrices'} ],
          'physics': [ {num:'01', name:'Electric Charges and Fields', slug:'electric-charges-and-fields'}, {num:'02', name:'Electrostatic Potential', slug:'electrostatic-potential'} ],
          'chemistry': [ {num:'01', name:'The Solid State', slug:'the-solid-state'}, {num:'02', name:'Solutions', slug:'solutions'} ],
          'biology': [ {num:'01', name:'Reproduction in Organisms', slug:'reproduction-in-organisms'}, {num:'02', name:'Sexual Reproduction in Flowering Plants', slug:'sexual-reproduction-in-flowering-plants'} ]
        },
        '11': {
          'mathematics': [ {num:'01', name:'Sets', slug:'sets'}, {num:'02', name:'Relations and Functions', slug:'relations-and-functions'} ],
          'physics': [ {num:'01', name:'Physical World', slug:'physical-world'} ],
          'chemistry': [ {num:'01', name:'Some Basic Concepts of Chemistry', slug:'some-basic-concepts-of-chemistry'} ],
          'biology': [ {num:'01', name:'The Living World', slug:'the-living-world'} ]
        },
        '10': {
          'mathematics': [ {num:'01', name:'Real Numbers', slug:'real-numbers'}, {num:'02', name:'Polynomials', slug:'polynomials'}, {num:'03', name:'Pair of Linear Equations in Two Variables', slug:'pair-of-linear-equations'}, {num:'04', name:'Quadratic Equations', slug:'quadratic-equations'} ],
          'science': [ {num:'01', name:'Chemical Reactions and Equations', slug:'chemical-reactions-and-equations'}, {num:'02', name:'Acids, Bases and Salts', slug:'acids-bases-and-salts'} ]
        }
      },
      'ncert-solutions': {
        '12': {
          'mathematics': [ {num:'01', name:'Relations and Functions', slug:'relations-and-functions'}, {num:'02', name:'Inverse Trigonometric Functions', slug:'inverse-trigonometric-functions'} ],
          'physics': [ {num:'01', name:'Electric Charges and Fields', slug:'electric-charges-and-fields'} ],
          'chemistry': [ {num:'01', name:'The Solid State', slug:'the-solid-state'} ],
          'biology': [ {num:'01', name:'Reproduction in Organisms', slug:'reproduction-in-organisms'} ]
        },
        '11': {
          'mathematics': [ {num:'01', name:'Sets', slug:'sets'} ],
          'physics': [ {num:'01', name:'Physical World', slug:'physical-world'} ],
          'chemistry': [ {num:'01', name:'Some Basic Concepts of Chemistry', slug:'some-basic-concepts-of-chemistry'} ],
          'biology': [ {num:'01', name:'The Living World', slug:'the-living-world'} ]
        },
        '10': {
          'mathematics': [ {num:'01', name:'Real Numbers', slug:'real-numbers'}, {num:'02', name:'Polynomials', slug:'polynomials'}, {num:'03', name:'Pair of Linear Equations in Two Variables', slug:'pair-of-linear-equations'} ],
          'science': [ {num:'01', name:'Chemical Reactions and Equations', slug:'chemical-reactions-and-equations'} ]
        }
      },
      'examples': {
        '10': {
          'mathematics': [ {num:'01', name:'Real Numbers', slug:'real-numbers'}, {num:'02', name:'Polynomials', slug:'polynomials'}, {num:'03', name:'Pair of Linear Equations in Two Variables', slug:'pair-of-linear-equations'} ]
        },
        '12': {
          'mathematics': [ {num:'01', name:'Relations and Functions', slug:'relations-and-functions'} ]
        }
      },
      'reference': {
        '12': {
          'mathematics': [ {num:'01', name:'Relations and Functions', slug:'relations-and-functions'}, {num:'02', name:'Matrices', slug:'matrices'} ],
          'physics': [ {num:'01', name:'Electric Charges and Fields', slug:'electric-charges-and-fields'} ]
        },
        '10': {
          'science': [ {num:'01', name:'Chemical Reactions and Equations', slug:'chemical-reactions-and-equations'}, {num:'02', name:'Acids, Bases and Salts', slug:'acids-bases-and-salts'} ],
          'mathematics': [ {num:'01', name:'Real Numbers', slug:'real-numbers'} ]
        }
      },
      'mock-tests': {
        '10': {
          'mathematics': [ {num:'01', name:'Real Numbers', slug:'real-numbers'}, {num:'02', name:'Polynomials', slug:'polynomials'} ],
          'science': [ {num:'01', name:'Chemical Reactions and Equations', slug:'chemical-reactions-and-equations'} ]
        },
        '12': {
          'physics': [ {num:'01', name:'Electric Charges and Fields', slug:'electric-charges-and-fields'} ],
          'mathematics': [ {num:'01', name:'Relations and Functions', slug:'relations-and-functions'} ]
        }
      }
    };

    const CLASS_ORDER = ['12','11','10'];

    function getParams() {
      const sp = new URLSearchParams(location.search);
      return {
        resource: sp.get('resource'),
        cls: sp.get('class'),
        subject: sp.get('subject')
      };
    }

    function buildUrl(resource, cls, subject) {
      const base = '/continua-web/resources/navigate.html?resource=' + encodeURIComponent(resource);
      if (!cls) return base;
      if (!subject) return base + '&class=' + encodeURIComponent(cls);
      return base + '&class=' + encodeURIComponent(cls) + '&subject=' + encodeURIComponent(subject);
    }

    function navigate(resource, cls, subject) {
      const url = buildUrl(resource, cls, subject);
      history.pushState(null, '', url);
      render();
    }

    function canonicalChapterUrl(cls, subject, chapterSlug, suffix) {
      return '/continua-web/class-' + cls + '/' + subject + '/' + chapterSlug + '/' + suffix;
    }

    function updateHeader(resourceKey, params) {
      const kicker = document.getElementById('navKicker');
      const title = document.getElementById('navTitle');
      const desc = document.getElementById('navDesc');
      const path = document.getElementById('navPath');
      const bcCurrent = document.getElementById('breadcrumbCurrent');
      const trail = document.getElementById('breadcrumbTrail');

      if (!resourceKey) {
        kicker.textContent = 'Resources';
        title.textContent = 'Browse by Resource';
        desc.textContent = 'Choose the type of study material you want to find.';
        path.innerHTML = '';
        bcCurrent.textContent = 'Browse';
        document.title = 'Browse by Resource — Continua';
        trail.innerHTML = '<li class="breadcrumb-item" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem"><a href="/continua-web/index.html" class="breadcrumb-link" itemprop="item"><span itemprop="name">Continua</span></a><meta itemprop="position" content="1"><span class="breadcrumb-separator">/</span></li>' +
          '<li class="breadcrumb-item" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem"><a href="/continua-web/resources/navigate.html" class="breadcrumb-link" itemprop="item"><span itemprop="name">Resources</span></a><meta itemprop="position" content="2"><span class="breadcrumb-separator">/</span></li>' +
          '<li class="breadcrumb-item"><span class="breadcrumb-current">Browse</span></li>';
        return;
      }
      const cfg = RESOURCE_CONFIG[resourceKey];
      if (!cfg) {
        kicker.textContent = 'Resources';
        title.textContent = 'Resource Not Found';
        desc.textContent = "The resource you're looking for could not be found.";
        path.innerHTML = '';
        bcCurrent.textContent = 'Not Found';
        document.title = 'Resource Not Found — Continua';
        trail.innerHTML = '<li class="breadcrumb-item"><a href="/continua-web/index.html" class="breadcrumb-link">Continua</a><span class="breadcrumb-separator">/</span></li>' +
          '<li class="breadcrumb-item"><a href="/continua-web/resources/navigate.html" class="breadcrumb-link">Resources</a><span class="breadcrumb-separator">/</span></li>' +
          '<li class="breadcrumb-item"><span class="breadcrumb-current">Not Found</span></li>';
        return;
      }
      kicker.textContent = 'Resources';
      title.textContent = cfg.name;
      desc.textContent = cfg.description;
      document.title = cfg.name + ' — Browse — Continua';

      let bcHtml = '<li class="breadcrumb-item" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem"><a href="/continua-web/index.html" class="breadcrumb-link" itemprop="item"><span itemprop="name">Continua</span></a><meta itemprop="position" content="1"><span class="breadcrumb-separator">/</span></li>' +
        '<li class="breadcrumb-item" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem"><a href="/continua-web/resources/navigate.html" class="breadcrumb-link" itemprop="item"><span itemprop="name">Resources</span></a><meta itemprop="position" content="2"><span class="breadcrumb-separator">/</span></li>' +
        '<li class="breadcrumb-item" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem"><a href="/continua-web/resources/navigate.html?resource=' + encodeURIComponent(resourceKey) + '" class="breadcrumb-link" itemprop="item"><span itemprop="name">' + cfg.name + '</span></a><meta itemprop="position" content="3">';
      let pathHtml = '';
      if (params.cls) {
        bcHtml += '<span class="breadcrumb-separator">/</span></li><li class="breadcrumb-item"><a href="' + buildUrl(resourceKey, params.cls) + '" class="breadcrumb-link">Class ' + params.cls + '</a>';
        pathHtml += '<span class="nav-path-sep">/</span> <strong>Class ' + params.cls + '</strong>';
      } else {
        bcHtml += '</li>';
      }
      if (params.subject) {
        const subjLabel = (SUBJECT_META[params.subject]||{label:params.subject}).label;
        bcHtml += '<span class="breadcrumb-separator">/</span></li><li class="breadcrumb-item"><span class="breadcrumb-current">' + subjLabel + '</span>';
        pathHtml += ' <span class="nav-path-sep">→</span> <strong>' + subjLabel + '</strong>';
      } else if (params.cls) {
        bcHtml += '</li>';
      }
      if (!params.cls) {
        bcHtml += '';
      }
      trail.innerHTML = bcHtml + '</li>';
      bcCurrent.textContent = cfg.name;
      // path bar under title
      if (params.cls || params.subject) {
        path.innerHTML = '<span>Resources</span> <span class="nav-path-sep">/</span> <strong>' + cfg.name + '</strong>' + pathHtml;
      } else {
        path.innerHTML = '<span>Resources</span> <span class="nav-path-sep">/</span> <strong>' + cfg.name + '</strong> <span class="nav-path-sep">·</span> <span>Class → Subject → Chapter</span>';
      }
    }

    function renderResourcePicker() {
      const root = document.getElementById('navigatorRoot');
      const items = Object.keys(RESOURCE_CONFIG).map(key => {
        const cfg = RESOURCE_CONFIG[key];
        return '<a href="/continua-web/resources/navigate.html?resource=' + encodeURIComponent(key) + '" class="resource-card">' +
          '<span class="resource-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg></span>' +
          '<span class="resource-card-body"><span class="resource-card-title">' + cfg.name + '</span><span class="resource-card-desc">' + cfg.description + '</span></span>' +
          '<span class="resource-card-arrow">›</span></a>';
      }).join('');
      root.innerHTML = '<div class="section-label">Browse by Resource</div><p class="section-sub">Select a resource type to see where it is available. This is the reverse entry point — <strong>Resource → Class → Subject → Chapter</strong> — which converges on the same permanent pages as <strong>Class → Subject → Chapter → Resource</strong>.</p><div class="resource-grid">' + items + '</div>' +
        '<div style="margin-top:1.5rem;padding:0.75rem 0.9rem;background:var(--color-bg-surface);border:1px solid var(--color-border-subtle);border-left:3px solid #cbd5e1;font-size:0.84rem;color:var(--color-text-subtle);line-height:1.6">PYQ Library is a global destination and is not listed here. Use the header link or browse classes to reach it.</div>';
    }

    function renderInvalid() {
      const root = document.getElementById('navigatorRoot');
      root.innerHTML = '<div class="quiet-box"><div class="quiet-title">Resource Not Found</div><p class="quiet-desc">The resource you\'re looking for could not be found.</p><div class="quiet-actions"><a href="/continua-web/resources/navigate.html" class="quiet-btn quiet-btn--primary">Back to Resources</a><a href="/continua-web/index.html" class="quiet-btn">Browse Classes</a></div></div>';
    }

    function renderClasses(resourceKey) {
      const root = document.getElementById('navigatorRoot');
      const avail = AVAILABILITY[resourceKey] || {};
      const classes = CLASS_ORDER.filter(c => avail[c] && Object.keys(avail[c]).length > 0);
      if (classes.length === 0) {
        root.innerHTML = '<div class="quiet-box"><div class="quiet-title">No classes available</div><p class="quiet-desc">This resource is not yet available for any class.</p><div class="quiet-actions"><a href="/continua-web/resources/navigate.html" class="quiet-btn">Back to Resources</a></div></div>';
        return;
      }
      let html = '<div class="section-label">Classes</div><p class="section-sub">Select a class to see subjects that have <strong>' + RESOURCE_CONFIG[resourceKey].name + '</strong>. Only combinations that actually have this resource are shown.</p><div class="classes-list">';
      classes.forEach(cls => {
        const subjects = Object.keys(avail[cls]);
        html += '<div class="class-block"><div class="class-header"><span class="class-numeral">' + cls + '</span><h2 class="class-name">Class ' + cls + '</h2></div><div class="class-subjects-grid">';
        subjects.forEach(sub => {
          const meta = SUBJECT_META[sub] || {label: sub, icon: '/continua-web/assets/science_icon-opt.webp'};
          html += '<a href="' + buildUrl(resourceKey, cls, sub) + '" class="subject-cell" data-nav="subject" data-cls="' + cls + '" data-sub="' + sub + '"><span class="subject-icon-wrap"><img src="' + meta.icon + '" alt="" class="subject-icon-img"></span><span class="subject-title">' + meta.label + '</span><span class="subject-arrow">›</span></a>';
          // For class-level: we want click on any subject to go to chapters, but spec says State 1 shows classes with subjects, clicking subject goes to chapters. We also support clicking class to see subjects (State 2). To keep single template simple, we interpret subject click as going to chapters directly; but we also provide class click alternative via dedicated subject view.
        });
        html += '</div></div>';
      });
      html += '</div>';
      // Also provide explicit class selection buttons for State 2 transition: clicking class header goes to subject list
      // Instead, we add subtle "View subjects" links per class that navigate to class-only view (without subject)
      // For prototype, keep as is — subject click goes straight to chapters, which still satisfies flow. To demonstrate State 2, we add clickable class headers:
      root.innerHTML = html;
      // Enhance: make class headers clickable to show subject-only view
      root.querySelectorAll('.class-block').forEach(block => {
        const hdr = block.querySelector('.class-header');
        const cls = hdr.querySelector('.class-numeral').textContent.trim();
        hdr.style.cursor = 'pointer';
        hdr.title = 'View subjects for Class ' + cls;
        hdr.addEventListener('click', (e) => {
          e.preventDefault();
          navigate(resourceKey, cls, null);
        });
      });
      // intercept subject clicks to use pushState
      root.querySelectorAll('a.subject-cell').forEach(a => {
        a.addEventListener('click', (e) => {
          e.preventDefault();
          const cls = a.getAttribute('data-cls');
          const sub = a.getAttribute('data-sub');
          navigate(resourceKey, cls, sub);
        });
      });
    }

    function renderSubjects(resourceKey, cls) {
      const root = document.getElementById('navigatorRoot');
      const avail = AVAILABILITY[resourceKey] || {};
      const classData = avail[cls];
      if (!classData) {
        root.innerHTML = '<div class="quiet-box"><div class="quiet-title">No subjects available</div><p class="quiet-desc">No subjects have ' + RESOURCE_CONFIG[resourceKey].name + ' for Class ' + cls + '.</p><div class="quiet-actions"><a href="' + buildUrl(resourceKey) + '" class="quiet-btn">Back to classes</a></div></div>';
        return;
      }
      const subjects = Object.keys(classData);
      let html = '<div class="back-row"><a href="' + buildUrl(resourceKey) + '" class="back-link" data-back="classes">← Back to classes</a></div>';
      html += '<div class="section-label">Subjects</div><p class="section-sub">Class ' + cls + ' — choose a subject to see chapters with <strong>' + RESOURCE_CONFIG[resourceKey].name + '</strong>.</p>';
      html += '<div class="subjects-row">';
      subjects.forEach(sub => {
        const meta = SUBJECT_META[sub] || {label: sub, icon: '/continua-web/assets/science_icon-opt.webp'};
        html += '<a href="' + buildUrl(resourceKey, cls, sub) + '" class="subject-cell" data-nav="subj" data-cls="' + cls + '" data-sub="' + sub + '"><span class="subject-icon-wrap"><img src="' + meta.icon + '" alt="" class="subject-icon-img"></span><span class="subject-title">' + meta.label + '</span><span class="subject-arrow">›</span></a>';
      });
      html += '</div>';
      root.innerHTML = html;
      root.querySelector('a[data-back="classes"]').addEventListener('click', (e) => { e.preventDefault(); navigate(resourceKey, null, null); });
      root.querySelectorAll('a.subject-cell').forEach(a => {
        a.addEventListener('click', (e) => { e.preventDefault(); navigate(resourceKey, a.getAttribute('data-cls'), a.getAttribute('data-sub')); });
      });
    }

    function renderChapters(resourceKey, cls, subject) {
      const root = document.getElementById('navigatorRoot');
      const avail = AVAILABILITY[resourceKey] || {};
      const chapters = avail[cls] && avail[cls][subject];
      if (!chapters || chapters.length === 0) {
        root.innerHTML = '<div class="quiet-box"><div class="quiet-title">No chapters available</div><p class="quiet-desc">No chapters have ' + RESOURCE_CONFIG[resourceKey].name + ' for Class ' + cls + ' ' + subject + '.</p><div class="quiet-actions"><a href="' + buildUrl(resourceKey, cls) + '" class="quiet-btn">Back to subjects</a></div></div>';
        return;
      }
      const cfg = RESOURCE_CONFIG[resourceKey];
      const subjLabel = (SUBJECT_META[subject]||{label:subject}).label;
      let html = '<div class="back-row" style="display:flex;gap:0.8rem;flex-wrap:wrap"><a href="' + buildUrl(resourceKey) + '" class="back-link" data-back="classes">← Classes</a><span style="color:var(--color-text-light)">·</span><a href="' + buildUrl(resourceKey, cls) + '" class="back-link" data-back="subjects">← Back to subjects</a></div>';
      html += '<div class="section-label">Chapters</div><p class="section-sub">' + subjLabel + ' · Class ' + cls + ' — each chapter links directly to its permanent ' + cfg.name + ' page.</p>';
      html += '<div class="chapters-list">';
      chapters.forEach(ch => {
        const url = canonicalChapterUrl(cls, subject, ch.slug, cfg.suffix);
        html += '<a href="' + url + '" class="chapter-row"><span class="chapter-num">' + ch.num + '</span><span class="chapter-body"><span class="chapter-name">' + ch.name + '</span><span class="chapter-meta">' + subjLabel + ' · Chapter ' + ch.num + '</span></span><span class="chapter-cta">' + cfg.name + ' →</span></a>';
      });
      html += '</div>';
      root.innerHTML = html;
      root.querySelector('a[data-back="classes"]').addEventListener('click', (e) => { e.preventDefault(); navigate(resourceKey, null, null); });
      root.querySelector('a[data-back="subjects"]').addEventListener('click', (e) => { e.preventDefault(); navigate(resourceKey, cls, null); });
    }

    function render() {
      const params = getParams();
      const resource = params.resource;
      if (!resource) {
        updateHeader(null, params);
        renderResourcePicker();
        return;
      }
      if (!RESOURCE_CONFIG[resource]) {
        updateHeader(resource, params);
        renderInvalid();
        return;
      }
      // valid resource
      if (params.cls && params.subject) {
        // validate existence, if invalid fall back to class or subject view
        const avail = AVAILABILITY[resource] || {};
        if (!avail[params.cls] || !avail[params.cls][params.subject]) {
          // if class exists but subject not, show subjects
          if (avail[params.cls]) { updateHeader(resource, {cls: params.cls, subject: null}); renderSubjects(resource, params.cls); return; }
          updateHeader(resource, {}); renderClasses(resource); return;
        }
        updateHeader(resource, params);
        renderChapters(resource, params.cls, params.subject);
        return;
      }
      if (params.cls) {
        const avail = AVAILABILITY[resource] || {};
        if (!avail[params.cls]) { updateHeader(resource, {}); renderClasses(resource); return; }
        updateHeader(resource, params);
        renderSubjects(resource, params.cls);
        return;
      }
      updateHeader(resource, {});
      renderClasses(resource);
    }

    window.addEventListener('popstate', render);
    render();
  });