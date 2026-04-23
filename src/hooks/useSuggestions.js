import { useCallback, useState } from 'react';
import { useSession } from '../store/sessionStore';
import { getSuggestions } from '../services/groqApi';

export function useSuggestions() {
  const { state, dispatch } = useSession();
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = useCallback(async (customTranscript = null) => {
    if (!state.apiKey) return;

    // Use provided transcript or get from state based on context window
    const transcriptSources = customTranscript || state.transcript;
    if (transcriptSources.length === 0) return;

    setIsGenerating(true);
    try {
      const windowSize = state.settings.suggestionsContextWindow;
      const recentTranscript = transcriptSources
        .slice(-windowSize)
        .map(t => t.text)
        .join(' ');

      const suggestions = await getSuggestions(
        state.apiKey,
        state.settings.suggestionsPrompt,
        recentTranscript
      );

      if (suggestions && suggestions.length > 0) {
        dispatch({
          type: 'ADD_SUGGESTIONS',
          payload: {
            id: Date.now().toString(),
            timestamp: new Date(),
            suggestions: suggestions.slice(0, 3) // Ensure exactly 3
          }
        });
      }
    } catch (err) {
      console.error("Suggestion generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  }, [state.apiKey, state.transcript, state.settings, dispatch]);

  return { generate, isGenerating };
}
