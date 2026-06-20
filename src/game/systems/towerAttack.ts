import type { GameState, Tower, Creep, Projectile } from "../engine/gameState";

// Tile-units per second for each projectile type
const ARROW_SPEED    = 12;
const FIREBALL_SPEED = 10;

let projCounter = 0;

function dist(tower: Tower, creep: Creep): number {
  return Math.hypot(tower.col - creep.position.x, tower.row - creep.position.y);
}

function travelTime(fromCol: number, fromRow: number, toX: number, toY: number, speed: number): number {
  return Math.max(0.05, Math.hypot(fromCol - toX, fromRow - toY) / speed);
}

function findTarget(tower: Tower, creeps: Creep[]): Creep | null {
  let best: Creep | null = null;
  for (const c of creeps) {
    if (dist(tower, c) <= tower.range) {
      if (!best || c.pathProgress > best.pathProgress) best = c;
    }
  }
  return best;
}

function makeProjectile(
  tower: Tower,
  target: Creep,
  gameTime: number,
  damage: number,
  slow: number,
  kind: "arrow" | "axe" | "fireball",
  aoeDmgPct: number,
  explosionAoe: number,
): Projectile {
  const speed = kind === "fireball" ? FIREBALL_SPEED : ARROW_SPEED;
  return {
    id: `p-${++projCounter}`,
    towerType: tower.type,
    fromCol: tower.col,
    fromRow: tower.row,
    toX: target.position.x,
    toY: target.position.y,
    kind,
    spawnTime: gameTime,
    duration: travelTime(tower.col, tower.row, target.position.x, target.position.y, speed),
    pendingDamage: {
      targetId: target.id,
      damage,
      slow,
      ...(explosionAoe > 0 ? { explosionAoe, explosionDmgPct: aoeDmgPct } : {}),
    },
  };
}

export function tickTowerAttack(state: GameState): GameState {
  if (state.creeps.length === 0) return state;

  const newProjectiles: Projectile[] = [];

  const towers = state.towers.map(tower => {
    if (tower.buildTimeRemaining > 0) return tower;
    if (state.gameTime - tower.lastAttackTime < 1 / tower.attackSpeed) return tower;
    const target = findTarget(tower, state.creeps);
    if (!target) return tower;

    if (tower.type === "dragon") {
      newProjectiles.push(makeProjectile(
        tower, target, state.gameTime,
        tower.damage, tower.slow,
        "fireball", tower.aoeDmgPct, tower.aoe,
      ));
    } else if (tower.type === "dwarf") {
      // Гном бросает топор (одиночный, без AoE)
      newProjectiles.push(makeProjectile(
        tower, target, state.gameTime,
        tower.damage, tower.slow,
        "axe", 0, 0,
      ));
    } else {
      // Эльф: стрела к основной цели + веерные стрелы по AoE
      newProjectiles.push(makeProjectile(
        tower, target, state.gameTime,
        tower.damage, tower.slow,
        "arrow", 0, 0,
      ));
      if (tower.aoe > 0) {
        for (const c of state.creeps) {
          if (c.id === target.id) continue;
          const d = Math.hypot(target.position.x - c.position.x, target.position.y - c.position.y);
          if (d <= tower.aoe) {
            newProjectiles.push(makeProjectile(
              tower, c, state.gameTime,
              tower.damage * tower.aoeDmgPct, 0,
              "arrow", 0, 0,
            ));
          }
        }
      }
    }

    return { ...tower, lastAttackTime: state.gameTime };
  });

  return {
    ...state,
    towers,
    projectiles: [...state.projectiles, ...newProjectiles],
  };
}
