document.addEventListener('DOMContentLoaded',()=>{
      const btn=document.getElementById('mobileMenuBtn');
      const nav=document.getElementById('mobileNav');
      if(btn&&nav){btn.addEventListener('click',()=>{const o=nav.classList.toggle('open');btn.setAttribute('aria-expanded',o);nav.setAttribute('aria-hidden',!o)})}
      const bc=document.querySelector('.breadcrumb-section');
      function onScroll(){if(!bc)return;if(window.innerWidth<=768){if(window.scrollY>45)bc.classList.add('is-compact');else bc.classList.remove('is-compact')}else bc.classList.remove('is-compact')}
      window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll,{passive:true});onScroll();
      // Floaters must not overlay footer
      const floaterEls = [document.getElementById('openDrawerBtn'), document.getElementById('moreMenuWrapper'), document.getElementById('floatingTryFirst')].filter(Boolean);
      const footerEl = document.querySelector('.global-footer');
      function updateFloaterFooter(){ if(!footerEl || !floaterEls.length) return; const shouldHide = footerEl.getBoundingClientRect().top < window.innerHeight + 24; floaterEls.forEach(el=>{ if(shouldHide) el.classList.add('floater-hidden'); else el.classList.remove('floater-hidden'); }); }
      window.addEventListener('scroll', updateFloaterFooter, {passive:true}); window.addEventListener('resize', updateFloaterFooter, {passive:true}); window.addEventListener('load', updateFloaterFooter); updateFloaterFooter();
    });