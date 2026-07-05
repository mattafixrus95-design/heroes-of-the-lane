import { memo } from "react";
import type { GameState, Tower, Hero, Creep, CreepKind, FloatingText } from "../game/engine/gameState";
import { SELL_RATE } from "../game/engine/gameState";
import { TOWER_DEFS } from "../data/towers";
import type { TowerType } from "../data/towers";
import {
  farmCost, FARM_BUILD_TIME,
  sawmillCost, SAWMILL_MAX_LEVEL, SAWMILL_BUILD_TIME, SAWMILL_TICK_INTERVAL, SAWMILL_WOOD_PER_LEVEL,
  TOWN_LEVELS,
  TAVERN_COST, TAVERN_BUILD_TIME, HERO_HIRE_COST, HERO_MAX_LEVEL,
} from "../data/buildings";
import { FARM_CELL, SAWMILL_CELL, EXIT_CELL, TAVERN_CELL } from "../data/map";
import { CREEP_DEFS, WAVE_DEFS } from "../data/waves";
import { HERO_DEFS, heroAuraPct, heroDamage, heroRange, heroAttackSpeed } from "../data/heroes";
import type { HeroType } from "../data/heroes";
import { auraBonus, heroAuraBonus } from "../game/systems/towerAttack";
import TowerIcon from "./TowerIcon";
import HeroIcon from "./HeroIcon";
import WoodSVG from "../assets/WoodSVG";
import SawmillSVG from "../assets/SawmillSVG";
import TavernSVG from "../assets/TavernSVG";
import InfoBadge from "./InfoBadge";
import BuildProgressBar from "./BuildProgressBar";
import type { Selection } from "./selection";

