/* ============================================================
   TIMA.DEV — Portfolio Script
   ============================================================ */

/* ---- CUSTOM CURSOR ---- */
(function initCursor() {
  const dot = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let activated = false;
  let mx = -100, my = -100;
  let rx = -100, ry = -100;

  function onFirstMouseMove(e) {
    if (e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents) return;
    if (!activated) {
      activated = true;
      document.body.classList.add('has-mouse-cursor');
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    }
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  }

  dot.style.opacity = '0';
  ring.style.opacity = '0';
  document.addEventListener('mousemove', onFirstMouseMove);

  (function animateRing() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
  })();

  const hoverTargets = 'a, button, .pcard, .scard, .cert-card, .btn-cta, .contact__link, .stack-strip';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('hover');
      ring.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('hover');
      ring.classList.remove('hover');
    });
  });
})();

/* ---- TECH STACK FAN ---- */
(function initStack() {
  const stackEl = document.getElementById('stack');
  if (!stackEl) return;

  const TECH = [
    { label: 'HTML', color: '#E34F26', icon: '</>' },
    { label: 'CSS', color: '#1572B6', icon: '{ }' },
    { label: 'JS', color: '#F7DF1E', icon: 'fn' },
    { label: 'PY', color: '#3776AB', icon: 'py' },
    { label: 'API', color: '#16A34A', icon: 'REST' },
    { label: 'SQL', color: '#336791', icon: 'DB' },
    { label: 'GIT', color: '#F05032', icon: 'git' },
    { label: 'AI', color: '#7C3AED', icon: 'ML' },
  ];

  const COUNT = TECH.length;
  const TOTAL_DEG = 120;
  const START_DEG = -TOTAL_DEG / 2;
  const center = (COUNT - 1) / 2;

  TECH.forEach((tech, i) => {
    const angle = START_DEG + (TOTAL_DEG / (COUNT - 1)) * i;
    const distFromCenter = Math.abs(i - center);
    const delay = Math.round((distFromCenter / center) * 400);

    const strip = document.createElement('div');
    strip.className = 'stack-strip';
    strip.style.setProperty('--angle', angle.toFixed(2) + 'deg');
    strip.style.setProperty('--delay', delay + 'ms');
    strip.style.background = `linear-gradient(180deg, ${tech.color} 0%, ${tech.color}cc 100%)`;
    strip.style.zIndex = Math.round(COUNT - distFromCenter);

    const icon = document.createElement('div');
    icon.className = 'stack-strip__icon';
    icon.textContent = tech.icon;
    if (tech.label === 'JS') icon.style.color = '#1a1a1a';

    const lbl = document.createElement('div');
    lbl.className = 'stack-strip__lbl';
    lbl.textContent = tech.label;

    strip.appendChild(icon);
    strip.appendChild(lbl);
    stackEl.appendChild(strip);
  });

  requestAnimationFrame(() => {
    setTimeout(() => stackEl.classList.add('stack--open'), 350);
  });

  stackEl.addEventListener('mouseover', e => {
    const strip = e.target.closest('.stack-strip');
    if (!strip) return;
    const siblings = Array.from(stackEl.children);
    const idx = siblings.indexOf(strip);
    siblings.forEach((s, i) => {
      s.style.zIndex = COUNT - Math.abs(i - idx);
    });
  });
})();

