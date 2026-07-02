import type { GameState, Tower, Creep, Projectile } from "../engine/gameState";

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
  explosionAoe = 0,
  explosionDmgPct = 0,
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
      ...(explosionAoe > 0 ? { explosionAoe, explosionDmgPct } : {}),
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

    const ab = tower.ability;

    if (tower.type === "dragon") {
      const radius = ab?.kind === "aoe" ? ab.radius : 0;
      const dmgPct = ab?.kind === "aoe" ? ab.dmgPct : 0;
      newProjectiles.push(makeProjectile(
        tower, target, state.gameTime,
        tower.damage, tower.slow,
        "fireball", radius, dmgPct,
      ));
    } else if (tower.type === "dwarf") {
      newProjectiles.push(makeProjectile(
        tower, target, state.gameTime,
        tower.damage, tower.slow,
        "axe",
      ));
    } else {
      // Эльф: базовый — одна стрела; Благородный — мультишот N стрел
      if (ab?.kind === "multishot") {
        const inRange = state.creeps
          .filter(c => dist(tower, c) <= tower.range)
          .sort((a, b) => b.pathProgress - a.pathProgress)
          .slice(0, ab.arrows);
        const dmg = tower.damage * ab.dmgPct;
        for (const c of inRange) {
          newProjectiles.push(makeProjectile(tower, c, state.gameTime, dmg, 0, "arrow"));
        }
      } else {
        newProjectiles.push(makeProjectile(
          tower, target, state.gameTime,
          tower.damage, tower.slow,
          "arrow",
        ));
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
