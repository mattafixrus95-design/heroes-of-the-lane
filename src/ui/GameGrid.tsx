import { useState, useEffect } from "react";
import type { GameState, Tower, FloatingText } from "../game/engine/gameState";
import type { TowerType } from "../data/towers";
import { TOWER_DEFS } from "../data/towers";
import { GRID_COLS, GRID_ROWS, isPathCell, isTownTerritory, ENTRY_CELL, EXIT_CELL, FARM_CELL, SAWMILL_CELL } from "../data/map";
import GateSVG from "../assets/GateSVG";
import FarmSVG from "../assets/FarmSVG";
import SawmillSVG from "../assets/SawmillSVG";
import TowerIcon from "./TowerIcon";
import TownIcon from "./TownIcon";
import { CREEP_DEFS } from "../data/waves";
import type { ShopItem } from "./TowerShop";
import type { Selection } from "./selection";

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
  selectedItem: ShopItem | null;
  selection: Selection | null;
  onUpdateState: (updater: (s: GameState) => GameState) => void;
  onExitBuildMode: () => void;
  onSelect: (s: Selection | null) => void;
}

function placeTower(col: number, row: number, type: TowerType, state: GameState): GameState {
  const def = TOWER_DEFS[type];
  if (state.gold < def.purchaseCost || state.food < def.foodCost) return state;
  if (state.towers.some(t => t.col === col && t.row === row)) return state;
  const g = def.grades[0];
  const tower: Tower = {
    id: `t-${Date.now()}-${Math.random()}`,
    type, col, row,
    gradeIndex: 0,
    damage: g.damage, range: g.range, attackSpeed: g.attackSpeed,
    ability: g.ability, slow: g.slow,
    totalInvested: def.purchaseCost,
    foodSpent: def.foodCost,
    lastAttackTime: -999,
    attackCount: 0,
    buildTimeRemaining: def.buildTime,
  };
  return {
    ...state,
    gold: state.gold - def.purchaseCost,
    food: state.food - def.foodCost,
    towers: [...state.towers, tower],
    floatingTexts: [...state.floatingTexts, {
      id: `ft-${Date.now()}`, text: `-${def.purchaseCost}💰`,
      x: col, y: row, color: "#ff8080", spawnTime: state.gameTime, duration: 1.4,
    }],
  };
}

const PATH_CORNER   = new Set(["9,0","9,2","0,2","0,4","9,4","9,6","0,6","0,8"]);
const PATH_VERTICAL = new Set(["9,1","0,3","9,5","0,7"]);

function cellBg(col: number, row: number, isPath: boolean): string {
  if (col === ENTRY_CELL[0] && row === ENTRY_CELL[1]) return "#6a5038";
  if (col === EXIT_CELL[0]  && row === EXIT_CELL[1])  return "#2a5c30";
  if (!isPath) {
    return (col + row) % 2 === 0
      ? "linear-gradient(145deg,#52965c 0%,#3d7a48 100%)"
      : "linear-gradient(145deg,#3d7a48 0%,#4d8e58 100%)";
  }
  const key = `${col},${row}`;
  if (PATH_CORNER.has(key))   return "#8a7050";
  if (PATH_VERTICAL.has(key)) return "linear-gradient(to right,#6a5038 0%,#a08860 30%,#aa9468 50%,#a08860 70%,#6a5038 100%)";
  return                              "linear-gradient(to bottom,#6a5038 0%,#a08860 30%,#aa9468 50%,#a08860 70%,#6a5038 100%)";
}

function ArrowMarker({ angle, towerType }: { angle: number; towerType: string }) {
  const isElf = towerType === "elf";
  const shaft = isElf ? "#8B6914" : "#5C3A1E";
  const feather = isElf ? "#2a9d2a" : "#9d5a2a";
  return (
    <svg width="28" height="8" viewBox="0 0 28 8" style={{
      position: "absolute", left: -14, top: -4, overflow: "visible",
      transform: `rotate(${angle}deg)`, transformOrigin: "14px 4px", pointerEvents: "none",
    }}>
      <line x1="2" y1="4" x2="22" y2="4" stroke={shaft} strokeWidth={isElf ? 1.5 : 2}/>
      <polygon points="20,1 28,4 20,7" fill={shaft}/>
      <line x1="4" y1="4" x2="1" y2="1" stroke={feather} strokeWidth="1.2"/>
      <line x1="4" y1="4" x2="1" y2="7" stroke={feather} strokeWidth="1.2"/>
      {isElf && <line x1="7" y1="4" x2="4" y2="1" stroke={feather} strokeWidth="1"/>}
      {isElf && <line x1="7" y1="4" x2="4" y2="7" stroke={feather} strokeWidth="1"/>}
    </svg>
  );
}

