import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import type { TMessage } from '../types';
import MessageBubble from './MessageBubble';
import { useSound } from '../hooks/useSound';

interface IChatBoxProps {
  messages: TMessage[];
  onSend: (content: string) => Promise<void>;
  disabled: boolean;
}

export default function ChatBox({ messages, onSend, disabled }: IChatBoxProps) {
  const [content, setContent] = useState('');
  const listRef = useRef<HTMLDivElement | null>(null);
  const { playSound } = useSound();

  const canSend = useMemo(() => content.trim().length > 0 && !disabled, [content, disabled]);

  useEffect(() => {
    // 新消息滚动到底部
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSend) return;
    const next = content.trim();
    setContent('');
    playSound('/sounds/button-click.mp3');
    await onSend(next);
  };

  return (
    <div className="flex flex-col h-full min-h-[520px] bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden">
      <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-slate-400 text-sm">
            提问吧。主持人只会回答“是 / 否 / 无关”。
          </div>
        ) : (
          messages.map((m) => (
            <MessageBubble key={m.id} message={m} isUser={m.role === 'user'} />
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t border-slate-700">
        <div className="flex gap-2">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="输入你的问题..."
            className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder:text-slate-500 outline-none min-h-[44px]"
            disabled={disabled}
          />
          <button
            type="submit"
            className="min-h-[44px] px-4 rounded-lg bg-amber-500 text-slate-950 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:bg-amber-400"
            disabled={!canSend}
          >
            发送
          </button>
        </div>
        <div className="mt-2 text-xs text-slate-400">
          {disabled ? 'AI正在思考...' : '提示：输入“查看汤底”将不会触发作弊，仅用于本地展示。'}
        </div>
      </form>
    </div>
  );
}

