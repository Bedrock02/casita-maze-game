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
