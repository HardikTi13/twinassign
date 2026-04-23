import React, { useState } from 'react';
import { useSession } from '../store/sessionStore';

export function SettingsModal() {
  const { state, dispatch } = useSession();
  const [formData, setFormData] = useState(state.settings);
  const [apiKey, setApiKey] = useState(state.apiKey);

  if (!state.isSettingsOpen) return null;

  const handleSave = () => {
    dispatch({ type: 'SET_API_KEY', payload: apiKey });
    dispatch({ type: 'UPDATE_SETTINGS', payload: formData });
    dispatch({ type: 'TOGGLE_SETTINGS' });
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, left: 0, right: 0, bottom: 0, 
      background: 'rgba(0,0,0,0.8)', 
      backdropFilter: 'blur(4px)',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 100 
    }}>
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSave(); }}
        className="glass" 
        style={{ 
          width: '90%', 
          maxWidth: '600px', 
          maxHeight: '85vh', 
          borderRadius: '20px', 
          padding: '32px',
          overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Settings</h2>
          <button type="button" style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px' }} onClick={() => dispatch({ type: 'TOGGLE_SETTINGS' })}>✕</button>
        </div>

        <section style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Groq API Key</label>
          <input 
            type="password" 
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Paste your k_xxxx..."
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
          />
        </section>

        <section style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Suggestions System Prompt</label>
          <textarea 
            value={formData.suggestionsPrompt}
            onChange={(e) => setFormData({...formData, suggestionsPrompt: e.target.value})}
            rows={5}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '12px', resize: 'vertical' }}
          />
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Suggestions Window (chunks)</label>
            <input 
              type="number" 
              value={formData.suggestionsContextWindow}
              onChange={(e) => setFormData({...formData, suggestionsContextWindow: parseInt(e.target.value)})}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Auto-Refresh (seconds)</label>
            <input 
              type="number" 
              value={formData.refreshInterval}
              onChange={(e) => setFormData({...formData, refreshInterval: parseInt(e.target.value)})}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-secondary" onClick={() => dispatch({ type: 'TOGGLE_SETTINGS' })}>Cancel</button>
          <button type="submit" className="btn btn-primary">Save Settings</button>
        </div>
      </form>
    </div>
  );
}
