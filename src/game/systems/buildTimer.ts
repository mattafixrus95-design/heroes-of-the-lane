import type { GameState, FloatingText } from "../engine/gameState";
import { FARM_FOOD_PER_LEVEL, SAWMILL_TICK_INTERVAL, SAWMILL_WOOD_PER_LEVEL } from "../../data/buildings";
import { FARM_CELL, SAWMILL_CELL } from "../../data/map";

let ftCounter = 0;

export function tickBuildTimer(state: GameState, dt: number): GameState {
  const towers = state.towers.map(t =>
    t.buildTimeRemaining > 0
      ? { ...t, buildTimeRemaining: Math.max(0, t.buildTimeRemaining - dt) }
      : t,
  );

  let food = state.food;
  const newTexts: FloatingText[] = [];

  let farm = state.farm;
  if (farm && farm.buildTimeRemaining > 0) {
    const newTime = farm.buildTimeRemaining - dt;
    if (newTime <= 0) {
      food += FARM_FOOD_PER_LEVEL;
      newTexts.push({
        id: `ft-farm-${++ftCounter}`,
        text: `+${FARM_FOOD_PER_LEVEL}🌾`,
        x: FARM_CELL[0] + 0.5, y: FARM_CELL[1],
        color: "#8bc34a",
        spawnTime: state.gameTime,
        duration: 1.4,
      });
      farm = { ...farm, buildTimeRemaining: 0, foodProduced: farm.foodProduced + FARM_FOOD_PER_LEVEL };
    } else {
      farm = { ...farm, buildTimeRemaining: newTime };
    }
  }

  let wood = state.wood;
  let sawmill = state.sawmill;
  if (sawmill && sawmill.buildTimeRemaining > 0) {
    const newTime = sawmill.buildTimeRemaining - dt;
    sawmill = newTime <= 0
      ? { ...sawmill, buildTimeRemaining: 0, tickTimer: SAWMILL_TICK_INTERVAL }
      : { ...sawmill, buildTimeRemaining: newTime };
  } else if (sawmill) {
    const tickTimer = sawmill.tickTimer - dt;
    if (tickTimer <= 0) {
      const gain = sawmill.level * SAWMILL_WOOD_PER_LEVEL;
      wood += gain;
      newTexts.push({
        id: `ft-sawmill-${++ftCounter}`,
        text: `+${gain}🌲`,
        x: SAWMILL_CELL[0] + 0.5, y: SAWMILL_CELL[1],
        color: "#8bc34a",
        spawnTime: state.gameTime,
        duration: 1,
      });
      sawmill = { ...sawmill, tickTimer: tickTimer + SAWMILL_TICK_INTERVAL };
    } else {
      sawmill = { ...sawmill, tickTimer };
    }
  }

  return {
    ...state,
    towers,
    farm,
    sawmill,
    food,
    wood,
    floatingTexts: newTexts.length > 0 ? [...state.floatingTexts, ...newTexts] : state.floatingTexts,
  };
}
