import type { GameState, FloatingText, HeroOffer } from "../engine/gameState";
import { FARM_FOOD_PER_LEVEL, SAWMILL_TICK_INTERVAL, SAWMILL_WOOD_PER_LEVEL, TOWN_LEVELS } from "../../data/buildings";
import { FARM_CELL, SAWMILL_CELL, EXIT_CELL } from "../../data/map";
import { HERO_DEFS } from "../../data/heroes";
import type { HeroType } from "../../data/heroes";

function randomHeroOffer(): HeroOffer {
  const types = Object.keys(HERO_DEFS) as HeroType[];
  return { type: types[Math.floor(Math.random() * types.length)] };
}

let ftCounter = 0;

export function tickBuildTimer(state: GameState, dt: number): GameState {
  const towers = state.towers.map(t =>
    t.buildTimeRemaining > 0
      ? { ...t, buildTimeRemaining: Math.max(0, t.buildTimeRemaining - dt) }
      : t,
  );

  const heroes = state.heroes.map(h =>
    h.buildTimeRemaining > 0
      ? { ...h, buildTimeRemaining: Math.max(0, h.buildTimeRemaining - dt) }
      : h,
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
        text: `+${FARM_FOOD_PER_LEVEL}🍖`,
        x: FARM_CELL[0], y: FARM_CELL[1],
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
        text: `+${gain} 🌲`,
        x: SAWMILL_CELL[0], y: SAWMILL_CELL[1],
        color: "#8bc34a",
        spawnTime: state.gameTime,
        duration: 1.4,
      });
      sawmill = { ...sawmill, tickTimer: tickTimer + SAWMILL_TICK_INTERVAL };
    } else {
      sawmill = { ...sawmill, tickTimer };
    }
  }

  let townLevel = state.townLevel;
  let maxLives = state.maxLives;
  let lives = state.lives;
  let townBuildTimeRemaining = state.townBuildTimeRemaining;
  if (townBuildTimeRemaining > 0) {
    const newTime = townBuildTimeRemaining - dt;
    if (newTime <= 0) {
      const oldDef = TOWN_LEVELS[townLevel - 1];
      const newDef = TOWN_LEVELS[townLevel];
      const hpDelta = newDef.maxHp - oldDef.maxHp;
      townLevel = newDef.level;
      maxLives += hpDelta;
      lives += hpDelta;
      townBuildTimeRemaining = 0;
      newTexts.push({
        id: `ft-town-${++ftCounter}`,
        text: `+${hpDelta}❤️`,
        x: EXIT_CELL[0], y: EXIT_CELL[1],
        color: "#8bc34a",
        spawnTime: state.gameTime,
        duration: 1.4,
      });
    } else {
      townBuildTimeRemaining = newTime;
    }
  }

  let tavern = state.tavern;
  if (tavern && tavern.buildTimeRemaining > 0) {
    const newTime = tavern.buildTimeRemaining - dt;
    tavern = newTime <= 0
      ? { ...tavern, buildTimeRemaining: 0, offers: [randomHeroOffer()] }
      : { ...tavern, buildTimeRemaining: newTime };
  }

  return {
    ...state,
    towers,
    heroes,
    farm,
    sawmill,
    tavern,
    food,
    wood,
    townLevel,
    maxLives,
    lives,
    townBuildTimeRemaining,
    floatingTexts: newTexts.length > 0 ? [...state.floatingTexts, ...newTexts] : state.floatingTexts,
  };
}
