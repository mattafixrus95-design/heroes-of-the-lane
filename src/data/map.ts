// 8x8 grid. Path tiles marked as true, others false.
// Snake-shaped path: left→right on row 0, right→left on row 2, etc.

export const GRID_COLS = 8;
export const GRID_ROWS = 8;

// [col, row] coordinates of the enemy path in order
export const PATH: [number, number][] = [
  // row 0 — left to right
  [0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],
  // row 1 — turn down
  [7,1],
  // row 2 — right to left
  [6,1],[5,1],[4,1],[3,1],[2,1],[1,1],[0,1],
  // row 2 — turn down
  [0,2],
  // row 2 — left to right
  [1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],
  // turn
  [7,3],
  // right to left
  [6,3],[5,3],[4,3],[3,3],[2,3],[1,3],[0,3],
  // turn
  [0,4],
  // left to right
  [1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],
  // turn
  [7,5],
  // right to left
  [6,5],[5,5],[4,5],[3,5],[2,5],[1,5],[0,5],
  // turn
  [0,6],
  // left to right
  [1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6],
  // turn
  [7,7],
  // finish column
  [6,7],[5,7],[4,7],[3,7],[2,7],[1,7],[0,7],
];

// Set of "col,row" strings for O(1) lookup
export const PATH_SET = new Set(PATH.map(([c, r]) => `${c},${r}`));

export function isPathCell(col: number, row: number): boolean {
  return PATH_SET.has(`${col},${row}`);
}
