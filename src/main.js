import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  // Sticky Navbar
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Smooth Scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // adjust for navbar height
        const offsetTop = targetElement.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // Scroll Reveal Animation (Intersection Observer)
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      } else {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  revealElements.forEach(el => {
    revealOnScroll.observe(el);
  });

  // Lightbox functionality for Gallery
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxVideo = document.getElementById('lightbox-video');
  const closeBtn = document.querySelector('.close-lightbox');

  galleryItems.forEach(item => {
    item.addEventListener('click', (e) => {
      // Don't open lightbox if they clicked directly on a video tag's controls
      if (e.target.tagName.toLowerCase() === 'video') return;

      const src = item.getAttribute('data-src');
      if (!src) return; // Skip if no data-src

      const type = item.getAttribute('data-type');
      
      if (type === 'video') {
        lightboxImg.style.display = 'none';
        lightboxVideo.style.display = 'block';
        lightboxVideo.src = src;
        lightboxVideo.play();
      } else {
        lightboxVideo.style.display = 'none';
        lightboxVideo.pause();
        lightboxVideo.src = '';
        lightboxImg.style.display = 'block';
        lightboxImg.src = src;
      }
      
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden'; // prevent scrolling behind
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto'; // re-enable scrolling
    if(lightboxVideo) {
      lightboxVideo.pause();
      lightboxVideo.src = '';
    }
  };

  if(closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if(lightbox) lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Close lightbox on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
  
  // Mobile Menu Toggle (Basic implementation)
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if(mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      if (navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
      } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = 'white';
        navLinks.style.padding = '1rem';
        navLinks.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      }
    });
  }

  // Hover-to-play for desktop, tap-to-play for mobile
  const galleryVideos = document.querySelectorAll('.gallery-grid video');
  const isTouchDevice = () => window.matchMedia('(hover: none)').matches;

  galleryVideos.forEach(video => {
    // Ensure video is fully loaded/ready (fixes vid3 mobile issue)
    video.load();

    if (!isTouchDevice()) {
      // Desktop: play on hover, pause on leave
      video.addEventListener('mouseenter', () => {
        // Pause all other videos first
        galleryVideos.forEach(v => { if (v !== video && !v.paused) v.pause(); });
        video.play().catch(() => {});
      });
      video.addEventListener('mouseleave', () => {
        video.pause();
      });
    } else {
      // Mobile: tap to toggle play/pause
      video.addEventListener('click', () => {
        if (video.paused) {
          // Pause all others
          galleryVideos.forEach(v => { if (v !== video && !v.paused) v.pause(); });
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }
  });

  // Service Tab Switching
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');

      // Update buttons
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Update panels
      tabPanels.forEach(panel => {
        panel.classList.remove('active');
      });
      const activePanel = document.getElementById(`panel-${target}`);
      if (activePanel) {
        activePanel.classList.add('active');

        // Re-trigger scroll-reveal for newly visible cards
        const newCards = activePanel.querySelectorAll('.scroll-reveal:not(.visible)');
        newCards.forEach(el => revealOnScroll.observe(el));
      }
    });
  });

  // Contact Form to WhatsApp
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const message = document.getElementById('contact-message').value;
      
      const whatsappNumber = '233544026418';
      const text = `Hello Kleenit Ghana,\n\nMy name is ${name} (${email}).\n\n${message}`;
      const encodedText = encodeURIComponent(text);
      
      window.open(`https://wa.me/${whatsappNumber}?text=${encodedText}`, '_blank');
    });
  }
});
