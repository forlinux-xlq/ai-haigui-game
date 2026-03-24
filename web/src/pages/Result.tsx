import { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import StoryReveal from '../components/StoryReveal';
import { stories } from '../data/stories';
import { useGame } from '../hooks/useGame';

export default function Result() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const storyId = searchParams.get('story');
  const story = storyId ? stories.find((s) => s.id === storyId) : undefined;

  const { session, restartGame } = useGame();

  // 随机选择一个不同的故事
  const getRandomStory = useMemo(() => {
    if (!story) return null;
    // 过滤掉当前故事
    const otherStories = stories.filter(s => s.id !== story.id);
    if (otherStories.length === 0) return story; // 如果只有一个故事，返回当前故事
    // 随机选择一个
    const randomIndex = Math.floor(Math.random() * otherStories.length);
    return otherStories[randomIndex];
  }, [story]);

  useEffect(() => {
    if (!story) {
      navigate('/', { replace: true });
    }
  }, [navigate, story]);

  const timeSeconds = useMemo(() => {
    if (!session.startTime) return 0;
    const end = session.endTime ?? Date.now();
    return Math.max(0, Math.floor((end - session.startTime) / 1000));
  }, [session.endTime, session.startTime]);

  if (!story) return null;

  return (
    <StoryReveal
      bottom={story.bottom}
      surface={story.surface}
      stats={{
        questions: session.questionCount,
        hints: session.hintsUsed,
        time: timeSeconds,
      }}
      onRestart={() => {
        const randomStory = getRandomStory;
        if (randomStory) {
          restartGame();
          navigate(`/game?story=${encodeURIComponent(randomStory.id)}`);
        }
      }}
      onHome={() => navigate(`/difficulty/${story.difficulty}`, { replace: true })}
    />
  );
}

