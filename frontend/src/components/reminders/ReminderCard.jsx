import React from 'react';
import { Clock, Trash2 } from 'lucide-react';

export const ReminderCard = ({ reminder, onDelete }) => (
  <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div>
      <h4 style={{ fontWeight: 600, fontSize: '0.95rem' }}>{reminder.title}</h4>
      {reminder.description && (
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.2rem' }}>{reminder.description}</p>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem', fontSize: '0.8rem', color: '#f59e0b' }}>
        <Clock size={14} /> {reminder.dateTime}
      </div>
    </div>
    <button onClick={() => onDelete(reminder.id)} style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer' }}>
      <Trash2 size={16} />
    </button>
  </div>
);
