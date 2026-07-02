import type { GameState, Tower, FloatingText } from "../game/engine/gameState";
import { SELL_RATE } from "../game/engine/gameState";
import { TOWER_DEFS } from "../data/towers";
import type { TowerType } from "../data/towers";
import {
  FARM_COST, FARM_BUILD_TIME,
  SAWMILL_COST, SAWMILL_MAX_LEVEL, SAWMILL_BUILD_TIME, SAWMILL_TICK_INTERVAL, SAWMILL_WOOD_PER_LEVEL,
  TOWN_LEVELS,
} from "../data/buildings";
import { FARM_CELL, SAWMILL_CELL, EXIT_CELL } from "../data/map";
import TowerIcon from "./TowerIcon";
import WoodSVG from "../assets/WoodSVG";
import SawmillSVG from "../assets/SawmillSVG";
import type { Selection } from "./selection";

interface Props {
  state: GameState;
  selection: Selection;
  onUpdateState: (updater: (s: GameState) => GameState) => void;
  onClose: () => void;
  onShowTowerInfo: (type: TowerType) => void;
  onShowBuildingInfo: (kind: "farm" | "sawmill" | "town") => void;
}

function ft(text: string, x: number, y: number, color: string, gameTime: number): FloatingText {
  return { id: `ft-${Date.now()}-${Math.random().toString(36).slice(2)}`, text, x, y, color, spawnTime: gameTime, duration: 1.4 };
}

// ── Башня ─────────────────────────────────────────────────────────────────────
function applyUpgrade(id: string, state: GameState): GameState {
  const tower = state.towers.find(t => t.id === id);
  if (!tower) return state;
  const def = TOWER_DEFS[tower.type];
  const nextIdx = tower.gradeIndex + 1;
  if (nextIdx >= def.grades.length) return state;
  const g = def.grades[nextIdx];
  if (state.gold < g.upgradeCost || state.food < g.foodUpgradeCost) return state;
  const upgraded: Tower = {
    ...tower,
    gradeIndex: nextIdx,
    damage: g.damage, range: g.range, attackSpeed: g.attackSpeed,
    ability: g.ability, slow: g.slow,
    totalInvested: tower.totalInvested + g.upgradeCost,
    foodSpent: tower.foodSpent + g.foodUpgradeCost,
    buildTimeRemaining: g.upgradeTime,
  };
  const texts: FloatingText[] = [
    ft(`-${g.upgradeCost}💰`, tower.col, tower.row, "#ff8080", state.gameTime),
  ];
  if (g.foodUpgradeCost > 0) texts.push(ft(`-${g.foodUpgradeCost}🌾`, tower.col, tower.row - 0.6, "#ff8080", state.gameTime));
  return {
    ...state,
    gold: state.gold - g.upgradeCost,
    food: state.food - g.foodUpgradeCost,
    towers: state.towers.map(t => t.id === id ? upgraded : t),
    floatingTexts: [...state.floatingTexts, ...texts],
  };
}

function applySell(id: string, state: GameState): GameState {
  const tower = state.towers.find(t => t.id === id);
  if (!tower) return state;
  const value = Math.floor(tower.totalInvested * SELL_RATE);
  return {
    ...state,
    gold: state.gold + value,
    food: state.food + tower.foodSpent,
    towers: state.towers.filter(t => t.id !== id),
    floatingTexts: [...state.floatingTexts,
      ft(`+${value}💰`, tower.col, tower.row, "#f0c040", state.gameTime),
    ],
  };
}

