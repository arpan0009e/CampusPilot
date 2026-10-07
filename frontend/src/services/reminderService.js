import api from './api.js';

const DEFAULT_MOCK_REMINDERS = [
  {
    id: 'rem-1',
    user_id: 'demo-student',
    title: 'Submit DBMS Lab Assignment',
    description: 'PostgreSQL optimization queries and explain plan PDF',
    reminder_time: new Date(Date.now() + 86400000 * 1).toISOString(),
    is_completed: false,
  },
  {
    id: 'rem-2',
    user_id: 'demo-student',
    title: 'Operating Systems Class Quiz',
    description: 'Chapters 3 & 4: CPU Scheduling and Synchronization',
    reminder_time: new Date(Date.now() + 86400000 * 3).toISOString(),
    is_completed: false,
  },
  {
    id: 'rem-3',
    user_id: 'demo-student',
    title: 'Register for Hackathon',
    description: 'Form submission with team members list and project concept',
    reminder_time: new Date(Date.now() - 86400000 * 1).toISOString(),
    is_completed: true,
  },
];

function getLocalReminders() {
  try {
    const raw = localStorage.getItem('cp_offline_reminders');
    if (!raw) {
      localStorage.setItem('cp_offline_reminders', JSON.stringify(DEFAULT_MOCK_REMINDERS));
      return DEFAULT_MOCK_REMINDERS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_MOCK_REMINDERS;
  }
}

function saveLocalReminders(reminders) {
  try {
    localStorage.setItem('cp_offline_reminders', JSON.stringify(reminders));
  } catch {
    // Ignore storage errors
  }
}

export const reminderService = {
  /**
   * Fetch all reminders
   */
  getReminders: async () => {
    try {
      const data = await api.get('/reminders');
      return Array.isArray(data) ? data : [];
    } catch (err) {
      if (err.isNetworkError || err.status === 401) {
        return getLocalReminders();
      }
      throw err;
    }
  },

  /**
   * Create a new reminder
   * @param {Object} data - { title, description, reminder_time }
   */
  createReminder: async (data) => {
    const payload = {
      title: data.title.trim(),
      description: data.description ? data.description.trim() : null,
      reminder_time: new Date(data.reminder_time).toISOString(),
    };

    try {
      const res = await api.post('/reminders', payload);
      return res;
    } catch (err) {
      if (err.isNetworkError || err.status === 401) {
        const list = getLocalReminders();
        const newItem = {
          ...payload,
          id: 'rem-' + Date.now(),
          user_id: 'current-user',
          is_completed: false,
        };
        const updated = [newItem, ...list];
        saveLocalReminders(updated);
        return newItem;
      }
      throw err;
    }
  },

  /**
   * Get single reminder by ID
   */
  getReminder: async (id) => {
    try {
      return await api.get(`/reminders/${id}`);
    } catch (err) {
      if (err.isNetworkError || err.status === 401) {
        const list = getLocalReminders();
        return list.find(r => r.id === id) || null;
      }
      throw err;
    }
  },

  /**
   * Update reminder by ID
   */
  updateReminder: async (id, updates) => {
    const payload = {};
    if (updates.title !== undefined) payload.title = updates.title.trim();
    if (updates.description !== undefined) payload.description = updates.description ? updates.description.trim() : null;
    if (updates.reminder_time !== undefined) payload.reminder_time = new Date(updates.reminder_time).toISOString();
    if (updates.is_completed !== undefined) payload.is_completed = Boolean(updates.is_completed);

    try {
      const res = await api.put(`/reminders/${id}`, payload);
      return res;
    } catch (err) {
      if (err.isNetworkError || err.status === 401) {
        const list = getLocalReminders();
        const updated = list.map(r => (r.id === id ? { ...r, ...payload } : r));
        saveLocalReminders(updated);
        return updated.find(r => r.id === id);
      }
      throw err;
    }
  },

  /**
   * Delete reminder by ID
   */
  deleteReminder: async (id) => {
    try {
      await api.delete(`/reminders/${id}`);
      return true;
    } catch (err) {
      if (err.isNetworkError || err.status === 401) {
        const list = getLocalReminders();
        const updated = list.filter(r => r.id !== id);
        saveLocalReminders(updated);
        return true;
      }
      throw err;
    }
  },
};

export default reminderService;
