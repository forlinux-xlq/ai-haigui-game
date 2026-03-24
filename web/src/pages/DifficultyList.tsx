import { useMemo } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import GameCard from '../components/GameCard';
import { stories } from '../data/stories';
import type { TGameDifficulty } from '../types';

const DIFFICULTY_LABEL: Record<TGameDifficulty, string> = {
  easy: '简单',
  medium: '中等',
  hard: '困难',
};

function parseDifficulty(value: string | undefined): TGameDifficulty | null {
  if (value === 'easy' || value === 'medium' || value === 'hard') return value;
  return null;
}

export default function DifficultyList() {
  const params = useParams();
  const navigate = useNavigate();

  const difficulty = parseDifficulty(params.difficulty);

  const filteredStories = useMemo(() => {
    if (!difficulty) return [];
    return stories.filter((s) => s.difficulty === difficulty);
  }, [difficulty]);

  if (!difficulty) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen text-slate-100 relative overflow-hidden bg-slate-950 flex items-center justify-center">
      {/* 背景：保持与首页一致的雾光氛围 */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950"
      />
      <div
        aria-hidden="true"
        className="absolute -top-32 left-1/2 w-[900px] h-[420px] -translate-x-1/2 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.18),transparent_60%)] blur-2xl"
      />
      <div
        aria-hidden="true"
        className="absolute top-24 -right-32 w-[700px] h-[420px] bg-[radial-gradient(circle_at_center,rgba(217,70,239,0.16),transparent_62%)] blur-2xl"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"
      />

      <main className="relative max-w-6xl w-full mx-auto px-4 py-10 sm:px-8">
        <section className="rounded-2xl border border-white/10 bg-slate-800/30 backdrop-blur-md shadow-xl p-4 sm:p-6 lg:p-8">
          {/* 按钮区域 - 位于最上端 */}
          <div className="flex justify-start gap-3 mb-4">
            <button
              type="button"
              onClick={() => navigate('/?mode=list', { replace: true })}
              className="min-h-[44px] px-4 rounded-lg bg-slate-700 text-slate-100 font-semibold hover:bg-slate-600 transition-all duration-300"
            >
              返回上页
            </button>
            <button
              type="button"
              onClick={() => navigate('/', { replace: true })}
              className="min-h-[44px] px-4 rounded-lg bg-slate-700 text-slate-100 font-semibold hover:bg-slate-600 transition-all duration-300"
            >
              结束游戏
            </button>
          </div>
          
          {/* 标题区域 */}
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-100">
              {DIFFICULTY_LABEL[difficulty]}难度列表
            </h2>
            <div className="text-xs text-slate-400">共 {filteredStories.length} 则</div>
          </div>

          {/* 响应式网格：减少留白，尽量让内容紧凑填充 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredStories.map((s) => (
              <div key={s.id} className="group relative">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300
                               bg-[linear-gradient(110deg,transparent,rgba(34,211,238,0.22),transparent)] blur-[2px]"
                />
                <GameCard
                  story={s}
                  onClick={() => navigate(`/game?story=${encodeURIComponent(s.id)}`)}
                />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

