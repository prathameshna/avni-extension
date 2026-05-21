

/**
 * Main Content Script for Avni Extension
 */
console.log('[Avni] Content script loaded.');

// Initialize the core engine which detects platform and sets up observers


const DASHBOARD_URL = chrome.runtime.getURL('dashboard/dashboard.html');
const OVERLAY_ID = 'avni-dashboard-overlay';
const SHORTCUT_KEY = 'Slash';

function isEditableTarget(target) {
  if (!target) return false;

  const tagName = target.tagName;
  return (
    target.isContentEditable ||
    tagName === 'INPUT' ||
    tagName === 'TEXTAREA' ||
    tagName === 'SELECT'
  );
}

function buildOverlay() {
  const overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  overlay.className = 'avni-dashboard-overlay';
  const handles = ['top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];
  const handlesHTML = handles.map(pos => `<div class="avni-resize-handle ${pos}" data-avni-resize="${pos}"></div>`).join('');
  
  overlay.innerHTML = `
    <section class="avni-dashboard-panel" role="dialog" aria-modal="true" aria-label="Avni Dashboard">
      ${handlesHTML}
      <header class="avni-dashboard-header">
        <div class="avni-dashboard-title">
          <span class="avni-dashboard-dot"></span>
          <span>Avni Dashboard</span>
        </div>
        <div class="avni-dashboard-actions">
          <button type="button" class="avni-dashboard-icon-button" data-avni-toggle-fullscreen="true" aria-label="Toggle fullscreen">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button type="button" class="avni-dashboard-icon-button" data-avni-close="true" aria-label="Close dashboard">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </header>
      <iframe class="avni-dashboard-frame" src="${DASHBOARD_URL}" title="Avni Dashboard"></iframe>
    </section>
  `;

  const panel = overlay.querySelector('.avni-dashboard-panel');
  const header = overlay.querySelector('.avni-dashboard-header');

  // --- Dragging Logic ---
  let isDragging = false;
  let dragStartX, dragStartY, dragStartLeft, dragStartTop;

  const onDragMove = (e) => {
    if (!isDragging) return;
    panel.style.left = `${dragStartLeft + (e.clientX - dragStartX)}px`;
    panel.style.top = `${dragStartTop + (e.clientY - dragStartY)}px`;
    panel.style.bottom = 'auto';
    panel.style.right = 'auto';
  };

  const onDragEnd = () => {
    isDragging = false;
    panel.classList.remove('is-dragging');
    document.removeEventListener('mousemove', onDragMove);
    document.removeEventListener('mouseup', onDragEnd);
    
    const iframe = panel.querySelector('iframe');
    if (iframe) iframe.style.pointerEvents = 'auto';
  };

  header.addEventListener('mousedown', (e) => {
    if (e.target.closest('.avni-dashboard-actions')) return;
    if (panel.classList.contains('is-fullscreen')) return;
    
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    const rect = panel.getBoundingClientRect();
    dragStartLeft = rect.left;
    dragStartTop = rect.top;
    
    panel.style.width = `${rect.width}px`;
    panel.style.height = `${rect.height}px`;
    panel.style.transform = 'none';
    panel.style.transition = 'none';
    panel.classList.add('is-dragging');
    
    const iframe = panel.querySelector('iframe');
    if (iframe) iframe.style.pointerEvents = 'none';
    
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);
  });

  // --- Resizing Logic ---
  let isResizing = false;
  let currentHandle = '';
  let resStartX, resStartY, resStartWidth, resStartHeight, resStartLeft, resStartTop;

  const onResizeMove = (e) => {
    if (!isResizing) return;
    e.preventDefault(); // Prevent text selection
    
    const dx = e.clientX - resStartX;
    const dy = e.clientY - resStartY;
    
    let newWidth = resStartWidth;
    let newHeight = resStartHeight;
    let newLeft = resStartLeft;
    let newTop = resStartTop;
    
    if (currentHandle.includes('right')) newWidth = resStartWidth + dx;
    if (currentHandle.includes('left')) {
      newWidth = resStartWidth - dx;
      newLeft = resStartLeft + dx;
    }
    if (currentHandle.includes('bottom')) newHeight = resStartHeight + dy;
    if (currentHandle.includes('top')) {
      newHeight = resStartHeight - dy;
      newTop = resStartTop + dy;
    }
    
    // Apply min sizes
    const minW = 420, minH = 420;
    if (newWidth >= minW) {
      panel.style.width = `${newWidth}px`;
      panel.style.left = `${newLeft}px`;
    }
    if (newHeight >= minH) {
      panel.style.height = `${newHeight}px`;
      panel.style.top = `${newTop}px`;
    }
    
    panel.style.bottom = 'auto';
    panel.style.right = 'auto';
  };

  const onResizeEnd = () => {
    isResizing = false;
    document.removeEventListener('mousemove', onResizeMove);
    document.removeEventListener('mouseup', onResizeEnd);
    
    // Re-enable iframe pointer events if we disabled them
    const iframe = panel.querySelector('iframe');
    if (iframe) iframe.style.pointerEvents = 'auto';
  };

  panel.addEventListener('mousedown', (e) => {
    const handle = e.target.closest('.avni-resize-handle');
    if (!handle) return;
    if (panel.classList.contains('is-fullscreen')) return;
    
    isResizing = true;
    currentHandle = handle.dataset.avniResize;
    resStartX = e.clientX;
    resStartY = e.clientY;
    
    const rect = panel.getBoundingClientRect();
    resStartWidth = rect.width;
    resStartHeight = rect.height;
    resStartLeft = rect.left;
    resStartTop = rect.top;
    
    panel.style.transform = 'none';
    panel.style.transition = 'none';
    
    // Disable iframe pointer events during resize to avoid stealing mousemove
    const iframe = panel.querySelector('iframe');
    if (iframe) iframe.style.pointerEvents = 'none';
    
    document.addEventListener('mousemove', onResizeMove);
    document.addEventListener('mouseup', onResizeEnd);
  });

  overlay.addEventListener('click', (event) => {
    const closeTrigger = event.target.closest('[data-avni-close="true"]');
    const fullscreenTrigger = event.target.closest('[data-avni-toggle-fullscreen="true"]');

    if (closeTrigger) {
      closeDashboardOverlay();
      return;
    }

    if (fullscreenTrigger) {
      if (panel) {
        panel.classList.toggle('is-fullscreen');
        if (panel.classList.contains('is-fullscreen')) {
          panel.style.transform = '';
          panel.style.transition = '';
        } else {
          // Returning from fullscreen, re-apply transition for smooth snapping back
          panel.style.transition = 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1), opacity 220ms ease, border-radius 220ms ease, inset 220ms ease';
        }
      }
    }
  });

  return overlay;
}

