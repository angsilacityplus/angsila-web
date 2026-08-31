/* ================================================
   เทศบาลเมืองอ่างศิลา — Main Script
   ================================================ */
(function () {
  'use strict';

  /* ---------- 1. HERO SLIDER ---------- */
  const slides = document.querySelectorAll('.slide');
  const dots   = document.querySelectorAll('.dots span');
  let current  = 0;
  let timer    = null;

  function goSlide(n) {
    if (!slides.length) return;
    slides[current].classList.remove('on');
    if (dots[current]) dots[current].classList.remove('on');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('on');
    if (dots[current]) dots[current].classList.add('on');
  }

  function startAuto() {
    stopAuto();
    timer = setInterval(() => goSlide(current + 1), 6000);
  }
  function stopAuto() { if (timer) clearInterval(timer); }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goSlide(parseInt(dot.dataset.go, 10));
      startAuto();
    });
  });

  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mouseenter', stopAuto);
    hero.addEventListener('mouseleave', startAuto);
  }
  startAuto();

  /* ---------- 2. NEWS TABS ---------- */
  const tabs  = document.querySelectorAll('.tab');
  const panes = document.querySelectorAll('.pane');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const idx = parseInt(tab.dataset.tab, 10);
      tabs.forEach(t => t.classList.remove('on'));
      tab.classList.add('on');
      panes.forEach((p, i) => p.classList.toggle('on', i === idx));
    });
  });

  /* ---------- 3. FONT SIZE CONTROL ---------- */
  const MIN = 14, MAX = 20, DEFAULT = 16;
  let fontSize = parseInt(localStorage.getItem('angsila_fs'), 10) || DEFAULT;
  applyFont();

  document.querySelectorAll('.fsize button').forEach(btn => {
    btn.addEventListener('click', () => {
      const d = parseInt(btn.dataset.fs, 10);
      fontSize = (d === 0) ? DEFAULT : Math.min(MAX, Math.max(MIN, fontSize + d));
      applyFont();
    });
  });

  function applyFont() {
    document.body.style.fontSize = fontSize + 'px';
    localStorage.setItem('angsila_fs', fontSize);
  }

  /* ---------- 4. MOBILE MENU ---------- */
  const burger = document.getElementById('burger');
  const menu   = document.getElementById('menu');

  if (burger) burger.addEventListener('click', () => menu.classList.toggle('show'));

  document.querySelectorAll('.has-sub > a').forEach(link => {
    link.addEventListener('click', e => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        link.parentElement.classList.toggle('open');
      }
    });
  });

  document.querySelectorAll('.sub a, #menu > li:not(.has-sub) > a').forEach(a => {
    a.addEventListener('click', () => {
      if (window.innerWidth <= 768) menu.classList.remove('show');
    });
  });

  /* ---------- 5. BACK TO TOP ---------- */
  const topBtn = document.getElementById('top');
  window.addEventListener('scroll', () => {
    if (topBtn) topBtn.classList.toggle('show', window.scrollY > 400);
  });
  if (topBtn) topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- 6. COUNT-UP STATS ---------- */
  const counters = document.querySelectorAll('[data-count]');
  let counted = false;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        counters.forEach(runCount);
      }
    });
  }, { threshold: 0.4 });

  const statsSec = document.querySelector('.stats');
  if (statsSec) observer.observe(statsSec);

  function runCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const step   = Math.max(1, Math.ceil(target / 60));
    let value    = 0;
    const tick = setInterval(() => {
      value += step;
      if (value >= target) { value = target; clearInterval(tick); }
      el.textContent = value.toLocaleString('th-TH') + (target >= 1000 ? '+' : '');
    }, 25);
  }

  /* ---------- 7. FORMS (ระบบสาธิต) ---------- */
  const contactForm = document.getElementById('contactForm');
  const formMsg     = document.getElementById('formMsg');

  if (contactForm) contactForm.addEventListener('submit', e => {
    e.preventDefault();
    formMsg.textContent = '✓ ส่งเรื่องเรียบร้อยแล้ว เจ้าหน้าที่จะติดต่อกลับภายใน 3 วันทำการ (ระบบสาธิต)';
    formMsg.classList.add('show');
    contactForm.reset();
    setTimeout(() => formMsg.classList.remove('show'), 6000);
  });

  const searchForm = document.getElementById('searchForm');
  if (searchForm) searchForm.addEventListener('submit', e => {
    e.preventDefault();
    const q = searchForm.querySelector('input').value.trim();
    if (q) alert('ระบบสาธิต: กำลังค้นหา "' + q + '"');
  });

})();