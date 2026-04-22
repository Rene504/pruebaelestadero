/* =============================================
   EL ESTADERO — Main Script
   ============================================= */

document.addEventListener('DOMContentLoaded', async () => {

  // ── Fetch menu data ──────────────────────────
  let menuData;
  try {
    const res = await fetch('menu.json');
    menuData = await res.json();
  } catch (e) {
    console.error('Could not load menu.json', e);
    return;
  }

  // ── Build drawer nav links ───────────────────
  const drawerNav = document.getElementById('drawer-nav');
  menuData.categories.forEach(cat => {
    const a = document.createElement('a');
    a.href = `#cat-${cat.id}`;
    a.innerHTML = `<span class="nav-icon">${cat.icon}</span>${cat.name}`;
    a.addEventListener('click', () => closeDrawer());
    drawerNav.appendChild(a);
  });

  // ── Build menu sections ──────────────────────
  const menuEl = document.getElementById('menu-sections');

  menuData.categories.forEach(cat => {
    const block = document.createElement('div');
    block.className = 'category-block';
    block.id = `cat-${cat.id}`;

    const useTwoCol = cat.items.length >= 4 && !cat.items.some(i => i.note);

    block.innerHTML = `
      <div class="category-header">
        <span class="cat-icon">${cat.icon}</span>
        <h2 class="cat-title">${cat.name}</h2>
      </div>
      ${cat.description ? `<p class="cat-desc">${cat.description}</p>` : ''}
      <div class="menu-items${useTwoCol ? ' two-col' : ''}">
        ${cat.items.map(item => `
          <div class="menu-item">
            <div class="item-info">
              <div class="item-name">${item.name}</div>
              ${item.note ? `<div class="item-note">${item.note}</div>` : ''}
            </div>
            <div class="item-price">${item.price}</div>
          </div>
        `).join('')}
      </div>
    `;

    menuEl.appendChild(block);
  });

  // ── Restaurant info ──────────────────────────
  const r = menuData.restaurant;
  document.getElementById('info-phone').textContent    = r.phone;
  document.getElementById('info-social').textContent   = r.social;
  document.getElementById('info-address').textContent  = r.address;

  // ── Intro animation ──────────────────────────
  const intro      = document.getElementById('intro');
  const mainContent = document.getElementById('main-content');

  function revealSite() {
    intro.classList.add('hidden');
    mainContent.classList.add('visible');
  }

  // Auto-advance after animation
  const introTimer = setTimeout(revealSite, 3200);

  document.getElementById('skip-btn').addEventListener('click', () => {
    clearTimeout(introTimer);
    revealSite();
  });

  // ── Hamburger / drawer ───────────────────────
  const toggle  = document.getElementById('menu-toggle');
  const drawer  = document.getElementById('side-drawer');
  const overlay = document.getElementById('drawer-overlay');

  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    toggle.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    toggle.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    drawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });

  overlay.addEventListener('click', closeDrawer);

  // ── Navbar scroll effect ─────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // ── Smooth scroll for hero CTA ───────────────
  document.querySelector('.hero-cta')?.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
  });

});