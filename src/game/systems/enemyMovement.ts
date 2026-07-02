import type { GameState, Creep, Point } from "../engine/gameState";
import { PATH } from "../../data/map";

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

  for (let c of state.creeps) {
    // Regen
    if (c.regenPerSec > 0) {
      c = { ...c, hp: Math.min(c.maxHp, c.hp + c.regenPerSec * dt) };
    }

    // Self-heal trigger: once per wave, at <50% HP
    if (
      c.abilities.includes("self_heal") &&
      !c.selfHealUsed &&
      c.healTimer <= 0 &&
      c.hp < c.maxHp * 0.5
    ) {
      c = {
        ...c,
        hp: Math.min(c.maxHp, c.hp + c.maxHp * 0.3),
        selfHealUsed: true,
        healTimer: 1.0,
      };
    }

    // If healing — pause movement
    if (c.healTimer > 0) {
      creeps.push({ ...c, healTimer: Math.max(0, c.healTimer - dt) });
      continue;
    }

    // Slow (slow_resist ignores it)
    const slowTimer = Math.max(0, c.slowTimer - dt);
    const slowActive = slowTimer > 0 && !c.abilities.includes("slow_resist");
    const vulnTimer = Math.max(0, c.vulnTimer - dt);
    const rootTimer = Math.max(0, c.rootTimer - dt);
    const effectiveSpeed = rootTimer > 0 ? 0 : c.speed * (1 - (slowActive ? c.slowFactor : 0));
    const newProgress = c.pathProgress + effectiveSpeed * dt;

    if (newProgress >= PATH.length - 1) {
      lives -= c.livesLost;
      continue;
    }

    creeps.push({
      ...c,
      pathProgress: newProgress,
      position: positionAt(newProgress),
      slowTimer,
      vulnTimer,
      rootTimer,
    });
  }

  return { ...state, lives, creeps };
}
