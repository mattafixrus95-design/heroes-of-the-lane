import type { GameState, Enemy } from "../engine/gameState";
import { PATH } from "../../data/map";

export function tickEnemyMovement(state: GameState, dt: number): GameState {
  let lives = state.lives;
  const enemies: Enemy[] = [];

  for (const e of state.enemies) {
    const tilesMoved = e.speed * dt;
    let newProgress = e.progress + tilesMoved;
    let newIndex = e.pathIndex;

    while (newProgress >= 1) {
      newProgress -= 1;
      newIndex += 1;
    }

    // Reached the end — lose a life
    if (newIndex >= PATH.length) {
      lives -= 1;
      continue;
    }

    enemies.push({ ...e, pathIndex: newIndex, progress: newProgress });
  }

  return { ...state, lives, enemies };
}
