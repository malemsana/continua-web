document.addEventListener('DOMContentLoaded', () => {
      // 1. Mobile Hamburger Menu Toggle
      const mobileMenuBtn = document.getElementById('mobileMenuBtn');
      const mobileNav = document.getElementById('mobileNav');

      if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
          const isOpen = mobileNav.classList.toggle('open');
          mobileMenuBtn.setAttribute('aria-expanded', isOpen);
          mobileNav.setAttribute('aria-hidden', !isOpen);
        });

        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
            mobileNav.classList.remove('open');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            mobileNav.setAttribute('aria-hidden', 'true');
            mobileMenuBtn.focus();
          }
        });
      }

      // 2. Three Dots More Options Menu
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

        // Close on outside click
        document.addEventListener('click', (e) => {
          if (!moreMenuBtn.contains(e.target) && !moreMenuDropdown.contains(e.target)) {
            moreMenuDropdown.classList.remove('open');
            moreMenuBtn.setAttribute('aria-expanded', 'false');
            moreMenuDropdown.setAttribute('aria-hidden', 'true');
          }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && moreMenuDropdown.classList.contains('open')) {
            moreMenuDropdown.classList.remove('open');
            moreMenuBtn.setAttribute('aria-expanded', 'false');
            moreMenuDropdown.setAttribute('aria-hidden', 'true');
            moreMenuBtn.focus();
          }
        });

        // Copy link action
        if (menuCopyLinkBtn && copyLinkTitle) {
          menuCopyLinkBtn.addEventListener('click', async () => {
            try {
              await navigator.clipboard.writeText(window.location.href);
              const original = copyLinkTitle.textContent;
              copyLinkTitle.textContent = 'Link Copied!';
              setTimeout(() => {
                copyLinkTitle.textContent = original;
                moreMenuDropdown.classList.remove('open');
                moreMenuBtn.setAttribute('aria-expanded', 'false');
              }, 1200);
            } catch (err) {
              console.warn('Clipboard write failed:', err);
            }
          });
        }

        // Print action
        if (menuPrintBtn) {
          menuPrintBtn.addEventListener('click', () => {
            moreMenuDropdown.classList.remove('open');
            moreMenuBtn.setAttribute('aria-expanded', 'false');
            window.print();
          });
        }
      }

      // 3. Fetch PDF as Blob and Render Inline
      const PDF_SRC = 'https://raw.githubusercontent.com/malemsana/continua-resource/main/c10/math/ch1/c10_mathemat_ch1_ncert.pdf';
      
      const loader = document.getElementById('pdfLoadingState');
      const frame = document.getElementById('pdfFrame');
      const fallback = document.getElementById('pdfFallback');
      const openTabBtn = document.getElementById('openTabBtn');
      const menuDownloadBtn = document.getElementById('menuDownloadBtn');
      const fallbackOpenBtn = document.getElementById('fallbackOpenBtn');
      const fallbackDownloadBtn = document.getElementById('fallbackDownloadBtn');

      async function initPdfBlob() {
        try {
          const response = await fetch(PDF_SRC);
          if (!response.ok) throw new Error('HTTP ' + response.status);
          
          const blob = await response.blob();
          const pdfBlob = new Blob([blob], { type: 'application/pdf' });
          const blobUrl = URL.createObjectURL(pdfBlob);

          if (frame) {
            frame.src = blobUrl;
            frame.style.display = 'block';
          }
          if (loader) {
            loader.style.display = 'none';
          }

          // Update action links to direct blob URL
          if (openTabBtn) openTabBtn.href = blobUrl;
          if (menuDownloadBtn) menuDownloadBtn.href = blobUrl;
          if (fallbackOpenBtn) fallbackOpenBtn.href = blobUrl;
          if (fallbackDownloadBtn) fallbackDownloadBtn.href = blobUrl;
        } catch (err) {
          console.warn('Blob fetch failed, showing fallback options:', err);
          if (loader) loader.style.display = 'none';
          if (fallback) fallback.style.display = 'flex';
        }
      }

      initPdfBlob();
    });