import type { TAIAnswer } from '../types';
import { askAI } from './api';
import type { TStory } from '../types';

type TFetchAIAnswerInput = {
  surface: string;
  bottom: string;
  question: string;
};

export async function fetchAIAnswer(input: TFetchAIAnswerInput): Promise<TAIAnswer> {
  const story: TStory = {
    id: 'temp',
    title: 'temp',
    difficulty: 'easy',
    surface: input.surface,
    bottom: input.bottom,
    hintCount: 0
  };
  
  try {
    const answer = await askAI(input.question, story);
    return answer as TAIAnswer;
  } catch (error) {
    console.error('AI 调用失败:', error);
    // 失败时返回默认值
    return '无关';
  }
}

