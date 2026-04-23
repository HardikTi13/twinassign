import { useCallback, useState } from 'react';
import { useSession } from '../store/sessionStore';
import { streamChat } from '../services/groqApi';

export function useChat() {
  const { state, dispatch } = useSession();
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(async (content, isSuggestion = false, suggestionContext = null) => {
    if (!state.apiKey) return;

    // Add user message to UI
    dispatch({
      type: 'ADD_CHAT_MESSAGE',
      payload: { role: 'user', content, timestamp: new Date() }
    });

    // Add empty assistant message for streaming
    dispatch({
      type: 'ADD_CHAT_MESSAGE',
      payload: { role: 'assistant', content: '', timestamp: new Date(), isStreaming: true }
    });

    setIsTyping(true);
    try {
      const windowSize = state.settings.chatContextWindow;
      const transcriptText = state.transcript
        .slice(-windowSize)
        .map(t => t.text)
        .join(' ');

      let systemPrompt = state.settings.chatPrompt.replace('{{TRANSCRIPT}}', transcriptText);
      
      const messages = [
        { role: 'system', content: systemPrompt }
      ];

      // Add conversation history (limited)
      state.chatMessages.slice(-6).forEach(msg => {
        messages.push({ role: msg.role, content: msg.content });
      });

      // Special handling for suggestions to provide more detail
      let userContent = content;
      if (isSuggestion && suggestionContext) {
        const detailPrompt = state.settings.detailPrompt
          .replace('{{SUGGESTION_TITLE}}', suggestionContext.title)
          .replace('{{SUGGESTION_PREVIEW}}', suggestionContext.preview)
          .replace('{{TRANSCRIPT}}', transcriptText);
        
        userContent = detailPrompt;
      }

      messages.push({ role: 'user', content: userContent });

      await streamChat(
        state.apiKey,
        state.settings.modelChat,
        messages,
        (token, full) => {
          dispatch({
            type: 'UPDATE_CHAT_MESSAGE',
            payload: { content: full }
          });
        }
      );

      dispatch({
        type: 'UPDATE_CHAT_MESSAGE',
        payload: { isStreaming: false }
      });
    } catch (err) {
      console.error("Chat error:", err);
      dispatch({
        type: 'UPDATE_CHAT_MESSAGE',
        payload: { content: "Error: " + err.message, isStreaming: false }
      });
    } finally {
      setIsTyping(false);
    }
  }, [state.apiKey, state.transcript, state.settings, state.chatMessages, dispatch]);

  return { sendMessage, isTyping };
}
