import React from 'react';
import { AlertCircle } from 'lucide-react';

export const PriorityList = ({ tasks = [] }) => (
  <div className="glass-card">
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
      <AlertCircle size={18} color="#e11d48" />
      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>High Priority Tasks</h3>
    </div>
    {tasks.length === 0 ? (
      <div style={{ color: '#64748b', fontSize: '0.85rem' }}>No high priority tasks right now.</div>
    ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {tasks.map(task => (
          <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.65rem 0.85rem', borderRadius: '6px' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1e293b' }}>{task.title}</span>
            <span className="badge badge-high">{task.dueDate}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);
