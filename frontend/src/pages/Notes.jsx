import React, { useState, useEffect } from 'react';
import { noteService } from '../services/noteService';
import { NoteList } from '../components/notes/NoteList';
import { NoteForm } from '../components/notes/NoteForm';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Loading } from '../components/common/Loading';
import { Plus, Search } from 'lucide-react';

export const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchNotes = async () => {
    try {
      const data = await noteService.getNotes();
      setNotes(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreateNote = async (noteData) => {
    await noteService.createNote(noteData);
    setIsModalOpen(false);
    fetchNotes();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      await noteService.deleteNote(id);
      fetchNotes();
    }
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase()) ||
    (n.category && n.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Study Notes</h1>
          <p className="page-subtitle">Store and search your study materials and formulas.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Add Note
        </Button>
      </div>

      <div style={{ maxWidth: '400px', marginBottom: '1.5rem' }}>
        <Input 
          placeholder="Search notes by title, content, or category..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
      </div>

      {loading ? <Loading text="Loading notes..." /> : (
        <NoteList notes={filteredNotes} onDelete={handleDelete} />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Note">
        <NoteForm onSubmit={handleCreateNote} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};
