import api from './api';

const DEFAULT_NOTES = [
  { id: '1', title: 'Data Structures Quick Reference', category: 'CS', content: 'Arrays: O(1) access. Linked Lists: O(1) insertion. Binary Search Tree: O(log n) search.' },
  { id: '2', title: 'Physics Formulae - Waves', category: 'Physics', content: 'v = f * lambda. Doppler effect frequency calculation notes.' }
];

export const noteService = {
  getNotes: async () => {
    try {
      const res = await api.get('/notes');
      return res.data;
    } catch {
      const saved = localStorage.getItem('cp_notes');
      if (!saved) {
        localStorage.setItem('cp_notes', JSON.stringify(DEFAULT_NOTES));
        return DEFAULT_NOTES;
      }
      return JSON.parse(saved);
    }
  },

  createNote: async (noteData) => {
    try {
      const res = await api.post('/notes', noteData);
      return res.data;
    } catch {
      const notes = await noteService.getNotes();
      const newNote = { ...noteData, id: Date.now().toString() };
      const updated = [newNote, ...notes];
      localStorage.setItem('cp_notes', JSON.stringify(updated));
      return newNote;
    }
  },

  updateNote: async (id, updates) => {
    try {
      const res = await api.put(`/notes/${id}`, updates);
      return res.data;
    } catch {
      const notes = await noteService.getNotes();
      const updated = notes.map(n => n.id === id ? { ...n, ...updates } : n);
      localStorage.setItem('cp_notes', JSON.stringify(updated));
      return updated.find(n => n.id === id);
    }
  },

  deleteNote: async (id) => {
    try {
      await api.delete(`/notes/${id}`);
    } catch {
      const notes = await noteService.getNotes();
      const updated = notes.filter(n => n.id !== id);
      localStorage.setItem('cp_notes', JSON.stringify(updated));
    }
  }
};
