import type { GameState, Farm, FloatingText } from "../game/engine/gameState";
import { SELL_RATE, FARM_UPGRADE_COST, FARM_FOOD_PER_LEVEL } from "../game/engine/gameState";

interface Props {
  farm: Farm;
  gold: number;
  food: number;
  waveActive: boolean;
  onUpdateState: (updater: (s: GameState) => GameState) => void;
  onClose: () => void;
}

function ft(text: string, color: string, gameTime: number): FloatingText {
  return { id: `ft-${Date.now()}-${Math.random().toString(36).slice(2)}`, text, x: 4.5, y: 4, color, spawnTime: gameTime, duration: 1.4 };
}

function applyFarmUpgrade(id: string, state: GameState): GameState {
  const farm = state.farms.find(f => f.id === id);
  if (!farm || state.gold < FARM_UPGRADE_COST) return state;
  const newFarm: Farm = {
    ...farm,
    foodProduced: farm.foodProduced + FARM_FOOD_PER_LEVEL,
    totalInvested: farm.totalInvested + FARM_UPGRADE_COST,
  };
  return {
    ...state,
    gold: state.gold - FARM_UPGRADE_COST,
    food: state.food + FARM_FOOD_PER_LEVEL,
    farms: state.farms.map(f => f.id === id ? newFarm : f),
    floatingTexts: [...state.floatingTexts,
      ft(`+${FARM_FOOD_PER_LEVEL}`, "#8bc34a", state.gameTime),
      ft(`-${FARM_UPGRADE_COST}`, "#ff8080", state.gameTime),
    ],
  };
}

function applyFarmSell(id: string, state: GameState): GameState {
  const farm = state.farms.find(f => f.id === id);
  if (!farm) return state;
  if (state.food < farm.foodProduced) return state;
  const value = Math.floor(farm.totalInvested * SELL_RATE);
  return {
    ...state,
    gold: state.gold + value,
    food: state.food - farm.foodProduced,
    farms: state.farms.filter(f => f.id !== id),
    floatingTexts: [...state.floatingTexts,
      ft(`+${value}`, "#f0c040", state.gameTime),
    ],
  };
}

export default function FarmMenu({ farm, gold, food, waveActive, onUpdateState, onClose }: Props) {
  const canUpgrade = gold >= FARM_UPGRADE_COST && !waveActive;
  const canSell = !waveActive && food >= farm.foodProduced;
  const sellValue = Math.floor(farm.totalInvested * SELL_RATE);
  const level = Math.round(farm.foodProduced / FARM_FOOD_PER_LEVEL);

  return (
    <div className="tower-menu-overlay" onClick={onClose}>
      <div className="tower-menu" onClick={e => e.stopPropagation()}>
        <div className="tm-header">
          <span className="tm-title">Ферма ур.{level}</span>
          <button className="tm-close" onClick={onClose}>✕</button>
        </div>

        <div className="tm-stats">
          <span>+{farm.foodProduced} еды</span>
          <span>{farm.totalInvested} вложено</span>
        </div>

        <div className="tm-actions">
          <button
            className="tm-btn upgrade"
            disabled={!canUpgrade}
            onClick={() => { onUpdateState(s => applyFarmUpgrade(farm.id, s)); onClose(); }}
          >
            Улучшить (+{FARM_FOOD_PER_LEVEL} еды)
            <span className="tm-btn-cost">
              {FARM_UPGRADE_COST}
              {waveActive ? " (волна)" : gold < FARM_UPGRADE_COST ? " (недост.)" : ""}
            </span>
          </button>

          <button
            className="tm-btn sell"
            disabled={!canSell}
            onClick={() => { onUpdateState(s => applyFarmSell(farm.id, s)); onClose(); }}
          >
            Продать
            <span className="tm-btn-cost">
              {!canSell && !waveActive ? "(мало еды)" : waveActive ? "(волна)" : `+${sellValue}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
