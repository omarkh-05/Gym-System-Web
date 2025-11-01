// Enhanced smooth scroll navigation
document.addEventListener('DOMContentLoaded', function(){
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('nav-links');
  if(!toggle || !nav) return;

  // Handle all navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get the target element
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Close mobile menu if open
        nav.classList.remove('show');
        toggle.setAttribute('aria-expanded', 'false');
        
        // Calculate header height for offset
        const headerHeight = document.querySelector('.site-header').offsetHeight;
        
        // Get element position
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

        // Smooth scroll with offset
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });

  toggle.addEventListener('click', function(){
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('show');
  });

  // Close nav on Escape
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && nav.classList.contains('show')){
      nav.classList.remove('show');
      toggle.setAttribute('aria-expanded','false');
      toggle.focus();
    }
  });
});
