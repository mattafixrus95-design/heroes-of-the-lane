import type { GameState, Creep, CreepKind } from "../engine/gameState";
import { CREEP_DEFS } from "../../data/waves";
import { PATH } from "../../data/map";

let creepCounter = 0;

function makeCreep(kind: CreepKind): Creep {
  const def = CREEP_DEFS[kind];
  const [cx, cy] = PATH[0];
  return {
    id: `c-${++creepCounter}`,
    kind,
    hp: def.hp,
    maxHp: def.hp,
    speed: def.speed,
    regenPerSec: def.regenPerSec,
    reward: def.reward,
    livesLost: def.livesLost,
    pathProgress: 0,
    position: { x: cx, y: cy },
    slowFactor: 0,
    slowTimer: 0,
    abilities: def.abilities,
    selfHealUsed: false,
    healTimer: 0,
  };
}

export function tickCreepSpawn(state: GameState, dt: number): GameState {
  if (state.spawnQueue.length === 0) return state;

  let spawnTimer = state.spawnTimer - dt;
  let spawnQueue = state.spawnQueue;
  let creeps = state.creeps;

  while (spawnTimer <= 0 && spawnQueue.length > 0) {
    const [entry, ...rest] = spawnQueue;
    creeps = [...creeps, makeCreep(entry.kind)];
    spawnQueue = rest;
    // Timer until next spawn: next entry's delay, or large sentinel if done
    spawnTimer += spawnQueue.length > 0 ? spawnQueue[0].delay : 999;
  }

  return { ...state, spawnQueue, spawnTimer, creeps };
}
