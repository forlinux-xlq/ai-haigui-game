import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ChatBox from '../components/ChatBox';
import DifficultyBadge from '../components/DifficultyBadge';
import HintButton from '../components/HintButton';
import { stories } from '../data/stories';
import { useGame } from '../hooks/useGame';

export default function Game() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const storyId = searchParams.get('story');
  const story = storyId ? stories.find((s) => s.id === storyId) : undefined;

  const { session, startGame, sendMessage, useHint, isLoading, endGame } = useGame();

  useEffect(() => {
    if (!story) {
      navigate('/', { replace: true });
      return;
    }

    if (session.storyId !== story.id) {
      startGame(story);
    }
  }, [navigate, startGame, session.storyId, story]);

  const handleViewBottom = () => {
    endGame('giveup');
    navigate(`/result?story=${encodeURIComponent(story?.id ?? '')}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-8">
      <div className="max-w-5xl w-full mx-auto flex flex-col gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-4">
          {/* 按钮区域 - 位于最上端 */}
          <div className="flex justify-start gap-3 mb-4">
            <button
              type="button"
              onClick={() => {
                if (story) navigate(`/difficulty/${story.difficulty}`, { replace: true });
                else navigate('/?mode=list', { replace: true });
              }}
              className="min-h-[44px] px-3 rounded-lg bg-slate-700 text-slate-100 font-semibold hover:bg-slate-600 transition-all duration-300"
            >
              返回上页
            </button>
            <button
              type="button"
              onClick={() => navigate('/', { replace: true })}
              className="min-h-[44px] px-5 rounded-lg bg-slate-700 text-slate-100 font-semibold hover:bg-slate-600 transition-all duration-300"
            >
              结束游戏
            </button>
          </div>
          
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-amber-400">汤面故事</h2>
              <p className="mt-2 text-slate-200 whitespace-pre-wrap">{session.surface ?? story?.surface}</p>
            </div>
            {story ? <DifficultyBadge difficulty={story.difficulty} /> : null}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
            <div className="md:col-span-1">
              <HintButton remaining={session.hintsRemaining} disabled={isLoading} onUse={useHint} />
            </div>
            <div className="md:col-span-2 flex gap-2 md:justify-end flex-wrap">
              <button
                type="button"
                onClick={handleViewBottom}
                className="min-h-[44px] px-5 rounded-lg bg-amber-500 text-slate-950 font-semibold disabled:opacity-50 hover:bg-amber-400 transition-all duration-300"
                disabled={!story}
              >
                查看汤底
              </button>
            </div>
          </div>
        </div>

        <ChatBox messages={session.messages} onSend={sendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}