function TowerPanel({ tower, state, onUpdateState, onClose, onShowTowerInfo }: {
  tower: Tower; state: GameState;
  onUpdateState: Props["onUpdateState"]; onClose: () => void; onShowTowerInfo: (t: TowerType) => void;
}) {
  const def = TOWER_DEFS[tower.type];
  const currentGrade = def.grades[tower.gradeIndex];
  const nextGrade = def.grades[tower.gradeIndex + 1] ?? null;
  const sellValue = Math.floor(tower.totalInvested * SELL_RATE);
  const isBuilding = tower.buildTimeRemaining > 0;
  const waveActive = state.phase === "wave";

  const maxUpgradeTier = TOWN_LEVELS[state.townLevel - 1].maxUpgradeTier;
  const tierLocked = def.tier > maxUpgradeTier;

  const canAffordUpgrade = nextGrade
    ? state.gold >= nextGrade.upgradeCost && state.food >= nextGrade.foodUpgradeCost
    : false;
  const canUpgrade = canAffordUpgrade && !waveActive && !isBuilding && !tierLocked;

  return (
    <>
      <div className="cm-header">
        <span className="cm-title">
          <TowerIcon type={tower.type} grade={tower.gradeIndex} size={26} />
          {" "}{def.name} · {currentGrade.gradeName}
        </span>
      </div>

      {isBuilding && (
        <div className="cm-building-badge">⚙️ Строится… {Math.ceil(tower.buildTimeRemaining)}с</div>
      )}

      <div className="cm-stats">
        <span>⚔️ {tower.damage}</span>
        <span>🎯 {tower.range}</span>
        <span>⚡ {tower.attackSpeed}/с</span>
        {tower.ability?.kind === "aoe"           && <span>💥 AoE r{tower.ability.radius}</span>}
        {tower.ability?.kind === "multishot"     && <span>🏹 +{tower.ability.extraTargets}×{Math.round(tower.ability.extraDmgPct * 100)}%</span>}
        {tower.ability?.kind === "crit"           && <span>🎯 Крит {Math.round(tower.ability.chance * 100)}%×{tower.ability.multiplier}</span>}
        {tower.ability?.kind === "vulnerability" && <span>🔻 Уязв. +{Math.round(tower.ability.pct * 100)}%</span>}
        {tower.ability?.kind === "root"           && <span>🌿 Корни /{tower.ability.everyNth}</span>}
        {tower.ability?.kind === "aura_haste"     && <span>✨ Аура +{Math.round(tower.ability.pct * 100)}%</span>}
        {tower.slow > 0 && <span>❄️ {tower.slow * 100}%</span>}
      </div>

      <div className="cm-actions">
        {nextGrade ? (
          <button
            className="cm-btn upgrade"
            disabled={!canUpgrade}
            onClick={() => { onUpdateState(s => applyUpgrade(tower.id, s)); onClose(); }}
          >
            ⬆ {nextGrade.gradeName}
            <span className="cm-btn-cost">
              💰 {nextGrade.upgradeCost}
              {nextGrade.foodUpgradeCost > 0 ? ` 🌾 ${nextGrade.foodUpgradeCost}` : ""}
              {tierLocked ? " (город)" : isBuilding ? " (строится)" : waveActive ? " (волна)" : !canAffordUpgrade ? " (недост.)" : ""}
            </span>
          </button>
        ) : (
          <div className="cm-maxed">★ Макс. грейд</div>
        )}

        <button
          className="cm-btn sell"
          disabled={waveActive}
          onClick={() => { onUpdateState(s => applySell(tower.id, s)); onClose(); }}
        >
          Продать
          <span className="cm-btn-cost">
            {waveActive ? "(волна)" : `+${sellValue}💰 +${tower.foodSpent}🌾`}
          </span>
        </button>

        <button className="cm-btn info" onClick={() => onShowTowerInfo(tower.type)}>
          Информация
        </button>
      </div>
    </>
  );
}

// ── Ферма ─────────────────────────────────────────────────────────────────────
function buildOrUpgradeFarm(state: GameState): GameState {
  if (state.gold < FARM_COST.gold || state.wood < FARM_COST.wood) return state;
  if (state.farm && state.farm.buildTimeRemaining > 0) return state;
  const nextLevel = (state.farm?.level ?? 0) + 1;
  const texts = [
    ft(`-${FARM_COST.gold}💰`, FARM_CELL[0], FARM_CELL[1], "#ff8080", state.gameTime),
    ft(`-${FARM_COST.wood}🌲`, FARM_CELL[0], FARM_CELL[1] - 0.6, "#ff8080", state.gameTime),
  ];
  return {
    ...state,
    gold: state.gold - FARM_COST.gold,
    wood: state.wood - FARM_COST.wood,
    farm: {
      level: nextLevel,
      foodProduced: state.farm?.foodProduced ?? 0,
      totalInvested: (state.farm?.totalInvested ?? 0) + FARM_COST.gold,
      buildTimeRemaining: FARM_BUILD_TIME,
    },
    floatingTexts: [...state.floatingTexts, ...texts],
  };
}

