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
        restartGame();
        navigate(`/game?story=${encodeURIComponent(story.id)}`);
      }}
      onHome={() => navigate(`/game?story=${encodeURIComponent(story.id)}`, { replace: true })}
    />
  );
}

