import api from './api.js';

const DEFAULT_MOCK_TASKS = [
  {
    id: 'mock-1',
    user_id: 'demo-student',
    title: 'Complete Database Assignment 2',
    description: 'Write B-Tree index queries and optimize execution plans in PostgreSQL',
    status: 'pending',
    priority: 'high',
    due_date: new Date(Date.now() + 86400000 * 2).toISOString(),
  },
  {
    id: 'mock-2',
    user_id: 'demo-student',
    title: 'Operating Systems - Process Scheduling',
    description: 'Implement Round Robin and Shortest Job First scheduling simulation in C++',
    status: 'in_progress',
    priority: 'high',
    due_date: new Date(Date.now() + 86400000 * 4).toISOString(),
  },
  {
    id: 'mock-3',
    user_id: 'demo-student',
    title: 'Revise Computer Networks Chapter 4',
    description: 'Transport layer protocols: TCP vs UDP headers, congestion control window',
    status: 'completed',
    priority: 'medium',
    due_date: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'mock-4',
    user_id: 'demo-student',
    title: 'CampusPilot Minor Project Frontend',
    description: 'Recreate frontend in clean modern HTML, CSS, JavaScript connecting with FastAPI',
    status: 'in_progress',
    priority: 'medium',
    due_date: new Date(Date.now() + 86400000 * 5).toISOString(),
  },
];

function getLocalTasks() {
  try {
    const raw = localStorage.getItem('cp_offline_tasks');
    if (!raw) {
      localStorage.setItem('cp_offline_tasks', JSON.stringify(DEFAULT_MOCK_TASKS));
      return DEFAULT_MOCK_TASKS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_MOCK_TASKS;
  }
}

function saveLocalTasks(tasks) {
  try {
    localStorage.setItem('cp_offline_tasks', JSON.stringify(tasks));
  } catch {
    // Ignore storage errors
  }
}

export const taskService = {
  /**
   * Fetch all tasks for logged in user
   */
  getTasks: async () => {
    try {
      const data = await api.get('/tasks');
      return Array.isArray(data) ? data : [];
    } catch (err) {
      if (err.isNetworkError || err.status === 401) {
        return getLocalTasks();
      }
      throw err;
    }
  },

  /**
   * Create a new task
   * @param {Object} taskData - { title, description, priority, due_date, status }
   */
  createTask: async (taskData) => {
    const payload = {
      title: taskData.title.trim(),
      description: taskData.description ? taskData.description.trim() : null,
      priority: (taskData.priority || 'medium').toLowerCase(),
      status: (taskData.status || 'pending').toLowerCase(),
      due_date: taskData.due_date ? new Date(taskData.due_date).toISOString() : null,
    };

    try {
      const data = await api.post('/tasks', payload);
      return data;
    } catch (err) {
      if (err.isNetworkError || err.status === 401) {
        const tasks = getLocalTasks();
        const newTask = {
          ...payload,
          id: 'task-' + Date.now(),
          user_id: 'current-user',
        };
        const updated = [newTask, ...tasks];
        saveLocalTasks(updated);
        return newTask;
      }
      throw err;
    }
  },

  /**
   * Get single task by ID
   */
  getTask: async (id) => {
    try {
      return await api.get(`/tasks/${id}`);
    } catch (err) {
      if (err.isNetworkError || err.status === 401) {
        const tasks = getLocalTasks();
        return tasks.find(t => t.id === id) || null;
      }
      throw err;
    }
  },

  /**
   * Update task by ID
   */
  updateTask: async (id, taskData) => {
    const payload = {};
    if (taskData.title !== undefined) payload.title = taskData.title.trim();
    if (taskData.description !== undefined) payload.description = taskData.description ? taskData.description.trim() : null;
    if (taskData.priority !== undefined) payload.priority = taskData.priority.toLowerCase();
    if (taskData.status !== undefined) payload.status = taskData.status.toLowerCase();
    if (taskData.due_date !== undefined) {
      payload.due_date = taskData.due_date ? new Date(taskData.due_date).toISOString() : null;
    }

    try {
      const data = await api.put(`/tasks/${id}`, payload);
      return data;
    } catch (err) {
      if (err.isNetworkError || err.status === 401) {
        const tasks = getLocalTasks();
        const updated = tasks.map(t => (t.id === id ? { ...t, ...payload } : t));
        saveLocalTasks(updated);
        return updated.find(t => t.id === id);
      }
      throw err;
    }
  },

  /**
   * Delete task by ID
   */
  deleteTask: async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      return true;
    } catch (err) {
      if (err.isNetworkError || err.status === 401) {
        const tasks = getLocalTasks();
        const updated = tasks.filter(t => t.id !== id);
        saveLocalTasks(updated);
        return true;
      }
      throw err;
    }
  },
};

export default taskService;
