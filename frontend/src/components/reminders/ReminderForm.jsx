import React, { useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export const ReminderForm = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !dateTime) return;
    onSubmit({ title, description, dateTime });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input label="Reminder Title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Physics Office Hours" />
      <Input label="Details (Optional)" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Ask prof about homework question #5" />
      <Input label="Date & Time" type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} required />
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Add Reminder</Button>
      </div>
    </form>
  );
};
