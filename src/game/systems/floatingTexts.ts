import type { GameState } from "../engine/gameState";

export function tickFloatingTexts(state: GameState): GameState {
  const floatingTexts = state.floatingTexts.filter(
    t => state.gameTime - t.spawnTime < t.duration,
  );
  return { ...state, floatingTexts };
}
