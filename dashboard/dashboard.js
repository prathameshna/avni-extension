document.addEventListener('DOMContentLoaded', () => {

  // ── Sidebar navigation ────────────────────────────────────────────────────
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.content-section');
  const breadcrumb = document.querySelector('.topbar-breadcrumb');

  const sectionNames = {
    overview:  'Dashboard / Session Overview',
    tokens:    'Dashboard / Token Manager',
    clipboard: 'Dashboard / Clipboard',
    context:   'Dashboard / Context',
    settings:  'Dashboard / Settings',
  };

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(n => n.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));
      item.classList.add('active');
      const id = item.getAttribute('data-section');
      document.getElementById(id)?.classList.add('active');
      if (breadcrumb) breadcrumb.textContent = sectionNames[id] || 'Dashboard';
    });
  });

  // ── Close button ──────────────────────────────────────────────────────────
  document.getElementById('btn-close')?.addEventListener('click', () => {
    // If embedded in the extension panel iframe, tell parent to close
    if (window.self !== window.top) {
      window.parent.postMessage({ avni: 'close' }, '*');
    } else {
      window.close();
    }
  });

  // ── Drag to move (only when embedded as iframe in extension panel) ────────
  const dragBar = document.querySelector('.drag-bar');
  if (dragBar && window.self !== window.top) {
    dragBar.addEventListener('mousedown', e => {
      if (e.target.closest('button')) return;
      window.parent.postMessage({ avni: 'dragStart', x: e.screenX, y: e.screenY }, '*');
    });
  }

});