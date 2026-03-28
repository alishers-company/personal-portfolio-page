/* ============================================================
   Mobile navigation toggle
   ============================================================ */
var navToggle = document.getElementById('mobile-nav-toggle');
var navMenu   = document.getElementById('nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', function () {
    var expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navMenu.classList.toggle('is-open', !expanded);
  });
}

/* Close mobile menu when any nav link is clicked */
document.querySelectorAll('.nav-link').forEach(function (link) {
  link.addEventListener('click', function () {
    if (navMenu) navMenu.classList.remove('is-open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ============================================================
   Smooth scrolling for anchor links
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    var targetId = anchor.getAttribute('href');
    var target   = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    var offset = document.getElementById('primary-nav')
      ? document.getElementById('primary-nav').offsetHeight
      : 0;
    var top = target.getBoundingClientRect().top + window.scrollY - offset - 12;
    window.scrollTo({ top: top, behavior: 'smooth' });
  });
});

/* ============================================================
   Terminal typewriter animation
   ============================================================ */
var terminalOutput = document.getElementById('terminal-output');

var terminalSequence = [
  { type: 'cmd',    text: 'whoami' },
  { type: 'output', text: 'Alex Chen — Full Stack Engineer' },
  { type: 'cmd',    text: 'cat stack.json' },
  { type: 'output', text: '["TypeScript","React","Node.js","Go","PostgreSQL"]' },
  { type: 'cmd',    text: 'git log --oneline -3' },
  { type: 'accent', text: 'a1b2c3d feat: ship CloudSync API v2' },
  { type: 'accent', text: 'e4f5g6h fix: optimize p99 latency → 48ms' },
  { type: 'accent', text: 'i7j8k9l feat: release openmetrics-js 2.0' }
];

var seqIndex  = 0;
var charIndex = 0;
var cursorEl  = null;

function createLine(type) {
  var line = document.createElement('div');
  line.className = 't-line';

  if (type === 'cmd') {
    var prompt = document.createElement('span');
    prompt.className = 't-prompt';
    prompt.textContent = '❯';

    var cmd = document.createElement('span');
    cmd.className = 't-cmd';

    cursorEl = document.createElement('span');
    cursorEl.className = 't-cursor';
    cursorEl.setAttribute('aria-hidden', 'true');
    cursorEl.textContent = '▋';

    line.appendChild(prompt);
    line.appendChild(cmd);
    line.appendChild(cursorEl);
    return { line: line, textEl: cmd };
  }

  var out = document.createElement('span');
  out.className = type === 'accent' ? 't-output-accent' : 't-output';
  line.appendChild(out);
  return { line: line, textEl: out };
}

function typeNext() {
  if (!terminalOutput || seqIndex >= terminalSequence.length) return;

  var step = terminalSequence[seqIndex];

  if (charIndex === 0) {
    var created = createLine(step.type);
    terminalOutput.appendChild(created.line);
    terminalOutput._currentTextEl = created.textEl;
    if (step.type !== 'cmd' && cursorEl) {
      cursorEl.remove();
      cursorEl = null;
    }
  }

  var textEl = terminalOutput._currentTextEl;

  if (charIndex < step.text.length) {
    textEl.textContent += step.text[charIndex];
    charIndex++;
    var delay = step.type === 'cmd' ? 55 + Math.random() * 35 : 14;
    setTimeout(typeNext, delay);
  } else {
    charIndex = 0;
    seqIndex++;
    var pauseMs = step.type === 'cmd' ? 420 : 160;
    if (seqIndex < terminalSequence.length) {
      if (step.type === 'cmd' && cursorEl) {
        cursorEl.remove();
        cursorEl = null;
      }
      setTimeout(typeNext, pauseMs);
    }
  }
}

if (terminalOutput) {
  setTimeout(typeNext, 800);
}

/* ============================================================
   Interactive demo — tab switching
   ============================================================ */
var demoTabs   = document.querySelectorAll('.demo-tab');
var codePanels = document.querySelectorAll('.code-panel');

demoTabs.forEach(function (tab) {
  tab.addEventListener('click', function () {
    var targetId = tab.getAttribute('aria-controls');

    /* Deactivate all */
    demoTabs.forEach(function (t) {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    codePanels.forEach(function (p) {
      p.classList.remove('active');
      p.hidden = true;
    });

    /* Activate selected */
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');

    var panel = document.getElementById(targetId);
    if (panel) {
      panel.classList.add('active');
      panel.hidden = false;
    }
  });
});

/* ============================================================
   Primary CTA button interaction
   ============================================================ */
var heroCta = document.getElementById('hero-cta-btn');
if (heroCta) {
  heroCta.addEventListener('click', function () {
    /* btn-primary hover is CSS-handled; add a quick ring effect */
    heroCta.style.outline = '3px solid rgba(124,111,255,0.4)';
    heroCta.style.outlineOffset = '3px';
    setTimeout(function () {
      heroCta.style.outline = '';
      heroCta.style.outlineOffset = '';
    }, 700);
  });
}

/* ============================================================
   Scroll-reveal via IntersectionObserver
   ============================================================ */
var revealEls = document.querySelectorAll(
  '.project-card, .audience-card, .stat-item, .section-head, .cta-card'
);

revealEls.forEach(function (el) {
  el.classList.add('reveal');
});

if ('IntersectionObserver' in window) {
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(function (el) {
    observer.observe(el);
  });
} else {
  /* Fallback: show everything immediately */
  revealEls.forEach(function (el) {
    el.classList.add('in-view');
  });
}

/* ============================================================
   Active nav link on scroll
   ============================================================ */
var sections = document.querySelectorAll('section[id]');
var navLinks  = document.querySelectorAll('#nav-menu .nav-link');

function updateActiveLink() {
  var scrollY = window.scrollY;
  var offset  = 80;

  sections.forEach(function (section) {
    var top    = section.offsetTop - offset;
    var bottom = top + section.offsetHeight;
    if (scrollY >= top && scrollY < bottom) {
      navLinks.forEach(function (link) {
        link.classList.remove('active-link');
        if (link.getAttribute('href') === '#' + section.id) {
          link.classList.add('active-link');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();
