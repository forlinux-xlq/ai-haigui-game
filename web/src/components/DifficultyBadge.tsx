import type { TGameDifficulty } from '../types';

interface IGameDifficultyBadgeProps {
  difficulty: TGameDifficulty;
}

export default function DifficultyBadge({ difficulty }: IGameDifficultyBadgeProps) {
  const styleByDifficulty: Record<TGameDifficulty, string> = {
    easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    hard: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  return (
    <span
      className={[
        'inline-flex items-center px-2.5 py-1 rounded-lg border text-sm font-medium',
        styleByDifficulty[difficulty],
      ].join(' ')}
    >
      {difficulty === 'easy' ? '简单' : difficulty === 'medium' ? '中等' : '困难'}
    </span>
  );
}

