import React from 'react';

const icons = {
  question: '❓',
  point: '💡',
  answer: '✅',
  factcheck: '🔍',
  clarify: '📝'
};

export function SuggestionCard({ suggestion, onClick }) {
  return (
    <div 
      className="glass animate-fade-in" 
      onClick={() => onClick(suggestion)}
      style={{ 
        padding: '16px', 
        borderRadius: '12px', 
        cursor: 'pointer',
        transition: 'all 0.2s',
        marginBottom: '12px',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--card-hover)';
        e.currentTarget.style.borderColor = 'var(--accent-primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(22, 22, 30, 0.7)';
        e.currentTarget.style.borderColor = 'var(--border-color)';
      }}
    >
      <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
        <span style={{ fontSize: '18px' }}>{icons[suggestion.type] || '✨'}</span>
        <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>{suggestion.title}</h3>
      </div>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
        {suggestion.preview}
      </p>
    </div>
  );
}
