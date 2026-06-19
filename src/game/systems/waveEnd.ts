import type { GameState } from "../engine/gameState";

export function tickWaveEnd(state: GameState): GameState {
  if (state.phase !== "wave") return state;
  if (state.enemies.length > 0) return state;
  if (state.lives <= 0) return { ...state, phase: "defeat" };

  // Wave cleared
  return {
    ...state,
    phase: "idle",
    gold: state.gold + 30 + state.wave * 10, // reward scales with wave
  };
}
