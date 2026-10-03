import React, { useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export const TaskForm = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title, description, priority, dueDate });
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input label="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Read Physics Chapter 2" />
      <Input label="Description (Optional)" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Take notes on key formulas" />
      <div className="input-group">
        <label className="input-label">Priority</label>
        <select className="input-field" value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <Input label="Due Date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Create Task</Button>
      </div>
    </form>
  );
};
