interface GameOverProps {
  completedRounds: number;
  score: number;
  onRestart: () => void;
}

export default function GameOver({
  completedRounds,
  score,
  onRestart,
}: GameOverProps) {

  const getMotivationalMessage = (rounds: number) => {
    if (rounds >= 20) return "¡Increíble! Eres un verdadero maestro del laberinto";
    if (rounds >= 15) return "¡Excelente trabajo! Tu habilidad es impresionante";
    if (rounds >= 10) return "¡Muy bien! Estás mejorando rápidamente";
    if (rounds >= 5) return "¡Buen trabajo! Sigue así";
    return "¡Buen comienzo! Sigue practicando";
  };

  const getRoundsText = (rounds: number) => {
    if (rounds === 1) return "ronda completada";
    return "rondas completadas";
  };

  return (
    <main className="app-shell game-over-shell">
      <div className="game-over-scene">
        <section className="game-over-card" aria-label="Game over results">
        
          <div className="motivational-overlay">
            <div className="motivational-content">
              <h2 className="motivational-title">
                {getMotivationalMessage(completedRounds)}
              </h2>
              <div className="rounds-display">
                <span className="rounds-number">{completedRounds}</span>
                <span className="rounds-text">{getRoundsText(completedRounds)}</span>
              </div>
              <div className="motivational-subtitle">
                ¿Puedes superar tu récord?
              </div>
              <div className="motivational-subtitle">
                Puntuacion final: <strong>{score}</strong>
              </div>
              <div>
                <button className="restart-btn" type="button" onClick={onRestart}>
                  Jugar De Nuevo
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
