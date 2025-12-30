/*
  YFYD — Youth For Youth Development
  Vanilla JS for interactions, accessibility, and micro-animations.
*/

(function () {
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Current year in footer
  const yearEl = qs('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = qs('.nav-toggle');
  const siteNav = qs('#site-nav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const open = siteNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });

    // Close menu on link click (mobile)
    siteNav.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      if (siteNav.classList.contains('open')) {
        siteNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Smooth scroll with accessible focus management
  qsa('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const targetId = a.getAttribute('href').slice(1);
      if (!targetId) return;
      const targetEl = qs(`#${CSS.escape(targetId)}`);
      if (!targetEl) return;
      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Move focus for screen readers
      targetEl.setAttribute('tabindex', '-1');
      targetEl.focus({ preventScroll: true });
    });
  });

  // Intersection-based reveal animations
  const animateEls = qsa('[data-animate]');
  if ('IntersectionObserver' in window && animateEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    animateEls.forEach((el) => io.observe(el));
  } else {
    // Fallback: show all
    animateEls.forEach((el) => el.classList.add('in-view'));
  }

  // Active nav state based on scroll position
  const sections = qsa('main section[id]');
  const navLinks = qsa('.site-nav a');
  const setActive = (id) => {
    navLinks.forEach((l) => {
      const href = l.getAttribute('href');
      const isMatch = href === `#${id}`;
      l.setAttribute('aria-current', isMatch ? 'page' : 'false');
    });
  };
  const spy = () => {
    let current = sections[0]?.id || 'home';
    const scrollY = window.scrollY + 120; // offset for sticky header
    for (const sec of sections) {
      if (sec.offsetTop <= scrollY) current = sec.id;
    }
    setActive(current);
  };
  spy();
  window.addEventListener('scroll', () => { requestAnimationFrame(spy); });

  // Contact form validation and fake submission
  const form = qs('#contactForm');
  if (form) {
    const statusEl = qs('#form-status');
    const fields = {
      name: qs('#name'),
      email: qs('#email'),
      message: qs('#message'),
    };
    const errors = {
      name: qs('#error-name'),
      email: qs('#error-email'),
      message: qs('#error-message'),
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validate = () => {
      let valid = true;
      // Name
      if (!fields.name.value.trim() || fields.name.value.trim().length < 2) {
        errors.name.textContent = 'Please enter your full name.';
        valid = false;
      } else {
        errors.name.textContent = '';
      }
      // Email
      if (!emailRegex.test(fields.email.value.trim())) {
        errors.email.textContent = 'Please enter a valid email address.';
        valid = false;
      } else {
        errors.email.textContent = '';
      }
      // Message
      if (!fields.message.value.trim() || fields.message.value.trim().length < 10) {
        errors.message.textContent = 'Message should be at least 10 characters.';
        valid = false;
      } else {
        errors.message.textContent = '';
      }
      return valid;
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      statusEl.textContent = '';
      if (!validate()) {
        statusEl.textContent = 'Please fix the highlighted fields.';
        return;
      }
      // Simulate async submission
      statusEl.textContent = 'Sending…';
      setTimeout(() => {
        statusEl.textContent = 'Thank you! We will be in touch shortly.';
        form.reset();
      }, 900);
    });
  }
})();
