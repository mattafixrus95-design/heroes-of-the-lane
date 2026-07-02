import type { GameState, Tower, Creep, Projectile } from "../engine/gameState";

const ARROW_SPEED    = 12;
const FIREBALL_SPEED = 10;

let projCounter = 0;

function dist(tower: Tower, creep: Creep): number {
  return Math.hypot(tower.col - creep.position.x, tower.row - creep.position.y);
}

function towerDist(a: Tower, b: Tower): number {
  return Math.hypot(a.col - b.col, a.row - b.row);
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

// Суммарный бонус к скорости атаки от аур соседних единорогов
function auraBonus(tower: Tower, towers: Tower[]): number {
  let bonus = 0;
  for (const t of towers) {
    if (t.id === tower.id) continue;
    if (t.ability?.kind === "aura_haste" && t.buildTimeRemaining <= 0 && towerDist(t, tower) <= t.ability.radius) {
      bonus += t.ability.pct;
    }
  }
  return bonus;
}

function makeProjectile(
  tower: Tower,
  target: Creep,
  gameTime: number,
  damage: number,
  slow: number,
  kind: "arrow" | "axe" | "fireball",
  extra: {
    explosionAoe?: number;
    explosionDmgPct?: number;
    vulnApply?: { pct: number; duration: number };
    rootApply?: { duration: number };
  } = {},
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
      ...(extra.explosionAoe ? { explosionAoe: extra.explosionAoe, explosionDmgPct: extra.explosionDmgPct } : {}),
      ...(extra.vulnApply ? { vulnApply: extra.vulnApply } : {}),
      ...(extra.rootApply ? { rootApply: extra.rootApply } : {}),
    },
  };
}

export function tickTowerAttack(state: GameState): GameState {
  if (state.creeps.length === 0) return state;

  const newProjectiles: Projectile[] = [];

  const towers = state.towers.map(tower => {
    if (tower.buildTimeRemaining > 0) return tower;
    const effectiveAttackSpeed = tower.attackSpeed * (1 + auraBonus(tower, state.towers));
    if (state.gameTime - tower.lastAttackTime < 1 / effectiveAttackSpeed) return tower;
    const target = findTarget(tower, state.creeps);
    if (!target) return tower;

    const ab = tower.ability;
    const attackCount = tower.attackCount + 1;

    // Дендроид: каждая N-я атака сковывает цель
    const rootApply = ab?.kind === "root" && attackCount % ab.everyNth === 0
      ? { duration: ab.duration }
      : undefined;

    // Кентавр: шанс критического удара
    let damage = tower.damage;
    if (ab?.kind === "crit" && Math.random() < ab.chance) damage *= ab.multiplier;

    if (tower.type === "dragon") {
      const radius = ab?.kind === "aoe" ? ab.radius : 0;
      const dmgPct = ab?.kind === "aoe" ? ab.dmgPct : 0;
      newProjectiles.push(makeProjectile(
        tower, target, state.gameTime, damage, tower.slow, "fireball",
        { explosionAoe: radius, explosionDmgPct: dmgPct },
      ));
    } else if (tower.type === "elf" && ab?.kind === "multishot") {
      // Основная стрела на 100% урона
      newProjectiles.push(makeProjectile(tower, target, state.gameTime, damage, tower.slow, "arrow"));
      // Дополнительные стрелы по ближайшим целям
      const extraTargets = state.creeps
        .filter(c => c.id !== target.id && dist(tower, c) <= tower.range)
        .sort((a, b) => b.pathProgress - a.pathProgress)
        .slice(0, ab.extraTargets);
      const extraDmg = tower.damage * ab.extraDmgPct;
      for (const c of extraTargets) {
        newProjectiles.push(makeProjectile(tower, c, state.gameTime, extraDmg, 0, "arrow"));
      }
    } else if (ab?.kind === "vulnerability") {
      newProjectiles.push(makeProjectile(
        tower, target, state.gameTime, damage, tower.slow, "arrow",
        { vulnApply: { pct: ab.pct, duration: ab.duration } },
      ));
    } else if (tower.type === "dendroid") {
      newProjectiles.push(makeProjectile(
        tower, target, state.gameTime, damage, tower.slow, "axe",
        { rootApply },
      ));
    } else if (tower.type === "dwarf") {
      newProjectiles.push(makeProjectile(tower, target, state.gameTime, damage, tower.slow, "axe"));
    } else {
      // Кентавр, единорог, эльф без апгрейда
      newProjectiles.push(makeProjectile(tower, target, state.gameTime, damage, tower.slow, "arrow"));
    }

    return { ...tower, lastAttackTime: state.gameTime, attackCount };
  });

  return {
    ...state,
    towers,
    projectiles: [...state.projectiles, ...newProjectiles],
  };
}
