import type { GameState, Creep } from "../engine/gameState";
import { SPAWN_INTERVAL } from "../engine/gameState";
import { PATH } from "../../data/map";

let creepCounter = 0;

function makeCreep(): Creep {
  const [cx, cy] = PATH[0];
  return {
    id: `c-${++creepCounter}`,
    hp: 10,
    maxHp: 10,
    pathProgress: 0,
    position: { x: cx, y: cy },
    slowFactor: 0,
    slowTimer: 0,
  };
}

export function tickCreepSpawn(state: GameState, dt: number): GameState {
  if (state.toSpawn <= 0) return state;

  let { toSpawn, spawnTimer, creeps } = state;
  spawnTimer -= dt;

  while (spawnTimer <= 0 && toSpawn > 0) {
    creeps = [...creeps, makeCreep()];
    toSpawn--;
    spawnTimer += SPAWN_INTERVAL;
  }

  return { ...state, toSpawn, spawnTimer, creeps };
}
