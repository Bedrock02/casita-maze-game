import type { Maze, Position } from './types';

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function createMaze(level: number): Maze {
  const cellRows = 5 + Math.floor(level * 0.6);
  const cellCols = 7 + Math.floor(level * 0.7);

  const rows = cellRows * 2 + 1;
  const cols = cellCols * 2 + 1;

  const tiles: boolean[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => true),
  );

  const visited: boolean[][] = Array.from({ length: cellRows }, () =>
    Array.from({ length: cellCols }, () => false),
  );

  const stack: Position[] = [{ row: 0, col: 0 }];
  visited[0][0] = true;
  tiles[1][1] = false;

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors = shuffle([
      { dr: -1, dc: 0 },
      { dr: 1, dc: 0 },
      { dr: 0, dc: -1 },
      { dr: 0, dc: 1 },
    ]);

    let carved = false;

    for (const { dr, dc } of neighbors) {
      const nextRow = current.row + dr;
      const nextCol = current.col + dc;

      if (
        nextRow < 0 ||
        nextCol < 0 ||
        nextRow >= cellRows ||
        nextCol >= cellCols ||
        visited[nextRow][nextCol]
      ) {
        continue;
      }

      visited[nextRow][nextCol] = true;

      const currentTileRow = current.row * 2 + 1;
      const currentTileCol = current.col * 2 + 1;
      const nextTileRow = nextRow * 2 + 1;
      const nextTileCol = nextCol * 2 + 1;

      tiles[nextTileRow][nextTileCol] = false;
      tiles[(currentTileRow + nextTileRow) / 2][(currentTileCol + nextTileCol) / 2] = false;

      stack.push({ row: nextRow, col: nextCol });
      carved = true;
      break;
    }

    if (!carved) {
      stack.pop();
    }
  }

  const start = { row: 1, col: 0 };
  const exit = { row: rows - 2, col: cols - 1 };

  tiles[start.row][start.col] = false;
  tiles[1][1] = false;
  tiles[rows - 2][cols - 2] = false;
  tiles[exit.row][exit.col] = false;

  return { tiles, start, exit };
}

export function formatTime(totalSeconds: number): string {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (safeSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function getResponsiveTileSize(rows: number, cols: number): number {
  const horizontalPadding = 44;
  const verticalReserved = 250;
  const widthBudget = Math.max(140, window.innerWidth - horizontalPadding);
  const heightBudget = Math.max(180, window.innerHeight - verticalReserved);
  const fillRatio = 0.96;
  const sizeByWidth = Math.floor((widthBudget * fillRatio) / cols);
  const sizeByHeight = Math.floor((heightBudget * fillRatio) / rows);
  const bestFit = Math.min(sizeByWidth, sizeByHeight);
  return Math.max(10, Math.min(120, bestFit));
}

export function getLevelCountdown(level: number): number {
  const baseSeconds = 180;
  const reductionPerLevel = 8;
  return Math.max(60, baseSeconds - (level - 1) * reductionPerLevel);
}

export function generatePlantains(maze: Maze, level: number): Position[] {
  return generatePlantainsWithExclusions(maze, level, []);
}

function generatePlantainsWithExclusions(
  maze: Maze,
  level: number,
  excludedPositions: Position[],
): Position[] {
  const excluded = new Set(excludedPositions.map((position) => `${position.row}-${position.col}`));
  const candidates: Position[] = [];

  for (let row = 0; row < maze.tiles.length; row += 1) {
    for (let col = 0; col < maze.tiles[row].length; col += 1) {
      const isWall = maze.tiles[row][col];
      const isStart = row === maze.start.row && col === maze.start.col;
      const isExit = row === maze.exit.row && col === maze.exit.col;

      const isExcluded = excluded.has(`${row}-${col}`);
      if (!isWall && !isStart && !isExit && !isExcluded) {
        candidates.push({ row, col });
      }
    }
  }

  const shuffled = shuffle(candidates);
  const desiredCount = Math.min(12, 4 + Math.floor(level * 0.6));
  const count = Math.min(desiredCount, shuffled.length);

  return shuffled.slice(0, count);
}

export function generatePlantainsAvoiding(
  maze: Maze,
  level: number,
  excludedPositions: Position[],
): Position[] {
  return generatePlantainsWithExclusions(maze, level, excludedPositions);
}

export function getHardestFlagPosition(maze: Maze): Position | null {
  const rows = maze.tiles.length;
  const cols = maze.tiles[0].length;
  const visited = new Set<string>();
  const queue: Array<{ row: number; col: number; distance: number }> = [
    { row: maze.start.row, col: maze.start.col, distance: 0 },
  ];

  let best: { row: number; col: number; distance: number; openNeighbors: number } | null = null;
  const directions = [
    { dr: -1, dc: 0 },
    { dr: 1, dc: 0 },
    { dr: 0, dc: -1 },
    { dr: 0, dc: 1 },
  ];

  const countOpenNeighbors = (row: number, col: number): number =>
    directions.reduce((count, { dr, dc }) => {
      const nextRow = row + dr;
      const nextCol = col + dc;
      if (
        nextRow < 0 ||
        nextCol < 0 ||
        nextRow >= rows ||
        nextCol >= cols ||
        maze.tiles[nextRow][nextCol]
      ) {
        return count;
      }
      return count + 1;
    }, 0);

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) {
      break;
    }

    const key = `${current.row}-${current.col}`;
    if (visited.has(key)) {
      continue;
    }
    visited.add(key);

    const isStart = current.row === maze.start.row && current.col === maze.start.col;
    const isExit = current.row === maze.exit.row && current.col === maze.exit.col;

    if (!isStart && !isExit) {
      const openNeighbors = countOpenNeighbors(current.row, current.col);
      const isBetter =
        !best ||
        current.distance > best.distance ||
        (current.distance === best.distance && openNeighbors < best.openNeighbors);

      if (isBetter) {
        best = { ...current, openNeighbors };
      }
    }

    for (const { dr, dc } of directions) {
      const nextRow = current.row + dr;
      const nextCol = current.col + dc;
      if (
        nextRow < 0 ||
        nextCol < 0 ||
        nextRow >= rows ||
        nextCol >= cols ||
        maze.tiles[nextRow][nextCol]
      ) {
        continue;
      }

      queue.push({ row: nextRow, col: nextCol, distance: current.distance + 1 });
    }
  }

  return best ? { row: best.row, col: best.col } : null;
}