interface Props {
  state: GameState;
  selection: Selection;
  pendingHero: HeroType | null;
  onUpdateState: (updater: (s: GameState) => GameState) => void;
  onClose: () => void;
  onShowTowerInfo: (type: TowerType) => void;
  onShowBuildingInfo: (kind: "farm" | "sawmill" | "town" | "tavern") => void;
  onSelectHero: (type: HeroType) => void;
  onShowHeroInfo: (type: HeroType) => void;
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
  if (g.foodUpgradeCost > 0) texts.push(ft(`-${g.foodUpgradeCost}🍖`, tower.col, tower.row - 0.6, "#ff8080", state.gameTime));
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

function applyCancelBuild(id: string, state: GameState): GameState {
  const tower = state.towers.find(t => t.id === id);
  if (!tower || tower.buildTimeRemaining <= 0) return state;
  const def = TOWER_DEFS[tower.type];

  if (tower.gradeIndex === 0) {
    // Отмена самой первой постройки — полный возврат, башня удаляется
    return {
      ...state,
      gold: state.gold + tower.totalInvested,
      food: state.food + tower.foodSpent,
      towers: state.towers.filter(t => t.id !== id),
      floatingTexts: [...state.floatingTexts,
        ft(`+${tower.totalInvested}💰`, tower.col, tower.row, "#f0c040", state.gameTime),
      ],
    };
  }

  // Отмена апгрейда — откат к предыдущему грейду, возврат стоимости апгрейда
  const currentGradeDef = def.grades[tower.gradeIndex];
  const prevGradeDef = def.grades[tower.gradeIndex - 1];
  const reverted: Tower = {
    ...tower,
    gradeIndex: tower.gradeIndex - 1,
    damage: prevGradeDef.damage, range: prevGradeDef.range, attackSpeed: prevGradeDef.attackSpeed,
    ability: prevGradeDef.ability, slow: prevGradeDef.slow,
    totalInvested: tower.totalInvested - currentGradeDef.upgradeCost,
    foodSpent: tower.foodSpent - currentGradeDef.foodUpgradeCost,
    buildTimeRemaining: 0,
  };
  return {
    ...state,
    gold: state.gold + currentGradeDef.upgradeCost,
    food: state.food + currentGradeDef.foodUpgradeCost,
    towers: state.towers.map(t => t.id === id ? reverted : t),
    floatingTexts: [...state.floatingTexts,
      ft(`+${currentGradeDef.upgradeCost}💰`, tower.col, tower.row, "#f0c040", state.gameTime),
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

  const maxUpgradeTier = TOWN_LEVELS[state.townLevel - 1].maxUpgradeTier;
  const tierLocked = def.tier > maxUpgradeTier;

  const bonus = auraBonus(tower, state.towers);
  const effectiveAttackSpeed = tower.attackSpeed * (1 + bonus);

  const heroBonus = heroAuraBonus(tower, state.heroes);
  const effectiveDamage = tower.damage * (1 + heroBonus);

  const canAffordUpgrade = nextGrade
    ? state.gold >= nextGrade.upgradeCost && state.food >= nextGrade.foodUpgradeCost
    : false;
  const canUpgrade = canAffordUpgrade && !isBuilding && !tierLocked;

  const buildTotal = tower.gradeIndex === 0 ? def.buildTime : def.grades[tower.gradeIndex].upgradeTime;

  return (
    <>
      <div className="cm-header">
        <span className="cm-title">
          <TowerIcon type={tower.type} grade={tower.gradeIndex} size={26} />
          {" "}{def.name} · {currentGrade.gradeName}
        </span>
        <InfoBadge onClick={() => onShowTowerInfo(tower.type)} />
      </div>

      {isBuilding && (
        <div className="cm-building-badge">
          <span>⚙️ Строится… {Math.ceil(tower.buildTimeRemaining)}с</span>
          <BuildProgressBar remaining={tower.buildTimeRemaining} total={buildTotal} />
        </div>
      )}

      <div className="cm-stats">
        <span>⚔️ <span className={heroBonus > 0 ? "cm-buffed" : undefined}>{heroBonus > 0 ? effectiveDamage.toFixed(1) : tower.damage}</span>{heroBonus > 0 && ` (+${Math.round(heroBonus * 100)}%)`}</span>
        <span>🎯 {tower.range}</span>
        <span>⚡ <span className={bonus > 0 ? "cm-buffed" : undefined}>{bonus > 0 ? effectiveAttackSpeed.toFixed(2) : tower.attackSpeed}</span>/с{bonus > 0 && ` (+${Math.round(bonus * 100)}%)`}</span>
        {tower.ability?.kind === "aoe"           && <span>💥 AoE r{tower.ability.radius}</span>}
        {tower.ability?.kind === "multishot"     && <span>🏹 +{tower.ability.extraTargets}×{Math.round(tower.ability.extraDmgPct * 100)}%</span>}
        {tower.ability?.kind === "crit"           && <span>🎯 Крит {Math.round(tower.ability.chance * 100)}%×{tower.ability.multiplier}</span>}
        {tower.ability?.kind === "vulnerability" && <span>🔻 Уязв. +{Math.round(tower.ability.pct * 100)}%</span>}
        {tower.ability?.kind === "root"           && <span>🌿 Корни /{tower.ability.everyNth}</span>}
        {tower.ability?.kind === "aura_haste"     && <span>✨ Аура +{Math.round(tower.ability.pct * 100)}%</span>}
        {tower.slow > 0 && <span>❄️ {tower.slow * 100}%</span>}
      </div>

      <div className="cm-actions">
        {isBuilding ? (
          <div className="cm-action-row">
            <button
              className="cm-btn cancel"
              onClick={() => { onUpdateState(s => applyCancelBuild(tower.id, s)); onClose(); }}
            >
              ✕ Отменить
            </button>
            <span className="cm-cost-side">
              {tower.gradeIndex === 0
                ? `+${tower.totalInvested}💰${tower.foodSpent > 0 ? ` +${tower.foodSpent}🍖` : ""}`
                : `+${currentGrade.upgradeCost}💰${currentGrade.foodUpgradeCost > 0 ? ` +${currentGrade.foodUpgradeCost}🍖` : ""}`}
            </span>
          </div>
        ) : (
          <div className="cm-action-pair">
            {nextGrade && (
              <button
                className="cm-btn upgrade paired"
                disabled={!canUpgrade}
                onClick={() => onUpdateState(s => applyUpgrade(tower.id, s))}
              >
                <span className="cm-btn-label">⬆ {nextGrade.gradeName}</span>
                <span className="cm-btn-subcost">
                  💰{nextGrade.upgradeCost}
                  {nextGrade.foodUpgradeCost > 0 ? ` 🍖${nextGrade.foodUpgradeCost}` : ""}
                  {tierLocked ? " (город)" : !canAffordUpgrade ? " (недост.)" : ""}
                </span>
              </button>
            )}

            <button
              className="cm-btn sell paired"
              onClick={() => { onUpdateState(s => applySell(tower.id, s)); onClose(); }}
            >
              <span className="cm-btn-label">Продать</span>
              <span className="cm-btn-subcost">+{sellValue}💰 +{tower.foodSpent}🍖</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ── Ферма ─────────────────────────────────────────────────────────────────────
function buildOrUpgradeFarm(state: GameState): GameState {
  if (state.farm && state.farm.buildTimeRemaining > 0) return state;
  const nextLevel = (state.farm?.level ?? 0) + 1;
  const cost = farmCost(nextLevel);
  if (state.gold < cost.gold || state.wood < cost.wood) return state;
  const texts = [
    ft(`-${cost.gold}💰`, FARM_CELL[0], FARM_CELL[1], "#ff8080", state.gameTime),
    ft(`-${cost.wood}🌲`, FARM_CELL[0], FARM_CELL[1] - 0.6, "#ff8080", state.gameTime),
  ];
  return {
    ...state,
    gold: state.gold - cost.gold,
    wood: state.wood - cost.wood,
    farm: {
      level: nextLevel,
      foodProduced: state.farm?.foodProduced ?? 0,
      totalInvested: (state.farm?.totalInvested ?? 0) + cost.gold,
      buildTimeRemaining: FARM_BUILD_TIME,
    },
    floatingTexts: [...state.floatingTexts, ...texts],
  };
}

function applyCancelFarmBuild(state: GameState): GameState {
  const farm = state.farm;
  if (!farm || farm.buildTimeRemaining <= 0) return state;
  const cost = farmCost(farm.level);
  const prevLevel = farm.level - 1;
  const texts = [
    ft(`+${cost.gold}💰`, FARM_CELL[0], FARM_CELL[1], "#f0c040", state.gameTime),
    ft(`+${cost.wood}🌲`, FARM_CELL[0], FARM_CELL[1] - 0.6, "#f0c040", state.gameTime),
  ];
  return {
    ...state,
    gold: state.gold + cost.gold,
    wood: state.wood + cost.wood,
    farm: prevLevel > 0 ? { ...farm, level: prevLevel, totalInvested: farm.totalInvested - cost.gold, buildTimeRemaining: 0 } : null,
    floatingTexts: [...state.floatingTexts, ...texts],
  };
}

function FarmPanel({ state, onUpdateState, onShowBuildingInfo }: {
  state: GameState; onUpdateState: Props["onUpdateState"]; onShowBuildingInfo: Props["onShowBuildingInfo"];
}) {
  const farm = state.farm;
  const level = farm?.level ?? 0;
  const isBuilding = !!farm && farm.buildTimeRemaining > 0;
  const nextCost = farmCost(level + 1);
  const cancelCost = isBuilding ? farmCost(farm!.level) : null;
  const canAfford = state.gold >= nextCost.gold && state.wood >= nextCost.wood;
  const canBuild = !isBuilding && canAfford;

  return (
    <>
      <div className="cm-header">
        <span className="cm-title">🍖 Ферма{level > 0 ? ` ур.${level}` : ""}</span>
        <InfoBadge onClick={() => onShowBuildingInfo("farm")} />
      </div>
      {isBuilding && (
        <div className="cm-building-badge">
          <span>⚙️ Строится… {Math.ceil(farm!.buildTimeRemaining)}с</span>
          <BuildProgressBar remaining={farm!.buildTimeRemaining} total={FARM_BUILD_TIME} />
        </div>
      )}
      <div className="cm-stats">
        <span>🍖 Макс. еда: +{farm?.foodProduced ?? 0}</span>
      </div>
      <div className="cm-actions">
        {isBuilding ? (
          <div className="cm-action-row">
            <button
              className="cm-btn cancel"
              onClick={() => onUpdateState(applyCancelFarmBuild)}
            >
              ✕ Отменить
            </button>
            <span className="cm-cost-side">
              +{cancelCost!.gold}💰 <span className="cost-icon">+<WoodSVG size={13} />{cancelCost!.wood}</span>
            </span>
          </div>
        ) : (
          <div className="cm-action-row">
            <button
              className="cm-btn upgrade"
              disabled={!canBuild}
              onClick={() => onUpdateState(buildOrUpgradeFarm)}
            >
              {level > 0 ? "⬆ Улучшить" : "Построить"}
            </button>
            <span className="cm-cost-side">
              💰{nextCost.gold} <span className="cost-icon"><WoodSVG size={13} />{nextCost.wood}</span>
              {!canAfford ? " (недост.)" : ""}
            </span>
          </div>
        )}
      </div>
    </>
  );
}

// ── Лесопилка ─────────────────────────────────────────────────────────────────
function buildOrUpgradeSawmill(state: GameState): GameState {
  if (state.sawmill && state.sawmill.buildTimeRemaining > 0) return state;
  const nextLevel = (state.sawmill?.level ?? 0) + 1;
  if (nextLevel > SAWMILL_MAX_LEVEL) return state;
  const cost = sawmillCost(nextLevel);
  if (state.gold < cost.gold || state.wood < cost.wood) return state;
  const texts = [
    ft(`-${cost.gold}💰`, SAWMILL_CELL[0], SAWMILL_CELL[1], "#ff8080", state.gameTime),
    ft(`-${cost.wood}🌲`, SAWMILL_CELL[0], SAWMILL_CELL[1] - 0.6, "#ff8080", state.gameTime),
  ];
  return {
    ...state,
    gold: state.gold - cost.gold,
    wood: state.wood - cost.wood,
    sawmill: {
      level: nextLevel,
      totalInvested: (state.sawmill?.totalInvested ?? 0) + cost.gold,
      buildTimeRemaining: SAWMILL_BUILD_TIME,
      tickTimer: state.sawmill?.tickTimer ?? SAWMILL_TICK_INTERVAL,
    },
    floatingTexts: [...state.floatingTexts, ...texts],
  };
}

function applyCancelSawmillBuild(state: GameState): GameState {
  const sawmill = state.sawmill;
  if (!sawmill || sawmill.buildTimeRemaining <= 0) return state;
  const cost = sawmillCost(sawmill.level);
  const prevLevel = sawmill.level - 1;
  const texts = [
    ft(`+${cost.gold}💰`, SAWMILL_CELL[0], SAWMILL_CELL[1], "#f0c040", state.gameTime),
    ft(`+${cost.wood}🌲`, SAWMILL_CELL[0], SAWMILL_CELL[1] - 0.6, "#f0c040", state.gameTime),
  ];
  return {
    ...state,
    gold: state.gold + cost.gold,
    wood: state.wood + cost.wood,
    sawmill: prevLevel > 0 ? { ...sawmill, level: prevLevel, totalInvested: sawmill.totalInvested - cost.gold, buildTimeRemaining: 0 } : null,
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
  const nextCost = isMaxed ? null : sawmillCost(level + 1);
  const cancelCost = isBuilding ? sawmillCost(sawmill!.level) : null;
  const canAfford = !!nextCost && state.gold >= nextCost.gold && state.wood >= nextCost.wood;
  const canBuild = !isBuilding && !isMaxed && canAfford;

  return (
    <>
      <div className="cm-header">
        <span className="cm-title"><SawmillSVG size={22} /> Лесопилка{level > 0 ? ` ур.${level}` : ""}</span>
        <InfoBadge onClick={() => onShowBuildingInfo("sawmill")} />
      </div>
      {isBuilding && (
        <div className="cm-building-badge">
          <span>⚙️ Строится… {Math.ceil(sawmill!.buildTimeRemaining)}с</span>
          <BuildProgressBar remaining={sawmill!.buildTimeRemaining} total={SAWMILL_BUILD_TIME} />
        </div>
      )}
      <div className="cm-stats">
        <span className="cost-icon"><WoodSVG size={14} /> Доход: {level * SAWMILL_WOOD_PER_LEVEL}/{SAWMILL_TICK_INTERVAL}с</span>
      </div>
      <div className="cm-actions">
        {isBuilding ? (
          <div className="cm-action-row">
            <button
              className="cm-btn cancel"
              onClick={() => onUpdateState(applyCancelSawmillBuild)}
            >
              ✕ Отменить
            </button>
            <span className="cm-cost-side">
              +{cancelCost!.gold}💰 <span className="cost-icon">+<WoodSVG size={13} />{cancelCost!.wood}</span>
            </span>
          </div>
        ) : isMaxed ? (
          <div className="cm-maxed">★ Макс. уровень</div>
        ) : (
          <div className="cm-action-row">
            <button
              className="cm-btn upgrade"
              disabled={!canBuild}
              onClick={() => onUpdateState(buildOrUpgradeSawmill)}
            >
              {level > 0 ? "⬆ Улучшить" : "Построить"}
            </button>
            <span className="cm-cost-side">
              💰{nextCost!.gold} <span className="cost-icon"><WoodSVG size={13} />{nextCost!.wood}</span>
              {!canAfford ? " (недост.)" : ""}
            </span>
          </div>
        )}
      </div>
    </>
  );
}

// ── Город ─────────────────────────────────────────────────────────────────────
function upgradeTown(state: GameState): GameState {
  if (state.townBuildTimeRemaining > 0) return state;
  const nextDef = TOWN_LEVELS[state.townLevel];
  if (!nextDef || !nextDef.upgradeCost) return state;
  if (state.gold < nextDef.upgradeCost.gold || state.wood < nextDef.upgradeCost.wood) return state;
  const texts = [
    ft(`-${nextDef.upgradeCost.gold}💰`, EXIT_CELL[0], EXIT_CELL[1], "#ff8080", state.gameTime),
    ft(`-${nextDef.upgradeCost.wood}🌲`, EXIT_CELL[0], EXIT_CELL[1] - 0.6, "#ff8080", state.gameTime),
  ];
  // Уровень/HP применяются по завершении стройки (tickBuildTimer),
  // чтобы новый tier башен не открывался до окончания апгрейда.
  return {
    ...state,
    gold: state.gold - nextDef.upgradeCost.gold,
    wood: state.wood - nextDef.upgradeCost.wood,
    townBuildTimeRemaining: nextDef.buildTime,
    floatingTexts: [...state.floatingTexts, ...texts],
  };
}

function applyCancelTownBuild(state: GameState): GameState {
  if (state.townBuildTimeRemaining <= 0) return state;
  const nextDef = TOWN_LEVELS[state.townLevel];
  if (!nextDef || !nextDef.upgradeCost) return state;
  const texts = [
    ft(`+${nextDef.upgradeCost.gold}💰`, EXIT_CELL[0], EXIT_CELL[1], "#f0c040", state.gameTime),
    ft(`+${nextDef.upgradeCost.wood}🌲`, EXIT_CELL[0], EXIT_CELL[1] - 0.6, "#f0c040", state.gameTime),
  ];
  return {
    ...state,
    gold: state.gold + nextDef.upgradeCost.gold,
    wood: state.wood + nextDef.upgradeCost.wood,
    townBuildTimeRemaining: 0,
    floatingTexts: [...state.floatingTexts, ...texts],
  };
}

function TownPanel({ state, onUpdateState, onShowBuildingInfo }: {
  state: GameState; onUpdateState: Props["onUpdateState"]; onShowBuildingInfo: Props["onShowBuildingInfo"];
}) {
  const currentDef = TOWN_LEVELS[state.townLevel - 1];
  const nextDef = TOWN_LEVELS[state.townLevel] ?? null;
  const isBuilding = state.townBuildTimeRemaining > 0;
  const canAfford = nextDef?.upgradeCost
    ? state.gold >= nextDef.upgradeCost.gold && state.wood >= nextDef.upgradeCost.wood
    : false;
  const canUpgrade = canAfford && !isBuilding;

  return (
    <>
      <div className="cm-header">
        <span className="cm-title">🏘️ {currentDef.name}</span>
        <InfoBadge onClick={() => onShowBuildingInfo("town")} />
      </div>
      {isBuilding && (
        <div className="cm-building-badge">
          <span>⚙️ Строится… {Math.ceil(state.townBuildTimeRemaining)}с</span>
          <BuildProgressBar remaining={state.townBuildTimeRemaining} total={nextDef!.buildTime} />
        </div>
      )}
      <div className="cm-stats">
        <span>❤️ {state.lives}/{state.maxLives}</span>
      </div>
      <div className="cm-actions">
        {isBuilding ? (
          <div className="cm-action-row">
            <button
              className="cm-btn cancel"
              onClick={() => onUpdateState(applyCancelTownBuild)}
            >
              ✕ Отменить
            </button>
            <span className="cm-cost-side">
              +{nextDef!.upgradeCost!.gold}💰 <span className="cost-icon">+<WoodSVG size={13} />{nextDef!.upgradeCost!.wood}</span>
            </span>
          </div>
        ) : nextDef ? (
          <div className="cm-action-row">
            <button
              className="cm-btn upgrade"
              disabled={!canUpgrade}
              onClick={() => onUpdateState(upgradeTown)}
            >
              ⬆ {nextDef.name}
            </button>
            <span className="cm-cost-side">
              💰{nextDef.upgradeCost!.gold} <span className="cost-icon"><WoodSVG size={13} />{nextDef.upgradeCost!.wood}</span>
              {!canAfford ? " (недост.)" : ""}
            </span>
          </div>
        ) : (
          <div className="cm-maxed">★ Макс. уровень</div>
        )}
      </div>
    </>
  );
}

// ── Таверна ───────────────────────────────────────────────────────────────────
function buildTavern(state: GameState): GameState {
  if (state.tavern) return state;
  if (state.gold < TAVERN_COST.gold || state.wood < TAVERN_COST.wood) return state;
  const texts = [
    ft(`-${TAVERN_COST.gold}💰`, TAVERN_CELL[0], TAVERN_CELL[1], "#ff8080", state.gameTime),
    ft(`-${TAVERN_COST.wood}🌲`, TAVERN_CELL[0], TAVERN_CELL[1] - 0.6, "#ff8080", state.gameTime),
  ];
  return {
    ...state,
    gold: state.gold - TAVERN_COST.gold,
    wood: state.wood - TAVERN_COST.wood,
    tavern: { buildTimeRemaining: TAVERN_BUILD_TIME, offers: [] },
    floatingTexts: [...state.floatingTexts, ...texts],
  };
}

function applyCancelTavernBuild(state: GameState): GameState {
  const tavern = state.tavern;
  if (!tavern || tavern.buildTimeRemaining <= 0) return state;
  const texts = [
    ft(`+${TAVERN_COST.gold}💰`, TAVERN_CELL[0], TAVERN_CELL[1], "#f0c040", state.gameTime),
    ft(`+${TAVERN_COST.wood}🌲`, TAVERN_CELL[0], TAVERN_CELL[1] - 0.6, "#f0c040", state.gameTime),
  ];
  return {
    ...state,
    gold: state.gold + TAVERN_COST.gold,
    wood: state.wood + TAVERN_COST.wood,
    tavern: null,
    floatingTexts: [...state.floatingTexts, ...texts],
  };
}

function TavernPanel({ state, pendingHero, onUpdateState, onShowBuildingInfo, onSelectHero, onShowHeroInfo }: {
  state: GameState; pendingHero: HeroType | null;
  onUpdateState: Props["onUpdateState"]; onShowBuildingInfo: Props["onShowBuildingInfo"];
  onSelectHero: Props["onSelectHero"]; onShowHeroInfo: Props["onShowHeroInfo"];
}) {
  const tavern = state.tavern;
  const isBuilding = !!tavern && tavern.buildTimeRemaining > 0;
  const canAffordBuild = state.gold >= TAVERN_COST.gold && state.wood >= TAVERN_COST.wood;
  const canBuild = !tavern && canAffordBuild;
  const hasHeroInPlay = state.heroes.length > 0 || !!pendingHero;
  const canAffordHire = state.gold >= HERO_HIRE_COST;

  return (
    <>
      <div className="cm-header">
        <span className="cm-title"><TavernSVG size={22} /> Таверна</span>
        <InfoBadge onClick={() => onShowBuildingInfo("tavern")} />
      </div>

      {isBuilding && (
        <div className="cm-building-badge">
          <span>⚙️ Строится… {Math.ceil(tavern!.buildTimeRemaining)}с</span>
          <BuildProgressBar remaining={tavern!.buildTimeRemaining} total={TAVERN_BUILD_TIME} />
        </div>
      )}

      {tavern && !isBuilding && (
        tavern.offers.length > 0 ? (
          tavern.offers.map((offer, i) => {
            const canPick = !hasHeroInPlay && canAffordHire;
            const offerDef = HERO_DEFS[offer.type];
            return (
              <div key={i} className="cm-hero-offer">
                <button
                  className="cm-hero-offer-icon"
                  disabled={!canPick}
                  onClick={() => onSelectHero(offer.type)}
                >
                  <HeroIcon type={offer.type} size={30} />
                </button>
                <span className="cm-hero-offer-cost">
                  💰{HERO_HIRE_COST} 🍖{offerDef.foodCost}
                  {hasHeroInPlay ? " (герой уже есть)" : !canAffordHire ? " (недост.)" : ""}
                </span>
                <InfoBadge onClick={() => onShowHeroInfo(offer.type)} />
              </div>
            );
          })
        ) : (
          <div className="cm-stats"><span>Героев пока нет</span></div>
        )
      )}

      <div className="cm-actions">
        {isBuilding ? (
          <div className="cm-action-row">
            <button
              className="cm-btn cancel"
              onClick={() => onUpdateState(applyCancelTavernBuild)}
            >
              ✕ Отменить
            </button>
            <span className="cm-cost-side">
              +{TAVERN_COST.gold}💰 <span className="cost-icon">+<WoodSVG size={13} />{TAVERN_COST.wood}</span>
            </span>
          </div>
        ) : !tavern ? (
          <div className="cm-action-row">
            <button
              className="cm-btn upgrade"
              disabled={!canBuild}
              onClick={() => onUpdateState(buildTavern)}
            >
              Построить
            </button>
            <span className="cm-cost-side">
              💰{TAVERN_COST.gold} <span className="cost-icon"><WoodSVG size={13} />{TAVERN_COST.wood}</span>
              {!canAffordBuild ? " (недост.)" : ""}
            </span>
          </div>
        ) : null}
      </div>
    </>
  );
}

// ── Герой ─────────────────────────────────────────────────────────────────────
function HeroPanel({ hero, state, onShowHeroInfo }: { hero: Hero; state: GameState; onShowHeroInfo: Props["onShowHeroInfo"] }) {
  const def = HERO_DEFS[hero.type];
  const isBuilding = hero.buildTimeRemaining > 0;
  const auraPct = def.ability.kind === "aura_damage" ? heroAuraPct(hero.level, def.ability) : 0;
  const damage = heroDamage(hero.level, def);
  const range = heroRange(hero.level, def);
  const hasteBonus = auraBonus(hero, state.towers);
  const attackSpeed = heroAttackSpeed(hero.level, def) * (1 + hasteBonus);

  return (
    <>
      <div className="cm-header">
        <span className="cm-title"><HeroIcon type={hero.type} size={26} /> {def.name} · ур.{hero.level}</span>
        <InfoBadge onClick={() => onShowHeroInfo(hero.type)} />
      </div>

      {isBuilding && (
        <div className="cm-building-badge">
          <span>⚙️ Занимает позицию… {Math.ceil(hero.buildTimeRemaining)}с</span>
          <BuildProgressBar remaining={hero.buildTimeRemaining} total={def.buildTime} />
        </div>
      )}

      <div className="cm-stats">
        <span>⚔️ {damage}</span>
        <span>🎯 {range}</span>
        <span>⚡ <span className={hasteBonus > 0 ? "cm-buffed" : undefined}>{hasteBonus > 0 ? attackSpeed.toFixed(2) : attackSpeed}</span>/с{hasteBonus > 0 && ` (+${Math.round(hasteBonus * 100)}%)`}</span>
        <span>🍖 {def.foodCost}</span>
        {def.ability.kind === "aura_damage" && (
          <span>✨ Аура +{Math.round(auraPct * 100)}% урона · r{def.ability.radius}</span>
        )}
      </div>
      <div className="cm-stats">
        <span>Уровень {hero.level}/{HERO_MAX_LEVEL}</span>
      </div>
    </>
  );
}

// ── Крип ──────────────────────────────────────────────────────────────────────
const ABILITY_LABEL: Record<string, string> = {
  block: "🛡 Блок 20%",
  dodge: "💨 Уклонение 20%",
  slow_resist: "🧊 Иммунитет к замедлению",
  root_resist: "🧱 Иммунитет к сковыванию",
  self_heal: "💚 Самолечение при <50% HP",
};

function CreepPanel({ creep }: { creep: Creep }) {
  const def = CREEP_DEFS[creep.kind];
  const hpPct = Math.max(0, Math.min(1, creep.hp / creep.maxHp));
  const hpBarColor = creep.regenPerSec > 0
    ? "#8bc34a"
    : hpPct > 0.5 ? "#4caf50" : "#f44336";

  return (
    <>
      <div className="cm-header">
        <span className="cm-title">{def.emoji} {def.name}</span>
      </div>
      <div className="cm-hp-bar-outer">
        <div className="cm-hp-bar-inner" style={{ width: `${hpPct * 100}%`, background: hpBarColor }} />
      </div>
      <div className="cm-stats">
        <span>❤️ {Math.ceil(creep.hp)}/{creep.maxHp}</span>
        <span>🏃 {creep.speed}</span>
        <span>💰 {creep.reward}</span>
        <span>💔 −{creep.livesLost} жизней</span>
        {creep.regenPerSec > 0 && <span>♻️ Реген {creep.regenPerSec}/с</span>}
        {creep.slowTimer > 0 && <span>❄️ Замедлен</span>}
        {creep.vulnTimer > 0 && <span>🔻 Уязвим +{Math.round(creep.vulnPct * 100)}%</span>}
        {creep.rootTimer > 0 && <span>🌿 Скован</span>}
        {creep.abilities.map(a => <span key={a}>{ABILITY_LABEL[a]}</span>)}
      </div>
    </>
  );
}

// ── Волна ─────────────────────────────────────────────────────────────────────
function WavePanel({ state }: { state: GameState }) {
  const isWaveActive = state.phase === "wave";
  const waveIdx = isWaveActive ? Math.max(state.wave - 1, 0) : Math.min(state.wave, WAVE_DEFS.length - 1);
  const waveDef = WAVE_DEFS[waveIdx];
  const waveNum = waveIdx + 1;
  const remaining = state.creeps.length + state.spawnQueue.length;

  const counts = new Map<CreepKind, number>();
  for (const entry of waveDef.entries) counts.set(entry.kind, (counts.get(entry.kind) ?? 0) + 1);

  return (
    <>
      <div className="cm-header">
        <span className="cm-title">🌊 Волна {waveNum} · {waveDef.name}</span>
      </div>
      <div className="cm-stats">
        <span>💰 Рекомендовано: {waveDef.recommended}</span>
        <span>👾 Всего в волне: {waveDef.entries.length}</span>
        {isWaveActive
          ? <span>⏳ Осталось: {remaining}</span>
          : state.phase === "prep"
            ? <span>⏱ Начнётся через {Math.ceil(state.prepTimer)}с</span>
            : <span>Ещё не начата</span>}
      </div>
      <div className="cm-stats" style={{ flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
        {[...counts.entries()].map(([kind, count]) => {
          const def = CREEP_DEFS[kind];
          return (
            <span key={kind}>
              {def.emoji} {def.name} ×{count} — ❤️{def.hp} 🏃{def.speed}
              {def.abilities.length > 0 && ` · ${def.abilities.map(a => ABILITY_LABEL[a]).join(", ")}`}
            </span>
          );
        })}
      </div>
    </>
  );
}

function ContextMenu({ state, selection, pendingHero, onUpdateState, onClose, onShowTowerInfo, onShowBuildingInfo, onSelectHero, onShowHeroInfo }: Props) {
  if (selection.kind === "tower") {
    const tower = state.towers.find(t => t.id === selection.id);
    if (!tower) return null;
    return (
      <div className="context-menu">
        <TowerPanel tower={tower} state={state} onUpdateState={onUpdateState} onClose={onClose} onShowTowerInfo={onShowTowerInfo} />
      </div>
    );
  }

  if (selection.kind === "hero") {
    const hero = state.heroes.find(h => h.id === selection.id);
    if (!hero) return null;
    return (
      <div className="context-menu">
        <HeroPanel hero={hero} state={state} onShowHeroInfo={onShowHeroInfo} />
      </div>
    );
  }

  if (selection.kind === "wave") {
    return (
      <div className="context-menu">
        <WavePanel state={state} />
      </div>
    );
  }

  if (selection.kind === "creep") {
    const creep = state.creeps.find(c => c.id === selection.id);
    if (!creep) return null;
    return (
      <div className="context-menu">
        <CreepPanel creep={creep} />
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

  if (selection.kind === "tavern") {
    return (
      <div className="context-menu">
        <TavernPanel state={state} pendingHero={pendingHero} onUpdateState={onUpdateState} onShowBuildingInfo={onShowBuildingInfo} onSelectHero={onSelectHero} onShowHeroInfo={onShowHeroInfo} />
      </div>
    );
  }

  return (
    <div className="context-menu">
      <TownPanel state={state} onUpdateState={onUpdateState} onShowBuildingInfo={onShowBuildingInfo} />
    </div>
  );
}

// state целиком меняется каждый кадр (state.gameTime), поэтому обычный
// memo был бы бесполезен — сверяем только поля, которые реально
// использует конкретная панель по selection.kind. Для "creep" всегда
// перерисовываем — HP там живое и должно обновляться каждый кадр.
function contextMenuPropsEqual(prev: Props, next: Props): boolean {
  if (
    prev.selection !== next.selection ||
    prev.pendingHero !== next.pendingHero ||
    prev.onUpdateState !== next.onUpdateState ||
    prev.onClose !== next.onClose ||
    prev.onShowTowerInfo !== next.onShowTowerInfo ||
    prev.onShowBuildingInfo !== next.onShowBuildingInfo ||
    prev.onSelectHero !== next.onSelectHero ||
    prev.onShowHeroInfo !== next.onShowHeroInfo
  ) return false;

  const sel = next.selection;
  const ps = prev.state, ns = next.state;

  if (sel.kind === "creep") return false;

  if (sel.kind === "tower") {
    const pt = ps.towers.find(t => t.id === sel.id);
    const nt = ns.towers.find(t => t.id === sel.id);
    const heroesEqual = ps.heroes.length === ns.heroes.length
      && ps.heroes.every((h, i) => h.level === ns.heroes[i].level && h.col === ns.heroes[i].col && h.row === ns.heroes[i].row);
    return pt === nt && heroesEqual && ps.gold === ns.gold && ps.food === ns.food && ps.townLevel === ns.townLevel;
  }

  if (sel.kind === "hero") return false;

  if (sel.kind === "wave") {
    return (
      ps.wave === ns.wave &&
      ps.phase === ns.phase &&
      Math.ceil(ps.prepTimer) === Math.ceil(ns.prepTimer) &&
      (ps.creeps.length + ps.spawnQueue.length) === (ns.creeps.length + ns.spawnQueue.length)
    );
  }

  if (sel.kind === "farm") {
    return ps.farm === ns.farm && ps.gold === ns.gold && ps.wood === ns.wood;
  }

  if (sel.kind === "sawmill") {
    return ps.sawmill === ns.sawmill && ps.gold === ns.gold && ps.wood === ns.wood;
  }

  if (sel.kind === "tavern") {
    return ps.tavern === ns.tavern && ps.gold === ns.gold && ps.wood === ns.wood && ps.heroes.length === ns.heroes.length;
  }

  // town
  return (
    ps.townLevel === ns.townLevel &&
    ps.townBuildTimeRemaining === ns.townBuildTimeRemaining &&
    ps.gold === ns.gold && ps.wood === ns.wood &&
    ps.lives === ns.lives && ps.maxLives === ns.maxLives
  );
}

export default memo(ContextMenu, contextMenuPropsEqual);
