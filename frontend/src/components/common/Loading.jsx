import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loading = ({ text = 'Loading...' }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', padding: '1rem 0' }}>
    <Loader2 className="animate-spin" size={20} style={{ animation: 'spin 1s linear infinite' }} />
    <span>{text}</span>
  </div>
);
