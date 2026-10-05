import React from 'react';

const PROMPTS = [
  "What should I focus on today?",
  "Help me create a 2-hour study schedule.",
  "How can I better prepare for my exams?",
  "Summarize my pending tasks."
];

export const SuggestedPrompts = ({ onSelect }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', margin: '0.75rem 0' }}>
    {PROMPTS.map((p, idx) => (
      <button
        key={idx}
        onClick={() => onSelect(p)}
        style={{
          background: '#f1f5f9',
          border: '1px solid #cbd5e1',
          color: '#334155',
          borderRadius: '6px',
          padding: '0.35rem 0.75rem',
          fontSize: '0.8rem',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.15s ease'
        }}
      >
        💡 {p}
      </button>
    ))}
  </div>
);
