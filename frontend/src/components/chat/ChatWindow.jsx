import React from 'react';
import { Message } from './Message';
import { Loading } from '../common/Loading';

export const ChatWindow = ({ messages, loading }) => (
  <div 
    className="glass-card" 
    style={{ 
      height: '420px', 
      overflowY: 'auto', 
      display: 'flex', 
      flexDirection: 'column', 
      padding: '1.25rem' 
    }}
  >
    {messages.map((msg) => (
      <Message key={msg.id} message={msg} />
    ))}
    {loading && <Loading text="CampusPilot AI is thinking..." />}
  </div>
);