/* ---- TERMINAL TYPING ---- */
(function initTerminal() {
  const codeEl = document.getElementById('terminal-code');
  if (!codeEl) return;

  const LINES = [
    '<span class="cm"># deploy portfolio</span>',
    '<span class="kw">git</span> push origin main',
    '<span class="ok">✓ deployed to GitHub Pages</span>',
    '',
    '<span class="kw">const</span> dev = <span class="str">"Тимур"</span>;',
    '<span class="fn">build</span>(<span class="str">"skl-academy.tech"</span>);',
    '<span class="ok">→ live at https://skl-academy.tech</span>',
  ];

  let lineIdx = 0;
  let charIdx = 0;
  let current = '';
  let pause = 0;

  function tick() {
    if (pause > 0) {
      pause--;
      requestAnimationFrame(tick);
      return;
    }

    if (lineIdx >= LINES.length) {
      pause = 40;
      lineIdx = 0;
      charIdx = 0;
      current = '';
      codeEl.innerHTML = '';
      requestAnimationFrame(tick);
      return;
    }

    const line = LINES[lineIdx];
    if (charIdx < line.length) {
      current += line[charIdx];
      charIdx++;
      const rendered = LINES.slice(0, lineIdx).join('\n') +
        (lineIdx > 0 ? '\n' : '') + current;
      codeEl.innerHTML = rendered;
      pause = line.startsWith('<') ? 0 : 1;
    } else {
      lineIdx++;
      charIdx = 0;
      current = '';
      pause = line === '' ? 8 : 18;
    }
    requestAnimationFrame(tick);
  }

  setTimeout(() => requestAnimationFrame(tick), 800);
})();

/* ---- SCROLL REVEAL ---- */
(function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('visible'), +delay);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

  document.querySelectorAll('.hero__text .reveal, .hero__visual.reveal').forEach((el, i) => {
    el.dataset.delay = i * 110;
  });

  document.querySelectorAll('.works__grid, .services__grid, .certs__grid').forEach(grid => {
    Array.from(grid.children).forEach((child, i) => {
      child.classList.add('reveal');
      child.dataset.delay = i * 75;
    });
  });

  document.querySelectorAll('.about__text, .about__stats, .services__title, .certs__head, .contact__title, .contact__links').forEach((el, i) => {
    el.classList.add('reveal');
    el.dataset.delay = i * 80;
  });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

/* ---- NAV SCROLL ---- */
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();

