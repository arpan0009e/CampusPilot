import React from 'react';
import { Trash2, Tag } from 'lucide-react';

export const NoteCard = ({ note, onDelete }) => (
  <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '140px' }}>
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <h4 style={{ fontWeight: 600, fontSize: '0.95rem', color: '#0f172a' }}>{note.title}</h4>
        <button onClick={() => onDelete(note.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
          <Trash2 size={16} />
        </button>
      </div>
      <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.45', whiteSpace: 'pre-line' }}>{note.content}</p>
    </div>
    {note.category && (
      <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#0284c7', fontWeight: 500 }}>
        <Tag size={12} /> {note.category}
      </div>
    )}
  </div>
);
