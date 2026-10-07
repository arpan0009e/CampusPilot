import api from './api.js';

export const authService = {
  /**
   * Register a new student account
   * @param {Object} userData - { name, email, password, department, semester, enrollment_id }
   */
  register: async (userData) => {
    const payload = {
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      department: userData.department.trim(),
      semester: userData.semester ? String(userData.semester).trim() : null,
      enrollment_id: userData.enrollment_id ? parseInt(userData.enrollment_id, 10) : null,
    };

    try {
      const data = await api.post('/auth/register', payload);
      return data;
    } catch (err) {
      // Offline fallback for preview if backend is down
      if (err.isNetworkError) {
        const mockUser = {
          id: 'demo-user-' + Date.now(),
          name: payload.name,
          email: payload.email,
          department: payload.department,
          semester: payload.semester,
          enrollment_id: payload.enrollment_id,
          is_active: true,
        };
        return mockUser;
      }
      throw err;
    }
  },

  /**
   * Authenticate student and retrieve access token & profile
   * @param {string} email 
   * @param {string} password 
   */
  login: async (email, password) => {
    const payload = {
      email: email.trim().toLowerCase(),
      password: password,
    };

    try {
      // 1. Get access token from backend
      const res = await api.post('/auth/login', payload);
      const token = res.access_token;
      if (token) {
        api.setToken(token);
        
        // 2. Fetch authenticated profile via /auth/me
        try {
          const profile = await api.get('/auth/me');
          localStorage.setItem('cp_user', JSON.stringify(profile));
          localStorage.setItem('user', JSON.stringify(profile));
          window.dispatchEvent(new CustomEvent('campus:auth-change', { detail: { user: profile, token } }));
          return { token, user: profile };
        } catch {
          // If me fails, construct minimal user
          const minimalUser = {
            id: 'current-user',
            name: email.split('@')[0],
            email: email,
            department: 'Computer Science',
            is_active: true,
          };
          localStorage.setItem('cp_user', JSON.stringify(minimalUser));
          localStorage.setItem('user', JSON.stringify(minimalUser));
          window.dispatchEvent(new CustomEvent('campus:auth-change', { detail: { user: minimalUser, token } }));
          return { token, user: minimalUser };
        }
      }
      throw new Error('No access token received from backend');
    } catch (err) {
      if (err.isNetworkError) {
        // Fallback for offline demo testing
        const mockToken = 'offline-demo-jwt-' + Date.now();
        const mockUser = {
          id: 'demo-student-1',
          name: email.split('@')[0] || 'Demo Student',
          email: email,
          department: 'Computer Science & Engineering',
          semester: '6th Semester',
          enrollment_id: 20261001,
          is_active: true,
        };
        api.setToken(mockToken);
        localStorage.setItem('cp_user', JSON.stringify(mockUser));
        localStorage.setItem('user', JSON.stringify(mockUser));
        window.dispatchEvent(new CustomEvent('campus:auth-change', { detail: { user: mockUser, token: mockToken } }));
        return { token: mockToken, user: mockUser, isOfflineMock: true };
      }
      throw err;
    }
  },

  /**
   * Fetch current user profile
   */
  getMe: async () => {
    try {
      const profile = await api.get('/auth/me');
      localStorage.setItem('cp_user', JSON.stringify(profile));
      localStorage.setItem('user', JSON.stringify(profile));
      return profile;
    } catch (err) {
      const cached = authService.getCurrentUser();
      if (cached) return cached;
      throw err;
    }
  },

  /**
   * Log out student
   */
  logout: () => {
    api.setToken(null);
    localStorage.removeItem('cp_user');
    localStorage.removeItem('user');
    window.dispatchEvent(new CustomEvent('campus:auth-change', { detail: { user: null, token: null } }));
  },

  /**
   * Synchronously get logged in student from localStorage
   */
  getCurrentUser: () => {
    try {
      const data = localStorage.getItem('cp_user') || localStorage.getItem('user');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  /**
   * Get current auth token
   */
  getToken: () => {
    return api.getToken();
  },

  /**
   * Check if user is logged in
   */
  isAuthenticated: () => {
    return Boolean(api.getToken());
  },
};

export default authService;
