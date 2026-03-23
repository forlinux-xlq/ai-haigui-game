# AI 海龟汤游戏 - 技术设计文档

## 1. 技术栈

| 层级 | 技术选型 | 说明 |
|------|---------|------|
| 前端框架 | React 18 + TypeScript | 类型安全，组件化开发 |
| 构建工具 | Vite | 快速热更新，开发体验好 |
| 样式方案 | Tailwind CSS | 原子化 CSS，快速迭代 |
| 状态管理 | React Hooks + useContext | 轻量级，无需引入 Redux |
| 路由 | React Router v6 | SPA 标准路由方案 |
| 后端 | Node.js + Express（可选） | 前期前端模拟，后期独立部署 |
| AI 服务 | DeepSeek API | 成本低，支持流式输出 |

## 2. 项目结构

```
src/
├── components/          # 可复用 UI 组件
│   ├── GameCard.tsx     # 游戏卡片（展示故事难度、标题）
│   ├── ChatBox.tsx      # 聊天容器（消息列表 + 输入框）
│   ├── Message.tsx      # 单条消息（区分用户/AI 样式）
│   ├── StoryReveal.tsx  # 汤底揭晓（动画展示）
│   ├── HintButton.tsx   # 提示按钮（消耗次数）
│   └── DifficultyBadge.tsx # 难度标签组件
├── pages/               # 页面级组件
│   ├── Home.tsx         # 首页/游戏大厅（故事列表）
│   ├── Game.tsx         # 游戏进行页面
│   └── Result.tsx       # 结果页（汤底 + 再来一局）
├── hooks/               # 自定义 Hooks
│   ├── useGame.ts       # 游戏状态逻辑
│   └── useAIChat.ts     # AI 对话逻辑
├── context/             # 全局状态
│   └── GameContext.tsx  # 游戏状态上下文
├── data/
│   └── stories.ts       # 海龟汤故事数据
├── types/
│   └── index.ts         # TypeScript 类型定义
├── utils/
│   └── ai.ts            # AI API 调用封装
├── App.tsx
└── main.tsx
```

## 3. 数据模型

### 3.1 Story（海龟汤故事）

```typescript
interface Story {
  id: string;                    // 唯一标识（UUID）
  title: string;                 // 故事标题
  difficulty: 'easy' | 'medium' | 'hard';  // 难度等级
  surface: string;               // 汤面（故事开头）
  bottom: string;                // 汤底（真相）
  hintCount: number;             // 提示次数（1-3）
  tags?: string[];               // 标签（可选）
  createdAt?: number;            // 创建时间戳
}
```

### 3.2 Message（对话消息）

```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant';   // 消息角色
  content: string;               // 消息内容
  timestamp: number;              // 时间戳
  status?: 'sending' | 'sent' | 'error'; // 发送状态（可选）
}
```

### 3.3 GameSession（游戏会话）

```typescript
interface GameSession {
  storyId: string | null;        // 当前故事 ID
  surface: string | null;       // 当前汤面
  bottom: string | null;         // 汤底（仅本地存储，不发送给 AI）
  messages: Message[];          // 对话历史
  hintsUsed: number;             // 已用提示次数
  hintsRemaining: number;        // 剩余提示次数
  questionCount: number;         // 已提问次数
  status: 'idle' | 'playing' | 'finished'; // 游戏状态
  startTime?: number;            // 开始时间
  endTime?: number;              // 结束时间
}
```

### 3.4 API Response（AI 响应）

```typescript
type AIAnswer = '是' | '否' | '无关';

interface AIResponse {
  answer: AIAnswer;
  // 后续扩展：原始回复、置信度等
}
```

## 4. 核心流程

```
┌─────────────┐
│  首页选择故事  │ ← Home.tsx
└──────┬──────┘
       ▼
┌─────────────┐
│  显示汤面    │ ← Game.tsx（展示 surface）
└──────┬──────┘
       ▼
┌──────────────────────────────────────┐
│  玩家提问 ←──────────────→ AI 判断    │
│  - 输入问题                           │
│  - 发送到 DeepSeek API               │
│  - 返回"是/否/无关"                   │
│  - 玩家可使用提示（消耗次数）          │
└──────┬───────────────────┬───────────┘
       ▼                   ▼
┌─────────────┐      ┌─────────────┐
│  猜出真相    │      │  放弃/超限   │
└──────┬──────┘      └──────┬──────┘
       ▼                   ▼
┌──────────────────────────────────────┐
│  汤底揭晓（StoryReveal.tsx）          │
│  - 动画展示汤底                       │
│  - 显示统计（提问次数、用时、提示数）    │
│  - 再来一局 / 返回首页                 │
└──────────────────────────────────────┘
```

## 5. AI Prompt 设计

### 5.1 系统提示词

