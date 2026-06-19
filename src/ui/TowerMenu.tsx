import type { GameState, Tower, FloatingText } from "../game/engine/gameState";
import { SELL_RATE } from "../game/engine/gameState";
import { TOWER_DEFS } from "../data/towers";
import TowerIcon from "./TowerIcon";

interface Props {
  tower: Tower;
  gold: number;
  food: number;
  waveActive: boolean;
  onUpdateState: (updater: (s: GameState) => GameState) => void;
  onClose: () => void;
}

function ft(text: string, x: number, y: number, color: string, gameTime: number): FloatingText {
  return { id: `ft-${Date.now()}-${Math.random().toString(36).slice(2)}`, text, x, y, color, spawnTime: gameTime, duration: 1.4 };
}

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
    aoe: g.aoe, aoeDmgPct: g.aoeDmgPct, slow: g.slow,
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

export default function TowerMenu({ tower, gold, food, waveActive, onUpdateState, onClose }: Props) {
  const def = TOWER_DEFS[tower.type];
  const currentGrade = def.grades[tower.gradeIndex];
  const nextGrade = def.grades[tower.gradeIndex + 1] ?? null;
  const sellValue = Math.floor(tower.totalInvested * SELL_RATE);
  const isBuilding = tower.buildTimeRemaining > 0;

  const canAffordUpgrade = nextGrade
    ? gold >= nextGrade.upgradeCost && food >= nextGrade.foodUpgradeCost
    : false;
  const canUpgrade = canAffordUpgrade && !waveActive && !isBuilding;

  return (
    <div className="tower-menu-overlay" onClick={onClose}>
      <div className="tower-menu" onClick={e => e.stopPropagation()}>
        <div className="tm-header">
          <span className="tm-title">
            <TowerIcon type={tower.type} grade={tower.gradeIndex} size={28} />
            {" "}{def.name} · {currentGrade.gradeName}
          </span>
          <button className="tm-close" onClick={onClose}>✕</button>
        </div>

        {isBuilding && (
          <div style={{
            background: "rgba(240,192,64,0.15)", borderRadius: 6, padding: "6px 10px",
            fontSize: "0.8rem", color: "#f0c040", textAlign: "center",
          }}>
            ⚙️ Строится… {Math.ceil(tower.buildTimeRemaining)}с
          </div>
        )}

        <div className="tm-stats">
          <span>⚔️ {tower.damage}</span>
          <span>🎯 {tower.range}</span>
          <span>⚡ {tower.attackSpeed}/с</span>
          {tower.aoe > 0 && <span>💥 AoE {tower.aoe}</span>}
          {tower.slow > 0 && <span>❄️ {tower.slow * 100}%</span>}
        </div>

        <div className="tm-actions">
          {nextGrade ? (
            <button
              className="tm-btn upgrade"
              disabled={!canUpgrade}
              onClick={() => { onUpdateState(s => applyUpgrade(tower.id, s)); onClose(); }}
            >
              ⬆ {nextGrade.gradeName}
              <span className="tm-btn-cost">
                💰 {nextGrade.upgradeCost}
                {nextGrade.foodUpgradeCost > 0 ? ` 🌾 ${nextGrade.foodUpgradeCost}` : ""}
                {isBuilding ? " (строится)" : waveActive ? " (волна)" : !canAffordUpgrade ? " (недост.)" : ""}
              </span>
            </button>
          ) : (
            <div className="tm-maxed">★ Макс. грейд</div>
          )}

          <button
            className="tm-btn sell"
            disabled={waveActive}
            onClick={() => { onUpdateState(s => applySell(tower.id, s)); onClose(); }}
          >
            Продать
            <span className="tm-btn-cost">
              {waveActive ? "(волна)" : `+${sellValue}💰 +${tower.foodSpent}🌾`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
