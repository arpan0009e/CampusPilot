import authContext from '../context/AuthContext.js';

export const routes = {
  LOGIN: 'login',
  REGISTER: 'register',
  DASHBOARD: 'dashboard',
  TASKS: 'tasks',
  NOTES: 'notes',
  REMINDERS: 'reminders',
  CHAT: 'chat',
};

const PUBLIC_ROUTES = [routes.LOGIN, routes.REGISTER];

export class Router {
  constructor() {
    this.currentRoute = null;
    this.routeHandlers = new Map();
    this.init();
  }

  init() {
    window.addEventListener('hashchange', () => this.handleNavigation());
    window.addEventListener('load', () => this.handleNavigation());
  }

  registerRoute(routeName, handler) {
    this.routeHandlers.set(routeName, handler);
  }

  getRouteFromHash() {
    const raw = window.location.hash.replace(/^#\/?/, '').trim();
    if (!raw) {
      return authContext.isAuthenticated() ? routes.DASHBOARD : routes.LOGIN;
    }
    const clean = raw.split('?')[0].toLowerCase();
    return Object.values(routes).includes(clean) ? clean : routes.DASHBOARD;
  }

  navigate(routeName) {
    window.location.hash = `#${routeName}`;
  }

  handleNavigation() {
    let target = this.getRouteFromHash();
    const isAuthed = authContext.isAuthenticated();

    // Route Guard check
    if (!isAuthed && !PUBLIC_ROUTES.includes(target)) {
      // Preserve requested route for after login if desired, redirect to login
      target = routes.LOGIN;
      if (window.location.hash !== `#${routes.LOGIN}`) {
        window.location.hash = `#${routes.LOGIN}`;
        return;
      }
    } else if (isAuthed && PUBLIC_ROUTES.includes(target)) {
      target = routes.DASHBOARD;
      if (window.location.hash !== `#${routes.DASHBOARD}`) {
        window.location.hash = `#${routes.DASHBOARD}`;
        return;
      }
    }

    this.currentRoute = target;
    const handler = this.routeHandlers.get(target);
    if (handler) {
      handler(target);
    }
    window.dispatchEvent(new CustomEvent('campus:route-changed', { detail: { route: target } }));
  }
}

export const router = new Router();
export default router;
