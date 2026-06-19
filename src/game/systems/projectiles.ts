import type { GameState } from "../engine/gameState";

export function tickProjectiles(state: GameState): GameState {
  const projectiles = state.projectiles.filter(
    p => state.gameTime - p.spawnTime < p.duration
  );
  return { ...state, projectiles };
}
