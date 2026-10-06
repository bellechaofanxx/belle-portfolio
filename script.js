const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isFinePointer = window.matchMedia('(pointer: fine)').matches;

// Custom cursor
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX = mouseX;
let ringY = mouseY;

if (isFinePointer && !prefersReducedMotion) {
  window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  const animateCursor = () => {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(animateCursor);
  };
  animateCursor();

  document.querySelectorAll('a, button').forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('link-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('link-hover'));
  });
}

// Mobile menu
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  nav.classList.toggle('is-open', !isOpen);
  document.body.style.overflow = !isOpen ? 'hidden' : '';
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Case-study accordions
const caseButtons = document.querySelectorAll('.case-head');
caseButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.case');
    const currentlyOpen = button.getAttribute('aria-expanded') === 'true';

    // Keep one open at a time for a cleaner editorial layout.
    document.querySelectorAll('.case.is-open').forEach((openCard) => {
      if (openCard !== card) {
        openCard.classList.remove('is-open');
        openCard.querySelector('.case-head')?.setAttribute('aria-expanded', 'false');
      }
    });

    card.classList.toggle('is-open', !currentlyOpen);
    button.setAttribute('aria-expanded', String(!currentlyOpen));
  });
});

// Scroll reveals
const revealItems = document.querySelectorAll('.reveal');
if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -5% 0px' }
  );

  revealItems.forEach((item) => observer.observe(item));
}
