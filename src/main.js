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

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const offsetTop = targetElement.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // Mobile Menu Toggle
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if(mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // Scroll Reveal Animation
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
  const closeBtn = document.querySelector('.close-lightbox');

  galleryItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const src = item.getAttribute('data-src');
      if (!src) return;

      lightboxImg.style.display = 'block';
      lightboxImg.src = src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  };

  if(closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if(lightbox) lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  // Service Tab Switching
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');

      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      tabPanels.forEach(panel => {
        panel.classList.remove('active');
      });
      const activePanel = document.getElementById(`panel-${target}`);
      if (activePanel) {
        activePanel.classList.add('active');

        const newCards = activePanel.querySelectorAll('.scroll-reveal:not(.visible)');
        newCards.forEach(el => revealOnScroll.observe(el));
      }
    });
  });

  // Booking Form Submission Flow with Turso Database & WhatsApp Handoff
  const bookingForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('booking-submit-btn');
  const errorBanner = document.getElementById('booking-error');
  const errorText = document.getElementById('booking-error-text');
  const retryBtn = document.getElementById('btn-retry-booking');
  const successBanner = document.getElementById('booking-success');
  const refDisplay = document.getElementById('booking-ref-display');
  const manualWhatsAppBtn = document.getElementById('btn-manual-whatsapp');

  // Auto-prefill service if specified on form or in URL
  if (bookingForm) {
    const prefillService = bookingForm.getAttribute('data-prefill-service');
    const serviceSelect = document.getElementById('contact-service');
    if (prefillService && serviceSelect) {
      for (let i = 0; i < serviceSelect.options.length; i++) {
        if (serviceSelect.options[i].value.toLowerCase() === prefillService.toLowerCase()) {
          serviceSelect.selectedIndex = i;
          break;
        }
      }
    }
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    if (serviceParam && serviceSelect) {
      for (let i = 0; i < serviceSelect.options.length; i++) {
        if (serviceSelect.options[i].value.toLowerCase().includes(serviceParam.toLowerCase())) {
          serviceSelect.selectedIndex = i;
          break;
        }
      }
    }
  }

  let isSubmitting = false;

  function clearFieldErrors() {
    ['name', 'phone', 'email', 'service'].forEach(id => {
      const errEl = document.getElementById(`error-${id}`);
      if (errEl) errEl.textContent = '';
      const inputEl = document.getElementById(`contact-${id}`);
      if (inputEl) inputEl.classList.remove('input-invalid');
    });
  }

  function setFieldError(fieldId, errorMsg) {
    const errEl = document.getElementById(`error-${fieldId}`);
    if (errEl) errEl.textContent = errorMsg;
    const inputEl = document.getElementById(`contact-${fieldId}`);
    if (inputEl) inputEl.classList.add('input-invalid');
  }

  function setLoadingState(loading) {
    isSubmitting = loading;
    if (submitBtn) {
      submitBtn.disabled = loading;
      const defaultContent = submitBtn.querySelector('.btn-content-default');
      const loadingContent = submitBtn.querySelector('.btn-content-loading');
      if (defaultContent) defaultContent.style.display = loading ? 'none' : 'inline-flex';
      if (loadingContent) loadingContent.style.display = loading ? 'inline-flex' : 'none';
    }
  }

  async function handleBookingSubmit(e) {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    clearFieldErrors();
    if (errorBanner) errorBanner.style.display = 'none';

    // Extract form fields
    const nameInput = document.getElementById('contact-name');
    const phoneInput = document.getElementById('contact-phone');
    const emailInput = document.getElementById('contact-email');
    const serviceInput = document.getElementById('contact-service');
    const dateInput = document.getElementById('contact-date');
    const timeInput = document.getElementById('contact-time');
    const messageInput = document.getElementById('contact-message');

    const customerName = nameInput ? nameInput.value.trim() : '';
    const customerPhone = phoneInput ? phoneInput.value.trim() : '';
    const customerEmail = emailInput ? emailInput.value.trim() : '';
    const service = serviceInput ? serviceInput.value.trim() : '';
    const bookingDate = dateInput ? dateInput.value.trim() : '';
    const bookingTime = timeInput ? timeInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    // Frontend validation
    let hasError = false;

    if (!customerName || customerName.length < 2) {
      setFieldError('name', 'Please enter your full name (at least 2 characters).');
      hasError = true;
    }

    const cleanPhoneDigits = customerPhone.replace(/\D/g, '');
    if (!customerPhone || cleanPhoneDigits.length < 7) {
      setFieldError('phone', 'Please enter a valid phone number (at least 7 digits).');
      hasError = true;
    }

    if (!service) {
      setFieldError('service', 'Please select a cleaning service from the list.');
      hasError = true;
    }

    if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      setFieldError('email', 'Please enter a valid email address.');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // Set loading state
    setLoadingState(true);

    // Promo Discount Flag
    let promoNotes = '';
    if (isPromoApplied) {
      promoNotes = ' [Promo: 15% November Website Discount Applied (Code: NOV15)]';
    }

    const finalMessage = message ? (message + promoNotes) : (promoNotes ? promoNotes.trim() : undefined);

    const payload = {
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail || undefined,
      service,
      booking_date: bookingDate || undefined,
      booking_time: bookingTime || undefined,
      message: finalMessage
    };

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result || !result.success) {
        // Saving failed: display clear error, retain form data, never open WhatsApp
        const errorMsg = result?.error || 'Unable to connect to booking server. Please check your connection and retry.';
        if (errorText) errorText.textContent = errorMsg;
        if (errorBanner) {
          errorBanner.style.display = 'flex';
          errorBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        setLoadingState(false);
        return;
      }

      // Success: Database confirmed the save!
      const bookingRef = result.booking_reference;

      // Show success feedback
      if (refDisplay) refDisplay.textContent = bookingRef;
      if (successBanner) {
        successBanner.style.display = 'flex';
        successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Build WhatsApp prefilled message
      const whatsappNumber = '233544026418';
      let waMessage = `Hello Kleenit Ghana,\n\nI have booked a service through your website.\n\n`;
      waMessage += `📋 *Booking Reference:* ${bookingRef}\n`;
      waMessage += `👤 *Name:* ${customerName}\n`;
      waMessage += `📞 *Phone:* ${customerPhone}\n`;
      if (customerEmail) waMessage += `✉️ *Email:* ${customerEmail}\n`;
      waMessage += `🧹 *Service:* ${service}\n`;
      if (bookingDate) waMessage += `📅 *Date:* ${bookingDate}\n`;
      if (bookingTime) waMessage += `⏰ *Time:* ${bookingTime}\n`;
      if (isPromoApplied) {
        waMessage += `🎉 *Promotion:* 15% November Website Discount Applied (Code: NOV15)\n`;
      }
      if (message) waMessage += `📝 *Notes:* ${message}\n`;
      waMessage += `\nPlease confirm availability and discounted quote. Thank you!`;

      const encodedText = encodeURIComponent(waMessage);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;

      // Update manual fallback link
      if (manualWhatsAppBtn) {
        manualWhatsAppBtn.href = whatsappUrl;
      }

      // Record WhatsApp handoff attempt in backend
      fetch('/api/bookings/track-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_reference: bookingRef })
      }).catch(err => console.warn('Could not record WhatsApp handoff event:', err));

      // Attempt to open WhatsApp in a new tab
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 300);

      // Reset form fields after confirmed save
      bookingForm.reset();
      setLoadingState(false);

    } catch (err) {
      console.error('Booking submission network error:', err);
      if (errorText) {
        errorText.textContent = 'Network or database connection error. Your details have been preserved. Please click Retry.';
      }
      if (errorBanner) {
        errorBanner.style.display = 'flex';
        errorBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      setLoadingState(false);
    }
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', handleBookingSubmit);
  }

  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      handleBookingSubmit();
    });
  }

  // ============================================================================
  // NOVEMBER 15% DISCOUNT PROMOTION POPUP & FLOATING BADGE
  // ============================================================================
  const promoModal = document.getElementById('promo-popup-modal');
  const promoFloatBadge = document.getElementById('promo-floating-badge');
  const btnClosePromo = document.getElementById('btn-close-promo');
  const btnDismissPromo = document.getElementById('btn-dismiss-promo');
  const btnClaimPromo = document.getElementById('btn-claim-promo');
  const btnCopyPromo = document.getElementById('btn-copy-promo');
  const promoCodeText = document.getElementById('promo-code-text');
  const promoAppliedBadge = document.getElementById('booking-promo-applied');
  const btnRemovePromo = document.getElementById('btn-remove-promo');

  let isPromoApplied = sessionStorage.getItem('kleenit_promo_applied') === 'true';

  function updatePromoBadge() {
    if (promoAppliedBadge) {
      promoAppliedBadge.style.display = isPromoApplied ? 'flex' : 'none';
    }
  }

  function showPromoModal() {
    if (promoModal) {
      promoModal.style.display = 'flex';
    }
  }

  function hidePromoModal() {
    if (promoModal) {
      promoModal.style.display = 'none';
    }
  }

  // Initial state check
  updatePromoBadge();

  // Auto-display popup after 2.5 seconds if not previously dismissed in this session
  const promoDismissed = sessionStorage.getItem('kleenit_promo_dismissed');
  if (!promoDismissed) {
    setTimeout(() => {
      showPromoModal();
    }, 2500);
  }

  // Close / Dismiss handlers
  if (btnClosePromo) {
    btnClosePromo.addEventListener('click', () => {
      hidePromoModal();
      sessionStorage.setItem('kleenit_promo_dismissed', 'true');
    });
  }

  if (btnDismissPromo) {
    btnDismissPromo.addEventListener('click', () => {
      hidePromoModal();
      sessionStorage.setItem('kleenit_promo_dismissed', 'true');
    });
  }

  if (promoModal) {
    promoModal.addEventListener('click', (e) => {
      if (e.target === promoModal) {
        hidePromoModal();
        sessionStorage.setItem('kleenit_promo_dismissed', 'true');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && promoModal.style.display === 'flex') {
        hidePromoModal();
      }
    });
  }

  // Floating badge to reopen promo anytime
  if (promoFloatBadge) {
    promoFloatBadge.addEventListener('click', () => {
      showPromoModal();
    });
  }

  // Copy Promo Code
  if (btnCopyPromo && promoCodeText) {
    btnCopyPromo.addEventListener('click', () => {
      navigator.clipboard.writeText(promoCodeText.textContent.trim()).then(() => {
        btnCopyPromo.innerHTML = '<i class="fa-solid fa-check" style="color: #10b981;"></i>';
        setTimeout(() => {
          btnCopyPromo.innerHTML = '<i class="fa-regular fa-copy"></i>';
        }, 2000);
      });
    });
  }

  // Claim Promo Button -> Apply discount, scroll to booking form
  if (btnClaimPromo) {
    btnClaimPromo.addEventListener('click', () => {
      isPromoApplied = true;
      sessionStorage.setItem('kleenit_promo_applied', 'true');
      sessionStorage.setItem('kleenit_promo_dismissed', 'true');
      hidePromoModal();
      updatePromoBadge();

      // Smooth scroll to booking section
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        // Focus name field
        setTimeout(() => {
          const nameInput = document.getElementById('contact-name');
          if (nameInput) nameInput.focus();
        }, 600);
      }
    });
  }

  // Remove applied promotion
  if (btnRemovePromo) {
    btnRemovePromo.addEventListener('click', () => {
      isPromoApplied = false;
      sessionStorage.removeItem('kleenit_promo_applied');
      updatePromoBadge();
    });
  }
});

