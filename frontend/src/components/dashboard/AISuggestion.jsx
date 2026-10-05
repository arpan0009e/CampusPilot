import React from 'react';
import { Sparkles } from 'lucide-react';

export const AISuggestion = ({ suggestion = "Focus on completing your high-priority Math assignment first, then take a short study break." }) => (
  <div className="glass-card" style={{ background: '#f0f9ff', borderColor: '#bae6fd' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', color: '#0284c7' }}>
      <Sparkles size={18} />
      <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>CampusPilot AI Suggestion</h4>
    </div>
    <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: '1.4' }}>{suggestion}</p>
  </div>
);
