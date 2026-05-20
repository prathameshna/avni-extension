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
      // TODO: Replace with chrome.tabs.create for full page, or chrome.sidePanel based on implementation
      chrome.tabs.create({ url: chrome.runtime.getURL('dashboard/dashboard.html') });
    });
  }

  // TODO: Load data from background script / storage
  // TODO: Implement clipboard search filtering
});
