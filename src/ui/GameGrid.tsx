import type { GameState, Tower } from "../game/engine/gameState";
import { GRID_COLS, GRID_ROWS, isPathCell, PATH } from "../data/map";
import { genId } from "../utils/idgen";

const CELL = 64; // px

interface Props {
  state: GameState;
  onUpdateState: (updater: (s: GameState) => GameState) => void;
}

function cellStyle(col: number, row: number, isPath: boolean): React.CSSProperties {
  return {
    gridColumn: col + 1,
    gridRow: row + 1,
    background: isPath ? "#c8b560" : "#4a7c59",
    border: "1px solid rgba(0,0,0,0.12)",
    cursor: isPath ? "default" : "pointer",
    position: "relative",
    width: CELL,
    height: CELL,
  };
}

function placeTower(col: number, row: number, state: GameState): GameState {
  if (state.gold < 50) return state;
  if (state.towers.some(t => t.col === col && t.row === row)) return state;
  const tower: Tower = {
    id: genId("t"),
    col, row,
    damage: 10,
    range: 2,
    attackSpeed: 1,
    cooldown: 0,
  };
  return { ...state, gold: state.gold - 50, towers: [...state.towers, tower] };
}

export default function GameGrid({ state, onUpdateState }: Props) {
  const cells = [];
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      const isPath = isPathCell(c, r);
      const tower = state.towers.find(t => t.col === c && t.row === r);
      cells.push(
        <div
          key={`${c}-${r}`}
          style={cellStyle(c, r, isPath)}
          onClick={() => !isPath && onUpdateState(s => placeTower(c, r, s))}
          title={isPath ? "Путь" : tower ? tower.id : "Поставить башню (50💰)"}
        >
          {tower && <div className="tower-marker">🗼</div>}
        </div>
      );
    }
  }

  // Render enemies as absolutely positioned dots on top of the grid
  const enemyMarkers = state.enemies.map(e => {
    const [c0, r0] = PATH[e.pathIndex];
    const next = PATH[Math.min(e.pathIndex + 1, PATH.length - 1)];
    const [c1, r1] = next;
    const x = (c0 + (c1 - c0) * e.progress) * CELL + CELL / 2;
    const y = (r0 + (r1 - r0) * e.progress) * CELL + CELL / 2;
    const hpPct = e.hp / e.maxHp;
    return (
      <div
        key={e.id}
        className="enemy-marker"
        style={{ left: x - 16, top: y - 16 }}
      >
        <div className="enemy-hp" style={{ width: `${hpPct * 100}%` }} />
        👾
      </div>
    );
  });

  const gridWidth = GRID_COLS * CELL;
  const gridHeight = GRID_ROWS * CELL;

  return (
    <div
      className="grid-wrapper"
      style={{ width: gridWidth, height: gridHeight, position: "relative" }}
    >
      <div
        className="grid"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_COLS}, ${CELL}px)`,
          gridTemplateRows: `repeat(${GRID_ROWS}, ${CELL}px)`,
          width: gridWidth,
          height: gridHeight,
        }}
      >
        {cells}
      </div>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {enemyMarkers}
      </div>
    </div>
  );
}
