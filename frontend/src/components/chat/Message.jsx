import React from 'react';
import { Bot, User } from 'lucide-react';

export const Message = ({ message }) => {
  const isAi = message.sender === 'ai';

  return (
    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: isAi ? 'flex-start' : 'flex-end', marginBottom: '1rem' }}>
      {isAi && (
        <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '0.45rem', borderRadius: '50%', height: 'fit-content' }}>
          <Bot size={18} />
        </div>
      )}
      <div 
        style={{ 
          maxWidth: '75%', 
          padding: '0.75rem 1rem', 
          borderRadius: '10px', 
          fontSize: '0.875rem', 
          lineHeight: '1.45', 
          background: isAi ? '#f1f5f9' : '#0284c7', 
          color: isAi ? '#1e293b' : '#ffffff',
          border: isAi ? '1px solid #e2e8f0' : 'none'
        }}
      >
        {message.text}
      </div>
      {!isAi && (
        <div style={{ background: '#e2e8f0', color: '#475569', padding: '0.45rem', borderRadius: '50%', height: 'fit-content' }}>
          <User size={18} />
        </div>
      )}
    </div>
  );
};
