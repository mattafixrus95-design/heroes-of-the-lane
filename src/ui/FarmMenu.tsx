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

function ft(text: string, x: number, y: number, color: string, gameTime: number): FloatingText {
  return { id: `ft-${Date.now()}`, text, x, y, color, spawnTime: gameTime, duration: 1.4 };
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
      ft(`+${FARM_FOOD_PER_LEVEL}🌾`, farm.col, farm.row, "#8bc34a", state.gameTime),
      ft(`-${FARM_UPGRADE_COST}💰`, farm.col, farm.row - 0.5, "#ff8080", state.gameTime),
    ],
  };
}

function applyFarmSell(id: string, state: GameState): GameState {
  const farm = state.farms.find(f => f.id === id);
  if (!farm) return state;
  if (state.food < farm.foodProduced) return state; // не хватит еды после продажи
  const value = Math.floor(farm.totalInvested * SELL_RATE);
  return {
    ...state,
    gold: state.gold + value,
    food: state.food - farm.foodProduced,
    farms: state.farms.filter(f => f.id !== id),
    floatingTexts: [...state.floatingTexts,
      ft(`+${value}💰`, farm.col, farm.row, "#f0c040", state.gameTime),
    ],
  };
}

export default function FarmMenu({ farm, gold, food, waveActive, onUpdateState, onClose }: Props) {
  const canUpgrade = gold >= FARM_UPGRADE_COST && !waveActive;
  const canSell = !waveActive && food >= farm.foodProduced;
  const sellValue = Math.floor(farm.totalInvested * SELL_RATE);

  return (
    <div className="tower-menu-overlay" onClick={onClose}>
      <div className="tower-menu" onClick={e => e.stopPropagation()}>
        <div className="tm-header">
          <span className="tm-title">🌾 Ферма</span>
          <button className="tm-close" onClick={onClose}>✕</button>
        </div>

        <div className="tm-stats">
          <span>🌾 +{farm.foodProduced} еды выдано</span>
          <span>💰 {farm.totalInvested} вложено</span>
        </div>

        <div className="tm-actions">
          <button
            className="tm-btn upgrade"
            disabled={!canUpgrade}
            onClick={() => { onUpdateState(s => applyFarmUpgrade(farm.id, s)); onClose(); }}
          >
            ⬆ Улучшить (+15🌾)
            <span className="tm-btn-cost">
              💰 {FARM_UPGRADE_COST}
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
              {!canSell && !waveActive ? "(мало еды)" : waveActive ? "(волна)" : `+${sellValue}💰`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