function AxeMarker({ angle, progress }: { angle: number; progress: number }) {
  const spin = angle + progress * 540;
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" style={{
      position: "absolute", left: -9, top: -9, overflow: "visible",
      transform: `rotate(${spin}deg)`, transformOrigin: "9px 9px", pointerEvents: "none",
    }}>
      <line x1="9" y1="15" x2="9" y2="7" stroke="#7a4520" strokeWidth="2" strokeLinecap="round"/>
      <path d="M9,7 L4,2 L4,9 Z" fill="#b8b8c8" stroke="#888" strokeWidth="0.6"/>
      <path d="M9,7 L14,2 L14,9 Z" fill="#d0d0e0" stroke="#aaa" strokeWidth="0.6"/>
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

function SplashRing({ effect, gameTime, cell }: { effect: import("../game/engine/gameState").SplashEffect; gameTime: number; cell: number }) {
  const t = Math.min(1, (gameTime - effect.spawnTime) / effect.duration);
  const maxR = effect.radius * cell;
  const r = maxR * (0.3 + t * 0.7);
  const opacity = 1 - t;
  const cx = effect.x * cell + cell / 2;
  const cy = effect.y * cell + cell / 2;
  return (
    <div style={{
      position: "absolute", left: cx - r, top: cy - r,
      width: r * 2, height: r * 2, borderRadius: "50%",
      border: `${3 - t * 2}px solid rgba(255,140,0,${opacity})`,
      boxShadow: `inset 0 0 ${12 * opacity}px rgba(255,200,0,${opacity * 0.5})`,
      pointerEvents: "none",
    }}/>
  );
}

function FloatingTextView({ ft, gameTime, cell }: { ft: FloatingText; gameTime: number; cell: number }) {
  const age = gameTime - ft.spawnTime;
  const t = Math.min(1, age / ft.duration);
  const opacity = ft.large ? (t < 0.6 ? 1 : 1 - (t - 0.6) / 0.4) : 1 - t;
  const yOff = -t * cell * (ft.large ? 1.8 : 1.2);
  const x = ft.x * cell + cell / 2;
  const y = ft.y * cell + cell / 2;
  return (
    <div style={{
      position: "absolute",
      left: x, top: y + yOff,
      transform: "translateX(-50%)",
      fontSize: ft.large ? "1.6rem" : "0.8rem",
      fontWeight: 800,
      color: ft.color,
      opacity,
      pointerEvents: "none",
      textShadow: ft.large
        ? "0 0 12px rgba(240,192,64,0.7), 0 2px 4px rgba(0,0,0,0.9)"
        : "0 1px 3px rgba(0,0,0,0.8)",
      whiteSpace: "nowrap",
    }}>
      {ft.text}
    </div>
  );
}

