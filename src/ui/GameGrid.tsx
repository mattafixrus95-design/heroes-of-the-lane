import { useState, useEffect } from "react";
import type { GameState, Tower, Projectile, SplashEffect } from "../game/engine/gameState";
import type { TowerType } from "../data/towers";
import { TOWER_DEFS } from "../data/towers";
import { GRID_COLS, GRID_ROWS, isPathCell, ENTRY_CELL, EXIT_CELL } from "../data/map";
import GateSVG from "../assets/GateSVG";
import CastleSVG from "../assets/CastleSVG";
import TowerIcon from "./TowerIcon";

const MAX_CELL = 56;

function useCell(): number {
  const compute = () =>
    Math.min(MAX_CELL, Math.floor((window.innerWidth - 8) / GRID_COLS));
  const [cell, setCell] = useState(compute);
  useEffect(() => {
    const handler = () => setCell(compute());
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return cell;
}

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

function ArrowMarker({ angle, towerType }: { angle: number; towerType: string }) {
  const isElf = towerType === "elf";
  const shaft = isElf ? "#8B6914" : "#5C3A1E";
  const feather = isElf ? "#2a9d2a" : "#9d5a2a";
  return (
    <svg
      width="28" height="8" viewBox="0 0 28 8"
      style={{
        position: "absolute", left: -14, top: -4,
        overflow: "visible",
        transform: `rotate(${angle}deg)`,
        transformOrigin: "14px 4px",
        pointerEvents: "none",
      }}
    >
      <line x1="2" y1="4" x2="22" y2="4" stroke={shaft} strokeWidth={isElf ? 1.5 : 2}/>
      <polygon points="20,1 28,4 20,7" fill={shaft}/>
      <line x1="4" y1="4" x2="1" y2="1" stroke={feather} strokeWidth="1.2"/>
      <line x1="4" y1="4" x2="1" y2="7" stroke={feather} strokeWidth="1.2"/>
      {isElf && <line x1="7" y1="4" x2="4" y2="1" stroke={feather} strokeWidth="1"/>}
      {isElf && <line x1="7" y1="4" x2="4" y2="7" stroke={feather} strokeWidth="1"/>}
    </svg>
  );
}

function FireballMarker({ progress }: { progress: number }) {
  const size = 20 + progress * 6;
  return (
    <div style={{
      position: "absolute", left: -size / 2, top: -size / 2,
      width: size, height: size, borderRadius: "50%",
      background: "radial-gradient(circle, #fff 0%, #FFD700 20%, #FF6000 55%, #CC0000 100%)",
      boxShadow: `0 0 ${10 + progress * 8}px ${5 + progress * 5}px rgba(255,100,0,0.8)`,
      pointerEvents: "none",
    }}/>
  );
}

function SplashRing({ effect, gameTime, cell }: { effect: SplashEffect; gameTime: number; cell: number }) {
  const t = Math.min(1, (gameTime - effect.spawnTime) / effect.duration);
  const maxR = effect.radius * cell;
  const r = maxR * (0.3 + t * 0.7);
  const opacity = 1 - t;
  const cx = effect.x * cell + cell / 2;
  const cy = effect.y * cell + cell / 2;
  return (
    <div style={{
      position: "absolute",
      left: cx - r, top: cy - r,
      width: r * 2, height: r * 2,
      borderRadius: "50%",
      border: `${3 - t * 2}px solid rgba(255,140,0,${opacity})`,
      boxShadow: `inset 0 0 ${12 * opacity}px rgba(255,200,0,${opacity * 0.5})`,
      pointerEvents: "none",
    }}/>
  );
}

function ProjectileLayer({ projectiles, splashEffects, gameTime, cell }: {
  projectiles: Projectile[];
  splashEffects: SplashEffect[];
  gameTime: number;
  cell: number;
}) {
  return (
    <>
      {splashEffects.map(e =>
        <SplashRing key={e.id} effect={e} gameTime={gameTime} cell={cell} />
      )}
      {projectiles.map(p => {
        const progress = Math.min(1, (gameTime - p.spawnTime) / p.duration);
        const x = (p.fromCol + (p.toX - p.fromCol) * progress) * cell + cell / 2;
        const y = (p.fromRow + (p.toY - p.fromRow) * progress) * cell + cell / 2;
        const angle = Math.atan2(p.toY - p.fromRow, p.toX - p.fromCol) * (180 / Math.PI);
        return (
          <div key={p.id} style={{ position: "absolute", left: x, top: y, pointerEvents: "none" }}>
            {p.kind === "fireball"
              ? <FireballMarker progress={progress} />
              : <ArrowMarker angle={angle} towerType={p.towerType} />
            }
          </div>
        );
      })}
    </>
  );
}

export default function GameGrid({ state, selectedTower, onUpdateState, onClearSelection, onSelectTowerId }: Props) {
  const cell = useCell();
  const waveActive = state.phase === "wave";

  // Scale tower/gate icons proportionally
  const iconSize = Math.round(cell * 0.72);
  const towerSize = Math.round(cell * 0.71);

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
            width: cell, height: cell,
            background: cellBg(c, r, isPath),
            border: "1px solid rgba(0,0,0,0.15)",
            cursor: tower ? "pointer" : (isPath || waveActive) ? "default" : selectedTower ? "crosshair" : "default",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
            overflow: "visible",
            touchAction: "manipulation",
          }}
        >
          {isEntry && !tower && <GateSVG size={iconSize} />}
          {isExit  && !tower && <CastleSVG size={iconSize} />}
          {tower && (
            <span style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TowerIcon type={tower.type} grade={tower.gradeIndex} size={towerSize} />
              {!isMaxGrade && (
                <span style={{
                  position: "absolute", top: -6, right: -8,
                  fontSize: "0.5rem", background: "#f0c040", color: "#1a1a2e",
                  borderRadius: 3, padding: "1px 3px", fontWeight: 800,
                }}>⬆</span>
              )}
            </span>
          )}
        </div>
      );
    }
  }

  const creepSize = Math.max(16, Math.round(cell * 0.5));
  const creepMarkers = state.creeps.map(e => {
    const x = e.position.x * cell + cell / 2;
    const y = e.position.y * cell + cell / 2;
    const hpPct = e.hp / e.maxHp;
    const isSlowed = e.slowTimer > 0;
    return (
      <div
        key={e.id}
        style={{
          position: "absolute",
          left: x - creepSize / 2, top: y - creepSize * 0.65,
          width: creepSize, pointerEvents: "none",
          display: "flex", flexDirection: "column", alignItems: "center",
        }}
      >
        <div style={{ width: "100%", height: 3, background: "#333", borderRadius: 2, marginBottom: 1 }}>
          <div style={{
            width: `${hpPct * 100}%`, height: "100%", borderRadius: 2,
            background: hpPct > 0.5 ? "#4caf50" : "#f44336",
          }}/>
        </div>
        <span style={{
          fontSize: `${Math.max(0.6, cell / 56)}rem`,
          lineHeight: 1,
          filter: isSlowed ? "hue-rotate(180deg)" : "none",
        }}>👾</span>
      </div>
    );
  });

  return (
    <div style={{
      position: "relative",
      width: GRID_COLS * cell,
      height: GRID_ROWS * cell,
      border: "2px solid rgba(255,255,255,0.15)",
      borderRadius: 6,
      overflow: "hidden",
      touchAction: "none",
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${GRID_COLS}, ${cell}px)`,
        gridTemplateRows: `repeat(${GRID_ROWS}, ${cell}px)`,
      }}>
        {cells}
      </div>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {creepMarkers}
        <ProjectileLayer
          projectiles={state.projectiles}
          splashEffects={state.splashEffects}
          gameTime={state.gameTime}
          cell={cell}
        />
      </div>
    </div>
  );
}
