import type { GameState } from "../engine/gameState";
import { TOTAL_CREEPS } from "../engine/gameState";

export function startWave(state: GameState): GameState {
  return {
    ...state,
    phase: "wave",
    wave: state.wave + 1,
    creeps: [],
    toSpawn: TOTAL_CREEPS,
    spawnTimer: 0, // first creep spawns immediately
  };
}
