import authContext from './context/AuthContext.js';
import router, { routes } from './routes/ProtectedRoute.js';
import ModalManager from './components/common/Modal.js';
import { initLoginPage } from './pages/Login.js';
import { initRegisterPage } from './pages/Register.js';
import { renderDashboardPage } from './pages/Dashboard.js';
import { initTasksPage } from './pages/Tasks.js';
import { initNotesPage } from './pages/Notes.js';
import { initRemindersPage } from './pages/Reminders.js';
import { initChatPage } from './pages/Chat.js';

export class App {
  constructor() {
    this.init();
  }

  init() {
    // 1. Initialize global modal listeners
    ModalManager.initGlobalListeners();

    // 2. Initialize page logic
    initLoginPage();
    initRegisterPage();

    // 3. Register route handlers
    router.registerRoute(routes.LOGIN, () => this.showView('view-login'));
    router.registerRoute(routes.REGISTER, () => this.showView('view-register'));
    router.registerRoute(routes.DASHBOARD, () => {
      this.showView('view-dashboard');
      renderDashboardPage();
    });
    router.registerRoute(routes.TASKS, () => {
      this.showView('view-tasks');
      initTasksPage();
    });
    router.registerRoute(routes.NOTES, () => {
      this.showView('view-notes');
      initNotesPage();
    });
    router.registerRoute(routes.REMINDERS, () => {
      this.showView('view-reminders');
      initRemindersPage();
    });
    router.registerRoute(routes.CHAT, () => {
      this.showView('view-chat');
      initChatPage();
    });

    // 4. Setup Navbar & User Profile
    this.setupNavbar();

    // 5. Auth subscription
    authContext.subscribe(({ user, isAuthenticated }) => {
      this.updateAuthUI(user, isAuthenticated);
    });

    // 6. Mobile drawer toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
    const sidebar = document.getElementById('app-sidebar');
    if (mobileMenuBtn && sidebar) {
      mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('is-open');
      });
      // Close on nav link click
      sidebar.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', () => sidebar.classList.remove('is-open'));
      });
    }

    // 7. Logout button
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        authContext.logout();
      });
    }

    // 8. Floating AI Assistance Button
    const fabBtn = document.getElementById('fab-ai-assistance');
    if (fabBtn) {
      fabBtn.addEventListener('click', () => {
        window.location.hash = '#chat';
      });
    }

    // Initial navigation
    router.handleNavigation();
  }

  setupNavbar() {
    // Highlight active nav links on route change
    window.addEventListener('campus:route-changed', (e) => {
      const activeRoute = e.detail.route;
      document.querySelectorAll('.nav-link').forEach((link) => {
        const href = link.getAttribute('href');
        if (href === `#${activeRoute}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    });
  }

  updateAuthUI(user, isAuthenticated) {
    const appShell = document.getElementById('app-authenticated-shell');
    const authShell = document.getElementById('app-public-auth-shell');
    const fabBtn = document.getElementById('fab-ai-assistance');

    if (isAuthenticated && user) {
      if (appShell) appShell.style.display = 'flex';
      if (authShell) authShell.style.display = 'none';
      if (fabBtn) fabBtn.style.display = 'flex';

      // Update user name in header
      const userNameEl = document.getElementById('header-user-name');
      if (userNameEl) userNameEl.textContent = user.name || 'Student';

      const userDeptEl = document.getElementById('header-user-dept');
      if (userDeptEl) userDeptEl.textContent = user.department || 'Campus Pilot';

      const userAvatarEl = document.getElementById('header-user-avatar');
      if (userAvatarEl) {
        userAvatarEl.textContent = (user.name || 'S').charAt(0).toUpperCase();
      }
    } else {
      if (appShell) appShell.style.display = 'none';
      if (authShell) authShell.style.display = 'flex';
      if (fabBtn) fabBtn.style.display = 'none';
    }
  }

  showView(viewId) {
    document.querySelectorAll('.app-page-view').forEach((view) => {
      if (view.id === viewId) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

export default App;