```
你是一个神秘的海龟汤游戏主持人。

【当前故事信息】
汤面（故事开头）：{surface}
汤底（真相）：{bottom}

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
```

### 5.2 玩家猜出真相的判定

```
当玩家明确表达最终答案时（如"所以真相是XXX"），AI 应：
1. 判断该答案是否与汤底一致
2. 如果一致 → 回答"是"，游戏胜利
3. 如果不一致 → 回答"否"，继续游戏
```

### 5.3 提示功能 Prompt（可选扩展）

```
基于汤面"{surface}"和汤底"{bottom}"，
请给出 {hintNumber} 个不透露汤底的暗示。
暗示应该帮助玩家缩小思考范围，但不直接指向答案。
```

## 6. 组件设计

### 6.1 GameCard

| 属性 | 类型 | 说明 |
|------|------|------|
| story | Story | 故事数据 |
| onClick | () => void | 点击开始游戏 |

**视觉要求**：卡片展示标题、难度标签（颜色区分）、简短描述

### 6.2 ChatBox

| 属性 | 类型 | 说明 |
|------|------|------|
| messages | Message[] | 消息列表 |
| onSend | (content: string) => void | 发送消息回调 |
| disabled | boolean | 是否禁用输入 |

**交互**：滚动到底部、新消息动画、发送中状态

### 6.3 Message

| 属性 | 类型 | 说明 |
|------|------|------|
| message | Message | 消息数据 |
| isUser | boolean | 是否为用户消息 |

**样式**：用户消息右侧气泡，AI 消息左侧气泡，区分颜色

### 6.4 StoryReveal

| 属性 | 类型 | 说明 |
|------|------|------|
| bottom | string | 汤底内容 |
| surface | string | 汤面内容（回顾） |
| stats | { questions: number; hints: number; time: number } | 游戏统计 |
| onRestart | () => void | 重新开始 |
| onHome | () => void | 返回首页 |

**动画**：打字机效果、淡入淡出

### 6.5 HintButton

| 属性 | 类型 | 说明 |
|------|------|------|
| remaining | number | 剩余提示次数 |
| onUse | () => void | 使用提示 |
| disabled | boolean | 是否禁用 |

**视觉**：显示剩余次数，点击后显示提示内容

## 7. 状态管理

### 7.1 GameContext 结构

```typescript
interface GameContextType {
  // 游戏状态
  session: GameSession;

  // 操作方法
  startGame: (story: Story) => void;
  sendMessage: (content: string) => Promise<void>;
  useHint: () => Promise<string | null>;
  restartGame: () => void;
  endGame: (type: 'win' | 'giveup') => void;

  // AI 响应
  lastAIAnswer: AIAnswer | null;
  isLoading: boolean;
}
```

### 7.2 本地存储

- 使用 `localStorage` 保存用户游戏记录（可选）
- 不推荐将汤底存储在 localStorage，防止作弊

## 8. AI API 调用

### 8.1 请求封装

```typescript
// utils/ai.ts
interface ChatCompletionRequest {
  model: string;        // e.g., "deepseek-chat"
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;  // 建议 0.1，降低随机性
  max_tokens?: number;   // 限制输出字数
}
```

### 8.2 错误处理

| 错误类型 | 处理方式 |
|---------|---------|
| 网络超时 | 显示"网络开小差了，请重试"，允许重发 |
| API 限流 | 显示友好提示，延迟重试 |
| 响应格式异常 | 降级为关键词匹配（是/否/无关） |
| API Key 无效 | 提示配置问题，显示设置页入口 |

### 8.3 流式输出（可选）

- 使用 `ReadableStream` 实现打字机效果
- 提升用户体验，减少等待焦虑

## 9. 难度分级建议

| 难度 | 提示次数 | 问题限制 | 适用场景 |
|------|---------|---------|---------|
| easy | 3 | 20 | 新手入门 |
| medium | 2 | 15 | 普通玩家 |
| hard | 1 | 10 | 挑战模式 |

## 10. 故事数据示例

```typescript
// data/stories.ts
export const stories: Story[] = [
  {
    id: '1',
    title: '浴室里的秘密',
    difficulty: 'easy',
    surface: '一个男人在浴室里死了，地上有碎玻璃和一片水渍。',
    bottom: '男人是花样滑冰运动员，在冰面上表演后去浴室。地上的是冰碎，不是玻璃。',
    hintCount: 3,
    tags: ['推理', '日常']
  },
  // ... 更多故事
];
```

## 11. 后续扩展方向

1. **多人模式**：引入 WebSocket，支持玩家对战
2. **故事创作**：用户可提交自己的海龟汤故事
3. **排行榜**：记录最快通关记录
4. **成就系统**：连续通关、无提示通关等
5. **主题皮肤**：节日主题、自定义配色
6. **国际化**：支持多语言 AI Prompt
