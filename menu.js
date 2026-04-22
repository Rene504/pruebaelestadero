/* =============================================
   EL ESTADERO — menu.js v2
   Tab-based menu, drawer, info modal
   ============================================= */

document.addEventListener('DOMContentLoaded', async () => {

  // ── Load data ────────────────────────────────
  let data;
  try {
    const res = await fetch('menu.json');
    data = await res.json();
  } catch (e) {
    console.error('No se pudo cargar menu.json', e);
    return;
  }

  const { restaurant: r, categories } = data;

  // ── DOM refs ─────────────────────────────────
  const intro       = document.getElementById('intro');
  const app         = document.getElementById('app');
  const tabBar      = document.getElementById('tab-bar');
  const menuPanel   = document.getElementById('menu-panel');
  const drawerNav   = document.getElementById('drawer-nav');
  const drawer      = document.getElementById('side-drawer');
  const dOverlay    = document.getElementById('drawer-overlay');
  const menuToggle  = document.getElementById('menu-toggle');
  const infoBtn     = document.getElementById('info-btn');
  const infoOverlay = document.getElementById('info-overlay');
  const infoClose   = document.getElementById('info-close');

  // ── Build tabs + panels ───────────────────────
  categories.forEach((cat, i) => {
    // Tab button
    const tab = document.createElement('button');
    tab.className = 'tab-btn' + (i === 0 ? ' active' : '');
    tab.dataset.id = cat.id;
    tab.innerHTML = `<span class="tab-icon">${cat.icon}</span>${cat.name}`;
    tab.addEventListener('click', () => switchTab(cat.id));
    tabBar.appendChild(tab);

    // Drawer nav button
    const dbtn = document.createElement('button');
    dbtn.dataset.id = cat.id;
    dbtn.className = i === 0 ? 'active' : '';
    dbtn.innerHTML = `<span class="d-icon">${cat.icon}</span>${cat.name}`;
    dbtn.addEventListener('click', () => { switchTab(cat.id); closeDrawer(); });
    drawerNav.appendChild(dbtn);

    // Panel
    const panel = document.createElement('div');
    panel.className = 'category-panel' + (i === 0 ? ' active' : '');
    panel.id = `panel-${cat.id}`;

    // Image or plain header
    if (cat.image) {
      panel.innerHTML += `
        <div class="cat-image-wrap">
          <img src="${cat.image}" alt="${cat.name}" loading="lazy"
               onerror="this.parentElement.style.display='none'; document.getElementById('header-plain-${cat.id}').style.display='block'">
          <div class="cat-image-overlay">
            <h2>${cat.icon} ${cat.name}</h2>
            ${cat.description ? `<p>${cat.description}</p>` : ''}
          </div>
        </div>
        <div class="cat-header-plain" id="header-plain-${cat.id}" style="display:none">
          <h2><span>${cat.icon}</span>${cat.name}</h2>
          ${cat.description ? `<p>${cat.description}</p>` : ''}
        </div>
      `;
    } else {
      panel.innerHTML += `
        <div class="cat-header-plain">
          <h2><span>${cat.icon}</span> ${cat.name}</h2>
          ${cat.description ? `<p>${cat.description}</p>` : ''}
        </div>
      `;
    }

    // Items list — two-col if many items without notes
    const twoCol = cat.items.length >= 5 && !cat.items.some(it => it.note);
    const list = document.createElement('div');
    list.className = 'items-list' + (twoCol ? ' two-col' : '');

    cat.items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'menu-item';
      div.innerHTML = `
        <div class="item-left">
          <div class="item-name">${item.name}</div>
          ${item.note ? `<div class="item-note">${item.note}</div>` : ''}
        </div>
        <div class="item-price">${item.price}</div>
      `;
      list.appendChild(div);
    });

    panel.appendChild(list);
    menuPanel.appendChild(panel);
  });

  // ── Tab switching ─────────────────────────────
  function switchTab(id) {
    // Tabs
    tabBar.querySelectorAll('.tab-btn').forEach(t => t.classList.toggle('active', t.dataset.id === id));
    // Drawer buttons
    drawerNav.querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset.id === id));
    // Panels
    menuPanel.querySelectorAll('.category-panel').forEach(p => p.classList.toggle('active', p.id === `panel-${id}`));
    // Scroll active tab into view
    const activeTab = tabBar.querySelector(`.tab-btn[data-id="${id}"]`);
    activeTab?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    // Reset panel scroll to top
    menuPanel.scrollTop = 0;
  }

  // ── Info modal ────────────────────────────────
  document.getElementById('info-phone').textContent   = r.phone;
  document.getElementById('info-address').textContent = r.address;
  document.getElementById('info-phone-link').href     = `tel:${r.phone.replace(/\D/g, '')}`;
  document.getElementById('info-phone-link').textContent = r.phone;
  document.getElementById('info-wa-link').href        = `https://wa.me/${r.whatsapp}`;
  document.getElementById('info-ig-link').href        = r.instagram;
  document.getElementById('info-ig-link').textContent = r.social;
  document.getElementById('info-fb-link').href        = r.facebook;
  document.getElementById('info-fb-link').textContent = r.social;

  infoBtn.addEventListener('click', () => infoOverlay.classList.add('open'));
  infoClose.addEventListener('click', () => infoOverlay.classList.remove('open'));
  infoOverlay.addEventListener('click', e => { if (e.target === infoOverlay) infoOverlay.classList.remove('open'); });

  // ── Drawer ────────────────────────────────────
  function openDrawer()  { drawer.classList.add('open'); dOverlay.classList.add('open'); menuToggle.classList.add('open'); }
  function closeDrawer() { drawer.classList.remove('open'); dOverlay.classList.remove('open'); menuToggle.classList.remove('open'); }

  menuToggle.addEventListener('click', () => drawer.classList.contains('open') ? closeDrawer() : openDrawer());
  dOverlay.addEventListener('click', closeDrawer);

  // ── Intro ─────────────────────────────────────
  function revealApp() {
    intro.classList.add('hidden');
    app.classList.add('visible');
  }

  const t = setTimeout(revealApp, 3000);
  document.getElementById('skip-btn').addEventListener('click', () => { clearTimeout(t); revealApp(); });

});
