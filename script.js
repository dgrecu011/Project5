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

// Slider controls
const sliderTrack = document.querySelector('.slider-track');
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');

const scrollAmount = () => {
  if (!sliderTrack) return 0;
  return sliderTrack.clientWidth * 0.8;
};

const slideLeft = () => {
  if (!sliderTrack) return;
  const atStart = sliderTrack.scrollLeft <= 5;
  if (atStart) {
    const max = sliderTrack.scrollWidth - sliderTrack.clientWidth;
    sliderTrack.scrollTo({ left: max, behavior: 'smooth' });
  } else {
    sliderTrack.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
  }
};
const slideRight = () => {
  if (!sliderTrack) return;
  const max = sliderTrack.scrollWidth - sliderTrack.clientWidth;
  const nearEnd = sliderTrack.scrollLeft + sliderTrack.clientWidth >= max - 5;
  if (nearEnd) {
    sliderTrack.scrollTo({ left: 0, behavior: 'smooth' });
  } else {
    sliderTrack.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
  }
};

prevBtn?.addEventListener('click', slideLeft);
nextBtn?.addEventListener('click', slideRight);
