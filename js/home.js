document.addEventListener('DOMContentLoaded', () => {
      // 1. Keyboard shortcut '/' to focus search input
      const heroSearchInput = document.getElementById('heroSearchInput');
      const headerSearchInput = document.getElementById('headerSearchInput');

      document.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
          e.preventDefault();
          if (heroSearchInput && window.getComputedStyle(heroSearchInput.closest('.hero-section')).display !== 'none') {
            heroSearchInput.focus();
          } else if (headerSearchInput) {
            headerSearchInput.focus();
          }
        }
      });

      // 2. Expand/Collapse "View more classes"
      const toggleBtn = document.getElementById('toggleClassesBtn');
      const toggleText = document.getElementById('toggleClassesText');
      const moreClasses = document.getElementById('moreClasses');

      if (toggleBtn && moreClasses) {
        toggleBtn.addEventListener('click', () => {
          const isExpanded = moreClasses.classList.toggle('expanded');
          toggleBtn.classList.toggle('expanded', isExpanded);
          toggleBtn.setAttribute('aria-expanded', isExpanded);
          toggleText.textContent = isExpanded ? 'View fewer classes' : 'View more classes';
        });
      }

        // 3. Global search -> Search Results Page (authoritative)
      function navigateToSearch(q){
        const trimmed = (q||'').trim();
        location.href = '/continua-web/search.html?q=' + encodeURIComponent(trimmed);
      }
      const heroForm = document.querySelector('.hero-search-form');
      if(heroForm && heroSearchInput){
        heroForm.addEventListener('submit', e=>{
          e.preventDefault();
          navigateToSearch(heroSearchInput.value);
        });
      }
      if(headerSearchInput){
        headerSearchInput.addEventListener('keydown', e=>{
          if(e.key==='Enter'){
            e.preventDefault();
            navigateToSearch(headerSearchInput.value);
          }
        });
      }
      const mobileSearchInput = document.getElementById('mobileSearchInput');
      if(mobileSearchInput){
        mobileSearchInput.addEventListener('keydown', e=>{
          if(e.key==='Enter'){
            e.preventDefault();
            navigateToSearch(mobileSearchInput.value);
          }
        });
      }

        // 4. Mobile Hamburger Menu Toggle
      const mobileMenuBtn = document.getElementById('mobileMenuBtn');
      const mobileNav = document.getElementById('mobileNav');

      if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
          const isOpen = mobileNav.classList.toggle('open');
          mobileMenuBtn.setAttribute('aria-expanded', isOpen);
          mobileNav.setAttribute('aria-hidden', !isOpen);
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
            mobileNav.classList.remove('open');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            mobileNav.setAttribute('aria-hidden', 'true');
            mobileMenuBtn.focus();
          }
        });
      }
    });