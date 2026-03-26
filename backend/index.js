const express = require('express');
const cors = require('cors');
const axios = require('axios');
// dotenv is used for local development only; in Railway, env vars are injected
// directly into process.env and do not require a .env file.
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// 配置 CORS
app.use(cors({
  origin: '*', // 在生产环境中应该设置具体的前端域名
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 解析 JSON 请求体
app.use(express.json());

// 测试接口
app.get('/api/test', (req, res) => {
  res.json({
    message: '测试接口成功',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// AI 对话接口
app.post('/api/chat', async (req, res) => {
  console.log('收到 AI 对话请求:', {
    body: req.body,
    headers: req.headers,
    method: req.method,
    url: req.url
  });
  
  try {
    const { question, story } = req.body;

    console.log('请求参数:', { question, story });
    
    if (!question || !story) {
      console.log('缺少必要参数');
      return res.status(400).json({
        error: '缺少必要参数',
        status: 'error'
      });
    }

    const API_KEY = process.env.DEEPSEEK_API_KEY;
    if (!API_KEY) {
      console.log('API Key 未配置');
      return res.status(500).json({
        error: 'API Key 未配置',
        status: 'error'
      });
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
4. 如果玩家直接问"汤底是什么"，回答"无关"`;

    console.log('正在调用 DeepSeek API...');
    const response = await axios.post('https://api.siliconflow.cn/v1/chat/completions', {
      model: 'deepseek-ai/DeepSeek-V3',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question.trim() }
      ],
      temperature: 0.1,
      max_tokens: 10
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    });

    console.log('DeepSeek API 响应:', response.data);
    
    if (!response.data || !response.data.choices || response.data.choices.length === 0) {
      console.log('AI 未返回有效回答');
      return res.status(500).json({
        error: 'AI 未返回有效回答',
        status: 'error'
      });
    }

    let answer = response.data.choices[0].message.content.trim();
    console.log('AI 原始回答:', answer);

    // 验证回答格式是否正确
    const validAnswers = ['是', '否', '无关'];
    if (!validAnswers.includes(answer)) {
      console.log('回答格式不正确，尝试提取有效答案');
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
        console.log('无法提取有效答案，返回默认值"无关"');
        answer = '无关';
      }
    }

    console.log('最终回答:', answer);
    res.json({
      answer: answer,
      status: 'ok',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI 调用失败:', error);
    res.status(500).json({
      error: 'AI 调用失败，请稍后重试',
      status: 'error'
    });
  }
});

// 根路径
app.get('/', (req, res) => {
  res.json({
    message: 'AI 海龟汤游戏后端服务',
    version: '1.0.0',
    status: 'running'
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    message: '接口不存在',
    status: 'error'
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`测试接口: http://localhost:${PORT}/api/test`);
});