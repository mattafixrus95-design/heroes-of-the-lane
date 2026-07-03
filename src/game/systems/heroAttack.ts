import type { GameState, Hero, Creep, Projectile } from "../engine/gameState";
import { HERO_DEFS } from "../../data/heroes";

const ARROW_SPEED = 12;

let projCounter = 0;

function dist(hero: Hero, creep: Creep): number {
  return Math.hypot(hero.col - creep.position.x, hero.row - creep.position.y);
}

function travelTime(fromCol: number, fromRow: number, toX: number, toY: number, speed: number): number {
  return Math.max(0.05, Math.hypot(fromCol - toX, fromRow - toY) / speed);
}

function findTarget(hero: Hero, range: number, creeps: Creep[]): Creep | null {
  let best: Creep | null = null;
  for (const c of creeps) {
    if (dist(hero, c) <= range) {
      if (!best || c.pathProgress > best.pathProgress) best = c;
    }
  }
  return best;
}

// Атаки героев тикаются отдельно от башен — герои хранятся в своём контейнере
export function tickHeroAttack(state: GameState): GameState {
  if (state.creeps.length === 0 || state.heroes.length === 0) return state;

  const newProjectiles: Projectile[] = [];

  const heroes = state.heroes.map(hero => {
    if (hero.buildTimeRemaining > 0) return hero;
    const def = HERO_DEFS[hero.type];
    if (state.gameTime - hero.lastAttackTime < 1 / def.attackSpeed) return hero;
    const target = findTarget(hero, def.range, state.creeps);
    if (!target) return hero;

    newProjectiles.push({
      id: `hp-${++projCounter}`,
      towerType: hero.type,
      fromCol: hero.col,
      fromRow: hero.row,
      toX: target.position.x,
      toY: target.position.y,
      kind: "arrow",
      spawnTime: state.gameTime,
      duration: travelTime(hero.col, hero.row, target.position.x, target.position.y, ARROW_SPEED),
      pendingDamage: { targetId: target.id, damage: def.damage, slow: 0 },
    });

    return { ...hero, lastAttackTime: state.gameTime };
  });

  return {
    ...state,
    heroes,
    projectiles: [...state.projectiles, ...newProjectiles],
  };
}
