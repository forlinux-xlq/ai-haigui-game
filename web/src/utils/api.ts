import type { TStory } from '../types';

// 使用环境变量配置 API 基础 URL，默认值为本地开发路径
const API_BASE_URL = import.meta.env.VITE_AI_API_URL || '/api/chat';

/**
 * 向 AI 提问关于海龟汤故事的问题
 * @param question 玩家的问题
 * @param story 海龟汤故事
 * @returns AI 的回答（"是"、"否"、"无关"）
 */
export async function askAI(question: string, story: TStory): Promise<string> {
  if (!question.trim()) {
    console.warn('问题不能为空，返回默认回答"无关"');
    return '无关';
  }

  try {
    console.log('正在调用 AI 接口:', {
      question,
      story: {
        id: story.id,
        title: story.title,
        surface: story.surface,
        bottom: story.bottom
      }
    });
    
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ question, story })
    });

    console.log('AI 接口响应状态:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || 
        `API 请求失败: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log('AI 接口返回数据:', data);

    if (!data.answer) {
      throw new Error('AI 未返回有效回答');
    }

    console.log('AI 回答:', data.answer);
    return data.answer;
  } catch (error) {
    console.error('AI 调用失败:', error);
    // 失败时返回默认值
    return '无关';
  }
}