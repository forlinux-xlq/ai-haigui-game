import type { TStory } from '../types';
import DifficultyBadge from './DifficultyBadge';

interface IGameCardProps {
  story: TStory;
  onClick: () => void;
}

export default function GameCard({ story, onClick }: IGameCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-4 transition-all duration-300 hover:scale-105 hover:bg-slate-700 min-h-[140px]"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-100">{story.title}</h3>
        <DifficultyBadge difficulty={story.difficulty} />
      </div>

      <p className="mt-3 text-slate-400 line-clamp-3">
        {story.surface}
      </p>

      {story.tags && story.tags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {story.tags.slice(0, 3).map((t) => (
            <span key={t} className="text-xs px-2 py-1 rounded-lg bg-slate-900/40 border border-slate-700 text-slate-300">
              {t}
            </span>
          ))}
        </div>
      ) : null}
    </button>
  );
}

