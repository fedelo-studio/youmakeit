/* ============================================================
   YouMakeIt — page behaviour (chrome, theme, mobile menu,
   smooth scroll, reveal-on-scroll, CTA cursor-bloom).
   Pure ES5; no build step.
   ============================================================ */
(function () {
  'use strict';

  /* ----- Nav state on scroll -----
     The nav starts with .theme-dark because it floats over the dark hero.
     Once the user has scrolled past the hero, drop .theme-dark so the nav
     adopts the light page palette. Same architecture as fedelo.studio. */
  var nav = document.getElementById('nav');
  var hero = document.getElementById('hero-shader');

  var updateNavState = function () {
    nav.classList.toggle('scrolled', window.scrollY > 24);
    if (hero) {
      var heroBottom = hero.getBoundingClientRect().bottom;
      // While the hero is at all visible, keep the nav dark. As soon as the
      // hero scrolls off the top (its bottom edge passes the nav baseline),
      // switch the nav to the light page palette.
      var navH = nav.getBoundingClientRect().height || 64;
      nav.classList.toggle('theme-dark', heroBottom > navH);
    }
  };
  window.addEventListener('scroll', updateNavState, { passive: true });
  window.addEventListener('resize', updateNavState, { passive: true });
  updateNavState();

  /* ----- Reveal on scroll ----- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) {
    var r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('in');
    else io.observe(el);
  });
  /* fallback: reveal everything after 2s regardless */
  setTimeout(function () {
    document.querySelectorAll('.reveal').forEach(function (n) { n.classList.add('in'); });
  }, 2000);

  /* ----- CTA pill cursor-following bloom ----- */
  document.querySelectorAll('.cta-pill').forEach(function (pill) {
    pill.addEventListener('pointermove', function (e) {
      var r = pill.getBoundingClientRect();
      var x = ((e.clientX - r.left) / r.width) * 100;
      var y = ((e.clientY - r.top)  / r.height) * 100;
      pill.style.setProperty('--pill-mx', x + '%');
      pill.style.setProperty('--pill-my', y + '%');
    });
  });

  /* ----- Service-card cursor spotlight ----- */
  document.querySelectorAll('.svc-graphic-card').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      var x = ((e.clientX - r.left) / r.width) * 100;
      var y = ((e.clientY - r.top)  / r.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });

  /* ----- Mobile menu ----- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobile-menu');
  var closeMenu = function () {
    burger.classList.remove('open');
    menu.classList.remove('open');
    document.body.style.overflow = '';
    burger.setAttribute('aria-label', 'Open menu');
  };
  burger.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    burger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* ----- Smooth in-page scroll ----- */
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var easeInOutCubic = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var raf = null;

  var animateScrollTo = function (targetY) {
    if (raf) cancelAnimationFrame(raf);
    var startY = window.scrollY;
    var dist = targetY - startY;
    if (Math.abs(dist) < 2) return;
    var dur = Math.min(1100, Math.max(420, Math.abs(dist) * 0.55));
    var t0 = performance.now();
    var step = function (now) {
      var t = Math.min(1, (now - t0) / dur);
      window.scrollTo(0, startY + dist * easeInOutCubic(t));
      if (t < 1) raf = requestAnimationFrame(step);
      else raf = null;
    };
    raf = requestAnimationFrame(step);
  };
  ['wheel', 'touchstart', 'keydown'].forEach(function (ev) {
    window.addEventListener(ev, function () {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
    }, { passive: true });
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (!href || href === '#') {
        e.preventDefault();
        prefersReduced ? window.scrollTo(0, 0) : animateScrollTo(0);
        return;
      }
      var el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      var navH = nav ? nav.getBoundingClientRect().height : 0;
      var targetY = el.getBoundingClientRect().top + window.scrollY - navH - 16;
      prefersReduced ? window.scrollTo(0, targetY) : animateScrollTo(targetY);
    });
  });
})();
