import type { TMessage } from '../types';
import MessageBubble from './MessageBubble';

interface IMessageProps {
  message: TMessage;
  isUser: boolean;
}

export default function Message({ message, isUser }: IMessageProps) {
  return <MessageBubble message={message} isUser={isUser} />;
}

