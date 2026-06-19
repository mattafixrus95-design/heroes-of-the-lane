import type { GameState, Tower } from "../game/engine/gameState";
import type { TowerType } from "../data/towers";
import { TOWER_DEFS } from "../data/towers";
import { GRID_COLS, GRID_ROWS, isPathCell, ENTRY_CELL, EXIT_CELL } from "../data/map";

const CELL = 56;

interface Props {
  state: GameState;
  selectedTower: TowerType | null;
  onUpdateState: (updater: (s: GameState) => GameState) => void;
  onClearSelection: () => void;
  onSelectTowerId: (id: string) => void;
}

function placeTower(col: number, row: number, type: TowerType, state: GameState): GameState {
  const def = TOWER_DEFS[type];
  if (state.gold < def.purchaseCost) return state;
  if (state.towers.some(t => t.col === col && t.row === row)) return state;
  const g = def.grades[0];
  const tower: Tower = {
    id: `t-${Date.now()}-${Math.random()}`,
    type, col, row,
    gradeIndex: 0,
    damage: g.damage, range: g.range, attackSpeed: g.attackSpeed,
    aoe: g.aoe, aoeDmgPct: g.aoeDmgPct, slow: g.slow,
    totalInvested: def.purchaseCost,
    lastAttackTime: -999,
  };
  return { ...state, gold: state.gold - def.purchaseCost, towers: [...state.towers, tower] };
}

function cellBg(col: number, row: number, isPath: boolean): string {
  if (col === ENTRY_CELL[0] && row === ENTRY_CELL[1]) return "#5cb85c";
  if (col === EXIT_CELL[0]  && row === EXIT_CELL[1])  return "#d9534f";
  return isPath ? "#c8a84a" : "#4a7c59";
}

export default function GameGrid({ state, selectedTower, onUpdateState, onClearSelection, onSelectTowerId }: Props) {
  const waveActive = state.phase === "wave";

  const cells = [];
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      const isPath  = isPathCell(c, r);
      const tower   = state.towers.find(t => t.col === c && t.row === r);
      const isEntry = c === ENTRY_CELL[0] && r === ENTRY_CELL[1];
      const isExit  = c === EXIT_CELL[0]  && r === EXIT_CELL[1];
      const isMaxGrade = tower ? tower.gradeIndex >= TOWER_DEFS[tower.type].grades.length - 1 : false;

      const handleClick = () => {
        if (tower) {
          // Always open the menu for placed towers
          onSelectTowerId(tower.id);
          onClearSelection();
        } else if (!isPath && !waveActive && selectedTower) {
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
            cursor: tower ? "pointer" : (isPath || waveActive) ? "default" : selectedTower ? "crosshair" : "default",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.5rem",
            position: "relative",
          }}
        >
          {isEntry && !tower && <span style={{ fontSize: "0.6rem", fontWeight: 800, color: "#fff" }}>G</span>}
          {isExit  && !tower && <span style={{ fontSize: "0.6rem", fontWeight: 800, color: "#fff" }}>C</span>}
          {tower && (
            <span style={{ position: "relative" }}>
              {TOWER_DEFS[tower.type].emoji}
              {!isMaxGrade && (
                <span style={{
                  position: "absolute", top: -6, right: -8,
                  fontSize: "0.55rem", background: "#f0c040", color: "#1a1a2e",
                  borderRadius: 3, padding: "1px 3px", fontWeight: 800,
                }}>⬆</span>
              )}
            </span>
          )}
        </div>
      );
    }
  }

  const creepMarkers = state.creeps.map(e => {
    const x = e.position.x * CELL + CELL / 2;
    const y = e.position.y * CELL + CELL / 2;
    const hpPct = e.hp / e.maxHp;
    const isSlowed = e.slowTimer > 0;
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
        <span style={{ fontSize: "1.1rem", lineHeight: 1, filter: isSlowed ? "hue-rotate(180deg)" : "none" }}>👾</span>
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
