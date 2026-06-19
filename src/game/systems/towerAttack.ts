import type { GameState, Tower, Creep } from "../engine/gameState";
import { CREEP_REWARD } from "../engine/gameState";

function distToCreep(tower: Tower, creep: Creep): number {
  return Math.hypot(tower.col - creep.position.x, tower.row - creep.position.y);
}

// Target = creep furthest along the path within range
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

    // Determine hit targets: AoE hits all creeps within radius of target
    const toHit = tower.aoe > 0
      ? creeps.filter(c =>
          Math.hypot(target.position.x - c.position.x, target.position.y - c.position.y) <= tower.aoe
        )
      : [target];

    const hitIds = new Set(toHit.map(c => c.id));
    creeps = creeps
      .map(c => hitIds.has(c.id) ? { ...c, hp: c.hp - tower.damage } : c)
      .filter(c => {
        if (c.hp <= 0) { gold += CREEP_REWARD; return false; }
        return true;
      });

    return { ...tower, lastAttackTime: state.gameTime };
  });

  return { ...state, towers, creeps, gold };
}
