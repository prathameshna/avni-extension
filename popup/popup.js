document.addEventListener('DOMContentLoaded', () => {
  // Tab Switching Logic
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons and contents
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      // Add active class to clicked button and target content
      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      document.getElementById(targetId).classList.add('active');
    });
  });

  // Open Dashboard Logic
  const openDashboardBtn = document.getElementById('open-dashboard');
  if (openDashboardBtn) {
    openDashboardBtn.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];

        if (!activeTab?.id) {
          return;
        }

        chrome.tabs.sendMessage(activeTab.id, { type: 'AVNI_TOGGLE_DASHBOARD' }, () => {
          if (chrome.runtime.lastError) {
            console.warn('[Avni] Content script missing. Injecting dynamically...');
            
            // Inject CSS first, then JS, then toggle
            chrome.scripting.insertCSS({
              target: { tabId: activeTab.id },
              files: ['content/content.css']
            }).then(() => {
              return chrome.scripting.executeScript({
                target: { tabId: activeTab.id },
                files: ['content/content.js']
              });
            }).then(() => {
              chrome.tabs.sendMessage(activeTab.id, { type: 'AVNI_TOGGLE_DASHBOARD' });
              window.close();
            }).catch(err => {
              console.error('[Avni] Failed to inject:', err);
            });
          } else {
            window.close();
          }
        });
      });
    });
  }

  // TODO: Load data from background script / storage
  // TODO: Implement clipboard search filtering
});
