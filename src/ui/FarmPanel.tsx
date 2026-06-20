import type { GameState, Farm, FloatingText } from "../game/engine/gameState";
import { FARM_UPGRADE_COST, FARM_FOOD_PER_LEVEL } from "../game/engine/gameState";

interface Props {
  farms: Farm[];
  gold: number;
  waveActive: boolean;
  onUpdateState: (updater: (s: GameState) => GameState) => void;
}

function buildFarm(farmId: string, state: GameState): GameState {
  const farm = state.farms.find(f => f.id === farmId);
  if (!farm || farm.buildTimeRemaining > 0 || state.gold < FARM_UPGRADE_COST) return state;
  const text: FloatingText = {
    id: `ft-farm-buy-${Date.now()}`,
    text: `-${FARM_UPGRADE_COST}💰`,
    x: 4.5, y: 4,
    color: "#ff8080",
    spawnTime: state.gameTime,
    duration: 1.4,
  };
  return {
    ...state,
    gold: state.gold - FARM_UPGRADE_COST,
    farms: state.farms.map(f =>
      f.id === farmId
        ? { ...f, buildTimeRemaining: 2, totalInvested: f.totalInvested + FARM_UPGRADE_COST }
        : f,
    ),
    floatingTexts: [...state.floatingTexts, text],
  };
}

export default function FarmPanel({ farms, gold, waveActive, onUpdateState }: Props) {
  if (farms.length === 0) return null;
  return (
    <div className="shop" style={{ justifyContent: "flex-start" }}>
      {farms.map(farm => {
        const level = Math.round(farm.foodProduced / FARM_FOOD_PER_LEVEL);
        const isBuilding = farm.buildTimeRemaining > 0;
        const canBuild = !isBuilding && !waveActive && gold >= FARM_UPGRADE_COST;
        return (
          <div
            key={farm.id}
            className="shop-item"
            style={{ minWidth: 90 }}
          >
            <span className="shop-emoji">🌾</span>
            <span className="shop-name">Ферма ур.{level}</span>
            <span className="shop-stat">
              {FARM_UPGRADE_COST}💰 &nbsp; +{FARM_FOOD_PER_LEVEL}🌾
            </span>
            {isBuilding ? (
              <span className="shop-cost" style={{ color: "#f0c040" }}>
                ⚙️ {Math.ceil(farm.buildTimeRemaining)}с
              </span>
            ) : (
              <button
                className="farm-build-btn"
                disabled={!canBuild}
                onClick={() => onUpdateState(s => buildFarm(farm.id, s))}
              >
                {waveActive ? "Волна" : gold < FARM_UPGRADE_COST ? "Мало 💰" : "Построить"}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
