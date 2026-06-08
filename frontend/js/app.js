const App = {
  currentPage: '',

  init(page) {
    this.currentPage = page;
    this.setupMobileMenu();
    this.setupSidebar(page);
    this.setupUserInfo();
    this.setupLogout();
  },

  setupMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('sidebar');
    if (btn && sidebar) {
      btn.addEventListener('click', () => sidebar.classList.toggle('open'));
    }
  },

  setupSidebar(activePage) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach((item) => {
      if (item.dataset.page === activePage) {
        item.classList.add('active');
      }
    });
  },

  setupUserInfo() {
    const user = Auth.getUser();
    if (!user) return;

    const avatar = document.getElementById('user-avatar');
    const name = document.getElementById('user-name');
    const email = document.getElementById('user-email');

    if (avatar) avatar.textContent = Auth.getInitials(user.fullName);
    if (name) name.textContent = user.fullName;
    if (email) email.textContent = user.email;
  },

  setupLogout() {
    const btn = document.getElementById('logout-btn');
    if (btn) {
      btn.addEventListener('click', () => Auth.logout());
    }
  },

  showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => toast.remove(), 4000);
  },

  showError(el, message) {
    if (!el) return;
    el.innerHTML = `<div class="alert alert-error">${message}</div>`;
  },

  clearError(el) {
    if (el) el.innerHTML = '';
  },

  formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-BD', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  },

  formatRelative(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return this.formatDate(dateStr);
  },

  statusBadge(status) {
    const map = {
      completed: 'badge-success',
      in_progress: 'badge-warning',
      pending: 'badge-muted',
      not_started: 'badge-muted',
      active: 'badge-success',
      easy: 'badge-success',
      medium: 'badge-warning',
      hard: 'badge-info',
    };
    const cls = map[status] || 'badge-muted';
    const label = (status || 'unknown').replace(/_/g, ' ');
    return `<span class="badge ${cls}">${label}</span>`;
  },

  sidebarHTML(activePage) {
    const pages = [
      { page: 'dashboard', href: 'dashboard.html', icon: '📊', label: 'Dashboard' },
      { page: 'ai-tutor', href: 'ai-tutor.html', icon: '🤖', label: 'AI Tutor' },
      { page: 'roadmap', href: 'roadmap.html', icon: '🗺️', label: 'Roadmap' },
      { page: 'goals', href: 'goals.html', icon: '🎯', label: 'Daily Goals' },
      { page: 'coding', href: 'coding.html', icon: '💻', label: 'Coding' },
      { page: 'notes', href: 'notes.html', icon: '📝', label: 'Notes' },
      { page: 'profile', href: 'profile.html', icon: '👤', label: 'Profile' },
    ];

    return pages
      .map(
        (p) =>
          `<a href="${p.href}" class="nav-item${p.page === activePage ? ' active' : ''}" data-page="${p.page}">
            <span class="icon">${p.icon}</span> ${p.label}
          </a>`,
      )
      .join('');
  },
};

function renderAppShell(activePage, title, subtitle) {
  return `
    <button class="mobile-menu-btn" id="mobile-menu-btn">☰</button>
    <div class="app-layout">
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
          <a href="dashboard.html" class="logo">
            <span class="logo-icon">N</span> NexLearn
          </a>
        </div>
        <nav class="sidebar-nav">${App.sidebarHTML(activePage)}</nav>
        <div class="sidebar-footer">
          <div class="user-info">
            <div class="user-avatar" id="user-avatar">?</div>
            <div>
              <div class="user-name" id="user-name">Student</div>
              <div class="user-email" id="user-email">—</div>
            </div>
          </div>
          <button class="btn btn-ghost btn-block" id="logout-btn">Sign out</button>
        </div>
      </aside>
      <main class="main-content">
        <div class="page-header">
          <h1>${title}</h1>
          ${subtitle ? `<p>${subtitle}</p>` : ''}
        </div>
        <div id="page-content"></div>
      </main>
    </div>
  `;
}
