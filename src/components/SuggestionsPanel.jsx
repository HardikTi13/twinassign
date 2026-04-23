import React from 'react';
import { useSession } from '../store/sessionStore';
import { SuggestionCard } from './SuggestionCard';

export function SuggestionsPanel({ onRefresh, onSelect, isGenerating }) {
  const { state } = useSession();

  return (
    <main className="panel" style={{ background: 'var(--bg-color)' }}>
      <div className="panel-header" style={{ position: 'sticky', top: 0, zIndex: 5, background: 'var(--bg-color)' }}>
        <span className="panel-title">Smart Suggestions</span>
        <button 
          className="btn btn-secondary" 
          onClick={onRefresh}
          disabled={isGenerating || state.transcript.length === 0}
          style={{ padding: '6px 12px', fontSize: '12px' }}
        >
          {isGenerating ? 'Analyzing...' : 'Refresh'}
        </button>
      </div>
      
      <div className="scroll-area">
        {state.suggestionBatches.length === 0 ? (
          <div style={{ color: 'var(--text-secondary)', fontSize: '14px', textAlign: 'center', marginTop: '40px' }}>
            {state.transcript.length === 0 
              ? 'Suggestions will appear once you start recording.' 
              : 'Generating initial suggestions...'}
          </div>
        ) : (
          state.suggestionBatches.map((batch, idx) => (
            <div key={batch.id} style={{ marginBottom: '24px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                marginBottom: '12px',
                padding: '0 4px'
              }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                  {idx === 0 ? 'LATEST' : new Date(batch.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {batch.suggestions.map((s, i) => (
                  <SuggestionCard key={i} suggestion={s} onClick={onSelect} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
