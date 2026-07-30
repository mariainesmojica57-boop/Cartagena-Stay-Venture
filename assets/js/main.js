/* ==========================================================================
   Cartagena Stay Venture — main.js
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- 1. Sticky header ---------- */
  const header = document.querySelector('.header');
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 2. Mobile menu ---------- */
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      nav.classList.toggle('open');
    });
    nav.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        nav.classList.remove('open');
      })
    );
  }

  /* ---------- 3. Language toggle (ES / EN) ---------- */
  const STORAGE_KEY = 'csv_lang';
  const applyLang = (lang) => {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-es]').forEach(el => {
      const val = el.getAttribute('data-' + lang);
      if (val === null) return;
      if (el.hasAttribute('data-attr')) {
        el.setAttribute(el.getAttribute('data-attr'), val);
      } else {
        el.innerHTML = val;
      }
    });
    document.querySelectorAll('.lang button').forEach(b =>
      b.classList.toggle('active', b.dataset.lang === lang)
    );
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  };
  let saved = 'es';
  try { saved = localStorage.getItem(STORAGE_KEY) || 'es'; } catch (e) {}
  applyLang(saved);
  document.querySelectorAll('.lang button').forEach(b =>
    b.addEventListener('click', () => applyLang(b.dataset.lang))
  );

  /* ---------- 4. Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- 5. Lightbox gallery ---------- */
  const lb = document.querySelector('.lightbox');
  if (lb) {
    const lbImg = lb.querySelector('img');
    const items = Array.from(document.querySelectorAll('[data-lightbox] img'));
    let idx = 0;
    const show = (i) => {
      idx = (i + items.length) % items.length;
      lbImg.src = items[idx].src;
      lbImg.alt = items[idx].alt || '';
    };
    const open = (i) => { show(i); lb.classList.add('open'); document.body.classList.add('no-scroll'); };
    const close = () => { lb.classList.remove('open'); document.body.classList.remove('no-scroll'); };
    items.forEach((img, i) =>
      img.parentElement.addEventListener('click', () => open(i))
    );
    lb.querySelector('.lightbox__close').addEventListener('click', close);
    lb.querySelector('.next').addEventListener('click', () => show(idx + 1));
    lb.querySelector('.prev').addEventListener('click', () => show(idx - 1));
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') show(idx + 1);
      if (e.key === 'ArrowLeft') show(idx - 1);
    });
  }

  /* ---------- 6. Booking form -> WhatsApp ---------- */
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    const WA_NUMBER = '573052080277';
    const val = (id) => {
      const el = document.getElementById(id);
      return el ? el.value.trim() : '';
    };
    const fmtDate = (d) => {
      // d viene como yyyy-mm-dd -> lo dejamos dd/mm/yyyy para leerlo fácil
      if (!d || d.indexOf('-') === -1) return d;
      const p = d.split('-');
      return p[2] + '/' + p[1] + '/' + p[0];
    };
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = val('bf-nombre');
      const llegada = val('bf-llegada');
      const salida = val('bf-salida');
      const huespedes = val('bf-huespedes');
      const apto = val('bf-apto');
      const mensaje = val('bf-mensaje');

      let t = '¡Hola Cartagena Stay Venture! Quiero reservar.';
      if (nombre)    t += '\nNombre: ' + nombre;
      if (apto)      t += '\nApartamento: ' + apto;
      if (llegada)   t += '\nLlegada: ' + fmtDate(llegada);
      if (salida)    t += '\nSalida: ' + fmtDate(salida);
      if (huespedes) t += '\nHuéspedes: ' + huespedes;
      if (mensaje)   t += '\nMensaje: ' + mensaje;

      const url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(t);
      window.open(url, '_blank', 'noopener');
    });
  }

  /* ---------- 7. AI assistant chat window ---------- */
  const aiBtn = document.querySelector('.ai-float');
  if (aiBtn) {
    const chatUrl = aiBtn.getAttribute('href');
    const panel = document.createElement('div');
    panel.className = 'ai-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Asistente virtual');
    panel.innerHTML =
      '<div class="ai-panel__head">' +
        '<img src="assets/img/logo.png" alt="Cartagena Stay Venture" />' +
        '<div class="ai-panel__title">Asistente virtual<small>Cartagena Stay Venture</small></div>' +
        '<div class="ai-panel__actions">' +
          '<button type="button" class="ai-panel__btn ai-panel__refresh" aria-label="Reiniciar conversación" title="Reiniciar conversación"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/></svg></button>' +
          '<a class="ai-panel__btn" href="' + chatUrl + '" target="_blank" rel="noopener" aria-label="Abrir en una pestaña" title="Abrir en una pestaña"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 3h7v7M21 3l-9 9M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"/></svg></a>' +
          '<button type="button" class="ai-panel__btn ai-panel__close" aria-label="Cerrar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
        '</div>' +
      '</div>' +
      '<div class="ai-panel__body"></div>';
    document.body.appendChild(panel);

    const body = panel.querySelector('.ai-panel__body');
    let loaded = false;
    const openPanel = () => {
      if (!loaded) {
        const ifr = document.createElement('iframe');
        ifr.src = chatUrl;
        ifr.title = 'Asistente virtual';
        ifr.setAttribute('allow', 'microphone; clipboard-write');
        ifr.addEventListener('load', () => panel.classList.add('loaded'));
        body.appendChild(ifr);
        loaded = true;
      }
      panel.classList.add('open');
    };
    const closePanel = () => panel.classList.remove('open');

    aiBtn.addEventListener('click', (e) => {
      e.preventDefault();
      panel.classList.contains('open') ? closePanel() : openPanel();
    });
    panel.querySelector('.ai-panel__close').addEventListener('click', closePanel);
    panel.querySelector('.ai-panel__refresh').addEventListener('click', () => {
      const ifr = body.querySelector('iframe');
      if (ifr) { panel.classList.remove('loaded'); ifr.src = chatUrl; }
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePanel(); });
  }

  /* ---------- 8. Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
