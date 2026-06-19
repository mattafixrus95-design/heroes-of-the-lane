import type { GameState, Tower, Creep, Projectile } from "../engine/gameState";
import { CREEP_REWARD, SLOW_DURATION } from "../engine/gameState";

// Travel time (seconds) per tower type
const PROJ_DURATION: Record<string, number> = {
  dwarf:  0.28,
  elf:    0.38,
  dragon: 0.52,
};

let projCounter = 0;

function distToCreep(tower: Tower, creep: Creep): number {
  return Math.hypot(tower.col - creep.position.x, tower.row - creep.position.y);
}

function findTarget(tower: Tower, creeps: Creep[]): Creep | null {
  let best: Creep | null = null;
  for (const c of creeps) {
    if (distToCreep(tower, c) <= tower.range) {
      if (!best || c.pathProgress > best.pathProgress) best = c;
    }
  }
  return best;
}

export function tickTowerAttack(state: GameState): GameState {
  if (state.creeps.length === 0) return state;

  let creeps = [...state.creeps];
  let gold = state.gold;
  let projectiles = [...state.projectiles];

  const towers = state.towers.map(tower => {
    if (state.gameTime - tower.lastAttackTime < 1 / tower.attackSpeed) return tower;

    const target = findTarget(tower, creeps);
    if (!target) return tower;

    // Spawn projectile (purely visual — damage applied immediately)
    const proj: Projectile = {
      id: `p-${++projCounter}`,
      fromCol: tower.col,
      fromRow: tower.row,
      toX: target.position.x,
      toY: target.position.y,
      kind: tower.type === "dragon" ? "fireball" : "arrow",
      spawnTime: state.gameTime,
      duration: PROJ_DURATION[tower.type] ?? 0.4,
    };
    projectiles = [...projectiles, proj];

    // Apply damage
    creeps = creeps.map(c => {
      if (c.id === target.id) {
        return {
          ...c,
          hp: c.hp - tower.damage,
          ...(tower.slow > 0 ? { slowFactor: tower.slow, slowTimer: SLOW_DURATION } : {}),
        };
      }
      if (tower.aoe > 0) {
        const d = Math.hypot(target.position.x - c.position.x, target.position.y - c.position.y);
        if (d <= tower.aoe) return { ...c, hp: c.hp - tower.damage * tower.aoeDmgPct };
      }
      return c;
    }).filter(c => {
      if (c.hp <= 0) { gold += CREEP_REWARD; return false; }
      return true;
    });

    return { ...tower, lastAttackTime: state.gameTime };
  });

  return { ...state, towers, creeps, gold, projectiles };
}
