import { useMemo } from 'react';
import type { Direction, Maze, PickupPopup, Position } from '../types';
import plantainImage from '../assets/plantain.png';

interface MazeBoardProps {
  maze: Maze;
  player: Position;
  plantains: Position[];
  flagPosition: Position | null;
  popups: PickupPopup[];
  facing: Direction;
  stepFrame: number;
  tileSize: number;
  onTouchStart: (event: React.TouchEvent<HTMLElement>) => void;
  onTouchEnd: (event: React.TouchEvent<HTMLElement>) => void;
}

export default function MazeBoard({
  maze,
  player,
  plantains,
  flagPosition,
  popups,
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

  const plantainSet = useMemo(
    () => new Set(plantains.map((plantain) => `${plantain.row}-${plantain.col}`)),
    [plantains],
  );
  const popupsByTile = useMemo(() => {
    const map = new Map<string, PickupPopup[]>();
    for (const popup of popups) {
      const key = `${popup.row}-${popup.col}`;
      const current = map.get(key) ?? [];
      current.push(popup);
      map.set(key, current);
    }
    return map;
  }, [popups]);

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
            const isPlantain = plantainSet.has(`${rowIndex}-${colIndex}`);
            const isFlag = flagPosition?.row === rowIndex && flagPosition?.col === colIndex;
            const tilePopups = popupsByTile.get(`${rowIndex}-${colIndex}`) ?? [];

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
                {isFlag && !isPlayer && <div className="puerto-flag" aria-hidden="true">🇵🇷</div>}
                {isPlantain && !isPlayer && (
                  <img className="plantain" src={plantainImage} alt="" aria-hidden="true" />
                )}
                {tilePopups.map((popup) => (
                  <span
                    key={popup.id}
                    className={`pickup-popup pickup-popup-${popup.kind}`}
                    aria-hidden="true"
                  >
                    {popup.text}
                  </span>
                ))}
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
