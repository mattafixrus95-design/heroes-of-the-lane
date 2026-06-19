import type { GameState } from "../engine/gameState";
import { tickCreepSpawn } from "./creepSpawn";
import { tickEnemyMovement } from "./enemyMovement";
import { tickTowerAttack } from "./towerAttack";
import { tickProjectiles } from "./projectiles";
import { tickWaveEnd } from "./waveEnd";

export function tickSystems(state: GameState, dt: number): GameState {
  let next = { ...state, gameTime: state.gameTime + dt };
  next = tickCreepSpawn(next, dt);
  next = tickEnemyMovement(next, dt);
  next = tickTowerAttack(next);
  next = tickProjectiles(next);
  next = tickWaveEnd(next);
  return next;
}
