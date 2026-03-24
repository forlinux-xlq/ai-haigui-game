import type { TMessage } from '../types';

interface IMessageBubbleProps {
  message: TMessage;
  isUser: boolean;
}

export default function MessageBubble({ message, isUser }: IMessageBubbleProps) {
  const isError = message.status === 'error';
  
  return (
    <div className={isUser ? 'flex justify-end' : 'flex justify-start'}>
      <div
        className={[
          'rounded-lg px-4 py-2 max-w-[80%] whitespace-pre-wrap break-words border',
          isUser
            ? 'bg-amber-500/10 text-amber-100 border-amber-500/30'
            : isError
              ? 'bg-rose-500/10 text-rose-100 border-rose-500/30'
              : 'bg-slate-700/60 text-slate-100 border-slate-600',
        ].join(' ')}
      >
        {message.content}
      </div>
    </div>
  );
}

