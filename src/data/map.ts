export const GRID_COLS = 10;
export const GRID_ROWS = 11;

// Visual layout (G=entry, X=клетка над воротами, недоступна под застройку,
// C=exit, P=path, .=buildable, T=территория города):
//      0  1  2  3  4  5  6  7  8  9
// r0  [ X  .  .  .  .  .  .  .  .  . ]  ← верхний ряд под застройку башнями
// r1  [ G  P  P  P  P  P  P  P  P  P ]
// r2  [ .  .  .  .  .  .  .  .  .  P ]
// r3  [ P  P  P  P  P  P  P  P  P  P ]
// r4  [ P  .  .  .  .  .  .  .  .  . ]
// r5  [ P  P  P  P  P  P  P  P  P  P ]
// r6  [ .  .  .  .  .  .  .  .  .  P ]
// r7  [ P  P  P  P  P  P  P  P  P  P ]
// r8  [ P  .  .  .  .  .  .  .  .  . ]
// r9  [ P  P  P  P  P  P  P  P  C  T ]  ← T на (9,9): не отдельное здание, накрыта спрайтом замка
// r10 [ .  .  .  .  .  .  .  T  T  T ]

export const ENTRY_CELL: [number, number] = [0, 1];
export const EXIT_CELL:  [number, number] = [8, 9];

export const PATH: [number, number][] = [
  // Row 1 → right (G at col 0)
  [0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],
  // Turn down col 9 → row 3
  [9,2],[9,3],
  // Row 3 ← left
  [8,3],[7,3],[6,3],[5,3],[4,3],[3,3],[2,3],[1,3],[0,3],
  // Turn down col 0 → row 5
  [0,4],[0,5],
  // Row 5 → right
  [1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5],[8,5],[9,5],
  // Turn down col 9 → row 7
  [9,6],[9,7],
  // Row 7 ← left
  [8,7],[7,7],[6,7],[5,7],[4,7],[3,7],[2,7],[1,7],[0,7],
  // Turn down col 0 → row 9
  [0,8],[0,9],
  // Row 9 → right, заканчивается у замка (C at col 8)
  [1,9],[2,9],[3,9],[4,9],[5,9],[6,9],[7,9],[8,9],
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

// Территория города: нижний правый угол карты, L-образная (не 2×2).
// (8,9) — замок (конечная точка пути), спрайт замка визуально растянут на 2
// клетки и центрирован между (8,9) и (9,9) (см. GameGrid.tsx) — поэтому (9,9)
// тоже часть территории города, хоть там и нет отдельного здания.
// Нижний ряд (row 10), слева направо: таверна (7,10) — ферма (8,10) — лесопилка (9,10).
export const FARM_CELL:    [number, number] = [8, 10];
export const SAWMILL_CELL: [number, number] = [9, 10];
export const TAVERN_CELL:  [number, number] = [7, 10];
export const TOWN_TERRITORY = new Set(["8,9", "9,9", "7,10", "8,10", "9,10"]);

export function isTownTerritory(col: number, row: number): boolean {
  return TOWN_TERRITORY.has(`${col},${row}`);
}

// Ворота открываются перед первым крипом волны — крип не должен появляться
// раньше, чем створки полностью разъедутся (см. GateImage.tsx и spawnWave.ts).
export const GATE_OPEN_SECONDS = 0.24;

// Клетка над воротами — спрайт ворот приподнят на четверть клетки вверх
// (см. GameGrid.tsx) и визуально заезжает на неё, поэтому строить тут нельзя;
// саму клетку при этом оставляем травой, а не частью пути.
export const NO_BUILD_CELLS = new Set([`${ENTRY_CELL[0]},${ENTRY_CELL[1] - 1}`]);

export function isNoBuildCell(col: number, row: number): boolean {
  return NO_BUILD_CELLS.has(`${col},${row}`);
}
