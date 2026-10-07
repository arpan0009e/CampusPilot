import api from './api.js';

const DEFAULT_MOCK_NOTES = [
  {
    id: 'note-1',
    user_id: 'demo-student',
    topic: 'Operating Systems',
    title: 'Process Synchronization & Semaphores',
    content: 'A semaphore is an integer variable used for process synchronization, accessed only through wait() (or P) and signal() (or V) atomic operations. Counting semaphores control resource instances. Binary semaphores act like mutex locks to prevent race conditions in critical sections.',
  },
  {
    id: 'note-2',
    user_id: 'demo-student',
    topic: 'Database Management Systems',
    title: 'B-Tree vs B+ Tree Indexing',
    content: 'B-Trees store keys and data records in both internal nodes and leaf nodes. B+ Trees store data records only in leaf nodes, while internal nodes store only router keys. Leaves are linked sequentially as a linked list, enabling fast range scans and higher branching factor.',
  },
  {
    id: 'note-3',
    user_id: 'demo-student',
    topic: 'Computer Networks',
    title: 'TCP 3-Way Handshake & Flow Control',
    content: 'Connection establishment involves SYN, SYN-ACK, and ACK packets. Sequence numbers are randomized to prevent replay attacks. Sliding window protocol provides end-to-end flow control to prevent buffer overrun at the receiver side.',
  },
];

function getLocalNotes() {
  try {
    const raw = localStorage.getItem('cp_offline_notes');
    if (!raw) {
      localStorage.setItem('cp_offline_notes', JSON.stringify(DEFAULT_MOCK_NOTES));
      return DEFAULT_MOCK_NOTES;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_MOCK_NOTES;
  }
}

function saveLocalNotes(notes) {
  try {
    localStorage.setItem('cp_offline_notes', JSON.stringify(notes));
  } catch {
    // Ignore storage errors
  }
}

export const noteService = {
  /**
   * Fetch all student notes
   */
  getNotes: async () => {
    try {
      const data = await api.get('/notes');
      return Array.isArray(data) ? data : [];
    } catch (err) {
      if (err.isNetworkError || err.status === 401) {
        return getLocalNotes();
      }
      throw err;
    }
  },

  /**
   * Create a new note
   * @param {Object} noteData - { topic, title, content }
   */
  createNote: async (noteData) => {
    const payload = {
      topic: noteData.topic.trim(),
      title: noteData.title.trim(),
      content: noteData.content.trim(),
    };

    try {
      const data = await api.post('/notes', payload);
      return data;
    } catch (err) {
      if (err.isNetworkError || err.status === 401) {
        const notes = getLocalNotes();
        const newNote = {
          ...payload,
          id: 'note-' + Date.now(),
          user_id: 'current-user',
        };
        const updated = [newNote, ...notes];
        saveLocalNotes(updated);
        return newNote;
      }
      throw err;
    }
  },

  /**
   * Get single note by ID
   */
  getNote: async (id) => {
    try {
      return await api.get(`/notes/${id}`);
    } catch (err) {
      if (err.isNetworkError || err.status === 401) {
        const notes = getLocalNotes();
        return notes.find(n => n.id === id) || null;
      }
      throw err;
    }
  },

  /**
   * Update note by ID
   */
  updateNote: async (id, noteData) => {
    const payload = {};
    if (noteData.topic !== undefined) payload.topic = noteData.topic.trim();
    if (noteData.title !== undefined) payload.title = noteData.title.trim();
    if (noteData.content !== undefined) payload.content = noteData.content.trim();

    try {
      const data = await api.put(`/notes/${id}`, payload);
      return data;
    } catch (err) {
      if (err.isNetworkError || err.status === 401) {
        const notes = getLocalNotes();
        const updated = notes.map(n => (n.id === id ? { ...n, ...payload } : n));
        saveLocalNotes(updated);
        return updated.find(n => n.id === id);
      }
      throw err;
    }
  },

  /**
   * Delete note by ID
   */
  deleteNote: async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      return true;
    } catch (err) {
      if (err.isNetworkError || err.status === 401) {
        const notes = getLocalNotes();
        const updated = notes.filter(n => n.id !== id);
        saveLocalNotes(updated);
        return true;
      }
      throw err;
    }
  },
};

export default noteService;
