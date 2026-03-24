import type { TStory } from '../types';

const API_BASE_URL = 'https://api.siliconflow.cn/v1/chat/completions';
const API_KEY = import.meta.env.VITE_AI_API_KEY || 'sk-sxpzuyiyetlfrjvcknbnyftdqemprrgokzjgvomrpwpxiezn';

interface ChatCompletionRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
}

interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: 'assistant';
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * 向 AI 提问关于海龟汤故事的问题
 * @param question 玩家的问题
 * @param story 海龟汤故事
 * @returns AI 的回答（"是"、"否"、"无关"）
 */
export async function askAI(question: string, story: TStory): Promise<string> {
  if (!API_KEY) {
    console.warn('AI API Key 未配置，使用默认回答"无关"');
    return '无关';
  }

  if (!question.trim()) {
    console.warn('问题不能为空，返回默认回答"无关"');
    return '无关';
  }

  const systemPrompt = `你是一个神秘的海龟汤游戏主持人。

【当前故事信息】
汤面（故事开头）：${story.surface}
汤底（真相）：${story.bottom}

【你的职责】
玩家会向你提问关于这个故事的问题，你需要根据汤底来判断并回答。

【回答规则】（必须严格遵守）
1. "是" — 玩家的猜测或推断完全符合汤底真相
2. "否" — 玩家的猜测或推断与汤底矛盾
3. "无关" — 玩家的猜测或推断与汤底无关，无法判断真假

【严格要求】
1. 只回答"是"、"否"、"无关"三个字，不要加任何标点符号
2. 不要解释原因，不要透露任何关于汤底的线索
3. 保持神秘感和游戏氛围
4. 如果玩家直接问"汤底是什么"，回答"无关"

【示例对话】
玩家：男人是因为滑倒才死的吗？
主持人：否

玩家：地上的是冰碎吗？
主持人：是

玩家：浴室里有其他人吗？
主持人：无关`;

  const requestData: ChatCompletionRequest = {
    model: 'deepseek-ai/DeepSeek-V3',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: question.trim() }
    ],
    temperature: 0.1,
    max_tokens: 10
  };

  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || 
        `API 请求失败: ${response.status} ${response.statusText}`
      );
    }

    const data: ChatCompletionResponse = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error('AI 未返回有效回答');
    }

    let answer = data.choices[0].message.content.trim();

    // 验证回答格式是否正确
    const validAnswers = ['是', '否', '无关'];
    if (!validAnswers.includes(answer)) {
      // 尝试从回答中提取有效答案
      let foundValidAnswer = false;
      for (const validAnswer of validAnswers) {
        if (answer.includes(validAnswer)) {
          answer = validAnswer;
          foundValidAnswer = true;
          break;
        }
      }
      
      // 如果仍然无效，返回默认值"无关"
      if (!foundValidAnswer) {
        console.warn('AI 回答不符合规范，返回默认值"无关"');
        return '无关';
      }
    }

    return answer;
  } catch (error) {
    console.error('AI 调用失败:', error);
    // 失败时返回默认值
    return '无关';
  }
}

/**
 * 生成海龟汤提示
 * @param story 海龟汤故事
 * @param hintNumber 提示序号
 * @returns 提示内容
 */
export async function generateHint(story: TStory, hintNumber: number): Promise<string> {
  if (!API_KEY) {
    throw new Error('AI API Key 未配置，请设置 VITE_AI_API_KEY 环境变量');
  }

  const systemPrompt = `基于汤面"${story.surface}"和汤底"${story.bottom}"，
请给出第 ${hintNumber} 个不透露汤底的暗示。
暗示应该帮助玩家缩小思考范围，但不直接指向答案。`;

  const requestData: ChatCompletionRequest = {
    model: 'deepseek-ai/DeepSeek-V3',
    messages: [
      { role: 'system', content: systemPrompt }
    ],
    temperature: 0.7,
    max_tokens: 100
  };

  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || 
        `API 请求失败: ${response.status} ${response.statusText}`
      );
    }

    const data: ChatCompletionResponse = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error('AI 未返回有效提示');
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('提示生成失败:', error);
    throw error;
  }
}