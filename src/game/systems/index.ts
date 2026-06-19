import type { GameState } from "../engine/gameState";
import { tickEnemyMovement } from "./enemyMovement";
import { tickTowerAttack } from "./towerAttack";
import { tickWaveEnd } from "./waveEnd";

// Called once per fixed step (~60 fps). dt = seconds elapsed.
export function tickSystems(state: GameState, dt: number): GameState {
  if (state.phase !== "wave") return state;

  let next = state;
  next = tickEnemyMovement(next, dt);
  next = tickTowerAttack(next, dt);
  next = tickWaveEnd(next);
  return { ...next, tick: next.tick + 1 };
}
