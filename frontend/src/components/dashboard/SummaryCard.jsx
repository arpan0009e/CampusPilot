import React from 'react';

export const SummaryCard = ({ title, count, icon: Icon, color = '#0284c7' }) => (
  <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <div style={{ background: `${color}15`, padding: '0.7rem', borderRadius: '8px', color }}>
      <Icon size={22} />
    </div>
    <div>
      <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>{count}</div>
      <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 500 }}>{title}</div>
    </div>
  </div>
);
