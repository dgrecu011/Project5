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
let slides = sliderTrack ? Array.from(sliderTrack.children) : [];
let currentIndex = 1;
let stepSize = 0;

const buildClones = () => {
  if (!sliderTrack || !slides.length) return;
  const first = slides[0].cloneNode(true);
  const last = slides[slides.length - 1].cloneNode(true);
  sliderTrack.appendChild(first);
  sliderTrack.insertBefore(last, slides[0]);
  slides = Array.from(sliderTrack.children);
};

const computeStep = () => {
  if (!sliderTrack || slides.length === 0) return 0;
  const style = getComputedStyle(sliderTrack);
  const gap = parseFloat(style.columnGap || style.gap || '18');
  return slides[0].offsetWidth + gap;
};

const applyTransform = (instant = false) => {
  if (!sliderTrack) return;
  sliderTrack.style.transition = instant ? 'none' : 'transform 0.45s ease';
  sliderTrack.style.transform = `translateX(-${currentIndex * stepSize}px)`;
};

const initSlider = () => {
  if (!sliderTrack || !slides.length) return;
  buildClones();
  stepSize = computeStep();
  currentIndex = 1;
  applyTransform(true);
  // force reflow to re-enable transition
  void sliderTrack.offsetWidth;
  sliderTrack.style.transition = 'transform 0.45s ease';
};

const handleNext = () => {
  if (!sliderTrack) return;
  currentIndex += 1;
  applyTransform();
};

const handlePrev = () => {
  if (!sliderTrack) return;
  currentIndex -= 1;
  applyTransform();
};

const onTransitionEnd = () => {
  if (!sliderTrack || slides.length === 0) return;
  // if we've moved past the last real slide
  if (currentIndex === slides.length - 1) {
    currentIndex = 1;
    applyTransform(true);
    void sliderTrack.offsetWidth;
    sliderTrack.style.transition = 'transform 0.45s ease';
  }
  // if we've moved before the first real slide
  if (currentIndex === 0) {
    currentIndex = slides.length - 2;
    applyTransform(true);
    void sliderTrack.offsetWidth;
    sliderTrack.style.transition = 'transform 0.45s ease';
  }
};

prevBtn?.addEventListener('click', handlePrev);
nextBtn?.addEventListener('click', handleNext);
sliderTrack?.addEventListener('transitionend', onTransitionEnd);

window.addEventListener('resize', () => {
  stepSize = computeStep();
  applyTransform(true);
});

initSlider();
