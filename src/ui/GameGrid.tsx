import type { GameState, Tower } from "../game/engine/gameState";
import type { TowerType } from "../data/towers";
import { TOWER_DEFS } from "../data/towers";
import { GRID_COLS, GRID_ROWS, isPathCell, ENTRY_CELL, EXIT_CELL } from "../data/map";

const CELL = 56; // px per tile

interface Props {
  state: GameState;
  selectedTower: TowerType | null;
  onUpdateState: (updater: (s: GameState) => GameState) => void;
  onClearSelection: () => void;
}

function placeTower(col: number, row: number, type: TowerType, state: GameState): GameState {
  const def = TOWER_DEFS[type];
  if (state.gold < def.cost) return state;
  if (state.towers.some(t => t.col === col && t.row === row)) return state;
  const tower: Tower = {
    id: `t-${Date.now()}-${Math.random()}`,
    type, col, row,
    damage: def.damage, range: def.range,
    attackSpeed: def.attackSpeed, cost: def.cost,
    sellValue: def.sellValue, aoe: def.aoe,
    lastAttackTime: -999,
  };
  return { ...state, gold: state.gold - def.cost, towers: [...state.towers, tower] };
}

function sellTower(id: string, state: GameState): GameState {
  const tower = state.towers.find(t => t.id === id);
  if (!tower) return state;
  return {
    ...state,
    gold: state.gold + tower.sellValue,
    towers: state.towers.filter(t => t.id !== id),
  };
}

function cellBg(col: number, row: number, isPath: boolean): string {
  if (col === ENTRY_CELL[0] && row === ENTRY_CELL[1]) return "#5cb85c";
  if (col === EXIT_CELL[0]  && row === EXIT_CELL[1])  return "#d9534f";
  return isPath ? "#c8a84a" : "#4a7c59";
}

export default function GameGrid({ state, selectedTower, onUpdateState, onClearSelection }: Props) {
  const cells = [];
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      const isPath = isPathCell(c, r);
      const tower  = state.towers.find(t => t.col === c && t.row === r);
      const isEntry = c === ENTRY_CELL[0] && r === ENTRY_CELL[1];
      const isExit  = c === EXIT_CELL[0]  && r === EXIT_CELL[1];

      const handleClick = () => {
        if (isPath && !tower) return;
        if (tower) {
          // always sell on click
          onUpdateState(s => sellTower(tower.id, s));
          onClearSelection();
        } else if (selectedTower) {
          onUpdateState(s => placeTower(c, r, selectedTower, s));
        }
      };

      cells.push(
        <div
          key={`${c}-${r}`}
          onClick={handleClick}
          style={{
            width: CELL, height: CELL,
            background: cellBg(c, r, isPath),
            border: "1px solid rgba(0,0,0,0.15)",
            cursor: isPath && !tower ? "default" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.6rem",
            position: "relative",
          }}
          title={
            tower
              ? `${TOWER_DEFS[tower.type].name} — клик чтобы продать (+${tower.sellValue}💰)`
              : isEntry ? "Вход G" : isExit ? "Выход C"
              : selectedTower ? `Поставить ${TOWER_DEFS[selectedTower].name}` : ""
          }
        >
          {isEntry && !tower && <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "#fff" }}>G</span>}
          {isExit  && !tower && <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "#fff" }}>C</span>}
          {tower && TOWER_DEFS[tower.type].emoji}
        </div>
      );
    }
  }

  const creepMarkers = state.creeps.map(e => {
    const x = e.position.x * CELL + CELL / 2;
    const y = e.position.y * CELL + CELL / 2;
    const hpPct = e.hp / e.maxHp;
    return (
      <div
        key={e.id}
        style={{
          position: "absolute",
          left: x - 14, top: y - 16,
          width: 28, pointerEvents: "none",
          display: "flex", flexDirection: "column", alignItems: "center",
        }}
      >
        <div style={{ width: "100%", height: 3, background: "#333", borderRadius: 2, marginBottom: 1 }}>
          <div style={{
            width: `${hpPct * 100}%`, height: "100%", borderRadius: 2,
            background: hpPct > 0.5 ? "#4caf50" : "#f44336",
          }} />
        </div>
        <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>👾</span>
      </div>
    );
  });

  return (
    <div style={{ position: "relative", width: GRID_COLS * CELL, height: GRID_ROWS * CELL, border: "2px solid rgba(255,255,255,0.15)", borderRadius: 6, overflow: "hidden" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${GRID_COLS}, ${CELL}px)`,
        gridTemplateRows: `repeat(${GRID_ROWS}, ${CELL}px)`,
      }}>
        {cells}
      </div>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {creepMarkers}
      </div>
    </div>
  );
}
