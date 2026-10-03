import React, { useState, useEffect } from 'react';
import { chatService } from '../services/chatService';
import { ChatWindow } from '../components/chat/ChatWindow';
import { ChatInput } from '../components/chat/ChatInput';
import { SuggestedPrompts } from '../components/chat/SuggestedPrompts';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { Sparkles } from 'lucide-react';

export const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    chatService.getConversation().then(setMessages);
  }, []);

  const handleSend = async (text) => {
    setError('');
    // Optimistic User Message
    const userMsg = { id: Date.now().toString(), sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const aiReply = await chatService.sendMessage(text);
      setMessages(prev => [...prev, aiReply]);
    } catch {
      setError("Couldn't reach the AI assistant. Click to try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles color="#38bdf8" /> AI Academic Assistant
          </h1>
          <p className="page-subtitle">Ask questions, get study suggestions, and organize your work.</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={() => setError('')} />}

      <ChatWindow messages={messages} loading={loading} />
      <SuggestedPrompts onSelect={handleSend} />
      <ChatInput onSend={handleSend} disabled={loading} />
    </div>
  );
};