export default function GameGrid({
  state, selectedItem, selection, onUpdateState, onExitBuildMode, onSelect,
}: Props) {
  const cell = useCell();
  const canBuild = true;

  const iconSize  = Math.round(cell * 0.72);
  const towerSize = Math.round(cell * 0.71);

  const [hoveredCell, setHoveredCell] = useState<{ col: number; row: number } | null>(null);

  // Очищаем hover когда выходим из режима строительства
  useEffect(() => {
    if (!selectedItem) setHoveredCell(null);
  }, [selectedItem]);

  const cells = [];
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      const isPath   = isPathCell(c, r);
      const isTerritory = isTownTerritory(c, r);
      const tower    = state.towers.find(t => t.col === c && t.row === r);
      const isEntry  = c === ENTRY_CELL[0] && r === ENTRY_CELL[1];
      const isExit   = c === EXIT_CELL[0]  && r === EXIT_CELL[1];
      const isFarmCell    = c === FARM_CELL[0]    && r === FARM_CELL[1];
      const isSawmillCell = c === SAWMILL_CELL[0] && r === SAWMILL_CELL[1];
      const isMaxGrade = tower ? tower.gradeIndex >= TOWER_DEFS[tower.type].grades.length - 1 : false;
      const isSelectedTower = !!tower && selection?.kind === "tower" && selection.id === tower.id;

      // Состояние hover и подсветки
      const isHovered = !!selectedItem && hoveredCell?.col === c && hoveredCell?.row === r;
      const canPlaceHere = !isPath && !isTerritory && !tower && canBuild;
      const highlightColor = isHovered
        ? (canPlaceHere ? "rgba(80,255,80,0.28)" : "rgba(255,60,60,0.32)")
        : undefined;

      const handleClick = () => {
        if (tower) {
          const already = selection?.kind === "tower" && selection.id === tower.id;
          onSelect(already ? null : { kind: "tower", id: tower.id });
          onExitBuildMode();
          return;
        }
        if (isExit) {
          onSelect(selection?.kind === "town" ? null : { kind: "town" });
          onExitBuildMode();
          return;
        }
        if (isFarmCell) {
          onSelect(selection?.kind === "farm" ? null : { kind: "farm" });
          onExitBuildMode();
          return;
        }
        if (isSawmillCell) {
          onSelect(selection?.kind === "sawmill" ? null : { kind: "sawmill" });
          onExitBuildMode();
          return;
        }
        if (!isPath && !isTerritory && canBuild && selectedItem) {
          onUpdateState(s => placeTower(c, r, selectedItem, s));
          return;
        }
        if (selection) onSelect(null);
      };

      cells.push(
        <div
          key={`${c}-${r}`}
          onClick={handleClick}
          onMouseEnter={() => selectedItem && setHoveredCell({ col: c, row: r })}
          style={{
            width: cell, height: cell,
            background: highlightColor
              ? `${highlightColor}`
              : cellBg(c, r, isPath),
            border: isPath
              ? "1px solid rgba(80,55,25,0.45)"
              : "1px solid rgba(25,70,35,0.35)",
            cursor: (tower || isExit || isFarmCell || isSawmillCell) ? "pointer"
              : (isPath || isTerritory || !canBuild) ? "default"
              : selectedItem ? "crosshair" : "default",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", overflow: "visible",
            touchAction: "manipulation",
            // Подсветка поверх фона ячейки
            ...(isHovered ? { boxShadow: canPlaceHere
              ? "inset 0 0 0 2px rgba(80,255,80,0.7)"
              : "inset 0 0 0 2px rgba(255,60,60,0.7)"
            } : {}),
            ...(isSelectedTower ? { boxShadow: "inset 0 0 0 2px rgba(80,220,255,0.85)" } : {}),
          }}
        >
          {/* Подсветка ячейки при hover в режиме строительства */}
          {isHovered && (
            <div style={{
              position: "absolute", inset: 0,
              background: canPlaceHere ? "rgba(80,255,80,0.18)" : "rgba(255,60,60,0.22)",
              pointerEvents: "none",
            }}/>
          )}

          {isEntry && !tower && <GateSVG size={iconSize} />}
          {isExit  && !tower && <TownIcon level={state.townLevel} size={iconSize} />}

          {isFarmCell && !tower && state.farm && (
            <span style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FarmSVG size={iconSize} />
              {state.farm.buildTimeRemaining > 0 && (
                <span style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(0,0,0,0.55)", borderRadius: 4, fontSize: "0.6rem",
                  color: "#f0c040", flexDirection: "column", gap: 1,
                }}>
                  ⚙️<span style={{ fontSize: "0.5rem" }}>{Math.ceil(state.farm.buildTimeRemaining)}с</span>
                </span>
              )}
            </span>
          )}

          {isSawmillCell && !tower && state.sawmill && (
            <span style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <SawmillSVG size={iconSize} />
              {state.sawmill.buildTimeRemaining > 0 && (
                <span style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(0,0,0,0.55)", borderRadius: 4, fontSize: "0.6rem",
                  color: "#f0c040", flexDirection: "column", gap: 1,
                }}>
                  ⚙️<span style={{ fontSize: "0.5rem" }}>{Math.ceil(state.sawmill.buildTimeRemaining)}с</span>
                </span>
              )}
            </span>
          )}

          {/* Башня */}
          {tower && (
            <span style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TowerIcon type={tower.type} grade={tower.gradeIndex} size={towerSize} />
              {tower.buildTimeRemaining > 0 && (
                <span style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(0,0,0,0.55)", borderRadius: 4, fontSize: "0.6rem",
                  color: "#f0c040", flexDirection: "column", gap: 1,
                }}>
                  ⚙️<span style={{ fontSize: "0.5rem" }}>{Math.ceil(tower.buildTimeRemaining)}с</span>
                </span>
              )}
              {!isMaxGrade && tower.buildTimeRemaining === 0 && (
                <span style={{
                  position: "absolute", top: -6, right: -8,
                  fontSize: "0.5rem", background: "#f0c040", color: "#1a1a2e",
                  borderRadius: 3, padding: "1px 3px", fontWeight: 800,
                }}>⬆</span>
              )}
            </span>
          )}

          {/* Призрак башни при строительстве */}
          {isHovered && !tower && canBuild && selectedItem && (
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              opacity: 0.55, pointerEvents: "none",
            }}>
              <TowerIcon type={selectedItem} grade={0} size={towerSize} />
            </div>
          )}
        </div>
      );
    }
  }

  const baseCreepSize = Math.max(16, Math.round(cell * 0.5));
  const creepMarkers = state.creeps.map(e => {
    const x = e.position.x * cell + cell / 2;
    const y = e.position.y * cell + cell / 2;
    const hpPct = e.hp / e.maxHp;
    const isSlowed = e.slowTimer > 0;
    const isBoss = e.kind === "angel" || e.kind === "black_dragon" || e.kind === "archangel";
    const creepSize = isBoss ? Math.round(baseCreepSize * 1.6) : baseCreepSize;
    const def = CREEP_DEFS[e.kind];
    const hpBarColor = e.regenPerSec > 0
      ? "#8bc34a"
      : hpPct > 0.5 ? "#4caf50" : "#f44336";
    return (
      <div key={e.id} style={{
        position: "absolute",
        left: x - creepSize / 2, top: y - creepSize * 0.65,
        width: creepSize, pointerEvents: "none",
        display: "flex", flexDirection: "column", alignItems: "center",
      }}>
        <div style={{ width: "100%", height: isBoss ? 4 : 3, background: "#333", borderRadius: 2, marginBottom: 1 }}>
          <div style={{ width: `${hpPct * 100}%`, height: "100%", borderRadius: 2, background: hpBarColor }}/>
        </div>
        <span style={{
          fontSize: `${Math.max(0.6, (isBoss ? cell * 1.3 : cell) / 56)}rem`,
          lineHeight: 1,
          filter: isSlowed ? "hue-rotate(180deg)" : "none",
        }}>{def.emoji}</span>
      </div>
    );
  });

  // Радиус атаки выбранной башни при hover
  const buildRange = selectedItem && hoveredCell
    ? TOWER_DEFS[selectedItem].grades[0].range
    : null;
  const radiusPx = buildRange !== null ? buildRange * cell : 0;

  return (
    <div
      style={{
        position: "relative",
        width: GRID_COLS * cell, height: GRID_ROWS * cell,
        border: "2px solid rgba(255,255,255,0.15)",
        borderRadius: 6, overflow: "hidden", touchAction: "none",
      }}
      onMouseLeave={() => setHoveredCell(null)}
      onContextMenu={e => { e.preventDefault(); onExitBuildMode(); }}
    >
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${GRID_COLS}, ${cell}px)`,
        gridTemplateRows: `repeat(${GRID_ROWS}, ${cell}px)`,
      }}>
        {cells}
      </div>

      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {/* Круг радиуса атаки */}
        {hoveredCell && buildRange !== null && (
          <div style={{
            position: "absolute",
            left: (hoveredCell.col + 0.5) * cell - radiusPx,
            top:  (hoveredCell.row + 0.5) * cell - radiusPx,
            width:  radiusPx * 2,
            height: radiusPx * 2,
            borderRadius: "50%",
            border: "2px solid rgba(255,230,80,0.55)",
            background: "rgba(255,230,80,0.06)",
          }}/>
        )}

        {creepMarkers}
        {state.splashEffects.map(e =>
          <SplashRing key={e.id} effect={e} gameTime={state.gameTime} cell={cell} />
        )}
        {state.projectiles.map(p => {
          const progress = Math.min(1, (state.gameTime - p.spawnTime) / p.duration);
          const x = (p.fromCol + (p.toX - p.fromCol) * progress) * cell + cell / 2;
          const y = (p.fromRow + (p.toY - p.fromRow) * progress) * cell + cell / 2;
          const angle = Math.atan2(p.toY - p.fromRow, p.toX - p.fromCol) * (180 / Math.PI);
          return (
            <div key={p.id} style={{ position: "absolute", left: x, top: y, pointerEvents: "none" }}>
              {p.kind === "fireball"
                ? <FireballMarker progress={progress} />
                : p.kind === "axe"
                  ? <AxeMarker angle={angle} progress={progress} />
                  : <ArrowMarker angle={angle} towerType={p.towerType} />
              }
            </div>
          );
        })}
        {state.floatingTexts.map(ft =>
          <FloatingTextView key={ft.id} ft={ft} gameTime={state.gameTime} cell={cell} />
        )}
      </div>
    </div>
  );
}
