import type { GameState } from "../engine/gameState";

export function tickBuildTimer(state: GameState, dt: number): GameState {
  const towers = state.towers.map(t =>
    t.buildTimeRemaining > 0
      ? { ...t, buildTimeRemaining: Math.max(0, t.buildTimeRemaining - dt) }
      : t,
  );
  return { ...state, towers };
}
