import React from 'react';
import { Calendar } from 'lucide-react';

export const UpcomingList = ({ reminders = [] }) => (
  <div className="glass-card">
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
      <Calendar size={18} color="#d97706" />
      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Upcoming Deadlines & Reminders</h3>
    </div>
    {reminders.length === 0 ? (
      <div style={{ color: '#64748b', fontSize: '0.85rem' }}>No upcoming reminders</div>
    ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {reminders.map(item => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.65rem 0.85rem', borderRadius: '6px' }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1e293b' }}>{item.title}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.description}</div>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#d97706', fontWeight: 600 }}>{item.dateTime}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);
