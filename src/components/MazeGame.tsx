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
    plantains,
    flagPosition,
    facing,
    stepFrame,
    timeLeft,
    score,
    tileSize,
    popups,
    onTouchStart,
    onTouchEnd,
    showControlsHelp,
    setShowControlsHelp,
    gameOver,
    completedRounds,
    tryMove,
    setGameOver,
    restartGame,
  } = useGameContext();

  if (gameOver) {
    return (
      <GameOver
        completedRounds={completedRounds}
        score={score}
        onRestart={restartGame}
      />
    );
  }

  return (
    <main className="app-shell">
      <GameHeader
        level={level}
        timeLeft={timeLeft}
        score={score}
        showControlsHelp={showControlsHelp}
        setShowControlsHelp={setShowControlsHelp}
      />

      <MazeBoard
        maze={maze}
        player={player}
        plantains={plantains}
        flagPosition={flagPosition}
        popups={popups}
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