function openDashboardOverlay() {
  let overlay = document.getElementById(OVERLAY_ID);

  if (!overlay) {
    overlay = buildOverlay();
    (document.body || document.documentElement).appendChild(overlay);
    
    // Force a reflow to ensure the CSS transition fires correctly
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.classList.add('is-open');
      });
    });
    return;
  }

  overlay.classList.add('is-open');
}

function closeDashboardOverlay() {
  const overlay = document.getElementById(OVERLAY_ID);
  if (!overlay) return;

  overlay.classList.remove('is-open');
  const panel = overlay.querySelector('.avni-dashboard-panel');
  if (panel) {
    panel.classList.remove('is-fullscreen');
  }
}

function toggleDashboardOverlay() {
  const overlay = document.getElementById(OVERLAY_ID);
  if (overlay && overlay.classList.contains('is-open')) {
    closeDashboardOverlay();
    return;
  }

  openDashboardOverlay();
}

document.addEventListener('keydown', (event) => {
  const isShortcut = event.code === SHORTCUT_KEY && (event.shiftKey || event.ctrlKey);

  if (!isShortcut || isEditableTarget(event.target)) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  toggleDashboardOverlay();
}, true);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request?.type === 'AVNI_TOGGLE_DASHBOARD') {
    toggleDashboardOverlay();
    sendResponse({ success: true, open: true });
    return false;
  }

  if (request?.type === 'AVNI_OPEN_DASHBOARD') {
    openDashboardOverlay();
    sendResponse({ success: true, open: true });
    return false;
  }

  if (request?.type === 'AVNI_CLOSE_DASHBOARD') {
    closeDashboardOverlay();
    sendResponse({ success: true, open: false });
    return false;
  }

  if (request?.type === 'PING') {
    sendResponse({ status: 'active', platform: typeof engine !== 'undefined' ? engine.platform : 'unknown' });
  }
});
