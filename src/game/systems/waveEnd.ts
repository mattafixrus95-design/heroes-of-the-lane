import type { GameState } from "../engine/gameState";

export function tickWaveEnd(state: GameState): GameState {
  if (state.lives <= 0) return { ...state, phase: "defeat", projectiles: [] };
  if (state.toSpawn > 0 || state.creeps.length > 0) return state;
  return { ...state, phase: "idle", projectiles: [] };
}
