import React, { useEffect, useRef } from 'react';
import { useSession } from '../store/sessionStore';

export function TranscriptPanel({ isRecording, onToggleRecording }) {
  const { state } = useSession();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.transcript]);

  return (
    <aside className="panel">
      <div className="panel-header">
        <span className="panel-title">Transcript</span>
        <button 
          className={`btn ${isRecording ? 'btn-secondary' : 'btn-primary'}`}
          onClick={onToggleRecording}
          style={{ padding: '6px 12px', fontSize: '12px' }}
        >
          {isRecording && <span className="animate-pulse" style={{ color: 'var(--recording-red)', marginRight: '6px' }}>●</span>}
          {isRecording ? 'Stop Mic' : 'Start Mic'}
        </button>
      </div>
      <div className="scroll-area" ref={scrollRef}>
        {state.transcript.length === 0 ? (
          <div style={{ color: 'var(--text-secondary)', fontSize: '14px', textAlign: 'center', marginTop: '40px' }}>
            {isRecording ? 'Listening for audio...' : 'Start the microphone to begin transcribing context.'}
          </div>
        ) : (
          state.transcript.map((chunk, i) => (
            <div key={i} className="animate-fade-in" style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                {new Date(chunk.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#e0e0e0' }}>{chunk.text}</p>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
