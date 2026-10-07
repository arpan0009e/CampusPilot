import authService from '../services/authService.js';

class AuthContextManager {
  constructor() {
    this.user = authService.getCurrentUser();
    this.token = authService.getToken();
    this.listeners = new Set();

    // Listen to window auth events
    window.addEventListener('campus:auth-change', (e) => {
      this.user = e.detail?.user || null;
      this.token = e.detail?.token || '';
      this.notify();
    });

    window.addEventListener('campus:unauthorized', () => {
      this.logout();
    });
  }

  subscribe(listener) {
    this.listeners.add(listener);
    // Initial call
    listener({ user: this.user, token: this.token, isAuthenticated: this.isAuthenticated() });
    return () => this.listeners.delete(listener);
  }

  notify() {
    const state = {
      user: this.user,
      token: this.token,
      isAuthenticated: this.isAuthenticated(),
    };
    for (const listener of this.listeners) {
      try {
        listener(state);
      } catch (err) {
        console.error('Error in auth listener:', err);
      }
    }
  }

  isAuthenticated() {
    return Boolean(this.token);
  }

  async login(email, password) {
    const res = await authService.login(email, password);
    this.user = res.user;
    this.token = res.token;
    this.notify();
    return res;
  }

  async register(userData) {
    const res = await authService.register(userData);
    return res;
  }

  logout() {
    authService.logout();
    this.user = null;
    this.token = '';
    this.notify();
    window.location.hash = '#login';
  }

  async refreshProfile() {
    if (!this.token) return null;
    try {
      const user = await authService.getMe();
      this.user = user;
      this.notify();
      return user;
    } catch {
      return this.user;
    }
  }
}

export const authContext = new AuthContextManager();
export default authContext;
