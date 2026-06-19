import type { GameState } from "../engine/gameState";
import { startWaveInternal } from "../entities/spawnWave";

export function tickPrepCountdown(state: GameState, dt: number): GameState {
  const prepTimer = Math.max(0, state.prepTimer - dt);
  if (prepTimer === 0) return startWaveInternal({ ...state, prepTimer: 0 });
  return { ...state, prepTimer };
}
