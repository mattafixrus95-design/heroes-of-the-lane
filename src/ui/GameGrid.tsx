import { useState, useEffect } from "react";
import type { GameState, Tower, Hero } from "../game/engine/gameState";
import type { TowerType } from "../data/towers";
import { TOWER_DEFS } from "../data/towers";
import type { HeroType } from "../data/heroes";
import { HERO_DEFS, heroRange } from "../data/heroes";
import { GRID_COLS, GRID_ROWS, isPathCell, isTownTerritory, ENTRY_CELL, EXIT_CELL, FARM_CELL, SAWMILL_CELL, TAVERN_CELL } from "../data/map";
import GateSVG from "../assets/GateSVG";
import FarmSVG from "../assets/FarmSVG";
import SawmillSVG from "../assets/SawmillSVG";
import TavernSVG from "../assets/TavernSVG";
import TowerIcon from "./TowerIcon";
import TownIcon from "./TownIcon";
import HeroIcon from "./HeroIcon";
import { EffectsCanvas, TextsCanvas } from "./HotCanvas";
import TerrainLayer from "./TerrainLayer";
import ObjectShadow from "./ObjectShadow";
import type { ShopItem } from "./TowerShop";
import type { Selection } from "./selection";

const MAX_CELL = 56;
const MIN_CELL = 32;
// Суммарные вертикальные отступы .app вне HUD и нижней панели:
// паддинги контейнера (8+16) + гэпы между HUD/сеткой/панелью (8+8).
const VERTICAL_MARGIN = 40;

