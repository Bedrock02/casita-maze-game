import { formatTime } from '../utils';

interface GameOverProps {
  completedRounds: number;
  bestElapsedTime: number | null;
  level: number;
  onRestart: () => void;
}

export default function GameOver({
  completedRounds,
  bestElapsedTime,
  level,
  onRestart,
}: GameOverProps) {
  const shareSummary = `I completed ${completedRounds} rounds in La Casita Maze. Best time: ${bestElapsedTime !== null ? formatTime(bestElapsedTime) : 'N/A'}.`;

  const shareResult = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'La Casita Maze Results',
        text: shareSummary,
      });
      return;
    }

    await navigator.clipboard.writeText(shareSummary);
    window.alert('Result copied. Paste it into SMS, WhatsApp, or Instagram caption.');
  };

  return (
    <main className="app-shell game-over-shell">
      <section className="game-over-card" aria-label="Game over results">
        <h1>Game Over</h1>
        <div className="game-over-scene">
          <div className="scene-avatar avatar avatar-down walk-a" aria-hidden="true">
            <div className="hat" />
            <div className="glasses" />
            <div className="face" />
            <div className="sweater" />
            <div className="legs">
              <span className="leg left" />
              <span className="leg right" />
            </div>
          </div>
          <div className="scene-casita" aria-hidden="true">
            <div className="roof" />
            <div className="house" />
            <div className="door" />
          </div>
        </div>

        <div className="analytics-grid">
          <p>
            <span>Best Elapsed</span>
            <strong>{bestElapsedTime !== null ? formatTime(bestElapsedTime) : 'N/A'}</strong>
          </p>
          <p>
            <span>Total Rounds Completed</span>
            <strong>{completedRounds}</strong>
          </p>
          <p>
            <span>Highest Level Reached</span>
            <strong>{level}</strong>
          </p>
        </div>

        <section className="share-actions" aria-label="Share your result">
          <button type="button" onClick={shareResult}>
            Share Result
          </button>
          <a
            href={`sms:?body=${encodeURIComponent(shareSummary)}`}
            aria-label="Share by SMS"
          >
            SMS
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareSummary)}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Share on WhatsApp"
          >
            WhatsApp
          </a>
          {/* TODO: Add export image functionality */}
          {/* <button type="button" onClick={downloadResultCard}>
            Export Image (Stories/Reels)
          </button> */}
        </section>

        <button className="restart-btn" type="button" onClick={onRestart}>
          Play Again
        </button>
      </section>
    </main>
  );
}
