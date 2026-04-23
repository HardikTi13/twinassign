import React, { useEffect, useCallback } from 'react';
import { useSession } from './store/sessionStore';
import { useAudioRecorder } from './hooks/useAudioRecorder';
import { useTranscription } from './hooks/useTranscription';
import { useSuggestions } from './hooks/useSuggestions';
import { useChat } from './hooks/useChat';
import { Header } from './components/Header';
import { TranscriptPanel } from './components/TranscriptPanel';
import { SuggestionsPanel } from './components/SuggestionsPanel';
import { ChatPanel } from './components/ChatPanel';
import { SettingsModal } from './components/SettingsModal';
import { exportToJSON } from './services/exportSession';

function App() {
  const { state, dispatch } = useSession();
  const { isRecording, startRecording, stopRecording } = useAudioRecorder();
  const { transcribe } = useTranscription();
  const { generate, isGenerating } = useSuggestions();
  const { sendMessage } = useChat();

  // Handle new audio chunks
  const onAudioData = useCallback(async (blob) => {
    const text = await transcribe(blob);
    if (text) {
      // After transcription, generate suggestions immediately using the new text
      generate([{ text }]);
    }
  }, [transcribe, generate]);

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
      dispatch({ type: 'SET_RECORDING', payload: false });
    } else {
      if (!state.apiKey) {
        alert("Please set your Groq API Key in settings first!");
        dispatch({ type: 'TOGGLE_SETTINGS' });
        return;
      }
      startRecording(onAudioData);
      dispatch({ type: 'SET_RECORDING', payload: true });
    }
  };

  const handleExport = () => {
    exportToJSON({
      transcript: state.transcript,
      suggestionBatches: state.suggestionBatches,
      chatMessages: state.chatMessages
    });
  };

  // Auto-refresh suggestions based on interval if recording
  useEffect(() => {
    let interval;
    if (isRecording && state.transcript.length > 0) {
      // Trigger one immediately so user doesn't wait for the first interval
      if (state.transcript.length === 1) {
        generate();
      }
      
      interval = setInterval(() => {
        generate();
      }, state.settings.refreshInterval * 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, state.transcript.length, state.settings.refreshInterval, generate]);

  return (
    <div className="app-container">
      <Header onExport={handleExport} />
      
      <TranscriptPanel 
        isRecording={isRecording} 
        onToggleRecording={toggleRecording} 
      />
      
      <SuggestionsPanel 
        onRefresh={() => generate()} 
        onSelect={(suggestion) => sendMessage(suggestion.title, true, suggestion)} 
        isGenerating={isGenerating}
      />
      
      <ChatPanel 
        onSendMessage={(msg) => sendMessage(msg)} 
      />

      <SettingsModal />
    </div>
  );
}

export default App;
