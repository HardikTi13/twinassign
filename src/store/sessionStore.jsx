import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { DEFAULT_PROMPTS, SETTINGS_DEFAULTS } from '../prompts/defaults';

const SessionContext = createContext();

const initialState = {
  apiKey: sessionStorage.getItem('groq_api_key') || '',
  isRecording: false,
  transcript: [], // Array of { text: string, timestamp: Date }
  suggestionBatches: [], // Array of { id: string, timestamp: Date, suggestions: [] }
  chatMessages: [], // Array of { role: 'user'|'assistant', content: string, timestamp: Date, isStreaming?: boolean }
  settings: {
    ...SETTINGS_DEFAULTS,
    suggestionsPrompt: DEFAULT_PROMPTS.suggestions,
    detailPrompt: DEFAULT_PROMPTS.detail,
    chatPrompt: DEFAULT_PROMPTS.chat,
  },
  isSettingsOpen: false,
};

function sessionReducer(state, action) {
  switch (action.type) {
    case 'SET_API_KEY':
      sessionStorage.setItem('groq_api_key', action.payload);
      return { ...state, apiKey: action.payload };
    case 'SET_RECORDING':
      return { ...state, isRecording: action.payload };
    case 'ADD_TRANSCRIPT':
      return { ...state, transcript: [...state.transcript, action.payload] };
    case 'ADD_SUGGESTIONS':
      return { ...state, suggestionBatches: [action.payload, ...state.suggestionBatches] };
    case 'ADD_CHAT_MESSAGE':
      return { ...state, chatMessages: [...state.chatMessages, action.payload] };
    case 'UPDATE_CHAT_MESSAGE': // For streaming
      const newChat = [...state.chatMessages];
      newChat[newChat.length - 1] = { ...newChat[newChat.length - 1], ...action.payload };
      return { ...state, chatMessages: newChat };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'TOGGLE_SETTINGS':
      return { ...state, isSettingsOpen: !state.isSettingsOpen };
    case 'RESET_SESSION':
      return { ...initialState, apiKey: state.apiKey, settings: state.settings };
    default:
      return state;
  }
}

export function SessionProvider({ children }) {
  const [state, dispatch] = useReducer(sessionReducer, initialState);

  return (
    <SessionContext.Provider value={{ state, dispatch }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession must be used within SessionProvider');
  return context;
}
