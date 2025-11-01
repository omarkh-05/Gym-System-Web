document.addEventListener("DOMContentLoaded", function() {
  const slider = document.querySelector('.imgslide');
  const dots = document.querySelectorAll('.dot');
  const thumbs = document.querySelectorAll('.work-thumb');
  let current = 0;

  const slideWidth = thumbs[0]?.offsetWidth + 100 || 0;

  function goToSlide(index) {
    current = index;
    slider.scrollTo({
      left: slideWidth * index,
      behavior: 'smooth'
    });
    dots.forEach(d => d.classList.remove('active'));
    dots[index].classList.add('active');
  }

  // Dot controls
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
    });
  });

  // Optional: update dots during touch scroll
  slider?.addEventListener('scroll', () => {
    const index = Math.round(slider.scrollLeft / slideWidth);
    if (index !== current) {
      current = index;
      dots.forEach((d, i) => {
        d.classList.toggle('active', i === index);
      });
    }
  });
});