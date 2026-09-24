/* ===========================
   PlanGenix — Main JS
   =========================== */

/* ---- Sticky Nav ---- */
const nav = document.getElementById('nav');
if (nav) {
  const isInnerPage = nav.classList.contains('scrolled');

  window.addEventListener('scroll', () => {
    if (!isInnerPage) {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }
  });
}

/* ---- Mobile Menu ---- */
const toggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    toggle.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ---- Scroll Reveal ---- */
const revealEls = document.querySelectorAll('.reveal');

if (revealEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger sibling reveals
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, Math.min(idx * 80, 320));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
}

/* ---- Project Filter ---- */
const filterTabs = document.querySelectorAll('.filter-tab');
const projectCards = document.querySelectorAll('[data-category]');

if (filterTabs.length && projectCards.length) {
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;

      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity .35s ease, transform .35s ease';
            card.style.opacity = '1';
            card.style.transform = 'none';
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ---- Contact Form ---- */
const form = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (form && formSuccess) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Simple validation
    const required = form.querySelectorAll('[required]');
    let valid = true;

    required.forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = '#e53935';
        valid = false;
      }
    });

    if (!valid) return;

    // Send via FormSubmit (https://formsubmit.co) to the PlanGenix inbox
    const btn = form.querySelector('button[type="submit"]');
    const btnText = btn.textContent;
    const formError = document.getElementById('form-error');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    if (formError) formError.style.display = 'none';

    const data = Object.fromEntries(new FormData(form));
    // Send the readable option labels rather than the internal values
    form.querySelectorAll('select').forEach(select => {
      const option = select.options[select.selectedIndex];
      data[select.name] = option && option.value ? option.text : '';
    });
    // FormSubmit sets the notification's reply-to from _replyto
    data._replyto = data['Email'];

    fetch('https://formsubmit.co/ajax/mandip@plangenix.com.au', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(res => res.json().then(body => ({ ok: res.ok, body })))
      .then(({ ok, body }) => {
        if (!ok || String(body.success) !== 'true') throw new Error(body.message || 'Send failed');
        form.style.display = 'none';
        formSuccess.style.display = 'block';
      })
      .catch(() => {
        btn.textContent = btnText;
        btn.disabled = false;
        if (formError) formError.style.display = 'block';
      });
  });
}

/* ---- Smooth anchor scroll ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
