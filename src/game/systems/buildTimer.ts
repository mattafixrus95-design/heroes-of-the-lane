import type { GameState, FloatingText } from "../engine/gameState";
import { FARM_FOOD_PER_LEVEL } from "../engine/gameState";

let ftCounter = 0;

export function tickBuildTimer(state: GameState, dt: number): GameState {
  const towers = state.towers.map(t =>
    t.buildTimeRemaining > 0
      ? { ...t, buildTimeRemaining: Math.max(0, t.buildTimeRemaining - dt) }
      : t,
  );

  let food = state.food;
  const newTexts: FloatingText[] = [];

  const farms = state.farms.map(f => {
    if (f.buildTimeRemaining <= 0) return f;
    const newTime = f.buildTimeRemaining - dt;
    if (newTime <= 0) {
      food += FARM_FOOD_PER_LEVEL;
      newTexts.push({
        id: `ft-farm-${++ftCounter}`,
        text: `+${FARM_FOOD_PER_LEVEL}🌾`,
        x: 4.5, y: 4,
        color: "#8bc34a",
        spawnTime: state.gameTime,
        duration: 1.4,
      });
      return { ...f, buildTimeRemaining: 0, foodProduced: f.foodProduced + FARM_FOOD_PER_LEVEL };
    }
    return { ...f, buildTimeRemaining: newTime };
  });

  return {
    ...state,
    towers,
    farms,
    food,
    floatingTexts: newTexts.length > 0 ? [...state.floatingTexts, ...newTexts] : state.floatingTexts,
  };
}