function FarmPanel({ state, onUpdateState, onShowBuildingInfo }: {
  state: GameState; onUpdateState: Props["onUpdateState"]; onShowBuildingInfo: Props["onShowBuildingInfo"];
}) {
  const farm = state.farm;
  const level = farm?.level ?? 0;
  const isBuilding = !!farm && farm.buildTimeRemaining > 0;
  const canAfford = state.gold >= FARM_COST.gold && state.wood >= FARM_COST.wood;
  const canBuild = !isBuilding && canAfford;

  return (
    <>
      <div className="cm-header">
        <span className="cm-title">🌾 Ферма{level > 0 ? ` ур.${level}` : ""}</span>
      </div>
      {isBuilding && (
        <div className="cm-building-badge">⚙️ Строится… {Math.ceil(farm!.buildTimeRemaining)}с</div>
      )}
      <div className="cm-stats">
        <span>🌾 Макс. еда: +{farm?.foodProduced ?? 0}</span>
      </div>
      <div className="cm-actions">
        <button
          className="cm-btn upgrade"
          disabled={!canBuild}
          onClick={() => onUpdateState(buildOrUpgradeFarm)}
        >
          {level > 0 ? "⬆ Улучшить" : "Построить"}
          <span className="cm-btn-cost">
            💰 {FARM_COST.gold} <span className="cost-icon"><WoodSVG size={13} /> {FARM_COST.wood}</span>
            {isBuilding ? " (строится)" : !canAfford ? " (недост.)" : ""}
          </span>
        </button>
        <button className="cm-btn info" onClick={() => onShowBuildingInfo("farm")}>
          Информация
        </button>
      </div>
    </>
  );
}

// ── Лесопилка ─────────────────────────────────────────────────────────────────
function buildOrUpgradeSawmill(state: GameState): GameState {
  if (state.gold < SAWMILL_COST.gold || state.wood < SAWMILL_COST.wood) return state;
  if (state.sawmill && state.sawmill.buildTimeRemaining > 0) return state;
  const nextLevel = (state.sawmill?.level ?? 0) + 1;
  if (nextLevel > SAWMILL_MAX_LEVEL) return state;
  const texts = [
    ft(`-${SAWMILL_COST.gold}💰`, SAWMILL_CELL[0], SAWMILL_CELL[1], "#ff8080", state.gameTime),
    ft(`-${SAWMILL_COST.wood}🌲`, SAWMILL_CELL[0], SAWMILL_CELL[1] - 0.6, "#ff8080", state.gameTime),
  ];
  return {
    ...state,
    gold: state.gold - SAWMILL_COST.gold,
    wood: state.wood - SAWMILL_COST.wood,
    sawmill: {
      level: nextLevel,
      totalInvested: (state.sawmill?.totalInvested ?? 0) + SAWMILL_COST.gold,
      buildTimeRemaining: SAWMILL_BUILD_TIME,
      tickTimer: state.sawmill?.tickTimer ?? SAWMILL_TICK_INTERVAL,
    },
    floatingTexts: [...state.floatingTexts, ...texts],
  };
}

function SawmillPanel({ state, onUpdateState, onShowBuildingInfo }: {
  state: GameState; onUpdateState: Props["onUpdateState"]; onShowBuildingInfo: Props["onShowBuildingInfo"];
}) {
  const sawmill = state.sawmill;
  const level = sawmill?.level ?? 0;
  const isBuilding = !!sawmill && sawmill.buildTimeRemaining > 0;
  const isMaxed = level >= SAWMILL_MAX_LEVEL;
  const canAfford = state.gold >= SAWMILL_COST.gold && state.wood >= SAWMILL_COST.wood;
  const canBuild = !isBuilding && !isMaxed && canAfford;

  return (
    <>
      <div className="cm-header">
        <span className="cm-title"><SawmillSVG size={22} /> Лесопилка{level > 0 ? ` ур.${level}` : ""}</span>
      </div>
      {isBuilding && (
        <div className="cm-building-badge">⚙️ Строится… {Math.ceil(sawmill!.buildTimeRemaining)}с</div>
      )}
      <div className="cm-stats">
        <span className="cost-icon"><WoodSVG size={14} /> Доход: {level * SAWMILL_WOOD_PER_LEVEL}/{SAWMILL_TICK_INTERVAL}с</span>
      </div>
      <div className="cm-actions">
        {isMaxed ? (
          <div className="cm-maxed">★ Макс. уровень</div>
        ) : (
          <button
            className="cm-btn upgrade"
            disabled={!canBuild}
            onClick={() => onUpdateState(buildOrUpgradeSawmill)}
          >
            {level > 0 ? "⬆ Улучшить" : "Построить"}
            <span className="cm-btn-cost">
              💰 {SAWMILL_COST.gold} <span className="cost-icon"><WoodSVG size={13} /> {SAWMILL_COST.wood}</span>
              {isBuilding ? " (строится)" : !canAfford ? " (недост.)" : ""}
            </span>
          </button>
        )}
        <button className="cm-btn info" onClick={() => onShowBuildingInfo("sawmill")}>
          Информация
        </button>
      </div>
    </>
  );
}

