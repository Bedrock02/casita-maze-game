import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type TouchEvent,
  type ReactNode,
} from 'react';
import { DIRECTION_BY_KEY, MOVE_BY_DIRECTION } from '../constants';
import { createMaze, getLevelCountdown, getResponsiveTileSize } from '../utils';
import type { Direction, Maze, Position, TouchPoint } from '../types';

export interface GameContextType {
  // Game state
  level: number;
  maze: Maze;
  player: Position;
  facing: Direction;
  stepFrame: number;
  elapsedSeconds: number;
  timeLeft: number;
  tileSize: number;
  touchStart: TouchPoint | null;
  showControlsHelp: boolean;
  gameOver: boolean;
  completedRounds: number;
  bestElapsedTime: number | null;

  // Game actions
  tryMove: (direction: Direction) => void;
  onTouchStart: (event: TouchEvent<HTMLElement>) => void;
  onTouchEnd: (event: TouchEvent<HTMLElement>) => void;
  setShowControlsHelp: React.Dispatch<React.SetStateAction<boolean>>;
  setGameOver: (gameOver: boolean) => void;
  restartGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function useGameContext() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [level, setLevel] = useState(1);
  const [maze, setMaze] = useState<Maze>(() => createMaze(1));
  const [player, setPlayer] = useState<Position>(() => maze.start);
  const [facing, setFacing] = useState<Direction>('down');
  const [stepFrame, setStepFrame] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(getLevelCountdown(1));
  const [tileSize, setTileSize] = useState(20);
  const [touchStart, setTouchStart] = useState<TouchPoint | null>(null);
  const [showControlsHelp, setShowControlsHelp] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [completedRounds, setCompletedRounds] = useState(0);
  const [bestElapsedTime, setBestElapsedTime] = useState<number | null>(null);

  const rows = maze.tiles.length;
  const cols = maze.tiles[0].length;

  const tryMove = (direction: Direction) => {
    if (gameOver) {
      return;
    }

    const move = MOVE_BY_DIRECTION[direction];
    setFacing(move.facing);

    setPlayer((prev) => {
      const next: Position = {
        row: prev.row + move.dr,
        col: prev.col + move.dc,
      };

      if (
        next.row < 0 ||
        next.col < 0 ||
        next.row >= maze.tiles.length ||
        next.col >= maze.tiles[0].length ||
        maze.tiles[next.row][next.col]
      ) {
        return prev;
      }

      setStepFrame((frame) => (frame + 1) % 2);

      if (next.row === maze.exit.row && next.col === maze.exit.col) {
        const roundTime = elapsedSeconds;
        setCompletedRounds((count) => count + 1);
        setBestElapsedTime((best) => {
          if (best === null) {
            return roundTime;
          }
          return Math.min(best, roundTime);
        });

        window.setTimeout(() => {
          setLevel((current) => current + 1);
        }, 120);
      }

      return next;
    });
  };

  // Timer effect
  useEffect(() => {
    if (gameOver) {
      return;
    }

    const timer = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [gameOver]);

  // Game over when time runs out
  useEffect(() => {
    if (timeLeft === 0) {
      const timer = setTimeout(() => setGameOver(true), 0);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Level change effect
  useEffect(() => {
    if (gameOver) {
      return;
    }

    const timer = setTimeout(() => {
      setElapsedSeconds(0);
      setTimeLeft(getLevelCountdown(level));
      setMaze(createMaze(level));
    }, 0);
    return () => clearTimeout(timer);
  }, [level, gameOver]);

  // Reset player position when maze changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setPlayer(maze.start);
      setFacing('down');
      setStepFrame(0);
    }, 0);
    return () => clearTimeout(timer);
  }, [maze]);

  // Keyboard controls
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const direction = DIRECTION_BY_KEY[event.key];
      if (!direction) {
        return;
      }

      event.preventDefault();
      tryMove(direction);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  // Responsive tile size
  useEffect(() => {
    const resize = () => {
      setTileSize(getResponsiveTileSize(rows, cols));
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [rows, cols]);

  // Click outside to close controls help
  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const tooltip = document.querySelector('.controls-tooltip') as HTMLButtonElement;
      if (!tooltip) {
        return;
      }

      if (!tooltip.contains(event.target as Node)) {
        setShowControlsHelp(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowControlsHelp(false);
      }
    };

    window.addEventListener('mousedown', onPointerDown);
    window.addEventListener('keydown', onEscape);
    return () => {
      window.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('keydown', onEscape);
    };
  }, []);

  const onTouchStart = (event: TouchEvent<HTMLElement>) => {
    const touch = event.changedTouches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const onTouchEnd = (event: TouchEvent<HTMLElement>) => {
    if (!touchStart || gameOver) {
      return;
    }

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const minSwipe = 24;

    if (Math.abs(deltaX) < minSwipe && Math.abs(deltaY) < minSwipe) {
      setTouchStart(null);
      return;
    }

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      tryMove(deltaX > 0 ? 'right' : 'left');
    } else {
      tryMove(deltaY > 0 ? 'down' : 'up');
    }

    setTouchStart(null);
  };

  const restartGame = () => {
    const nextMaze = createMaze(1);
    setGameOver(false);
    setLevel(1);
    setElapsedSeconds(0);
    setTimeLeft(getLevelCountdown(1));
    setMaze(nextMaze);
    setPlayer(nextMaze.start);
    setCompletedRounds(0);
    setBestElapsedTime(null);
    setFacing('down');
    setStepFrame(0);
  };

  const value: GameContextType = {
    // Game state
    level,
    maze,
    player,
    facing,
    stepFrame,
    elapsedSeconds,
    timeLeft,
    tileSize,
    touchStart,
    showControlsHelp,
    gameOver,
    completedRounds,
    bestElapsedTime,

    // Game actions
    tryMove,
    onTouchStart,
    onTouchEnd,
    setShowControlsHelp,
    setGameOver,
    restartGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
