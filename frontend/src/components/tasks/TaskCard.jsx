import React from 'react';
import { CheckSquare, Square, Trash2, Calendar } from 'lucide-react';

export const TaskCard = ({ task, onToggleStatus, onDelete }) => {
  const isDone = task.status === 'Completed';

  return (
    <div className="glass-card" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', opacity: isDone ? 0.6 : 1 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <button 
          onClick={() => onToggleStatus(task)} 
          style={{ background: 'none', border: 'none', color: isDone ? '#10b981' : '#64748b', cursor: 'pointer', marginTop: '0.15rem' }}
        >
          {isDone ? <CheckSquare size={20} /> : <Square size={20} />}
        </button>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, fontSize: '0.95rem', textDecoration: isDone ? 'line-through' : 'none' }}>
              {task.title}
            </span>
            {task.priority && (
              <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority}</span>
            )}
          </div>
          {task.description && (
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>
              {task.description}
            </div>
          )}
          {task.dueDate && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.45rem', fontSize: '0.75rem', color: '#64748b' }}>
              <Calendar size={12} /> {task.dueDate}
            </div>
          )}
        </div>
      </div>
      <button 
        onClick={() => onDelete(task.id)} 
        style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', opacity: 0.8 }}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};
