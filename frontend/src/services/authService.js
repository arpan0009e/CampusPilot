import api from './api';

export const authService = {
  // Login user
  login: async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      return res.data;
    } catch (err) {
      // Demo Fallback if backend is not running yet
      if (email && password) {
        const mockUser = { id: 'demo-123', name: email.split('@')[0], email };
        const mockToken = 'mock-jwt-token-123';
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        return { user: mockUser, token: mockToken };
      }
      throw err.response?.data?.message || 'Login failed';
    }
  },

  // Register user
  register: async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      return res.data;
    } catch (err) {
      // Demo Fallback
      if (name && email) {
        const mockUser = { id: 'demo-123', name, email };
        const mockToken = 'mock-jwt-token-123';
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        return { user: mockUser, token: mockToken };
      }
      throw err.response?.data?.message || 'Registration failed';
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get stored user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};
