import { useMemo } from 'react';
import type { Direction, Maze, Position } from '../types';

interface MazeBoardProps {
  maze: Maze;
  player: Position;
  facing: Direction;
  stepFrame: number;
  tileSize: number;
  onTouchStart: (event: React.TouchEvent<HTMLElement>) => void;
  onTouchEnd: (event: React.TouchEvent<HTMLElement>) => void;
}

export default function MazeBoard({
  maze,
  player,
  facing,
  stepFrame,
  tileSize,
  onTouchStart,
  onTouchEnd,
}: MazeBoardProps) {
  const standingClass = useMemo(() => {
    const pose = stepFrame === 0 ? 'walk-a' : 'walk-b';
    return `avatar avatar-${facing} ${pose}`;
  }, [facing, stepFrame]);

  const mazeStyle: React.CSSProperties = {
    gridTemplateColumns: `repeat(${maze.tiles[0].length}, var(--tile-size))`,
    gridTemplateRows: `repeat(${maze.tiles.length}, var(--tile-size))`,
    ['--tile-size' as string]: `${tileSize}px`,
  };

  return (
    <section
      className="game-wrap"
      aria-label="Maze board"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="maze" style={mazeStyle}>
        {maze.tiles.map((row, rowIndex) =>
          row.map((isWall, colIndex) => {
            const isPlayer = player.row === rowIndex && player.col === colIndex;
            const isExit = maze.exit.row === rowIndex && maze.exit.col === colIndex;
            const isEntry = maze.start.row === rowIndex && maze.start.col === colIndex;

            const tileClass = [
              'tile',
              isWall ? 'wall' : 'path',
              isExit ? 'goal' : '',
              isEntry ? 'entry' : '',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <div className={tileClass} key={`${rowIndex}-${colIndex}`}>
                {isExit && !isPlayer && (
                  <div className="casita" aria-hidden="true">
                    <div className="roof" />
                    <div className="house" />
                    <div className="door" />
                  </div>
                )}
                {isPlayer && (
                  <div className={standingClass} aria-label="Player avatar">
                    <div className="hat" />
                    <div className="glasses" />
                    <div className="face" />
                    <div className="sweater" />
                    <div className="legs">
                      <span className="leg left" />
                      <span className="leg right" />
                    </div>
                  </div>
                )}
              </div>
            );
          }),
        )}
      </div>
    </section>
  );
}