// ── Город ─────────────────────────────────────────────────────────────────────
function upgradeTown(state: GameState): GameState {
  const nextDef = TOWN_LEVELS[state.townLevel];
  if (!nextDef || !nextDef.upgradeCost) return state;
  if (state.gold < nextDef.upgradeCost.gold || state.wood < nextDef.upgradeCost.wood) return state;
  const currentDef = TOWN_LEVELS[state.townLevel - 1];
  const hpDelta = nextDef.maxHp - currentDef.maxHp;
  const texts = [
    ft(`-${nextDef.upgradeCost.gold}💰`, EXIT_CELL[0], EXIT_CELL[1], "#ff8080", state.gameTime),
    ft(`-${nextDef.upgradeCost.wood}🌲`, EXIT_CELL[0], EXIT_CELL[1] - 0.6, "#ff8080", state.gameTime),
    ft(`+${hpDelta}❤️`, EXIT_CELL[0], EXIT_CELL[1] - 1.2, "#8bc34a", state.gameTime),
  ];
  return {
    ...state,
    gold: state.gold - nextDef.upgradeCost.gold,
    wood: state.wood - nextDef.upgradeCost.wood,
    townLevel: nextDef.level,
    maxLives: state.maxLives + hpDelta,
    lives: state.lives + hpDelta,
    floatingTexts: [...state.floatingTexts, ...texts],
  };
}

function TownPanel({ state, onUpdateState, onShowBuildingInfo }: {
  state: GameState; onUpdateState: Props["onUpdateState"]; onShowBuildingInfo: Props["onShowBuildingInfo"];
}) {
  const currentDef = TOWN_LEVELS[state.townLevel - 1];
  const nextDef = TOWN_LEVELS[state.townLevel] ?? null;
  const canAfford = nextDef?.upgradeCost
    ? state.gold >= nextDef.upgradeCost.gold && state.wood >= nextDef.upgradeCost.wood
    : false;

  return (
    <>
      <div className="cm-header">
        <span className="cm-title">🏘️ {currentDef.name}</span>
      </div>
      <div className="cm-stats">
        <span>❤️ {state.lives}/{state.maxLives}</span>
      </div>
      <div className="cm-actions">
        {nextDef ? (
          <button
            className="cm-btn upgrade"
            disabled={!canAfford}
            onClick={() => onUpdateState(upgradeTown)}
          >
            ⬆ {nextDef.name}
            <span className="cm-btn-cost">
              💰 {nextDef.upgradeCost!.gold} <span className="cost-icon"><WoodSVG size={13} /> {nextDef.upgradeCost!.wood}</span>
              {!canAfford ? " (недост.)" : ""}
            </span>
          </button>
        ) : (
          <div className="cm-maxed">★ Макс. уровень</div>
        )}
        <button className="cm-btn info" onClick={() => onShowBuildingInfo("town")}>
          Информация
        </button>
      </div>
    </>
  );
}

export default function ContextMenu({ state, selection, onUpdateState, onClose, onShowTowerInfo, onShowBuildingInfo }: Props) {
  if (selection.kind === "tower") {
    const tower = state.towers.find(t => t.id === selection.id);
    if (!tower) return null;
    return (
      <div className="context-menu">
        <TowerPanel tower={tower} state={state} onUpdateState={onUpdateState} onClose={onClose} onShowTowerInfo={onShowTowerInfo} />
      </div>
    );
  }

  if (selection.kind === "farm") {
    return (
      <div className="context-menu">
        <FarmPanel state={state} onUpdateState={onUpdateState} onShowBuildingInfo={onShowBuildingInfo} />
      </div>
    );
  }

  if (selection.kind === "sawmill") {
    return (
      <div className="context-menu">
        <SawmillPanel state={state} onUpdateState={onUpdateState} onShowBuildingInfo={onShowBuildingInfo} />
      </div>
    );
  }

  return (
    <div className="context-menu">
      <TownPanel state={state} onUpdateState={onUpdateState} onShowBuildingInfo={onShowBuildingInfo} />
    </div>
  );
}
