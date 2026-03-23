import { useCallback } from 'react';
import { useGame } from './useGame';

export function useAIChat() {
  const { sendMessage, isLoading } = useGame();

  const chat = useCallback(
    async (content: string) => {
      await sendMessage(content);
    },
    [sendMessage],
  );

  return { chat, isLoading };
}

