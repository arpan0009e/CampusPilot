import React from 'react';
import { CheckCircle2, Circle, Trash2, Calendar } from 'lucide-react';

export const TaskCard = ({ task, onToggleStatus, onDelete }) => {
  const isDone = task.status === 'Completed';

  return (
    <div className="glass-card" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', opacity: isDone ? 0.6 : 1 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <button 
          onClick={() => onToggleStatus(task)} 
          style={{ background: 'none', border: 'none', color: isDone ? '#10b981' : '#64748b', cursor: 'pointer', marginTop: '0.15rem' }}
        >
          {isDone ? <CheckCircle2 size={20} /> : <Circle size={20} />}
        </button>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.95rem', textDecoration: isDone ? 'line-through' : 'none' }}>
            {task.title}
          </div>
          {task.description && (
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem' }}>
              {task.description}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
            <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority}</span>
            {task.dueDate && (
              <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Calendar size={12} /> {task.dueDate}
              </span>
            )}
          </div>
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
