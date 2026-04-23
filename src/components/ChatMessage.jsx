import React from 'react';
import { marked } from 'marked';

export function ChatMessage({ message }) {
  const isAssistant = message.role === 'assistant';
  
  return (
    <div className={`animate-fade-in`} style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: isAssistant ? 'flex-start' : 'flex-end',
      marginBottom: '20px'
    }}>
      <div style={{ 
        maxWidth: '85%',
        padding: '12px 16px',
        borderRadius: '16px',
        borderBottomRightRadius: !isAssistant ? '4px' : '16px',
        borderBottomLeftRadius: isAssistant ? '4px' : '16px',
        background: isAssistant ? 'rgba(255,255,255,0.05)' : 'var(--accent-primary)',
        color: 'white',
        fontSize: '14px',
        lineHeight: '1.6',
        border: isAssistant ? '1px solid var(--border-color)' : 'none'
      }}>
        {isAssistant ? (
          <div 
            className="markdown-content"
            dangerouslySetInnerHTML={{ __html: marked.parse(message.content || (message.isStreaming ? '...' : '')) }} 
          />
        ) : (
          <div>{message.content}</div>
        )}
      </div>
      <span style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
}
