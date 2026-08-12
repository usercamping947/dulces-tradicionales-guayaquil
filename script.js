/**
 * University Graduation Project Website
 * Title: "Revalorization of Two Traditional Sweets from Guayaquil"
 * Custom Interactive Logic (script.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // 1. PRELOADER & INITIAL ANIMS
  // ==========================================================================
  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.visibility = 'hidden';
        preloader.style.display = 'none';
        // Initialize scroll animations (AOS) after preloader is gone
        if (typeof AOS !== 'undefined') {
          AOS.init({
            duration: 1000,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100
          });
        }
      }, 800);
    }
  });

  // Fallback if load event takes too long
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader && preloader.style.display !== 'none') {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.visibility = 'hidden';
        preloader.style.display = 'none';
      }, 800);
    }
  }, 3000);


  // ==========================================================================
  // 2. DUAL-THEME SWITCHER (LIGHT/DARK MODE)
  // ==========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme');

  // Set initial theme based on local storage or system preference
  if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
  } else {
    // Default to dark theme as it feels extremely luxurious and museum-like
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      let theme = document.documentElement.getAttribute('data-theme');
      if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
      
      // Update Google Maps if iframe exists (dark mode inversion is handled in CSS)
      triggerMapRefresh();
    });
  }

  function triggerMapRefresh() {
    const mapIframe = document.querySelector('.map-container iframe');
    if (mapIframe) {
      // Small redraw trigger
      const src = mapIframe.src;
      mapIframe.src = '';
      mapIframe.src = src;
    }
  }


  // ==========================================================================
  // 3. STICKY NAVBAR, SCROLL PROGRESS & BACK TO TOP
  // ==========================================================================
  const navbar = document.querySelector('.custom-navbar');
  const progressBar = document.querySelector('.scroll-progress-bar');
  const backToTopBtn = document.getElementById('back-to-top');
  const heroBackground = document.querySelector('.hero-background');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Navbar styling on scroll
    if (navbar) {
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Scroll progress indicator
    if (progressBar && docHeight > 0) {
      const scrollPercent = (scrollY / docHeight) * 100;
      progressBar.style.width = `${scrollPercent}%`;
    }

    // Back to top visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }

    // Parallax hero background effect
    if (heroBackground) {
      // Limit parallax effect to the hero height area for performance
      if (scrollY < window.innerHeight) {
        const speed = 0.4;
        heroBackground.style.transform = `translateY(${scrollY * speed}px) scale(1.05)`;
      }
    }
  });

  // Smooth scroll back to top
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  // ==========================================================================
  // 4. ACTIVE SECTION OBSERVER (NAVBAR INDICATION)
  // ==========================================================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.custom-navbar .nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Focus on central viewport area
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });


  // ==========================================================================
  // 5. AUDIOVISUAL ARCHIVE (MODAL VIDEO LOADER)
  // ==========================================================================
  const videoModal = document.getElementById('videoModal');
  const videoPlayerContainer = document.getElementById('videoPlayerContainer');

  if (videoModal && videoPlayerContainer) {
    // When modal is shown
    videoModal.addEventListener('show.bs.modal', (event) => {
      const button = event.relatedTarget; // Button that triggered the modal
      const videoType = button.getAttribute('data-video-type');
      const videoSrc = button.getAttribute('data-video-src');
      const videoTitle = button.getAttribute('data-video-title');
      
      // Update modal title
      const modalTitleEl = videoModal.querySelector('.modal-title');
      if (modalTitleEl) modalTitleEl.textContent = videoTitle || 'Audiovisual Archive';

      // Load appropriate player
      if (videoType === 'youtube') {
        videoPlayerContainer.innerHTML = `
          <div class="ratio ratio-16x9">
            <iframe src="https://www.youtube.com/embed/${videoSrc}?autoplay=1&rel=0" 
                    title="${videoTitle}" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
            </iframe>
          </div>`;
      } else if (videoType === 'local') {
        videoPlayerContainer.innerHTML = `
          <div class="ratio ratio-16x9">
            <video controls autoplay class="w-100 h-100">
              <source src="${videoSrc}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </div>`;
      }
    });

    // When modal is hidden, clean innerHTML to stop playback
    videoModal.addEventListener('hide.bs.modal', () => {
      videoPlayerContainer.innerHTML = '';
    });
  }


  // ==========================================================================
  // 6. PHOTO GALLERY FILTERING & CUSTOM LIGHTBOX
  // ==========================================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('customLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let activeImages = []; // List of images currently visible based on active filter
  let currentIndex = 0;   // Current active image index in the lightbox

  // Category Filtering
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Set active button
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      // Animate filter change
      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
      
      // Update the active images reference for lightbox
      setTimeout(updateActiveImages, 350);
    });
  });

  function updateActiveImages() {
    activeImages = [];
    galleryItems.forEach(item => {
      if (item.style.display !== 'none') {
        const img = item.querySelector('img');
        const title = item.querySelector('.gallery-item-title')?.textContent || '';
        const cat = item.getAttribute('data-category-label') || '';
        activeImages.push({
          src: img.getAttribute('src'),
          title: title,
          category: cat
        });
      }
    });
  }

  // Initial update of active images
  updateActiveImages();

  // Custom Lightbox Open
  galleryItems.forEach(item => {
    const zoomIcon = item.querySelector('.gallery-zoom-icon');
    const trigger = zoomIcon || item; // Click on zoom icon or card itself
    
    trigger.addEventListener('click', (e) => {
      // If clicking the zoom icon, stop propagation so card click doesn't double trigger
      if (zoomIcon) {
        e.stopPropagation();
      }
      
      const img = item.querySelector('img');
      const src = img.getAttribute('src');
      
      // Find the index of this image in our active list
      currentIndex = activeImages.findIndex(imgObj => imgObj.src === src);
      
      if (currentIndex !== -1) {
        openLightbox();
      }
    });
  });

  function openLightbox() {
    if (!lightbox || !lightboxImg) return;
    
    const currentImg = activeImages[currentIndex];
    lightboxImg.setAttribute('src', currentImg.src);
    if (lightboxTitle) lightboxTitle.textContent = currentImg.title;
    if (lightboxCategory) lightboxCategory.textContent = currentImg.category;
    
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden'; // Disable page scrolling
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('show');
    document.body.style.overflow = 'auto'; // Re-enable page scrolling
  }

  function showNextImage() {
    if (activeImages.length <= 1) return;
    currentIndex = (currentIndex + 1) % activeImages.length;
    openLightbox();
  }

  function showPrevImage() {
    if (activeImages.length <= 1) return;
    currentIndex = (currentIndex - 1 + activeImages.length) % activeImages.length;
    openLightbox();
  }

  // Lightbox Event Listeners
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);

  // Close when clicking background outside content
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (lightbox && lightbox.classList.contains('show')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNextImage();
      if (e.key === 'ArrowLeft') showPrevImage();
    }
  });


  // ==========================================================================
  // 7. BIBLIOGRAPHY COPY CITATION TO CLIPBOARD
  // ==========================================================================
  const copyButtons = document.querySelectorAll('.bib-copy-btn');
  
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.bibliography-card');
      const citationText = card.querySelector('.bib-citation').textContent.trim();
      
      navigator.clipboard.writeText(citationText).then(() => {
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.borderColor = 'var(--accent-gold)';
        btn.style.color = 'var(--accent-gold)';
        
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.borderColor = '';
          btn.style.color = '';
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    });
  });

});