// Размер клетки считается и от ширины, и от доступной высоты (окно минус
// HUD сверху и шоп/контекстное меню снизу), иначе на невысоких экранах
// нижняя панель не помещается в окно. Пересчитывается на каждый рендер
// (в т.ч. при смене reservedHeight), эффект нужен только для resize.
function useCell(reservedHeight: number): number {
  const [, forceTick] = useState(0);
  useEffect(() => {
    const handler = () => forceTick(t => t + 1);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const widthBased = Math.floor((window.innerWidth - 8) / GRID_COLS);
  const heightBased = Math.floor((window.innerHeight - reservedHeight - VERTICAL_MARGIN) / GRID_ROWS);
  return Math.max(MIN_CELL, Math.min(MAX_CELL, widthBased, heightBased));
}

interface Props {
  state: GameState;
  selectedItem: ShopItem | null;
  selection: Selection | null;
  pendingHero: HeroType | null;
  reservedHeight: number;
  onUpdateState: (updater: (s: GameState) => GameState) => void;
  onExitBuildMode: () => void;
  onSelect: (s: Selection | null) => void;
  onPlaceHero: () => void;
  onCancelPendingHero: () => void;
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

// Герой уже оплачен при найме в таверне — здесь только размещение на поле,
// золото повторно не списывается.
function placeHero(col: number, row: number, type: HeroType, state: GameState): GameState {
  if (state.heroes.length > 0) return state;
  if (state.towers.some(t => t.col === col && t.row === row)) return state;
  const def = HERO_DEFS[type];
  if (state.food < def.foodCost) return state;
  const hero: Hero = {
    id: `h-${Date.now()}-${Math.random()}`,
    type, col, row,
    level: 1,
    foodSpent: def.foodCost,
    lastAttackTime: -999,
    buildTimeRemaining: def.buildTime,
  };
  return {
    ...state,
    food: state.food - def.foodCost,
    heroes: [...state.heroes, hero],
  };
}

export default function GameGrid({
  state, selectedItem, selection, pendingHero, reservedHeight, onUpdateState, onExitBuildMode, onSelect, onPlaceHero, onCancelPendingHero,
}: Props) {
  const cell = useCell(reservedHeight);
  const canBuild = true;
  const buildModeActive = !!selectedItem || !!pendingHero;

  // Визуальная иерархия: здания > башни > крипы (крипы — см. baseCreepSize в EffectsCanvas)
  const iconSize  = Math.round(cell * 0.94);
  const towerSize = Math.round(cell * 0.68);

  const [hoveredCell, setHoveredCell] = useState<{ col: number; row: number } | null>(null);

  // Очищаем hover когда выходим из режима строительства/размещения героя
  useEffect(() => {
    if (!buildModeActive) setHoveredCell(null);
  }, [buildModeActive]);

  // Крипы рисуются на canvas (см. EffectsCanvas в HotCanvas.tsx), поэтому клики
  // по ним перехватываем на фазе capture здесь — попадание считаем по тем же
  // размерам маркера, что использует EffectsCanvas.
  const handleContainerClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (state.creeps.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const baseCreepSize = Math.max(16, Math.round(cell * 0.5));
    for (const c of state.creeps) {
      const isBoss = c.kind === "angel" || c.kind === "black_dragon" || c.kind === "archangel";
      const size = isBoss ? Math.round(baseCreepSize * 1.6) : baseCreepSize;
      const cx = c.position.x * cell + cell / 2;
      const cy = c.position.y * cell + cell / 2 - size * 0.15;
      const hitRadius = size * 0.6;
      const dx = clickX - cx;
      const dy = clickY - cy;
      if (dx * dx + dy * dy <= hitRadius * hitRadius) {
        const already = selection?.kind === "creep" && selection.id === c.id;
        onSelect(already ? null : { kind: "creep", id: c.id });
        onExitBuildMode();
        e.stopPropagation();
        return;
      }
    }
  };

  const cells = [];
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      const isPath   = isPathCell(c, r);
      const isTerritory = isTownTerritory(c, r);
      const tower    = state.towers.find(t => t.col === c && t.row === r);
      const hero     = state.heroes.find(h => h.col === c && h.row === r);
      const isEntry  = c === ENTRY_CELL[0] && r === ENTRY_CELL[1];
      const isExit   = c === EXIT_CELL[0]  && r === EXIT_CELL[1];
      const isFarmCell    = c === FARM_CELL[0]    && r === FARM_CELL[1];
      const isSawmillCell = c === SAWMILL_CELL[0] && r === SAWMILL_CELL[1];
      const isTavernCell  = c === TAVERN_CELL[0]  && r === TAVERN_CELL[1];
      const isMaxGrade = tower ? tower.gradeIndex >= TOWER_DEFS[tower.type].grades.length - 1 : false;
      const isSelectedTower = !!tower && selection?.kind === "tower" && selection.id === tower.id;
      const isSelectedHero = !!hero && selection?.kind === "hero" && selection.id === hero.id;
      const isSelectedGate = isEntry && selection?.kind === "wave";
      const isSelectedFarm = isFarmCell && selection?.kind === "farm";
      const isSelectedSawmill = isSawmillCell && selection?.kind === "sawmill";
      const isSelectedTown = isExit && selection?.kind === "town";
      const isSelectedTavern = isTavernCell && selection?.kind === "tavern";

      // Состояние hover и подсветки
      const isHovered = buildModeActive && hoveredCell?.col === c && hoveredCell?.row === r;
      const canPlaceHere = !isPath && !isTerritory && !tower && !hero && canBuild;
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
        if (hero) {
          const already = selection?.kind === "hero" && selection.id === hero.id;
          onSelect(already ? null : { kind: "hero", id: hero.id });
          onExitBuildMode();
          return;
        }
        if (isEntry) {
          onSelect(selection?.kind === "wave" ? null : { kind: "wave" });
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
        if (isTavernCell) {
          onSelect(selection?.kind === "tavern" ? null : { kind: "tavern" });
          onExitBuildMode();
          return;
        }
        if (canPlaceHere && pendingHero) {
          onUpdateState(s => placeHero(c, r, pendingHero, s));
          onPlaceHero();
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
          onMouseEnter={() => buildModeActive && setHoveredCell({ col: c, row: r })}
          style={{
            width: cell, height: cell,
            background: highlightColor ?? "transparent",
            cursor: (tower || hero || isEntry || isExit || isFarmCell || isSawmillCell || isTavernCell) ? "pointer"
              : (isPath || isTerritory || !canBuild) ? "default"
              : buildModeActive ? "crosshair" : "default",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", overflow: "visible",
            touchAction: "manipulation",
            // Подсветка поверх фона ячейки
            ...(isHovered ? { boxShadow: canPlaceHere
              ? "inset 0 0 0 2px rgba(80,255,80,0.7)"
              : "inset 0 0 0 2px rgba(255,60,60,0.7)"
            } : {}),
            ...(isSelectedTower || isSelectedHero || isSelectedGate || isSelectedFarm || isSelectedSawmill || isSelectedTown || isSelectedTavern
              ? { boxShadow: "inset 0 0 0 2px rgba(80,220,255,0.85)" } : {}),
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

          {/* Сам спрайт ворот рисуется в отдельном слое ниже крипов (см. ниже
              по разметке) — иначе только что заспавнившийся крип оказывается
              визуально скрыт под воротами и "выезжает из-за" них, а не
              выходит из открытых створок. Здесь остаётся только клик-зона. */}
          {isExit && !tower && (
            <span style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", transform: `translateY(-${Math.round(cell * 0.14)}px)` }}>
              <ObjectShadow size={iconSize} />
              <span style={{ position: "relative", zIndex: 1, display: "flex" }}>
                <TownIcon level={state.townLevel} size={iconSize} />
              </span>
              {state.townBuildTimeRemaining > 0 && (
                <span style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(0,0,0,0.55)", borderRadius: 4, fontSize: "0.6rem",
                  color: "#f0c040", flexDirection: "column", gap: 1,
                }}>
                  ⚙️<span style={{ fontSize: "0.5rem" }}>{Math.ceil(state.townBuildTimeRemaining)}с</span>
                </span>
              )}
            </span>
          )}

          {isFarmCell && !tower && state.farm && (
            <span style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ObjectShadow size={iconSize} />
              <span style={{ position: "relative", zIndex: 1, display: "flex" }}>
                <FarmSVG size={iconSize} />
              </span>
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
              <ObjectShadow size={iconSize} />
              <span style={{ position: "relative", zIndex: 1, display: "flex" }}>
                <SawmillSVG size={iconSize} />
              </span>
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

          {isTavernCell && !tower && state.tavern && (
            <span style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ObjectShadow size={iconSize} />
              <span style={{ position: "relative", zIndex: 1, display: "flex" }}>
                <TavernSVG size={iconSize} />
              </span>
              {state.tavern.buildTimeRemaining > 0 && (
                <span style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(0,0,0,0.55)", borderRadius: 4, fontSize: "0.6rem",
                  color: "#f0c040", flexDirection: "column", gap: 1,
                }}>
                  ⚙️<span style={{ fontSize: "0.5rem" }}>{Math.ceil(state.tavern.buildTimeRemaining)}с</span>
                </span>
              )}
            </span>
          )}

          {/* Герой */}
          {hero && (
            <span style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ObjectShadow size={towerSize} />
              <span style={{ position: "relative", zIndex: 1, display: "flex" }}>
                <HeroIcon type={hero.type} size={towerSize} />
              </span>
              {hero.buildTimeRemaining > 0 && (
                <span style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(0,0,0,0.55)", borderRadius: 4, fontSize: "0.6rem",
                  color: "#f0c040", flexDirection: "column", gap: 1,
                }}>
                  ⚙️<span style={{ fontSize: "0.5rem" }}>{Math.ceil(hero.buildTimeRemaining)}с</span>
                </span>
              )}
              <span style={{
                position: "absolute", top: -6, left: -8,
                fontSize: "0.5rem", background: "#7fd6ff", color: "#1a1a2e",
                borderRadius: 3, padding: "1px 3px", fontWeight: 800,
              }}>{hero.level}</span>
            </span>
          )}

          {/* Башня */}
          {tower && (
            <span style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ObjectShadow size={towerSize} />
              <span style={{ position: "relative", zIndex: 1, display: "flex" }}>
                <TowerIcon type={tower.type} grade={tower.gradeIndex} size={towerSize} />
              </span>
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
          {isHovered && !tower && !hero && canBuild && selectedItem && (
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              opacity: 0.55, pointerEvents: "none",
            }}>
              <TowerIcon type={selectedItem} grade={0} size={towerSize} />
            </div>
          )}

          {/* Призрак героя при размещении */}
          {isHovered && !tower && !hero && canBuild && pendingHero && (
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              opacity: 0.55, pointerEvents: "none",
            }}>
              <HeroIcon type={pendingHero} size={towerSize} />
            </div>
          )}
        </div>
      );
    }
  }

  // Радиус атаки выбранной башни/героя при hover в режиме строительства/размещения
  const buildRange = !hoveredCell ? null
    : selectedItem ? TOWER_DEFS[selectedItem].grades[0].range
    : pendingHero ? HERO_DEFS[pendingHero].range
    : null;
  const radiusPx = buildRange !== null ? buildRange * cell : 0;

  // Круги радиуса атаки и ауры у уже поставленной выбранной башни
  const selectedTower = selection?.kind === "tower" ? state.towers.find(t => t.id === selection.id) : null;
  const selectedTowerRangePx = selectedTower ? selectedTower.range * cell : 0;
  const selectedTowerAuraPx = selectedTower?.ability?.kind === "aura_haste"
    ? selectedTower.ability.radius * cell
    : 0;

  // Круги радиуса атаки и ауры у выбранного героя
  const selectedHero = selection?.kind === "hero" ? state.heroes.find(h => h.id === selection.id) : null;
  const selectedHeroDef = selectedHero ? HERO_DEFS[selectedHero.type] : null;
  const selectedHeroRangePx = selectedHero && selectedHeroDef ? heroRange(selectedHero.level, selectedHeroDef) * cell : 0;
  const selectedHeroAuraPx = selectedHeroDef?.ability.kind === "aura_damage"
    ? selectedHeroDef.ability.radius * cell
    : 0;

  return (
    <div
      style={{
        position: "relative",
        width: GRID_COLS * cell, height: GRID_ROWS * cell,
        border: "2px solid rgba(255,255,255,0.15)",
        borderRadius: 6, overflow: "hidden", touchAction: "none",
      }}
      onMouseLeave={() => setHoveredCell(null)}
      onContextMenu={e => { e.preventDefault(); pendingHero ? onCancelPendingHero() : onExitBuildMode(); }}
      onClickCapture={handleContainerClickCapture}
    >
      <TerrainLayer cell={cell} />

      {/* Спрайт ворот — НИЖЕ слоя крипов, чтобы только что заспавнившийся крип
          был виден поверх ворот и выглядел выходящим из открытых створок,
          а не прячущимся за силуэтом ворот. */}
      <div style={{
        position: "absolute", left: ENTRY_CELL[0] * cell, top: ENTRY_CELL[1] * cell,
        width: cell, height: cell, zIndex: 1,
        display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none",
      }}>
        <ObjectShadow size={iconSize} />
        <span style={{ position: "relative", zIndex: 1, display: "flex" }}>
          <GateSVG size={iconSize} open={state.phase === "wave" && state.spawnQueue.length > 0} />
        </span>
      </div>

      {/* Крипы/снаряды/splash — под постройками, как требует слоевая модель поля */}
      <EffectsCanvas state={state} cell={cell} selection={selection} width={GRID_COLS * cell} height={GRID_ROWS * cell} />

      <div style={{
        position: "relative", zIndex: 2,
        display: "grid",
        gridTemplateColumns: `repeat(${GRID_COLS}, ${cell}px)`,
        gridTemplateRows: `repeat(${GRID_ROWS}, ${cell}px)`,
      }}>
        {cells}
      </div>

      <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none" }}>
        {/* Круг радиуса атаки при постройке */}
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

        {/* Радиус атаки и ауры выбранной (уже стоящей) башни */}
        {selectedTower && (
          <>
            <div style={{
              position: "absolute",
              left: (selectedTower.col + 0.5) * cell - selectedTowerRangePx,
              top:  (selectedTower.row + 0.5) * cell - selectedTowerRangePx,
              width:  selectedTowerRangePx * 2,
              height: selectedTowerRangePx * 2,
              borderRadius: "50%",
              border: "2px solid rgba(255,230,80,0.6)",
              background: "rgba(255,230,80,0.07)",
            }}/>
            {selectedTowerAuraPx > 0 && (
              <div style={{
                position: "absolute",
                left: (selectedTower.col + 0.5) * cell - selectedTowerAuraPx,
                top:  (selectedTower.row + 0.5) * cell - selectedTowerAuraPx,
                width:  selectedTowerAuraPx * 2,
                height: selectedTowerAuraPx * 2,
                borderRadius: "50%",
                border: "2px dashed rgba(120,180,255,0.75)",
                background: "rgba(120,180,255,0.08)",
              }}/>
            )}
          </>
        )}

        {/* Радиус атаки и ауры выбранного героя */}
        {selectedHero && (
          <>
            <div style={{
              position: "absolute",
              left: (selectedHero.col + 0.5) * cell - selectedHeroRangePx,
              top:  (selectedHero.row + 0.5) * cell - selectedHeroRangePx,
              width:  selectedHeroRangePx * 2,
              height: selectedHeroRangePx * 2,
              borderRadius: "50%",
              border: "2px solid rgba(255,230,80,0.6)",
              background: "rgba(255,230,80,0.07)",
            }}/>
            {selectedHeroAuraPx > 0 && (
              <div style={{
                position: "absolute",
                left: (selectedHero.col + 0.5) * cell - selectedHeroAuraPx,
                top:  (selectedHero.row + 0.5) * cell - selectedHeroAuraPx,
                width:  selectedHeroAuraPx * 2,
                height: selectedHeroAuraPx * 2,
                borderRadius: "50%",
                border: "2px dashed rgba(255,150,220,0.75)",
                background: "rgba(255,150,220,0.08)",
              }}/>
            )}
          </>
        )}
      </div>

      {/* Всплывающий текст — самый верхний слой поля */}
      <TextsCanvas state={state} cell={cell} width={GRID_COLS * cell} height={GRID_ROWS * cell} />
    </div>
  );
}