/* ---- MOBILE BURGER ---- */
(function initBurger() {
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobile-menu');
  if (!burger || !menu) return;

  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  menu.querySelectorAll('.mm-link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ---- CARD 3D TILT ---- */
(function initCardTilt() {
  document.querySelectorAll('.pcard').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 14;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 14;
      card.style.transform = `translateY(-6px) rotateX(${(-y).toFixed(2)}deg) rotateY(${x.toFixed(2)}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ---- COUNTERS ---- */
(function initCounters() {
  const nums = document.querySelectorAll('.stat__num[data-target]');
  if (!nums.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.target;
      const dur = 1400;
      const start = performance.now();

      function ease(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

      (function tick(now) {
        const t = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(ease(t) * target);
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      })(start);

      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  nums.forEach(el => io.observe(el));
})();

/* ---- TICKER ---- */
(function initTicker() {
  const track = document.getElementById('ticker-track');
  if (!track) return;

  const items = ['FRONTEND', 'BACKEND', 'PYTHON', 'JAVASCRIPT', 'FASTAPI', 'AI/ML', 'GIT', 'DEPLOY'];
  const SEP = '✦';

  function buildCycle() {
    const frag = document.createDocumentFragment();
    items.forEach(text => {
      const span = document.createElement('span');
      span.textContent = text;
      frag.appendChild(span);
      const sep = document.createElement('span');
      sep.className = 'ticker__sep';
      sep.textContent = SEP;
      frag.appendChild(sep);
    });
    return frag;
  }

  for (let i = 0; i < 4; i++) track.appendChild(buildCycle());

  requestAnimationFrame(() => requestAnimationFrame(() => {
    const cycleW = track.scrollWidth / 4;
    if (cycleW > 0) {
      track.style.setProperty('--ticker-shift', `-${cycleW}px`);
      track.style.animationDuration = (cycleW / 55) + 's';
    }
  }));
})();

/* ---- PROJECT MODAL ---- */
(function initProjectModal() {
  const PROJECTS = {
    skl: {
      tag: 'образовательная платформа',
      title: 'SKL Academy',
      desc: 'Образовательная IT-платформа с курсами по Python, Git, веб-разработке, Linux, AI и интерактивными инструментами — веб-песочница, тренажёры и библиотека статей.',
      tech: ['HTML', 'CSS', 'JavaScript', 'GitHub Pages'],
      link: 'https://skl-academy.tech',
      github: 'https://github.com/TimaPelmesh/skl-academy.tech',
    },
    corax: {
      tag: 'сетевые конфигурации · AI',
      title: 'CORAX',
      desc: 'Configuration Oracle & Reactive Analysis eXpert — веб-приложение для управления конфигурациями сетевого оборудования: дашборд, compliance-проверки, AI-анализ, Telegram-бот и интеграция с Oxidized.',
      tech: ['Python', 'FastAPI', 'SQLAlchemy', 'Telegram Bot', 'LM Studio'],
      link: 'https://github.com/TimaPelmesh/case-34-CORAX',
      github: 'https://github.com/TimaPelmesh/case-34-CORAX',
    },
    win: {
      tag: 'достижение',
      title: 'WIN AI Challenge',
      desc: 'Победа в международном конкурсе по искусственному интеллекту. Решение прикладной AI-задачи с применением машинного обучения и анализа данных.',
      tech: ['Python', 'Machine Learning', 'Data Analysis'],
      link: 'https://github.com/TimaPelmesh',
      github: 'https://github.com/TimaPelmesh',
    },
    fusion: {
      tag: 'data fusion contest 2026',
      title: 'Data Fusion — «Герои»',
      desc: 'Решение задачи 3 конкурса Data Fusion. Score 294 500 на платформе — топ-2 среди участников.',
      tech: ['Python', 'Pandas', 'ML', 'Feature Engineering'],
      link: 'https://github.com/TimaPelmesh/Data-Fusion-Contest-2026-task-3',
      github: 'https://github.com/TimaPelmesh/Data-Fusion-Contest-2026-task-3',
    },
  };

  const modal = document.getElementById('project-modal');
  const dialog = document.getElementById('project-dialog');
  const closeBtn = document.getElementById('project-close');
  if (!modal) return;

  const els = {
    tag: document.getElementById('project-tag'),
    title: document.getElementById('project-title'),
    desc: document.getElementById('project-desc'),
    tech: document.getElementById('project-tech'),
    link: document.getElementById('project-link'),
    github: document.getElementById('project-github'),
  };

  function openProject(key) {
    const data = PROJECTS[key];
    if (!data) return;

    els.tag.textContent = data.tag;
    els.title.textContent = data.title;
    els.desc.textContent = data.desc;
    els.tech.innerHTML = data.tech.map(t => `<li>${t}</li>`).join('');
    els.link.href = data.link;
    els.github.href = data.github;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeProject() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.pcard--has-modal').forEach(card => {
    card.addEventListener('click', () => openProject(card.dataset.project));
  });

  closeBtn.addEventListener('click', closeProject);
  modal.addEventListener('click', e => { if (e.target === modal) closeProject(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeProject();
  });

  dialog.addEventListener('touchstart', e => { dialog._y0 = e.touches[0].clientY; }, { passive: true });
  dialog.addEventListener('touchend', e => {
    if (e.changedTouches[0].clientY - dialog._y0 > 72) closeProject();
  }, { passive: true });
})();

/* ---- FLOATING PARTICLES ---- */
(function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const symbols = ['{', '}', '</>', '()', '[]', '0', '1', 'fn', '=>'];
  let particles = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function spawn() {
    particles = Array.from({ length: Math.min(40, Math.floor(w / 40)) }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: 10 + Math.random() * 8,
      sym: symbols[Math.floor(Math.random() * symbols.length)],
      alpha: 0.08 + Math.random() * 0.12,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.font = `${p.size}px JetBrains Mono, monospace`;
      ctx.fillStyle = `rgba(37, 99, 235, ${p.alpha})`;
      ctx.fillText(p.sym, p.x, p.y);
    });
    requestAnimationFrame(draw);
  }

  resize();
  spawn();
  draw();
  window.addEventListener('resize', () => { resize(); spawn(); }, { passive: true });
})();

/* ---- SMOOTH ANCHOR SCROLL ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
