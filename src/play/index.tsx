import { GameProvider } from '../context/GameContext';
import MazeGame from '../components/MazeGame';

const Play = () => {
  return (
    <GameProvider>
      <MazeGame />
    </GameProvider>
  );
};

export default Play;