import React from 'react';
import { useSession } from '../store/sessionStore';

export function Header({ onExport }) {
  const { state, dispatch } = useSession();

  return (
    <header className="header glass">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ 
          width: '32px', 
          height: '32px', 
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
          borderRadius: '8px'
        }} />
        <h1 style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.02em' }}>TwinMind</h1>
      </div>
      
      <div style={{ display: 'flex', gap: '12px' }}>
        <button className="btn btn-secondary" onClick={onExport}>
          Export Session
        </button>
        <button 
          className="btn btn-secondary btn-icon" 
          onClick={() => dispatch({ type: 'TOGGLE_SETTINGS' })}
          title="Settings"
        >
          ⚙️
        </button>
      </div>
    </header>
  );
}
