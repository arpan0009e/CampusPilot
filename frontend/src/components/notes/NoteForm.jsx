import React, { useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export const NoteForm = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSubmit({ title, category, content });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input label="Note Title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Organic Chemistry Reactions" />
      <Input label="Category / Subject (Optional)" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Chemistry" />
      <div className="input-group">
        <label className="input-label">Content</label>
        <textarea 
          className="input-field" 
          rows={4} 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          required 
          placeholder="Write your study notes here..."
        />
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Note</Button>
      </div>
    </form>
  );
};
