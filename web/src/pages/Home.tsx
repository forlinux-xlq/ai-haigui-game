import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { stories } from '../data/stories';
import type { TGameDifficulty } from '../types';

export default function Home() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'intro' | 'list'>('intro');

  const totalCount = useMemo(() => stories.length, []);

  const difficultyOptions = useMemo(
    () =>
      [
        { value: 'easy' as const, label: '简单', theme: 'easy' as const },
        { value: 'medium' as const, label: '中等', theme: 'medium' as const },
        { value: 'hard' as const, label: '困难', theme: 'hard' as const },
      ] as const,
    [],
  );

  const handleSelectDifficulty = (difficulty: TGameDifficulty) => {
    // 从“海龟汤列表”界面直接跳转，原界面消失（不再展示故事网格）。
    navigate(`/difficulty/${difficulty}`);
  };

  return (
    <div className="min-h-screen text-slate-100 relative overflow-hidden bg-slate-950">
      {/* 背景：深色渐变 + 霓虹雾光晕 */}
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

      {mode === 'intro' ? (
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-8">
          <div className="w-full max-w-3xl text-center">
            <h1 className="tracking-[0.22em] text-3xl sm:text-5xl font-extrabold text-cyan-400/90 drop-shadow-[0_0_22px_rgba(34,211,238,0.25)]">
              AI海龟汤
            </h1>
            <p className="mt-4 text-slate-300/80 text-sm sm:text-base">
              推理悬疑，真相只有一个
            </p>

            {/* 规则卡片：玻璃拟态 */}
            <div className="mt-8 mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl p-6 sm:p-7 text-left">
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-cyan-300/95">
                  游戏规则
                </h2>
              </div>

              <ul className="mt-5 space-y-3 text-slate-200/85 text-sm sm:text-base">
                <li className="flex gap-3 items-start">
                  <span className="mt-2 w-2 h-2 rounded-full bg-cyan-300/80 shadow-[0_0_18px_rgba(34,211,238,0.45)]" />
                  系统会展示一个海龟汤的表面故事（汤面）。
                </li>
                <li className="flex gap-3 items-start">
                  <span className="mt-2 w-2 h-2 rounded-full bg-cyan-300/80 shadow-[0_0_18px_rgba(34,211,238,0.45)]" />
                  通过提问来缩小范围：主持人只回答“是 / 否 / 无关”。
                </li>
                <li className="flex gap-3 items-start">
                  <span className="mt-2 w-2 h-2 rounded-full bg-cyan-300/80 shadow-[0_0_18px_rgba(34,211,238,0.45)]" />
                  根据对话信息推断真相；用尽提示也不会影响最后揭晓。
                </li>
                <li className="flex gap-3 items-start">
                  <span className="mt-2 w-2 h-2 rounded-full bg-cyan-300/80 shadow-[0_0_18px_rgba(34,211,238,0.45)]" />
                  你可以随时“查看汤底”，揭开唯一的答案。
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setMode('list')}
              className="mt-10 mx-auto min-h-[48px] px-8 rounded-2xl bg-cyan-400/90 text-slate-950 font-semibold
                         shadow-[0_0_0_1px_rgba(56,189,248,0.25),0_0_26px_rgba(34,211,238,0.35)]
                         hover:bg-cyan-400 transition-all duration-300"
            >
              开始游戏
              <span className="sr-only">进入海龟汤列表</span>
            </button>

            <div className="mt-4 text-xs text-slate-300/50">
              当前共有 {totalCount} 则海龟汤待你探索
            </div>
          </div>
        </div>
      ) : (
        <main className="relative max-w-6xl w-full mx-auto px-4 pb-10 sm:px-8 z-10">
          <section className="rounded-2xl border border-white/10 bg-slate-800/30 backdrop-blur-md shadow-xl p-4 sm:p-6 lg:p-8">
            {/* 列表界面：只显示难度选择（放大居中、尽量减少留白） */}
            <div className="min-h-[420px] flex flex-col items-center justify-center text-center">
              <h2 className="text-2xl sm:text-3xl font-semibold text-slate-100 mb-6">
                海龟汤列表
              </h2>

              <div className="w-full max-w-[340px] flex flex-col gap-4">
                {difficultyOptions.map((opt) => {
                  const themeClass =
                    opt.theme === 'easy'
                      ? {
                          border: 'border-emerald-300/35',
                          glow: 'shadow-[0_0_18px_rgba(52,211,153,0.25)]',
                          bg: 'bg-emerald-400/10',
                          text: 'text-emerald-200',
                        }
                      : opt.theme === 'medium'
                        ? {
                            border: 'border-amber-300/35',
                            glow: 'shadow-[0_0_18px_rgba(245,158,11,0.22)]',
                            bg: 'bg-amber-400/10',
                            text: 'text-amber-200',
                          }
                        : {
                            border: 'border-rose-300/35',
                            glow: 'shadow-[0_0_18px_rgba(244,63,94,0.22)]',
                            bg: 'bg-rose-400/10',
                            text: 'text-rose-200',
                          };

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelectDifficulty(opt.value)}
                      className={[
                        'min-h-[56px] rounded-2xl border transition-all duration-300 w-full',
                        'flex items-center justify-center font-semibold',
                        themeClass.border,
                        themeClass.bg,
                        themeClass.text,
                        themeClass.glow,
                        'hover:scale-[1.01]',
                      ].join(' ')}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 text-xs text-slate-300/60">
                选择难度后跳转到对应海龟汤列表
              </div>
            </div>
          </section>
        </main>
      )}
    </div>
  );
}

