import React, { useState, useRef, useEffect } from 'react';
import { useSession } from '../store/sessionStore';
import { ChatMessage } from './ChatMessage';

export function ChatPanel({ onSendMessage }) {
  const { state } = useSession();
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.chatMessages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <aside className="panel" style={{ width: '100%', borderRight: 'none' }}>
      <div className="panel-header">
        <span className="panel-title">Session Chat</span>
      </div>
      
      <div className="scroll-area" ref={scrollRef}>
        {state.chatMessages.length === 0 ? (
          <div style={{ color: 'var(--text-secondary)', fontSize: '14px', textAlign: 'center', marginTop: '40px' }}>
            Click a suggestion or type a question to start the conversation.
          </div>
        ) : (
          state.chatMessages.map((msg, i) => (
            <ChatMessage key={i} message={msg} />
          ))
        )}
      </div>

      <div style={{ padding: '20px', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Ask TwinMind anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            style={{ 
              width: '100%', 
              padding: '12px 48px 12px 16px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              background: 'rgba(255,255,255,0.03)',
              color: 'white',
              outline: 'none',
              fontSize: '14px'
            }}
          />
          <button 
            onClick={handleSend}
            style={{ 
              position: 'absolute', 
              right: '8px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              background: 'var(--accent-primary)',
              border: 'none',
              borderRadius: '8px',
              padding: '4px 8px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            →
          </button>
        </div>
      </div>
    </aside>
  );
}
