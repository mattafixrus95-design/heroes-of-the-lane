export const GRID_COLS = 10;
export const GRID_ROWS = 10;

// Visual layout (G=entry, C=exit, P=path, .=buildable, T=территория города):
//      0  1  2  3  4  5  6  7  8  9
// r0 [ G  P  P  P  P  P  P  P  P  P ]
// r1 [ .  .  .  .  .  .  .  .  .  P ]
// r2 [ P  P  P  P  P  P  P  P  P  P ]
// r3 [ P  .  .  .  .  .  .  .  .  . ]
// r4 [ P  P  P  P  P  P  P  P  P  P ]
// r5 [ .  .  .  .  .  .  .  .  .  P ]
// r6 [ P  P  P  P  P  P  P  P  P  P ]
// r7 [ P  .  .  .  .  .  .  .  .  . ]
// r8 [ P  P  P  P  P  P  P  C  T  . ]  ← замок сдвинут на клетку влево
// r9 [ .  .  .  .  .  .  .  .  T  T ]

export const ENTRY_CELL: [number, number] = [0, 0];
export const EXIT_CELL:  [number, number] = [8, 8]; // замок — на клетку левее, чем раньше

export const PATH: [number, number][] = [
  // Row 0 → right (G at col 0)
  [0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],
  // Turn down col 9 → row 2
  [9,1],[9,2],
  // Row 2 ← left
  [8,2],[7,2],[6,2],[5,2],[4,2],[3,2],[2,2],[1,2],[0,2],
  // Turn down col 0 → row 4
  [0,3],[0,4],
  // Row 4 → right
  [1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4],[9,4],
  // Turn down col 9 → row 6
  [9,5],[9,6],
  // Row 6 ← left
  [8,6],[7,6],[6,6],[5,6],[4,6],[3,6],[2,6],[1,6],[0,6],
  // Turn down col 0 → row 8
  [0,7],[0,8],
  // Row 8 → right, заканчивается у замка (C at col 8)
  [1,8],[2,8],[3,8],[4,8],[5,8],[6,8],[7,8],[8,8],
];

export const PATH_SET = new Set(PATH.map(([c, r]) => `${c},${r}`));

export function isPathCell(col: number, row: number): boolean {
  return PATH_SET.has(`${col},${row}`);
}

// Горизонтальное направление движения в данной точке пути — для спрайтов
// крипов с одной художественной ориентацией (зеркалим по этому значению).
// На вертикальных участках пути (dx===0) наследуем направление ближайшего
// горизонтального сегмента (сначала смотрим вперёд по пути, потом назад).
export function pathFacing(progress: number): 1 | -1 {
  const i = Math.min(Math.max(Math.floor(progress), 0), PATH.length - 2);
  for (let k = i; k < PATH.length - 1; k++) {
    const dx = PATH[k + 1][0] - PATH[k][0];
    if (dx !== 0) return dx > 0 ? 1 : -1;
  }
  for (let k = i; k >= 0; k--) {
    const dx = PATH[k + 1][0] - PATH[k][0];
    if (dx !== 0) return dx > 0 ? 1 : -1;
  }
  return 1;
}

// Территория города: нижние правые 2×2 клетки карты.
// (8,8) — замок (конечная точка пути). (9,8) — освободилось после переноса
// замка, слот таверны. (8,9) — слот фермы, (9,9) — слот лесопилки.
export const FARM_CELL:    [number, number] = [8, 9];
export const SAWMILL_CELL: [number, number] = [9, 9];
export const TAVERN_CELL:  [number, number] = [9, 8];
export const TOWN_TERRITORY = new Set(["8,8", "9,8", "8,9", "9,9"]);

export function isTownTerritory(col: number, row: number): boolean {
  return TOWN_TERRITORY.has(`${col},${row}`);
}
