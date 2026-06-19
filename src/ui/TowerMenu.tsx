import type { GameState, Tower } from "../game/engine/gameState";
import { SELL_RATE } from "../game/engine/gameState";
import { TOWER_DEFS } from "../data/towers";
import TowerIcon from "./TowerIcon";

interface Props {
  tower: Tower;
  gold: number;
  waveActive: boolean;
  onUpdateState: (updater: (s: GameState) => GameState) => void;
  onClose: () => void;
}

function applyUpgrade(id: string, state: GameState): GameState {
  const tower = state.towers.find(t => t.id === id);
  if (!tower) return state;
  const def = TOWER_DEFS[tower.type];
  const nextIdx = tower.gradeIndex + 1;
  if (nextIdx >= def.grades.length) return state;
  const g = def.grades[nextIdx];
  if (state.gold < g.upgradeCost) return state;
  const upgraded: Tower = {
    ...tower,
    gradeIndex: nextIdx,
    damage: g.damage, range: g.range, attackSpeed: g.attackSpeed,
    aoe: g.aoe, aoeDmgPct: g.aoeDmgPct, slow: g.slow,
    totalInvested: tower.totalInvested + g.upgradeCost,
  };
  return {
    ...state,
    gold: state.gold - g.upgradeCost,
    towers: state.towers.map(t => t.id === id ? upgraded : t),
  };
}

function applySell(id: string, state: GameState): GameState {
  const tower = state.towers.find(t => t.id === id);
  if (!tower) return state;
  return {
    ...state,
    gold: state.gold + Math.floor(tower.totalInvested * SELL_RATE),
    towers: state.towers.filter(t => t.id !== id),
  };
}

export default function TowerMenu({ tower, gold, waveActive, onUpdateState, onClose }: Props) {
  const def = TOWER_DEFS[tower.type];
  const currentGrade = def.grades[tower.gradeIndex];
  const nextGrade = def.grades[tower.gradeIndex + 1] ?? null;
  const sellValue = Math.floor(tower.totalInvested * SELL_RATE);
  const canAffordUpgrade = nextGrade ? gold >= nextGrade.upgradeCost : false;
  const canUpgrade = canAffordUpgrade && !waveActive;

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

        <div className="tm-stats">
          <span>⚔️ {tower.damage}</span>
          <span>🎯 {tower.range}</span>
          <span>⚡ {tower.attackSpeed}/с</span>
          {tower.aoe > 0 && <span>💥 AoE {tower.aoe} ({tower.aoeDmgPct * 100}%)</span>}
          {tower.slow > 0 && <span>❄️ slow {tower.slow * 100}%</span>}
        </div>

        <div className="tm-actions">
          {nextGrade ? (
            <button
              className="tm-btn upgrade"
              disabled={!canUpgrade}
              onClick={() => { onUpdateState(s => applyUpgrade(tower.id, s)); onClose(); }}
            >
              ⬆️ {nextGrade.gradeName}
              <span className="tm-btn-cost">
                💰 {nextGrade.upgradeCost}
                {waveActive ? " (волна)" : !canAffordUpgrade ? " (недостаточно)" : ""}
              </span>
            </button>
          ) : (
            <div className="tm-maxed">★ Макс. грейд</div>
          )}

          <button
            className="tm-btn sell"
            onClick={() => { onUpdateState(s => applySell(tower.id, s)); onClose(); }}
          >
            Продать
            <span className="tm-btn-cost">+{sellValue}💰</span>
          </button>
        </div>
      </div>
    </div>
  );
}
