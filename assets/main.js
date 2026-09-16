const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.global-nav');

function updateHeader() {
  const trigger = Math.max(window.innerHeight - header.offsetHeight, 120);
  header.classList.toggle('is-fixed', window.scrollY >= trigger);
}

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });
window.addEventListener('resize', updateHeader);

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  navigation.classList.toggle('is-open', !isOpen);
  header.classList.toggle('menu-open', !isOpen);
  document.body.style.overflow = isOpen ? '' : 'hidden';
});

navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuButton?.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
  header.classList.remove('menu-open');
  document.body.style.overflow = '';
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

document.querySelectorAll('[data-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');
    document.querySelectorAll('.work').forEach((work) => {
      const categories = work.dataset.category.split(' ');
      work.classList.toggle('is-hidden', selected !== 'all' && !categories.includes(selected));
    });
  });
});

const workDialog = document.getElementById('work-dialog');
document.querySelectorAll('[data-dialog="work-dialog"]').forEach((button) => button.addEventListener('click', () => workDialog?.showModal()));
document.querySelector('.dialog-close')?.addEventListener('click', () => workDialog?.close());
workDialog?.addEventListener('click', (event) => { if (event.target === workDialog) workDialog.close(); });
document.getElementById('year').textContent = new Date().getFullYear();
