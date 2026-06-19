import type { GameState } from "../engine/gameState";
import { tickCreepSpawn } from "./creepSpawn";
import { tickEnemyMovement } from "./enemyMovement";
import { tickTowerAttack } from "./towerAttack";
import { tickWaveEnd } from "./waveEnd";

export function tickSystems(state: GameState, dt: number): GameState {
  let next = { ...state, gameTime: state.gameTime + dt };
  next = tickCreepSpawn(next, dt);
  next = tickEnemyMovement(next, dt);
  next = tickTowerAttack(next);
  next = tickWaveEnd(next);
  return next;
}
