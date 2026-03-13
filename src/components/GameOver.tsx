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
      <div className="game-over-scene">
        <section className="game-over-card" aria-label="Game over results">
          <button className="restart-btn" type="button" onClick={onRestart}>
            Jugar De Nuevo
          </button>

        </section>
      </div>
    </main>
  );
}
