import { useGameContext } from '../context/GameContext';
import GameHeader from './GameHeader';
import MazeBoard from './MazeBoard';
import MobileControls from './MobileControls';
import GameOver from './GameOver';

export default function MazeGame() {
  const {
    level,
    maze,
    player,
    facing,
    stepFrame,
    elapsedSeconds,
    timeLeft,
    tileSize,
    onTouchStart,
    onTouchEnd,
    showControlsHelp,
    setShowControlsHelp,
    gameOver,
    completedRounds,
    bestElapsedTime,
    tryMove,
    setGameOver,
    restartGame,
  } = useGameContext();

  if (gameOver) {
    return (
      <GameOver
        completedRounds={completedRounds}
        bestElapsedTime={bestElapsedTime}
        level={level}
        onRestart={restartGame}
      />
    );
  }

  return (
    <main className="app-shell">
      <GameHeader
        level={level}
        elapsedSeconds={elapsedSeconds}
        timeLeft={timeLeft}
        showControlsHelp={showControlsHelp}
        setShowControlsHelp={setShowControlsHelp}
      />

      <MazeBoard
        maze={maze}
        player={player}
        facing={facing}
        stepFrame={stepFrame}
        tileSize={tileSize}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      />

      <MobileControls onMove={tryMove} />

      <button className="end-game-btn" type="button" onClick={() => setGameOver(true)}>
        Terminar Juego
      </button>
    </main>
  );
}
