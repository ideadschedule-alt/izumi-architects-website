const body = document.body;
const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.global-nav');

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('is-open', !open);
  body.classList.toggle('menu-open', !open);
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuButton?.setAttribute('aria-expanded', 'false');
  nav.classList.remove('is-open');
  body.classList.remove('menu-open');
}));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

document.querySelectorAll('[data-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    const category = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');
    document.querySelectorAll('.work-card').forEach((card) => {
      const categories = card.dataset.category.split(' ');
      card.classList.toggle('is-hidden', category !== 'all' && !categories.includes(category));
    });
  });
});

const workDialog = document.getElementById('work-dialog');
const confirmDialog = document.getElementById('confirm-dialog');
document.querySelectorAll('[data-dialog="work-dialog"]').forEach((button) => {
  button.addEventListener('click', () => workDialog?.showModal());
});
document.querySelectorAll('.dialog-close').forEach((button) => {
  button.addEventListener('click', () => button.closest('dialog')?.close());
});
document.querySelectorAll('dialog').forEach((dialog) => {
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
});

let counted = false;
const stats = document.querySelector('.stats');
const countObserver = new IntersectionObserver((entries) => {
  if (!entries[0].isIntersecting || counted) return;
  counted = true;
  document.querySelectorAll('[data-count]').forEach((item) => {
    const target = Number(item.dataset.count);
    const suffix = item.dataset.suffix || '';
    const start = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - start) / 1000, 1);
      item.textContent = `${Math.round(target * (1 - Math.pow(1 - progress, 3)))}${suffix}`;
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  });
}, { threshold: 0.5 });
if (stats) countObserver.observe(stats);

const form = document.getElementById('contact-form');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  document.getElementById('confirm-content').innerHTML = `<dl>
    <div><dt>お問い合わせ種別</dt><dd>${escapeHTML(data.get('type'))}</dd></div>
    <div><dt>お名前</dt><dd>${escapeHTML(data.get('name'))}</dd></div>
    <div><dt>メールアドレス</dt><dd>${escapeHTML(data.get('email'))}</dd></div>
    <div><dt>お問い合わせ内容</dt><dd>${escapeHTML(data.get('message'))}</dd></div>
  </dl>`;
  confirmDialog.showModal();
});
document.querySelector('.dialog-back')?.addEventListener('click', () => confirmDialog.close());

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
}

document.getElementById('year').textContent = new Date().getFullYear();
