import api from './api';

const DEFAULT_REMINDERS = [
  { id: '1', title: 'Submit Internship Application', description: 'Complete online form and submit resume', dateTime: '2026-10-06 17:00' },
  { id: '2', title: 'Group Study Session', description: 'Library room 3B for Math exam prep', dateTime: '2026-10-07 14:00' }
];

export const reminderService = {
  getReminders: async () => {
    try {
      const res = await api.get('/reminders');
      return res.data;
    } catch {
      const saved = localStorage.getItem('cp_reminders');
      if (!saved) {
        localStorage.setItem('cp_reminders', JSON.stringify(DEFAULT_REMINDERS));
        return DEFAULT_REMINDERS;
      }
      return JSON.parse(saved);
    }
  },

  createReminder: async (data) => {
    try {
      const res = await api.post('/reminders', data);
      return res.data;
    } catch {
      const list = await reminderService.getReminders();
      const newItem = { ...data, id: Date.now().toString() };
      const updated = [newItem, ...list];
      localStorage.setItem('cp_reminders', JSON.stringify(updated));
      return newItem;
    }
  },

  updateReminder: async (id, updates) => {
    try {
      const res = await api.put(`/reminders/${id}`, updates);
      return res.data;
    } catch {
      const list = await reminderService.getReminders();
      const updated = list.map(r => r.id === id ? { ...r, ...updates } : r);
      localStorage.setItem('cp_reminders', JSON.stringify(updated));
      return updated.find(r => r.id === id);
    }
  },

  deleteReminder: async (id) => {
    try {
      await api.delete(`/reminders/${id}`);
    } catch {
      const list = await reminderService.getReminders();
      const updated = list.filter(r => r.id !== id);
      localStorage.setItem('cp_reminders', JSON.stringify(updated));
    }
  }
};
