import type { GameState, Hero, Creep, Projectile } from "../engine/gameState";
import { HERO_DEFS, heroDamage, heroRange, heroAttackSpeed } from "../../data/heroes";
import { auraBonus } from "./towerAttack";

const ARROW_SPEED = 12;

let projCounter = 0;

function dist(hero: Hero, creep: Creep): number {
  return Math.hypot(hero.col - creep.position.x, hero.row - creep.position.y);
}

function travelTime(fromCol: number, fromRow: number, toX: number, toY: number, speed: number): number {
  return Math.max(0.05, Math.hypot(fromCol - toX, fromRow - toY) / speed);
}

export function findTarget(hero: Hero, range: number, creeps: Creep[]): Creep | null {
  let best: Creep | null = null;
  for (const c of creeps) {
    if (dist(hero, c) <= range) {
      if (!best || c.pathProgress > best.pathProgress) best = c;
    }
  }
  return best;
}

export type HeroAttackPhase = "idle" | "ready" | "after_shot";

// Кратковременная поза "после выстрела" сразу по lastAttackTime; "ready" —
// герой держит цель на прицеле (натянул тетиву) между выстрелами; иначе —
// нейтральный idle. Только для рендера (GameGrid), не часть тикающих систем.
const AFTER_SHOT_DURATION = 0.2;

export function heroAttackPhase(hero: Hero, state: GameState): HeroAttackPhase {
  if (hero.buildTimeRemaining > 0) return "idle";
  if (state.gameTime - hero.lastAttackTime < AFTER_SHOT_DURATION) return "after_shot";
  const def = HERO_DEFS[hero.type];
  const range = heroRange(hero.level, def);
  return findTarget(hero, range, state.creeps) ? "ready" : "idle";
}

// Атаки героев тикаются отдельно от башен — герои хранятся в своём контейнере
export function tickHeroAttack(state: GameState): GameState {
  if (state.creeps.length === 0 || state.heroes.length === 0) return state;

  const newProjectiles: Projectile[] = [];

  const heroes = state.heroes.map(hero => {
    if (hero.buildTimeRemaining > 0) return hero;
    const def = HERO_DEFS[hero.type];
    const attackSpeed = heroAttackSpeed(hero.level, def) * (1 + auraBonus(hero, state.towers));
    if (state.gameTime - hero.lastAttackTime < 1 / attackSpeed) return hero;
    const range = heroRange(hero.level, def);
    const target = findTarget(hero, range, state.creeps);
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
      pendingDamage: { targetId: target.id, damage: heroDamage(hero.level, def), slow: 0 },
    });

    return { ...hero, lastAttackTime: state.gameTime };
  });

  return {
    ...state,
    heroes,
    projectiles: [...state.projectiles, ...newProjectiles],
  };
}
