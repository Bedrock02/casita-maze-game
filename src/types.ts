export type Position = {
  row: number;
  col: number;
};

export type Direction = 'up' | 'down' | 'left' | 'right';

export type Maze = {
  tiles: boolean[][];
  start: Position;
  exit: Position;
};

export type Move = {
  dr: number;
  dc: number;
  facing: Direction;
};

export type TouchPoint = {
  x: number;
  y: number;
};

export type PickupPopupKind = 'time' | 'points';

export type PickupPopup = {
  id: number;
  row: number;
  col: number;
  text: string;
  kind: PickupPopupKind;
};
