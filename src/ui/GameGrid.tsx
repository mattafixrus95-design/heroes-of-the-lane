import type { GameState, Tower, Projectile } from "../game/engine/gameState";
import type { TowerType } from "../data/towers";
import { TOWER_DEFS } from "../data/towers";
import { GRID_COLS, GRID_ROWS, isPathCell, ENTRY_CELL, EXIT_CELL } from "../data/map";
import GateSVG from "../assets/GateSVG";
import CastleSVG from "../assets/CastleSVG";
import TowerIcon from "./TowerIcon";

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
  if (col === ENTRY_CELL[0] && row === ENTRY_CELL[1]) return "#3a6b3a";
  if (col === EXIT_CELL[0]  && row === EXIT_CELL[1])  return "#5a3030";
  return isPath ? "#c8a84a" : "#4a7c59";
}

// Arrow SVG pointing right (rotated via CSS to match direction)
function ArrowMarker({ angle, type }: { angle: number; type: "elf" | "dwarf" }) {
  const isElf = type === "elf";
  const shaft = isElf ? "#8B6914" : "#5C3A1E";
  const feather = isElf ? "#2a9d2a" : "#9d5a2a";
  return (
    <svg
      width="28" height="8"
      viewBox="0 0 28 8"
      style={{
        position: "absolute",
        left: -14, top: -4,
        overflow: "visible",
        transform: `rotate(${angle}deg)`,
        transformOrigin: "14px 4px",
        pointerEvents: "none",
      }}
    >
      {/* Shaft */}
      <line x1="2" y1="4" x2="22" y2="4" stroke={shaft} strokeWidth={isElf ? 1.5 : 2}/>
      {/* Head */}
      <polygon points="20,1 28,4 20,7" fill={shaft}/>
      {/* Feathers */}
      <line x1="4" y1="4" x2="1" y2="1" stroke={feather} strokeWidth="1.2"/>
      <line x1="4" y1="4" x2="1" y2="7" stroke={feather} strokeWidth="1.2"/>
      {isElf && <line x1="7" y1="4" x2="4" y2="1" stroke={feather} strokeWidth="1"/>}
      {isElf && <line x1="7" y1="4" x2="4" y2="7" stroke={feather} strokeWidth="1"/>}
    </svg>
  );
}

function FireballMarker({ progress }: { progress: number }) {
  const scale = 0.8 + progress * 0.4; // grows slightly as it travels
  const size = 22 * scale;
  return (
    <div style={{
      position: "absolute",
      left: -size / 2, top: -size / 2,
      width: size, height: size,
      borderRadius: "50%",
      background: "radial-gradient(circle, #fff 0%, #FFD700 25%, #FF6000 60%, #CC0000 100%)",
      boxShadow: `0 0 ${8 + progress * 6}px ${4 + progress * 4}px rgba(255,120,0,0.75)`,
      pointerEvents: "none",
    }}/>
  );
}

function ProjectileLayer({ projectiles, gameTime }: { projectiles: Projectile[]; gameTime: number }) {
  return (
    <>
      {projectiles.map(p => {
        const progress = Math.min(1, (gameTime - p.spawnTime) / p.duration);
        const x = (p.fromCol + (p.toX - p.fromCol) * progress) * CELL + CELL / 2;
        const y = (p.fromRow + (p.toY - p.fromRow) * progress) * CELL + CELL / 2;
        const angle = Math.atan2(p.toY - p.fromRow, p.toX - p.fromCol) * (180 / Math.PI);

        return (
          <div
            key={p.id}
            style={{ position: "absolute", left: x, top: y, pointerEvents: "none" }}
          >
            {p.kind === "fireball"
              ? <FireballMarker progress={progress} />
              : <ArrowMarker angle={angle} type={p.fromCol % 2 === 0 ? "elf" : "dwarf"} />
            }
          </div>
        );
      })}
    </>
  );
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
            overflow: "visible",
          }}
        >
          {isEntry && !tower && <GateSVG size={CELL - 4} />}
          {isExit  && !tower && <CastleSVG size={CELL - 4} />}
          {tower && (
            <span style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TowerIcon type={tower.type} grade={tower.gradeIndex} size={40} />
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
          }}/>
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
        <ProjectileLayer projectiles={state.projectiles} gameTime={state.gameTime} />
      </div>
    </div>
  );
}
