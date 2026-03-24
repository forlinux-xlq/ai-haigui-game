interface IStoryRevealStats {
  questions: number;
  hints: number;
  time: number;
}

interface IStoryRevealProps {
  bottom: string;
  surface: string;
  stats: IStoryRevealStats;
  onRestart: () => void;
  onHome: () => void;
}

export default function StoryReveal({
  bottom,
  surface,
  stats,
  onRestart,
  onHome,
}: IStoryRevealProps) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden">
          {/* 按钮区域 - 位于最上端 */}
          <div className="p-4 border-b border-slate-700 bg-slate-900/30 flex justify-start gap-3">
            <button
              type="button"
              onClick={onHome}
              className="min-h-[44px] px-4 rounded-lg bg-slate-700 text-slate-100 font-semibold hover:bg-slate-600 transition-all duration-300"
            >
              返回上页
            </button>
            <button
              type="button"
              onClick={() => window.location.href = '/'}
              className="min-h-[44px] px-4 rounded-lg bg-slate-700 text-slate-100 font-semibold hover:bg-slate-600 transition-all duration-300"
            >
              结束游戏
            </button>
          </div>
          
          <div className="p-5 border-b border-slate-700 bg-slate-900/30">
            <h1 className="text-2xl font-bold text-amber-400 mb-2">真相揭晓</h1>
            <p className="text-slate-300 text-sm">
              汤面回顾：<span className="text-slate-100">{surface}</span>
            </p>
          </div>

          <div className="p-5">
            <div className="text-sm text-slate-400 mb-2">汤底：</div>
            <div className="whitespace-pre-wrap leading-relaxed text-slate-100 bg-slate-900/40 border border-slate-700 rounded-lg p-4">
              {bottom}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="bg-slate-900/40 border border-slate-700 rounded-lg p-3">
                <div className="text-xs text-slate-400">提问次数</div>
                <div className="text-lg font-semibold">{stats.questions}</div>
              </div>
              <div className="bg-slate-900/40 border border-slate-700 rounded-lg p-3">
                <div className="text-xs text-slate-400">用过提示</div>
                <div className="text-lg font-semibold">{stats.hints}</div>
              </div>
              <div className="bg-slate-900/40 border border-slate-700 rounded-lg p-3">
                <div className="text-xs text-slate-400">用时</div>
                <div className="text-lg font-semibold">{stats.time}s</div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onRestart}
                className="min-h-[44px] flex-1 rounded-lg bg-amber-500 text-slate-950 font-semibold px-4 py-2 hover:bg-amber-400 transition-all duration-300"
              >
                再来一局
              </button>
              <button
                type="button"
                onClick={onHome}
                className="min-h-[44px] flex-1 rounded-lg bg-slate-700 text-slate-100 font-semibold px-4 py-2 hover:bg-slate-600 transition-all duration-300"
              >
                返回上一页
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

