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

  /* ---------- 7. Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
