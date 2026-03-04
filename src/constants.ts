import type { Direction, Move } from './types';

export const DIRECTION_BY_KEY: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
};

export const MOVE_BY_DIRECTION: Record<Direction, Move> = {
  up: { dr: -1, dc: 0, facing: 'up' },
  down: { dr: 1, dc: 0, facing: 'down' },
  left: { dr: 0, dc: -1, facing: 'left' },
  right: { dr: 0, dc: 1, facing: 'right' },
};
