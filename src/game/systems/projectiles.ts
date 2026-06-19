import type { GameState, Projectile, SplashEffect } from "../engine/gameState";
import { SLOW_DURATION } from "../engine/gameState";

let effectCounter = 0;

function applyExpired(state: GameState, expired: Projectile[]): GameState {
  if (expired.length === 0) return state;

  let creeps = [...state.creeps];
  let gold = state.gold;
  const newSplash: SplashEffect[] = [];

  for (const p of expired) {
    const pd = p.pendingDamage;

    if (p.kind === "fireball" && pd.explosionAoe) {
      // Apply main damage to primary target if still alive
      const hasTarget = creeps.some(c => c.id === pd.targetId);
      if (hasTarget) {
        creeps = creeps.map(c => c.id === pd.targetId
          ? { ...c, hp: c.hp - pd.damage, ...(pd.slow > 0 ? { slowFactor: pd.slow, slowTimer: SLOW_DURATION } : {}) }
          : c,
        );
      }
      // Explosion splash — always fires even if main target is already dead
      creeps = creeps.map(c => {
        if (c.id === pd.targetId) return c;
        const d = Math.hypot(p.toX - c.position.x, p.toY - c.position.y);
        return d <= pd.explosionAoe!
          ? { ...c, hp: c.hp - pd.damage * pd.explosionDmgPct! }
          : c;
      });
      // Sweep dead creeps
      creeps = creeps.filter(c => { if (c.hp <= 0) { gold += c.reward; return false; } return true; });
      // Visual splash ring
      newSplash.push({
        id: `sx-${++effectCounter}`,
        x: p.toX, y: p.toY,
        radius: pd.explosionAoe,
        spawnTime: state.gameTime,
        duration: 0.38,
      });
    } else {
      // Arrow — apply to specific target if still alive
      const target = creeps.find(c => c.id === pd.targetId);
      if (!target) continue;
      creeps = creeps.map(c => c.id === pd.targetId
        ? { ...c, hp: c.hp - pd.damage, ...(pd.slow > 0 ? { slowFactor: pd.slow, slowTimer: SLOW_DURATION } : {}) }
        : c,
      );
      creeps = creeps.filter(c => { if (c.hp <= 0) { gold += c.reward; return false; } return true; });
    }
  }

  // Clean up expired splash effects (tick alongside projectiles)
  const splashEffects = [
    ...state.splashEffects.filter(e => state.gameTime - e.spawnTime < e.duration),
    ...newSplash,
  ];

  return { ...state, creeps, gold, splashEffects };
}

export function tickProjectiles(state: GameState): GameState {
  const now = state.gameTime;
  const active: Projectile[] = [];
  const expired: Projectile[] = [];

  for (const p of state.projectiles) {
    (now - p.spawnTime >= p.duration ? expired : active).push(p);
  }

  const next = applyExpired({ ...state, projectiles: active }, expired);
  return next;
}
