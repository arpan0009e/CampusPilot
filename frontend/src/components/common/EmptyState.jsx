import React from 'react';
import { Inbox } from 'lucide-react';

export const EmptyState = ({ title = 'No items found', description = 'Get started by creating your first item.' }) => (
  <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
    <Inbox size={48} style={{ opacity: 0.5, marginBottom: '0.75rem' }} />
    <h4 style={{ color: '#94a3b8', fontSize: '1rem', fontWeight: 600 }}>{title}</h4>
    <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>{description}</p>
  </div>
);
