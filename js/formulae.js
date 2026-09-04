document.addEventListener('DOMContentLoaded', async () => {
      // Mobile header menu
      const mobileMenuBtn = document.getElementById('mobileMenuBtn');
      const mobileNav = document.getElementById('mobileNav');
      if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
          const isOpen = mobileNav.classList.toggle('open');
          mobileMenuBtn.setAttribute('aria-expanded', isOpen);
          mobileNav.setAttribute('aria-hidden', !isOpen);
        });
      }
      // Three-dots menu
      const moreMenuBtn = document.getElementById('moreMenuBtn');
      const moreMenuDropdown = document.getElementById('moreMenuDropdown');
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
        if (menuCopyLinkBtn && copyLinkTitle) {
          menuCopyLinkBtn.addEventListener('click', async () => {
            try {
              await navigator.clipboard.writeText(window.location.href);
              copyLinkTitle.textContent = 'Link Copied!';
              setTimeout(() => {
                copyLinkTitle.textContent = 'Copy Formulae Link';
                moreMenuDropdown.classList.remove('open');
              }, 1200);
            } catch (e) {}
          });
        }
        if (menuPrintBtn) {
          menuPrintBtn.addEventListener('click', () => {
            moreMenuDropdown.classList.remove('open');
            window.print();
          });
        }
      }
      // Breadcrumb compact on scroll (reuse Solutions behaviour)
      const breadcrumbSection = document.querySelector('.breadcrumb-section');
      function onScroll() {
        if (!breadcrumbSection) return;
        if (window.innerWidth <= 768) {
          if (window.scrollY > 45) breadcrumbSection.classList.add('is-compact');
          else breadcrumbSection.classList.remove('is-compact');
        } else {
          breadcrumbSection.classList.remove('is-compact');
        }
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      onScroll();

      // Load Formulae JSON — try assets path, then root path, then fallback
      const formulaEl = document.getElementById('formulaContent');
      const breadcrumbNameEl = document.getElementById('breadcrumbResourceName');
      const subtitleEl = document.getElementById('formulaSubtitle');

      let data = null;
      const candidates = ['assets/c10_mathemat_ch1_formula.json', 'c10_mathemat_ch1_formula.json', '/continua-web/c10_mathemat_ch1_formula.json'];
      for (const url of candidates) {
        try {
          const res = await fetch(url);
          if (res.ok) { data = await res.json(); break; }
        } catch (e) { /* try next */ }
      }
      // Ultimate fallback for file://
      if (!data && typeof FALLBACK_FORMULA_DATA !== 'undefined') data = FALLBACK_FORMULA_DATA;

      if (!data || !data.markdownContent) {
        if (formulaEl) formulaEl.innerHTML = '<p style="color:#dc2626;">Unable to load formulae. Please refresh.</p>';
        return;
      }

      if (breadcrumbNameEl && data.friendlyName) breadcrumbNameEl.textContent = data.friendlyName;
      if (subtitleEl && data.friendlyName) subtitleEl.textContent = data.friendlyName + ' \u2022 Class 10 Mathematics';
      document.title = 'Class 10 Mathematics Chapter 1 Real Numbers ' + data.friendlyName + ' \u2014 Continua';

      // Render via shared renderer
      const raw = data.markdownContent;
      let html = '';
      if (window.ContinuaRenderer && window.ContinuaRenderer.renderMarkdown) {
        html = window.ContinuaRenderer.renderMarkdown(raw);
      } else {
        // Fallback minimal
        html = '<p>' + raw.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>') + '</p>';
      }
      formulaEl.innerHTML = html;

      // KaTeX rendering via shared pipeline
      if (window.ContinuaRenderer && window.ContinuaRenderer.renderMath) {
        window.ContinuaRenderer.renderMath(formulaEl);
      } else if (window.renderMathInElement) {
        window.renderMathInElement(formulaEl, {
          delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '\\[', right: '\\]', display: true},
            {left: '\\(', right: '\\)', display: false},
            {left: '$', right: '$', display: false}
          ],
          throwOnError: false
        });
      }

      // Floaters must not overlay footer
      const floaterEl = document.getElementById('moreMenuWrapper');
      const footerEl = document.querySelector('.global-footer');
      function updateFloaterFooter(){
        if(!footerEl || !floaterEl) return;
        const shouldHide = footerEl.getBoundingClientRect().top < window.innerHeight + 24;
        if(shouldHide) floaterEl.classList.add('floater-hidden');
        else floaterEl.classList.remove('floater-hidden');
      }
      window.addEventListener('scroll', updateFloaterFooter, {passive:true});
      window.addEventListener('resize', updateFloaterFooter, {passive:true});
      window.addEventListener('load', updateFloaterFooter);
      updateFloaterFooter();

      // Escape key closes dropdown
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && moreMenuDropdown) {
          moreMenuDropdown.classList.remove('open');
          if (moreMenuBtn) moreMenuBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Fallback data for local file:// access
    const FALLBACK_FORMULA_DATA = {
      "id": "c10_mathemat_ch1_formula",
      "chapterId": "c10_mathemat_ch1",
      "friendlyName": "Formulae Sheet",
      "markdownContent": "# Real Numbers \u2014 Formula Sheet\n\n## Fundamental Theorem of Arithmetic\n\n**Prime Factorisation Form**\n\nNormal text containing inline mathematics:\n\nEvery composite number $x$ can be uniquely expressed as a product of prime powers:\n\n$$\nx = p_1^{k_1} \\cdot p_2^{k_2} \\cdots p_n^{k_n}\n$$\n\nwhere:\n\n* $p_1 < p_2 < \\dots < p_n$ are prime numbers\n* $k_i \\ge 1$ are positive integers\n* The exponent $k_i$ uses *superscript* notation and $p_1$ uses _subscript_ notation\n* Visit [NCERT Official](https://ncert.nic.in) for reference\n* Inline image: ![Real Numbers](assets/maths_icon-opt.webp)\n\n> This factorisation is unique up to the order of the factors.\n\n---\n\n## HCF and LCM\n\n### Two Numbers\n\nFor any two positive integers $a$ and $b$:\n\n$$\n\\text{HCF}(a,b) \\times \\text{LCM}(a,b) = a \\times b\n$$\n\n### Three Numbers\n\nFor three positive integers $p$, $q$, $r$:\n\n$$\n\\text{LCM}(p,q,r) =\n\\frac{p \\cdot q \\cdot r \\cdot \\text{HCF}(p,q,r)}\n{\\text{HCF}(p,q) \\cdot \\text{HCF}(q,r) \\cdot \\text{HCF}(p,r)}\n$$\n\n$$\n\\text{HCF}(p,q,r) =\n\\frac{p \\cdot q \\cdot r \\cdot \\text{LCM}(p,q,r)}\n{\\text{LCM}(p,q) \\cdot \\text{LCM}(q,r) \\cdot \\text{LCM}(p,r)}\n$$\n\n> **Note:** The simple product formula $\\text{HCF} \\times \\text{LCM} = a \\times b$ does **not** extend directly to three or more numbers.\n\n---\n\n## Irrational Numbers\n\n### Square Roots of Non-Perfect Squares\n\nIf $p$ is a prime number, then $\\sqrt{p}$ is irrational.\n\nMore generally, if $n$ is a positive integer that is **not a perfect square**, then $\\sqrt{n}$ and $\\sqrt{2}\\pm\\sqrt{3}$ are _irrational_.\n\nThe condition $\\sqrt{p}\\ne\\frac{a}{b}$ holds for any integers $a,b$.\n\n### Rational + Irrational\n\n* The sum of a rational number and an irrational number is irrational.\n* The product of a non-zero rational number and an irrational number is irrational.\n* $\\sqrt{p}$ where $p$ is prime is irrational \u2014 e.g. $\\frac{1}{\\sqrt{2}}$ is irrational inside list\n\nExamples:\n\n* $\\frac{1}{\\sqrt{2}}$ is irrational\n* $7\\sqrt{5}$ is irrational\n* $6 + \\sqrt{2}$ is irrational\n* $3 + 2\\sqrt{5}$ is irrational\n\n---\n\n## Rational Numbers and Decimal Expansions\n\n### Terminating Decimals\n\nA rational number $\\frac{p}{q}$ (in lowest terms) has a **terminating decimal expansion** if and only if the prime factorisation of $q$ is of the form $2^m \\cdot 5^n$, where $m, n \\ge 0$.\n\n### Non-Terminating Repeating Decimals\n\nIf the prime factorisation of $q$ contains any prime factor other than $2$ or $5$, then $\\frac{p}{q}$ has a **non-terminating repeating decimal expansion**.\n\n---\n\n## Key Results at a Glance\n\n| Concept | Formula / Statement |\n|---|---|\n| Prime factorisation of $x$ | $x = p_1^{k_1} p_2^{k_2} \\cdots p_n^{k_n}$ |\n| HCF $\\times$ LCM (2 numbers) | $\\text{HCF}(a,b) \\times \\text{LCM}(a,b) = a \\times b$ |\n| $\\sqrt{p}$ ($p$ prime) | Irrational |\n| $\\sqrt{n}$ ($n$ not a perfect square) | Irrational |\n| Rational + Irrational | Irrational |\n| Non-zero Rational $\\times$ Irrational | Irrational |\n| Terminating decimal $\\frac{p}{q}$ | $q = 2^m 5^n$ |\n| Repeating decimal $\\frac{p}{q}$ | $q$ has prime factor $\\ne 2,5$ |\n\n---\n\n## Commonly Used Values\n\n* $\\sqrt{2} \\approx 1.414$\n* $\\sqrt{3} \\approx 1.732$\n* $\\sqrt{5} \\approx 2.236$\n* $\\sqrt{6} \\approx 2.449$\n* $\\sqrt{7} \\approx 2.646$\n* $\\sqrt{10} \\approx 3.162$\n\n---\n\n## Escaped Characters\n\nThe price is \\$5 and \\*not italic\\* should remain literal. Escaped \\[ should not start display math.\n\n> **Tip:** For exam questions asking to \"prove that $x$ is irrational,\" the standard approach is proof by contradiction using the Fundamental Theorem of Arithmetic (unique prime factorisation).\n"
    };