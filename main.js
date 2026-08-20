/* =========================================================
   Quick Tip Rubbish Solutions
   Mobile nav, scroll reveals, hero card, FAQ, wizard form
   ========================================================= */

// Paste the Apps Script URL here after running Skill 03 (Form Backend Setup)
const ENDPOINT = '';

(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  document.querySelectorAll('#year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Mobile nav ---------- */
  const burger = document.getElementById('navBurger');
  const panel = document.getElementById('navPanel');

  if (burger && panel) {
    burger.addEventListener('click', function () {
      const open = panel.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    panel.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        panel.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  /* ---------- Sticky header on scroll (home page only) ---------- */
  const header = document.getElementById('siteHeader');
  const hero = document.querySelector('.hero');

  if (header && hero && !header.classList.contains('is-stuck')) {
    let ticking = false;
    const onScroll = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        const past = window.scrollY > window.innerHeight * 0.7;
        header.classList.toggle('is-stuck', past);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Hero headline: word by word ---------- */
  const heroTitle = document.getElementById('heroTitle');
  if (heroTitle) {
    // wrap each word, but keep the author's line breaks intact
    const lines = heroTitle.querySelectorAll('.line');
    const targets = lines.length ? lines : [heroTitle];

    targets.forEach(function (line) {
      line.innerHTML = line.textContent
        .trim()
        .split(/\s+/)
        .map(function (w) { return '<span class="word">' + w + '</span>'; })
        .join(' ');
    });

    heroTitle.querySelectorAll('.word').forEach(function (w, i) {
      w.style.transitionDelay = (0.08 * i + 0.15) + 's';
    });

    window.requestAnimationFrame(function () {
      heroTitle.classList.add('is-in');
    });
  }

  /* ---------- Hero rotating service card ---------- */
  const heroService = document.getElementById('heroService');
  const heroNum = document.getElementById('heroNum');
  const heroFill = document.getElementById('heroFill');

  if (heroService && heroNum && heroFill && !reduceMotion) {
    const items = [
      'Rubbish clearance',
      'House clear outs',
      'Builders waste',
      'Scrap metal'
    ];
    let i = 0;

    setInterval(function () {
      i = (i + 1) % items.length;
      heroService.textContent = items[i];
      heroNum.textContent = '0' + (i + 1);
      heroFill.style.width = ((i + 1) * 25) + '%';
    }, 3200);
  }

  /* ---------- Scroll reveal ---------- */
  const revealables = document.querySelectorAll('.reveal');

  if (revealables.length) {
    if ('IntersectionObserver' in window && !reduceMotion) {
      const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

      revealables.forEach(function (el) { io.observe(el); });
    } else {
      revealables.forEach(function (el) { el.classList.add('is-in'); });
    }
  }

  /* ---------- Wide media scale in ---------- */
  const mediaFrame = document.getElementById('mediaFrame');
  if (mediaFrame) {
    if ('IntersectionObserver' in window && !reduceMotion) {
      const mio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            mediaFrame.classList.add('is-in');
            mio.unobserve(mediaFrame);
          }
        });
      }, { threshold: 0.25 });
      mio.observe(mediaFrame);
    } else {
      mediaFrame.classList.add('is-in');
    }
  }

  /* ---------- Count up stats ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1200;
        const start = performance.now();

        const tick = function (now) {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) window.requestAnimationFrame(tick);
        };

        if (reduceMotion) {
          el.textContent = target + suffix;
        } else {
          window.requestAnimationFrame(tick);
        }
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Process progress line ---------- */
  const steps = document.getElementById('processSteps');
  const progress = document.getElementById('processProgress');

  if (steps && progress && !reduceMotion) {
    let ticking = false;
    const update = function () {
      const rect = steps.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height;
      const scrolled = Math.min(Math.max(vh * 0.6 - rect.top, 0), total);
      const pct = total ? scrolled / total : 0;
      progress.style.transform = 'translateY(' + ((pct - 1) * 100) + '%)';
      ticking = false;
    };

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });

    update();
  }

  /* ---------- Before / after comparison sliders ---------- */
  document.querySelectorAll('[data-ba]').forEach(function (media) {
    const range = media.querySelector('.ba__range');
    if (!range) return;

    const set = function (pct) {
      const v = Math.min(Math.max(pct, 0), 100);
      media.style.setProperty('--pos', v + '%');
      const inner = media.querySelector('.ba__after img');
      if (inner) inner.style.width = media.clientWidth + 'px';
    };

    const fromPointer = function (clientX) {
      const rect = media.getBoundingClientRect();
      set(((clientX - rect.left) / rect.width) * 100);
    };

    range.addEventListener('input', function () { set(Number(range.value)); });

    media.addEventListener('pointerdown', function (e) {
      if (e.target === range) return;
      media.setPointerCapture(e.pointerId);
      fromPointer(e.clientX);
    });
    media.addEventListener('pointermove', function (e) {
      if (e.buttons !== 1) return;
      fromPointer(e.clientX);
      range.value = String(Math.round(parseFloat(media.style.getPropertyValue('--pos'))));
    });

    window.addEventListener('resize', function () { set(Number(range.value)); });
    set(Number(range.value));
  });

  /* ---------- FAQ accordion ---------- */
  const faqList = document.getElementById('faqList');
  if (faqList) {
    faqList.querySelectorAll('.faq__q').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const item = btn.closest('.faq__item');
        const isOpen = item.classList.contains('is-open');

        faqList.querySelectorAll('.faq__item').forEach(function (other) {
          other.classList.remove('is-open');
          const q = other.querySelector('.faq__q');
          q.setAttribute('aria-expanded', 'false');
          other.querySelector('.faq__toggle').innerHTML = '&plus;';
        });

        if (!isOpen) {
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
          item.querySelector('.faq__toggle').innerHTML = '&minus;';
        }
      });
    });
  }

  /* ---------- Quote wizard ---------- */
  const form = document.getElementById('quoteForm');
  if (!form) return;

  const stepEls = Array.prototype.slice.call(form.querySelectorAll('.wizard__step'));
  const dots = Array.prototype.slice.call(form.querySelectorAll('.wizard__dot'));
  const stepNow = document.getElementById('stepNow');
  const btnBack = document.getElementById('btnBack');
  const btnNext = document.getElementById('btnNext');
  const btnSubmit = document.getElementById('btnSubmit');
  const status = document.getElementById('formStatus');
  const done = document.getElementById('wizardDone');

  const total = stepEls.length;
  const answers = {};
  let current = 1;

  function render() {
    stepEls.forEach(function (el) {
      el.classList.toggle('is-active', Number(el.dataset.step) === current);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-done', i < current);
    });
    if (stepNow) stepNow.textContent = String(current);

    btnBack.hidden = current === 1;
    btnNext.hidden = current === total;
    btnSubmit.hidden = current !== total;
    status.textContent = '';
    status.className = 'form-status';
  }

  function goTo(step) {
    current = Math.min(Math.max(step, 1), total);
    render();
    form.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }

  function stepIsAnswered(step) {
    const el = stepEls[step - 1];
    const choice = el.querySelector('.choice');
    if (!choice) return true;
    return !!el.querySelector('.choice.is-selected');
  }

  /* choice buttons: select and auto advance */
  form.querySelectorAll('.choice').forEach(function (choice) {
    choice.addEventListener('click', function () {
      const group = choice.closest('.choices');
      group.querySelectorAll('.choice').forEach(function (c) {
        c.classList.remove('is-selected');
      });
      choice.classList.add('is-selected');
      answers[choice.dataset.field] = choice.dataset.value;

      window.setTimeout(function () {
        if (current < total) goTo(current + 1);
      }, 220);
    });
  });

  btnNext.addEventListener('click', function () {
    if (!stepIsAnswered(current)) {
      status.textContent = 'Pick an option to carry on.';
      status.className = 'form-status form-status--err';
      return;
    }
    goTo(current + 1);
  });

  btnBack.addEventListener('click', function () {
    goTo(current - 1);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = form.querySelector('#name');
    const phone = form.querySelector('#phone');
    const email = form.querySelector('#email');
    const area = form.querySelector('#area');
    const message = form.querySelector('#message');

    if (!name.value.trim() || !phone.value.trim() || !email.value.trim() || !area.value.trim()) {
      status.textContent = 'Please fill in your name, phone, email and the job area.';
      status.className = 'form-status form-status--err';
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim())) {
      status.textContent = 'That email address does not look right.';
      status.className = 'form-status form-status--err';
      email.focus();
      return;
    }

    const payload = {
      jobType: answers.jobType || '',
      loadSize: answers.loadSize || '',
      timing: answers.timing || '',
      name: name.value.trim(),
      phone: phone.value.trim(),
      email: email.value.trim(),
      area: area.value.trim(),
      message: message.value.trim(),
      submittedAt: new Date().toISOString()
    };

    if (!ENDPOINT) {
      status.textContent = 'The form is not connected yet. Please call or message 07395 614297.';
      status.className = 'form-status form-status--err';
      return;
    }

    btnSubmit.setAttribute('disabled', 'disabled');
    status.textContent = 'Sending your enquiry...';
    status.className = 'form-status';

    fetch(ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    })
      .then(function () {
        form.querySelectorAll('.wizard__step, .wizard__nav, .wizard__bar').forEach(function (el) {
          el.style.display = 'none';
        });
        status.textContent = '';
        done.classList.add('is-active');
        done.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      })
      .catch(function () {
        btnSubmit.removeAttribute('disabled');
        status.textContent = 'That did not send. Please call or message 07395 614297 instead.';
        status.className = 'form-status form-status--err';
      });
  });

  render();
})();
