export type TAIAnswer = '是' | '否' | '无关';
export type TGameDifficulty = 'easy' | 'medium' | 'hard';
export type TMessageRole = 'user' | 'assistant';
export type TMessageStatus = 'sending' | 'sent' | 'error';
export type TGameStatus = 'idle' | 'playing' | 'finished';

export type TStory = {
  id: string;
  title: string;
  difficulty: TGameDifficulty;
  surface: string;
  bottom: string;
  hintCount: number;
  tags?: string[];
  createdAt?: number;
};

export type TMessage = {
  id: string;
  role: TMessageRole;
  content: string;
  timestamp: number;
  status?: TMessageStatus;
};

export type TGameSession = {
  storyId: string | null;
  surface: string | null;
  bottom: string | null;
  messages: TMessage[];
  hintsUsed: number;
  hintsRemaining: number;
  questionCount: number;
  status: TGameStatus;
  startTime?: number;
  endTime?: number;
};

