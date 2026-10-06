import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatService } from '../../services/chatService';
import { Message } from '../chat/Message';
import { Loading } from '../common/Loading';
import { Sparkles, X, Maximize2, Send } from 'lucide-react';

export const AIPopupWidget = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatService.getConversation().then(setMessages);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');

    // Optimistic user message
    const userMsg = { id: Date.now().toString(), sender: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const aiReply = await chatService.sendMessage(userText);
      setMessages(prev => [...prev, aiReply]);
    } catch {
      setMessages(prev => [
        ...prev, 
        { id: Date.now().toString(), sender: 'ai', text: "Sorry, I couldn't process your request right now. Try again!" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '5.8rem',
        right: '2.5rem',
        width: '380px',
        maxWidth: 'calc(100vw - 3rem)',
        height: '500px',
        maxHeight: 'calc(100vh - 8rem)',
        background: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 12px 35px -4px rgba(15, 23, 42, 0.2), 0 4px 12px rgba(15, 23, 42, 0.08)',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 95,
        overflow: 'hidden',
        animation: 'fadeInUp 0.2s ease-out'
      }}
    >
      {/* Widget Header */}
      <div 
        style={{
          padding: '0.85rem 1.15rem',
          background: 'linear-gradient(135deg, #0284c7, #0369a1)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.95rem' }}>
          <Sparkles size={18} />
          <span>CampusPilot AI</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            onClick={() => {
              onClose();
              navigate('/chat');
            }}
            title="Open Full Chat"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '6px',
              color: '#ffffff',
              padding: '0.35rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Maximize2 size={15} />
          </button>
          <button
            onClick={onClose}
            title="Close"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '6px',
              color: '#ffffff',
              padding: '0.35rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div 
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem',
          background: '#f8fafc',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
        {loading && <Loading text="CampusPilot AI is thinking..." />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form 
        onSubmit={handleSend} 
        style={{
          padding: '0.75rem 1rem',
          background: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center'
        }}
      >
        <input 
          type="text"
          className="input-field"
          style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
          placeholder="Ask a quick question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          autoFocus
        />
        <button 
          type="submit" 
          className="btn btn-primary"
          style={{ padding: '0.5rem 0.75rem', borderRadius: '6px' }}
          disabled={loading || !input.trim()}
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
};
