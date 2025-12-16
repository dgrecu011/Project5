// Smooth scroll for nav links
const navLinks = document.querySelectorAll('.nav nav a[href^="#"]');
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Accordion
const items = document.querySelectorAll('.accordion__item');
items.forEach(item => {
  item.addEventListener('click', () => {
    const expanded = item.getAttribute('aria-expanded') === 'true';
    items.forEach(i => i.setAttribute('aria-expanded', 'false'));
    item.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  });
});

// Back to top visibility
const backToTop = document.querySelector('.back-to-top');
const toggleBackToTop = () => {
  if (!backToTop) return;
  const show = window.scrollY > 280;
  backToTop.classList.toggle('visible', show);
};
toggleBackToTop();
window.addEventListener('scroll', toggleBackToTop);

// Slider controls (looping with clones)
const sliderTrack = document.querySelector('.slider-track');
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');
const slides = sliderTrack ? Array.from(sliderTrack.children) : [];
let currentIndex = 0;
let stepSize = 0;
let startX = 0;
let currentTranslate = 0;
let isDragging = false;
let mobileMode = false;

const computeStep = () => {
  if (!sliderTrack || slides.length === 0) return 0;
  const style = getComputedStyle(sliderTrack);
  const gap = parseFloat(style.columnGap || style.gap || '18');
  return slides[0].getBoundingClientRect().width + gap;
};

const updateSlider = (instant = false) => {
  if (!sliderTrack || mobileMode) return;
  sliderTrack.style.transition = instant ? 'none' : 'transform 0.45s ease';
  sliderTrack.style.transform = `translateX(-${currentIndex * stepSize}px)`;
};

const initSlider = () => {
  stepSize = computeStep();
  currentIndex = 0;
  updateSlider(true);
  void sliderTrack?.offsetWidth;
  if (sliderTrack) sliderTrack.style.transition = 'transform 0.45s ease';
};

const handleNext = () => {
  if (!slides.length || mobileMode) return;
  currentIndex = (currentIndex + 1) % slides.length;
  updateSlider();
};

const handlePrev = () => {
  if (!slides.length || mobileMode) return;
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateSlider();
};

prevBtn?.addEventListener('click', handlePrev);
nextBtn?.addEventListener('click', handleNext);

const detectMode = () => {
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const narrow = window.innerWidth <= 768;
  const nextMode = coarse || narrow;
  if (nextMode !== mobileMode) {
    mobileMode = nextMode;
    if (mobileMode) {
      sliderTrack?.classList.add('mobile-scroll');
      if (sliderTrack) {
        sliderTrack.style.transition = 'none';
        sliderTrack.style.transform = 'none';
      }
    } else {
      sliderTrack?.classList.remove('mobile-scroll');
      initSlider();
    }
  } else if (!mobileMode) {
    initSlider();
  }
};

detectMode();
initSlider();

window.addEventListener('resize', () => {
  detectMode();
});

// Touch drag/swipe for mobile
const touchStart = (e) => {
  if (!sliderTrack || mobileMode) return;
  isDragging = true;
  startX = e.touches ? e.touches[0].clientX : e.clientX;
  sliderTrack.style.transition = 'none';
  currentTranslate = -currentIndex * stepSize;
};

const touchMove = (e) => {
  if (!isDragging || !sliderTrack || mobileMode) return;
  const x = e.touches ? e.touches[0].clientX : e.clientX;
  const delta = x - startX;
  sliderTrack.style.transform = `translateX(${currentTranslate + delta}px)`;
};

const touchEnd = (e) => {
  if (!isDragging || mobileMode) return;
  isDragging = false;
  if (!sliderTrack) return;
  const x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
  const delta = x - startX;
  const threshold = stepSize * 0.25;
  if (delta < -threshold) handleNext();
  else if (delta > threshold) handlePrev();
  else updateSlider();
};

sliderTrack?.addEventListener('touchstart', touchStart, { passive: true });
sliderTrack?.addEventListener('touchmove', touchMove, { passive: true });
sliderTrack?.addEventListener('touchend', touchEnd);
sliderTrack?.addEventListener('mousedown', touchStart);
window.addEventListener('mousemove', touchMove);
window.addEventListener('mouseup', touchEnd);

// Reveal on scroll
const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('show');
      });
    },
    { threshold: 0.15 }
  );
  revealElements.forEach(el => observer.observe(el));
} else {
  revealElements.forEach(el => el.classList.add('show'));
}
