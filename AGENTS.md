# AI海龟汤游戏开发指令

## 项目概述
使用 React + TypeScript + Tailwind CSS 开发的 AI 海龟汤游戏网站。

## 开发规范
- 使用 TypeScript，确保类型安全
- 使用函数式组件 + Hooks
- 使用 Tailwind CSS 编写样式
- 组件要可复用，代码要有注释

## 代码风格

| 类型 | 命名规范 | 示例 |
|------|----------|------|
| 组件名 | PascalCase | `GameCard`, `ChatBox` |
| 函数名 | camelCase | `handleSubmit`, `fetchAIResponse` |
| 常量 | UPPER_SNAKE_CASE | `API_BASE_URL`, `MAX_QUESTIONS` |
| 类型定义 | T 前缀 | `TStory`, `TMessage`, `TGameState` |
| 接口定义 | I 前缀 | `IStoryProps`, `IGameContext` |
| 枚举定义 | E 前缀 | `EDifficulty`, `EMessageRole` |

## 设计要求

### 配色方案

| 用途 | 颜色 | Tailwind 类名 |
|------|------|---------------|
| 主背景 | 深蓝黑 | `bg-slate-900` |
| 卡片背景 | 深灰蓝 | `bg-slate-800` |
| 强调色 | 金色 | `text-amber-400`, `bg-amber-500` |
| 成功 | 绿色 | `text-emerald-400` |
| 警告 | 橙色 | `text-orange-400` |
| 错误 | 红色 | `text-rose-400` |
| 文字主色 | 浅灰白 | `text-slate-100` |
| 文字次色 | 中灰 | `text-slate-400` |

### 通用样式
- 圆角：`rounded-lg`（8px）
- 阴影：`shadow-lg`, `shadow-xl`
- 过渡：`transition-all duration-300`
- 悬停：`hover:scale-105`, `hover:bg-slate-700`

### 响应式断点

| 断点 | 尺寸 | 用途 |
|------|------|------|
| `sm` | 640px | 小屏手机 |
| `md` | 768px | 平板 |
| `lg` | 1024px | 桌面 |
| `xl` | 1280px | 大屏桌面 |

## 注意事项
- 保持代码简洁，避免过度设计
- 优先实现核心功能
- 确保移动端适配（触摸目标最小 44px）
- AI API Key 使用环境变量，禁止硬编码
- 添加错误边界处理 API 异常
- 实现加载状态，避免用户重复提交
- 对话历史本地存储，防止刷新丢失

## 测试要求
- 每个功能完成后手动测试
- 确保各种屏幕尺寸正常显示（Chrome DevTools 设备模拟）
- 测试 AI 回答是否准确（准备 10 组标准问答对验证）
- 测试边界情况：空输入、超长文本、特殊字符
- 测试网络异常：断网、超时、API 错误响应

