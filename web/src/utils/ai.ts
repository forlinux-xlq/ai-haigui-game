import type { TAIAnswer } from '../types';

type TFetchAIAnswerInput = {
  surface: string;
  bottom: string;
  question: string;
};

// MVP 版本：先用占位逻辑跑通前端链路（不发送真实请求）。
export async function fetchAIAnswer(_input: TFetchAIAnswerInput): Promise<TAIAnswer> {
  const _apiKey = import.meta.env.VITE_AI_API_KEY; // 仅用于后续接入真实 API
  void _apiKey;

  // 模拟网络延迟，让 UI 的加载态能被验证。
  await new Promise((resolve) => setTimeout(resolve, 650));
  return '无关';
}

