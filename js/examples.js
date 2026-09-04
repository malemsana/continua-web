const FALLBACK_EXAMPLES_DATA = {
      "id": "c10_mathemat_ch1_example",
      "chapterId": "c10_mathemat_ch1",
      "friendlyName": "Examples",
      "questions": [
        {
          "id": "c10_mathemat_ch1_example_main_q21",
          "displayOrder": 21,
          "questionText": "Two numbers are in the ratio $5 : 7$ and their LCM is $420$. Find the HCF and the two numbers.",
          "solutionText": "Let the two numbers be $a = 5k$ and $b = 7k$, where $k$ is a positive integer.\n\nSince $5$ and $7$ are prime to each other ($\\gcd(5, 7) = 1$):\n\n$$\n\\text{LCM}(5k, 7k) = 5 \\times 7 \\times k = 35k\n$$\n\nWe are given that $\\text{LCM} = 420$:\n\n$$\n35k = 420 \\implies k = \\frac{420}{35} = 12\n$$\n\nSince $\\text{HCF}(5k, 7k) = k$, we have:\n\n$$\n\\text{HCF} = 12\n$$\n\nThe two numbers are:\n\n$$\na = 5 \\times 12 = 60\n$$\n\n$$\nb = 7 \\times 12 = 84\n$$\n\n**Answer:** $\\text{HCF} = 12$; the numbers are $60$ and $84$.",
          "options": []
        },
        {
          "id": "c10_mathemat_ch1_example_main_q1",
          "displayOrder": 1,
          "questionText": "Express the number $420$ as a product of its prime factors in ascending order of primes.",
          "solutionText": "To express $420$ as a product of prime factors, we divide successively by the smallest possible prime numbers.\n\n$$\n\\begin{aligned}\n420 &= 2 \\times 210 \\\\\n&= 2 \\times 2 \\times 105 \\\\\n&= 2^2 \\times 3 \\times 35 \\\\\n&= 2^2 \\times 3 \\times 5 \\times 7\n\\end{aligned}\n$$\n\nWe have expressed $420$ with primes in ascending order $2 < 3 < 5 < 7$.\n\n**Answer:** $420 = 2^2 \\times 3 \\times 5 \\times 7$.\n\n> Note: This is the **Fundamental Theorem of Arithmetic** — every composite number has a unique prime factorisation.",
          "options": []
        },
        {
          "id": "c10_mathemat_ch1_example_main_q2",
          "displayOrder": 2,
          "questionText": "Express $7560$ as a product of powers of prime factors.",
          "solutionText": "We factorise $7560$ step by step:\n\n$$\n\\begin{aligned}\n7560 &= 2 \\times 3780 \\\\\n&= 2^2 \\times 1890 \\\\\n&= 2^3 \\times 945 \\\\\n&= 2^3 \\times 3 \\times 315 \\\\\n&= 2^3 \\times 3^2 \\times 105 \\\\\n&= 2^3 \\times 3^2 \\times 5 \\times 21 \\\\\n&= 2^3 \\times 3^3 \\times 5 \\times 7\n\\end{aligned}\n$$\n\nCheck with $\\text{HCF}$ and $\\text{LCM}$ concepts:\n\n* $7560 = 2^3 \\cdot 3^3 \\cdot 5^1 \\cdot 7^1$\n* Number of prime factors (with multiplicity) is $3+3+1+1 = 8$.\n\n**Answer:** $7560 = 2^3 \\times 3^3 \\times 5 \\times 7$.",
          "options": []
        }
      ]
    };
    document.addEventListener('DOMContentLoaded', async () => {
      const mobileMenuBtn = document.getElementById('mobileMenuBtn');
      const mobileNav = document.getElementById('mobileNav');
      if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
          const isOpen = mobileNav.classList.toggle('open');
          mobileMenuBtn.setAttribute('aria-expanded', isOpen);
          mobileNav.setAttribute('aria-hidden', !isOpen);
        });
      }
      const moreMenuBtn = document.getElementById('moreMenuBtn');
      const moreMenuDropdown = document.getElementById('moreMenuDropdown');
      const menuContentsBtn = document.getElementById('menuContentsBtn');
      const menuCopyLinkBtn = document.getElementById('menuCopyLinkBtn');
      const copyLinkTitle = document.getElementById('copyLinkTitle');
      const menuPrintBtn = document.getElementById('menuPrintBtn');
      if (moreMenuBtn && moreMenuDropdown) {
        moreMenuBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const isOpen = moreMenuDropdown.classList.toggle('open');
          moreMenuBtn.setAttribute('aria-expanded', isOpen);
          moreMenuDropdown.setAttribute('aria-hidden', !isOpen);
        });
        document.addEventListener('click', (e) => {
          if (!moreMenuBtn.contains(e.target) && !moreMenuDropdown.contains(e.target)) {
            moreMenuDropdown.classList.remove('open');
            moreMenuBtn.setAttribute('aria-expanded', 'false');
            moreMenuDropdown.setAttribute('aria-hidden', 'true');
          }
        });
        if (menuContentsBtn) {
          menuContentsBtn.addEventListener('click', () => {
            moreMenuDropdown.classList.remove('open');
            moreMenuBtn.setAttribute('aria-expanded', 'false');
            openDrawer();
          });
        }
        if (menuCopyLinkBtn && copyLinkTitle) {
          menuCopyLinkBtn.addEventListener('click', async () => {
            try {
              await navigator.clipboard.writeText(window.location.href);
              copyLinkTitle.textContent = 'Link Copied!';
              setTimeout(() => { copyLinkTitle.textContent = 'Copy Examples Link'; moreMenuDropdown.classList.remove('open'); }, 1200);
            } catch(e) {}
          });
        }
        if (menuPrintBtn) {
          menuPrintBtn.addEventListener('click', () => { moreMenuDropdown.classList.remove('open'); window.print(); });
        }
      }
      const openDrawerBtn = document.getElementById('openDrawerBtn');
      const closeDrawerBtn = document.getElementById('closeDrawerBtn');
      const tocDrawer = document.getElementById('tocDrawer');
      const drawerBackdrop = document.getElementById('drawerBackdrop');
      function openDrawer(){ if(!tocDrawer) return; tocDrawer.classList.add('open'); tocDrawer.setAttribute('aria-hidden','false'); if(openDrawerBtn) openDrawerBtn.classList.add('drawer-open'); if(drawerBackdrop && window.innerWidth<=900) drawerBackdrop.classList.add('open'); }
      function closeDrawer(){ if(!tocDrawer) return; tocDrawer.classList.remove('open'); tocDrawer.setAttribute('aria-hidden','true'); if(openDrawerBtn) openDrawerBtn.classList.remove('drawer-open'); if(drawerBackdrop) drawerBackdrop.classList.remove('open'); }
      function toggleDrawer(){ if(tocDrawer && tocDrawer.classList.contains('open')) closeDrawer(); else openDrawer(); }
      if(openDrawerBtn) openDrawerBtn.addEventListener('click', toggleDrawer);
      if(closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
      if(drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);
      document.addEventListener('keydown', (e)=>{ if(e.key==='Escape'){ closeDrawer(); if(moreMenuDropdown) moreMenuDropdown.classList.remove('open'); }});

      let data = FALLBACK_EXAMPLES_DATA;
      try {
        const res = await fetch('assets/c10_mathemat_ch1_example.json');
        if(res.ok) data = await res.json();
        else {
          const res2 = await fetch('c10_mathemat_ch1_example.json');
          if(res2.ok) data = await res2.json();
        }
      } catch(err){ console.warn('Using fallback examples payload'); }
      renderExamples(data, closeDrawer);

      // Example picker in breadcrumb (current example)
      const currentExampleBtn = document.getElementById('currentExampleBtn');
      const examplePickerDropdown = document.getElementById('examplePickerDropdown');
      const currentExampleLabel = document.getElementById('currentExampleLabel');
      function closeExamplePicker(){
        if(examplePickerDropdown && currentExampleBtn){
          examplePickerDropdown.classList.remove('open');
          currentExampleBtn.setAttribute('aria-expanded','false');
          examplePickerDropdown.setAttribute('aria-hidden','true');
        }
      }
      if(currentExampleBtn && examplePickerDropdown){
        currentExampleBtn.addEventListener('click', (e)=>{
          e.stopPropagation();
          const isOpen = examplePickerDropdown.classList.toggle('open');
          currentExampleBtn.setAttribute('aria-expanded', isOpen);
          examplePickerDropdown.setAttribute('aria-hidden', !isOpen);
        });
        document.addEventListener('click', (e)=>{
          if(!currentExampleBtn.contains(e.target) && !examplePickerDropdown.contains(e.target)){
            closeExamplePicker();
          }
        });
        document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeExamplePicker(); });
      }
      function updateCurrentExample(num){
        if(currentExampleLabel) currentExampleLabel.textContent = 'Example ' + num;
        document.querySelectorAll('.example-picker-tile').forEach(t=>{
          const isActive = t.getAttribute('data-target') === 'example-'+num;
          t.classList.toggle('active', isActive);
        });
      }

      // Try First mode — subtle reading-mode preference, default OFF, synced across 3 toggles
      const tryFirstToggle = document.getElementById('tryFirstToggle');
      const tryFirstToggleMobile = document.getElementById('tryFirstToggleMobile');
      const tryFirstToggleFloating = document.getElementById('tryFirstToggleFloating');
      const bookContentEl = document.getElementById('examplesBookContent');
      const floatingTryFirst = document.getElementById('floatingTryFirst');
      const chevronSvg = '<svg class="solution-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>';
      function syncToggles(checked){
        [tryFirstToggle, tryFirstToggleMobile, tryFirstToggleFloating].forEach(t=>{ if(t) t.checked = checked; });
      }
      function applyTryFirst(enabled){
        if(!bookContentEl) return;
        syncToggles(enabled);
        if(enabled){
          bookContentEl.classList.add('try-first-enabled');
          bookContentEl.querySelectorAll('.solution-block').forEach(el=>el.classList.remove('revealed'));
          bookContentEl.querySelectorAll('.show-solution-btn, .hide-solution-btn').forEach(btn=>{
            btn.innerHTML='<span>Show Solution</span>'+chevronSvg;
            btn.classList.remove('hide-solution-btn');
            btn.classList.add('show-solution-btn');
            btn.setAttribute('aria-expanded','false');
          });
          bookContentEl.querySelectorAll('.option-choice').forEach(o=>{
            o.removeAttribute('disabled');
            o.setAttribute('tabindex','0');
          });
        } else {
          bookContentEl.classList.remove('try-first-enabled');
          bookContentEl.querySelectorAll('.option-choice').forEach(o=>{
            o.setAttribute('aria-checked','false');
            o.setAttribute('tabindex','-1');
            o.setAttribute('disabled','');
          });
          bookContentEl.querySelectorAll('.solution-block').forEach(el=>el.classList.remove('revealed'));
          // reset buttons to Show state for next enable
          bookContentEl.querySelectorAll('.show-solution-btn, .hide-solution-btn').forEach(btn=>{
            btn.innerHTML='<span>Show Solution</span>'+chevronSvg;
            btn.classList.remove('hide-solution-btn');
            btn.classList.add('show-solution-btn');
            btn.setAttribute('aria-expanded','false');
          });
        }
      }
      function handleTryFirstChange(e){
        applyTryFirst(e.target.checked);
      }
      [tryFirstToggle, tryFirstToggleMobile, tryFirstToggleFloating].forEach(t=>{
        if(t) t.addEventListener('change', handleTryFirstChange);
      });
      if(bookContentEl){
        // delegation for per-example Show/Hide and MCQ selection
        bookContentEl.addEventListener('click', (e)=>{
          const btn = e.target.closest('.show-solution-btn, .hide-solution-btn');
          if(btn){
            const article = btn.closest('.question-entry');
            const solution = article ? article.querySelector('.solution-block') : null;
            if(!solution) return;
            const isRevealed = solution.classList.contains('revealed');
            if(isRevealed){
              solution.classList.remove('revealed');
              btn.innerHTML='<span>Show Solution</span>'+chevronSvg;
              btn.classList.remove('hide-solution-btn');
              btn.classList.add('show-solution-btn');
              btn.setAttribute('aria-expanded','false');
            } else {
              solution.classList.add('revealed');
              btn.innerHTML='<span>Hide Solution</span>'+chevronSvg;
              btn.classList.remove('show-solution-btn');
              btn.classList.add('hide-solution-btn');
              btn.setAttribute('aria-expanded','true');
              if(window.ContinuaRenderer && window.ContinuaRenderer.renderMath){
                window.ContinuaRenderer.renderMath(solution);
              }
            }
            return;
          }
          const optBtn = e.target.closest('.option-choice');
          if(optBtn && bookContentEl.classList.contains('try-first-enabled')){
            const group = optBtn.closest('.example-options');
            if(group){
              group.querySelectorAll('.option-choice').forEach(o=>o.setAttribute('aria-checked','false'));
              optBtn.setAttribute('aria-checked','true');
            }
          }
        });
        applyTryFirst(false);
      }
      // Floaters must not overlay footer — hide/slide away when footer enters viewport
      const floaterEls = [document.getElementById('openDrawerBtn'), document.getElementById('moreMenuWrapper'), document.getElementById('floatingTryFirst')].filter(Boolean);
      const footerEl = document.querySelector('.global-footer');
      function updateFloaterFooter(){
        if(!footerEl || !floaterEls.length) return;
        const footerTop = footerEl.getBoundingClientRect().top;
        const shouldHide = footerTop < window.innerHeight + 24;
        floaterEls.forEach(el=>{
          if(shouldHide) el.classList.add('floater-hidden');
          else el.classList.remove('floater-hidden');
        });
      }
      window.addEventListener('scroll', updateFloaterFooter, {passive:true});
      window.addEventListener('resize', updateFloaterFooter, {passive:true});
      // initial check and after drawer animations
      updateFloaterFooter();
      // also re-check after images/KaTeX load may shift footer
      window.addEventListener('load', updateFloaterFooter);
      // Expose updateCurrentExample for scrollspy
      window._updateCurrentExample = updateCurrentExample;
    });

    function renderExamples(data, closeDrawerFn){
      const container = document.getElementById('examplesBookContent');
      const drawerBody = document.getElementById('drawerBody');
      if(!container) return;
      const questions = (data.questions || []).slice().sort((a,b)=> (a.displayOrder||0)-(b.displayOrder||0));
      if(questions.length===0){
        container.innerHTML = '<div class=\"empty-state\"><strong>No examples available</strong><br>Worked examples for this chapter will appear here when published.</div>';
        if(drawerBody) drawerBody.innerHTML = '<div style=\"font-size:0.85rem;color:var(--color-text-muted);\">No examples</div>';
        return;
      }
      let html = '';
      let drawerHtml = '<div class=\"drawer-group\"><div class=\"drawer-group-title\"><span>Examples</span><span style=\"font-size:0.72rem;color:#64748b;font-weight:normal;\">' + questions.length + ' items</span></div><div class=\"drawer-q-grid\">';
      questions.forEach((q, idx)=>{
        const n = q.displayOrder;
        const anchorId = 'example-' + n;
        const formattedNum = String(n).padStart(2,'0');
        drawerHtml += '<a href=\"#' + anchorId + '\" class=\"drawer-q-link\" data-target=\"' + anchorId + '\">' + formattedNum + '</a>';
        let qHtml = '';
        if (window.ContinuaRenderer && window.ContinuaRenderer.renderMarkdown) {
          qHtml = window.ContinuaRenderer.renderMarkdown(q.questionText || '');
        } else {
          qHtml = (q.questionText||'').replace(/\n\n/g,'<br><br>');
        }
        let solHtml = '';
        if (window.ContinuaRenderer && window.ContinuaRenderer.renderMarkdown) {
          solHtml = window.ContinuaRenderer.renderMarkdown(q.solutionText || '');
        } else {
          solHtml = (q.solutionText||'').replace(/\n\n/g,'<br><br>');
        }
        // Options rendering - supports Try First selectable state
        let optionsHtml = '';
        if (q.options && Array.isArray(q.options) && q.options.length>0) {
          optionsHtml = '<div class=\"example-options\" role=\"radiogroup\" aria-label=\"Answer choices for Example ' + n + '\">';
          q.options.forEach((opt, oi)=>{
            const label = String.fromCharCode(65+oi);
            let optText = typeof opt === 'string' ? opt : (opt.text || opt.label || JSON.stringify(opt));
            if (window.ContinuaRenderer && window.ContinuaRenderer.renderMarkdown) {
              optText = window.ContinuaRenderer.renderMarkdown(optText).replace(/^<p>/,'').replace(/<\/p>$/,'');
            }
            optionsHtml += '<button type=\"button\" class=\"option-choice\" role=\"radio\" aria-checked=\"false\" data-opt=\"' + oi + '\" aria-label=\"Option ' + label + '\"><span class=\"options-label\">' + label + '.</span><span class=\"option-text\">' + optText + '</span></button>';
          });
          optionsHtml += '</div>';
        }
        const solutionId = 'solution-' + n;
        html += '<article class=\"question-entry\" id=\"' + anchorId + '\" data-num=\"' + n + '\">'
              + '<div class=\"question-header\"><h3 class=\"question-heading\">Example ' + n + '</h3></div>'
              + '<div class=\"question-body\">' + qHtml + '</div>'
              + optionsHtml
              + '<div class=\"try-first-controls\"><button type=\"button\" class=\"show-solution-btn\" aria-expanded=\"false\" aria-controls=\"' + solutionId + '\"><span>Show Solution</span><svg class=\"solution-chevron\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><polyline points=\"6 9 12 15 18 9\"></polyline></svg></button></div>'
              + '<div class=\"solution-block\" id=\"' + solutionId + '\"><span class=\"solution-label\">Solution</span><div class=\"solution-content\">' + solHtml + '</div></div>'
              + '</article>';
        if(idx < questions.length-1) html += '<hr class=\"question-divider\">';
      });
      drawerHtml += '</div></div>';
      container.innerHTML = html;
      if(drawerBody) drawerBody.innerHTML = drawerHtml;
      // Populate breadcrumb example picker
      const pickerGrid = document.getElementById('examplePickerGrid');
      const currentExampleLabelEl = document.getElementById('currentExampleLabel');
      if(pickerGrid){
        let pickerHtml='';
        questions.forEach(q=>{
          const n=q.displayOrder;
          const anchorId='example-'+n;
          const formatted=String(n).padStart(2,'0');
          const isActive = n===questions[0].displayOrder;
          pickerHtml+='<a href="#'+anchorId+'" class="example-picker-tile'+(isActive?' active':'')+'" data-target="'+anchorId+'">'+formatted+'</a>';
        });
        pickerGrid.innerHTML=pickerHtml;
        pickerGrid.querySelectorAll('.example-picker-tile').forEach(tile=>{
          tile.addEventListener('click', ()=>{
            const dd=document.getElementById('examplePickerDropdown');
            const btn=document.getElementById('currentExampleBtn');
            if(dd) dd.classList.remove('open');
            if(btn) btn.setAttribute('aria-expanded','false');
            if(dd) dd.setAttribute('aria-hidden','true');
          });
        });
      }
      if(currentExampleLabelEl) currentExampleLabelEl.textContent='Example '+questions[0].displayOrder;
      // Attach drawer link handlers
      if(drawerBody){
        drawerBody.querySelectorAll('.drawer-q-link').forEach(link=>{
          link.addEventListener('click', ()=>{
            if(window.innerWidth<=900 && closeDrawerFn) closeDrawerFn();
          });
        });
      }
      // KaTeX
      if(window.ContinuaRenderer && window.ContinuaRenderer.renderMath){
        window.ContinuaRenderer.renderMath(container);
      } else if(window.renderMathInElement){
        renderMathInElement(container, {delimiters:[{left:'$$',right:'$$',display:true},{left:'\\[',right:'\\]',display:true},{left:'\\(',right:'\\)',display:false},{left:'$',right:'$',display:false}],throwOnError:false});
      }
      // Highlight and scrollspy
      setupScrollSpy(questions);
      handleHash();
      window.addEventListener('hashchange', handleHash);
    }

    function setupScrollSpy(questions){
      const entries = document.querySelectorAll('.question-entry');
      if(!entries.length || !('IntersectionObserver' in window)) return;
      const observer = new IntersectionObserver((ents)=>{
        ents.forEach(e=>{
          if(e.isIntersecting){
            const num = e.target.getAttribute('data-num');
            // Mark active in drawer
            document.querySelectorAll('.drawer-q-link').forEach(l=>{
              const target = l.getAttribute('data-target');
              if(target === 'example-'+num) l.classList.add('active');
              else l.classList.remove('active');
            });
            if(window._updateCurrentExample) window._updateCurrentExample(num);
          }
        });
      }, {rootMargin:'-90px 0px -55% 0px'});
      entries.forEach(el=>observer.observe(el));
      const bc=document.querySelector('.breadcrumb-section');
      function onScroll(){ if(!bc) return; if(window.innerWidth<=768){ if(window.scrollY>45) bc.classList.add('is-compact'); else bc.classList.remove('is-compact'); } else bc.classList.remove('is-compact'); }
      window.addEventListener('scroll', onScroll, {passive:true});
      window.addEventListener('resize', onScroll, {passive:true});
      onScroll();
    }
    function handleHash(){
      const hash = window.location.hash.replace('#','');
      if(!hash) return;
      const el = document.getElementById(hash);
      if(el){
        el.scrollIntoView({behavior:'smooth', block:'start'});
        el.classList.add('highlight-pulse');
        setTimeout(()=> el.classList.remove('highlight-pulse'), 2000);
      }
    }