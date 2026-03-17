interface GameOverProps {
  completedRounds: number;
  onRestart: () => void;
}

export default function GameOver({
  onRestart,
}: GameOverProps) {

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
