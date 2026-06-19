import type { GameState, Creep, Point } from "../engine/gameState";
import { PATH } from "../../data/map";

const BASE_SPEED = 1; // tiles per second

function positionAt(progress: number): Point {
  const i = Math.min(Math.floor(progress), PATH.length - 1);
  const j = Math.min(i + 1, PATH.length - 1);
  const t = progress - Math.floor(progress);
  const [c0, r0] = PATH[i];
  const [c1, r1] = PATH[j];
  return { x: c0 + (c1 - c0) * t, y: r0 + (r1 - r0) * t };
}

export function tickEnemyMovement(state: GameState, dt: number): GameState {
  let lives = state.lives;
  const creeps: Creep[] = [];

  for (const c of state.creeps) {
    const slowTimer = Math.max(0, c.slowTimer - dt);
    const speed = BASE_SPEED * (1 - (slowTimer > 0 ? c.slowFactor : 0));
    const newProgress = c.pathProgress + speed * dt;

    if (newProgress >= PATH.length - 1) {
      lives -= 1;
      continue;
    }

    creeps.push({
      ...c,
      pathProgress: newProgress,
      position: positionAt(newProgress),
      slowTimer,
    });
  }

  return { ...state, lives, creeps };
}
