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
          <img
            src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExb25lZ2w4M2ZvM2w3eHR0bDJrbWluZ3k3MmI3ajAwMjNwejRheWhsYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/6Sv8GYSOin1VV3s0Ve/giphy.gif"
            alt="Bad Bunny in sugar cane field"
          />
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
