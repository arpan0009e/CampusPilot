import api from './api';

// Initial default tasks for demo fallback
const DEFAULT_TASKS = [
  { id: '1', title: 'Complete Math Assignment #4', priority: 'High', status: 'Pending', dueDate: '2026-10-05', description: 'Solve problems on Calculus chapter 3' },
  { id: '2', title: 'Read Chemistry Lab Manual', priority: 'Medium', status: 'Completed', dueDate: '2026-10-02', description: 'Review safety guidelines and experiment 2 steps' },
  { id: '3', title: 'Prepare Computer Science Project Demo', priority: 'High', status: 'Pending', dueDate: '2026-10-08', description: 'Build React UI layout and routing' }
];

export const taskService = {
  getTasks: async () => {
    try {
      const res = await api.get('/tasks');
      return res.data;
    } catch {
      const saved = localStorage.getItem('cp_tasks');
      if (!saved) {
        localStorage.setItem('cp_tasks', JSON.stringify(DEFAULT_TASKS));
        return DEFAULT_TASKS;
      }
      return JSON.parse(saved);
    }
  },

  createTask: async (taskData) => {
    try {
      const res = await api.post('/tasks', taskData);
      return res.data;
    } catch {
      const tasks = await taskService.getTasks();
      const newTask = { ...taskData, id: Date.now().toString(), status: 'Pending' };
      const updated = [newTask, ...tasks];
      localStorage.setItem('cp_tasks', JSON.stringify(updated));
      return newTask;
    }
  },

  updateTask: async (id, updates) => {
    try {
      const res = await api.put(`/tasks/${id}`, updates);
      return res.data;
    } catch {
      const tasks = await taskService.getTasks();
      const updated = tasks.map(t => t.id === id ? { ...t, ...updates } : t);
      localStorage.setItem('cp_tasks', JSON.stringify(updated));
      return updated.find(t => t.id === id);
    }
  },

  deleteTask: async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
    } catch {
      const tasks = await taskService.getTasks();
      const updated = tasks.filter(t => t.id !== id);
      localStorage.setItem('cp_tasks', JSON.stringify(updated));
    }
  }
};
