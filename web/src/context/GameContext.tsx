import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { stories } from '../data/stories';
import { fetchAIAnswer } from '../utils/ai';
import type { TAIAnswer, TGameSession, TMessage, TStory } from '../types';

interface IGameContext {
  session: TGameSession;
  lastAIAnswer: TAIAnswer | null;
  isLoading: boolean;
  startGame: (story: TStory) => void;
  sendMessage: (content: string) => Promise<void>;
  useHint: () => Promise<string | null>;
  restartGame: () => void;
  endGame: (type: 'win' | 'giveup') => void;
}

const STORAGE_KEY = 'ai_haigui_game_session_v1';

const createEmptySession = (): TGameSession => ({
  storyId: null,
  surface: null,
  bottom: null,
  messages: [],
  hintsUsed: 0,
  hintsRemaining: 0,
  questionCount: 0,
  status: 'idle',
});

function safeParseJSON(value: string): unknown {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function createId(): string {
  if (typeof globalThis.crypto !== 'undefined' && 'randomUUID' in globalThis.crypto) {
    return globalThis.crypto.randomUUID();
  }
  return `id_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function buildSessionFromStorage(stored: unknown): TGameSession | null {
  if (!stored || typeof stored !== 'object') return null;
  const maybe = stored as Partial<TGameSession> & { storyId?: unknown };
  const storyId = typeof maybe.storyId === 'string' ? maybe.storyId : null;
  if (!storyId) return null;

  const story = stories.find((s) => s.id === storyId);
  if (!story) return null;

  const messages = Array.isArray(maybe.messages) ? (maybe.messages as TMessage[]) : [];
  const hintsRemaining =
    typeof maybe.hintsRemaining === 'number' ? maybe.hintsRemaining : story.hintCount;

  return {
    storyId,
    surface: story.surface,
    bottom: story.bottom,
    messages,
    hintsUsed: typeof maybe.hintsUsed === 'number' ? maybe.hintsUsed : 0,
    hintsRemaining,
    questionCount: typeof maybe.questionCount === 'number' ? maybe.questionCount : 0,
    status: maybe.status === 'finished' || maybe.status === 'playing' ? maybe.status : 'playing',
    startTime: typeof maybe.startTime === 'number' ? maybe.startTime : Date.now(),
    endTime: typeof maybe.endTime === 'number' ? maybe.endTime : undefined,
  };
}

export const GameContext = React.createContext<IGameContext | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<TGameSession>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptySession();
    const parsed = safeParseJSON(raw);
    return buildSessionFromStorage(parsed) ?? createEmptySession();
  });

  const [lastAIAnswer, setLastAIAnswer] = useState<TAIAnswer | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 持久化：用于刷新不丢消息（MVP）。
  useEffect(() => {
    const toStore = {
      ...session,
      // 防止把汤底直接暴露给恶意访问者（虽然本地可被开发者工具看到，本意仍是降低作弊）。
      bottom: null,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }, [session]);

  const startGame = useCallback((story: TStory) => {
    setLastAIAnswer(null);
    setIsLoading(false);
    setSession({
      storyId: story.id,
      surface: story.surface,
      bottom: story.bottom,
      messages: [],
      hintsUsed: 0,
      hintsRemaining: story.hintCount,
      questionCount: 0,
      status: 'playing',
      startTime: Date.now(),
      endTime: undefined,
    });
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      console.log('发送消息:', content);
      
      if (!content.trim()) {
        console.log('消息为空，不发送');
        return;
      }
      if (isLoading) {
        console.log('正在加载中，不发送消息');
        return;
      }
      if (!session.storyId || !session.bottom || !session.surface) {
        console.log('游戏会话不完整，不发送消息');
        return;
      }

      const question = content.trim();
      const story = stories.find((s) => s.id === session.storyId);
      if (!story) {
        console.log('未找到故事，不发送消息');
        return;
      }

      const userMessage: TMessage = {
        id: createId(),
        role: 'user',
        content: question,
        timestamp: Date.now(),
        status: 'sent',
      };

      console.log('添加用户消息:', userMessage);
      setIsLoading(true);
      setSession((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
        questionCount: prev.questionCount + 1,
      }));

      try {
        console.log('正在获取 AI 回答...');
        const answer = await fetchAIAnswer({
          surface: story.surface,
          bottom: story.bottom,
          question,
        });

        console.log('获取到 AI 回答:', answer);
        const assistantMessage: TMessage = {
          id: createId(),
          role: 'assistant',
          content: answer,
          timestamp: Date.now(),
          status: 'sent',
        };

        setLastAIAnswer(answer);
        setSession((prev) => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
        }));
      } catch (error) {
        console.error('获取 AI 回答失败:', error);
        // 处理错误，显示友好提示
        const errorMessage: TMessage = {
          id: createId(),
          role: 'assistant',
          content: error instanceof Error && error.message.includes('不符合规范') 
            ? 'AI 回答不符合规范，请重新提问' 
            : 'AI 暂时无法回答，请稍后重试',
          timestamp: Date.now(),
          status: 'error',
        };

        setSession((prev) => ({
          ...prev,
          messages: [...prev.messages, errorMessage],
        }));
      } finally {
        console.log('消息发送完成，重置加载状态');
        setIsLoading(false);
      }
    },
    [isLoading, session.bottom, session.surface, session.storyId],
  );

  const useHint = useCallback(async () => {
    if (isLoading) return null;
    if (!session.storyId) return null;
    if (session.hintsRemaining <= 0) return null;

    setSession((prev) => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1,
      hintsRemaining: Math.max(0, prev.hintsRemaining - 1),
    }));

    // MVP 占位：后续可由 AI 生成暗示。
    await new Promise((resolve) => setTimeout(resolve, 250));
    return '提示暂不可用（占位版）';
  }, [isLoading, session.hintsRemaining, session.storyId]);

  const restartGame = useCallback(() => {
    if (!session.storyId) return;
    const story = stories.find((s) => s.id === session.storyId);
    if (!story) return;
    startGame(story);
  }, [session.storyId, startGame]);

  const endGame = useCallback((type: 'win' | 'giveup') => {
    setSession((prev) => ({
      ...prev,
      status: 'finished',
      endTime: Date.now(),
    }));
    setLastAIAnswer(type === 'win' ? '是' : null);
  }, []);

  const value = useMemo<IGameContext>(
    () => ({
      session,
      lastAIAnswer,
      isLoading,
      startGame,
      sendMessage,
      useHint,
      restartGame,
      endGame,
    }),
    [endGame, isLoading, lastAIAnswer, restartGame, sendMessage, session, startGame, useHint],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

