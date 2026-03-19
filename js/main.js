/* ====================================
   STUDIO ZEN PAY - Landing Page Scripts
   ==================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Respect reduced motion preference ----
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ========== AOS INITIALIZATION ==========
  AOS.init({
    duration: prefersReducedMotion ? 0 : 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60,
    disable: prefersReducedMotion,
  });

  // ========== HEADER SCROLL BEHAVIOR ==========
  const header = document.getElementById('header');
  let lastScroll = 0;

  const handleScroll = () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run on load

  // ========== MOBILE MENU ==========
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('active');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu on link click
    nav.querySelectorAll('.header__link').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close menu on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('active')) {
        nav.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // ========== SMOOTH SCROLL ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = header.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        window.scrollTo({
          top: targetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      }
    });
  });

  // ========== PRICING TOGGLE ==========
  const pricingToggle = document.getElementById('pricing-toggle');
  const labelMonthly = document.getElementById('label-monthly');
  const labelAnnual = document.getElementById('label-annual');
  const priceAmounts = document.querySelectorAll('.pricing-card__amount');

  let isAnnual = false;

  if (pricingToggle) {
    pricingToggle.addEventListener('click', () => {
      isAnnual = !isAnnual;
      pricingToggle.classList.toggle('active', isAnnual);

      if (isAnnual) {
        labelMonthly.classList.remove('pricing__toggle-label--active');
        labelAnnual.classList.add('pricing__toggle-label--active');
      } else {
        labelMonthly.classList.add('pricing__toggle-label--active');
        labelAnnual.classList.remove('pricing__toggle-label--active');
      }

      priceAmounts.forEach(el => {
        const monthly = el.dataset.monthly;
        const annual = el.dataset.annual;
        const targetValue = isAnnual ? annual : monthly;

        // Animate price change
        el.style.transform = 'scale(0.8)';
        el.style.opacity = '0.3';
        setTimeout(() => {
          el.textContent = targetValue;
          el.style.transform = 'scale(1)';
          el.style.opacity = '1';
        }, 200);
      });
    });
  }

  // ========== FAQ ACCORDION ==========
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-item__question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all items
      faqItems.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
      });

      // Open clicked item (if it wasn't already open)
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ========== NUMBER COUNTER ANIMATION ==========
  const counters = document.querySelectorAll('.social-proof__number, .counter');

  const animateCounter = (element) => {
    const target = parseFloat(element.dataset.target);
    const isDecimal = target % 1 !== 0;
    const duration = 2000;
    const startTime = performance.now();

    const easeOutQuad = t => t * (2 - t);

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuad(progress);
      const currentValue = target * easedProgress;

      if (isDecimal) {
        element.textContent = currentValue.toFixed(1);
      } else if (target >= 1000) {
        element.textContent = Math.floor(currentValue).toLocaleString('pt-BR');
      } else {
        element.textContent = Math.floor(currentValue);
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  };

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  } else {
    // If reduced motion or no IntersectionObserver, just set values
    counters.forEach(el => {
      const target = parseFloat(el.dataset.target);
      if (target % 1 !== 0) {
        el.textContent = target.toFixed(1);
      } else if (target >= 1000) {
        el.textContent = target.toLocaleString('pt-BR');
      } else {
        el.textContent = target;
      }
    });
  }

  // ========== TESTIMONIALS SWIPER ==========
  if (typeof Swiper !== 'undefined') {
    new Swiper('.testimonials__swiper', {
      slidesPerView: 1.1,
      spaceBetween: 16,
      centeredSlides: false,
      loop: false,
      autoplay: {
        delay: 5000,
        disableOnInteraction: true,
        pauseOnMouseEnter: true,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 2.2,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 24,
        },
      },
    });
  }

});
