import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ErrorMessage = ({ message, onRetry }) => (
  <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '8px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#f43f5e', marginBottom: '1rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <AlertCircle size={18} />
      <span>{message}</span>
    </div>
    {onRetry && (
      <button onClick={onRetry} style={{ background: 'none', border: 'underline', color: '#f43f5e', cursor: 'pointer', fontWeight: 600 }}>
        Retry
      </button>
    )}
  </div>
);
