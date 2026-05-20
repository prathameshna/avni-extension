document.addEventListener('DOMContentLoaded', () => {
  // Navigation Sidebar Logic
  const navItems = document.querySelectorAll('.nav-item');
  const contentSections = document.querySelectorAll('.content-section');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();

      // Remove active class from all nav items and sections
      navItems.forEach(n => n.classList.remove('active'));
      contentSections.forEach(s => s.classList.remove('active'));

      // Add active class to clicked item and target section
      item.classList.add('active');
      const targetId = item.getAttribute('data-section');
      document.getElementById(targetId).classList.add('active');
    });
  });

  // TODO: Fetch dashboard stats from background/storage
  // TODO: Render clipboard history dynamically
  // TODO: Render contexts dynamically
});
