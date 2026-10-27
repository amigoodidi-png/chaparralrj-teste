// header solidifica ao rolar
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.style.borderColor = window.scrollY > 40 ? 'rgba(163,32,32,0.4)' : 'var(--border)';
});

// reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
