import type { GameState, Tower, Creep } from "../engine/gameState";
import { CREEP_REWARD, SLOW_DURATION } from "../engine/gameState";

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

  const towers = state.towers.map(tower => {
    if (state.gameTime - tower.lastAttackTime < 1 / tower.attackSpeed) return tower;

    const target = findTarget(tower, creeps);
    if (!target) return tower;

    creeps = creeps.map(c => {
      if (c.id === target.id) {
        // Main target: full damage + slow if applicable
        return {
          ...c,
          hp: c.hp - tower.damage,
          ...(tower.slow > 0 ? { slowFactor: tower.slow, slowTimer: SLOW_DURATION } : {}),
        };
      }
      // AoE splash: aoeDmgPct of damage to creeps within aoe radius of target
      if (tower.aoe > 0) {
        const d = Math.hypot(target.position.x - c.position.x, target.position.y - c.position.y);
        if (d <= tower.aoe) {
          return { ...c, hp: c.hp - tower.damage * tower.aoeDmgPct };
        }
      }
      return c;
    }).filter(c => {
      if (c.hp <= 0) { gold += CREEP_REWARD; return false; }
      return true;
    });

    return { ...tower, lastAttackTime: state.gameTime };
  });

  return { ...state, towers, creeps, gold };
}
