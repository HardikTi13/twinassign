import { useCallback } from 'react';
import { useSession } from '../store/sessionStore';
import { transcribeAudio } from '../services/groqApi';

export function useTranscription() {
  const { state, dispatch } = useSession();

  const transcribe = useCallback(async (audioBlob) => {
    if (!state.apiKey) {
      console.warn("No API key available for transcription");
      return;
    }

    try {
      const data = await transcribeAudio(state.apiKey, audioBlob);
      if (data.text && data.text.trim()) {
        const chunk = {
          text: data.text,
          timestamp: new Date(),
          chunkIndex: state.transcript.length
        };
        dispatch({ type: 'ADD_TRANSCRIPT', payload: chunk });
        return data.text;
      }
    } catch (err) {
      console.error("Transcription error:", err);
    }
  }, [state.apiKey, state.transcript.length, dispatch]);

  return { transcribe };
}
