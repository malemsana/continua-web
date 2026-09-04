// Global — shared header/footer/navigation behavior
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('mobileNav');
  if (btn && nav) {
    btn.addEventListener('click', () => {
      const o = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', o);
      nav.setAttribute('aria-hidden', !o);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        nav.setAttribute('aria-hidden', 'true');
        btn.focus();
      }
    });
  }
});
