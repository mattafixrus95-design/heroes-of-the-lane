import { HERO_MAX_LEVEL } from "./buildings";

export type HeroType = "ivor";

export type HeroAbility =
  | { kind: "aura_damage"; radius: number; basePct: number; perLevelPct: number };

export interface HeroDef {
  type: HeroType;
  name: string;
  race: string;
  className: string;
  damage: number;
  range: number;
  attackSpeed: number;
  foodCost: number;
  buildTime: number;
  ability: HeroAbility;
}

export const HERO_DEFS: Record<HeroType, HeroDef> = {
  ivor: {
    type: "ivor", name: "Ивор",
    race: "Оплот", className: "Лучник",
    damage: 4, range: 3, attackSpeed: 1.0,
    foodCost: 1, buildTime: 1,
    ability: { kind: "aura_damage", radius: 3, basePct: 0.05, perLevelPct: 0.01 },
  },
};

// уровень 1 — +5% урона, каждый следующий уровень — ещё +1%
export function heroAuraPct(level: number, ability: { basePct: number; perLevelPct: number }): number {
  return ability.basePct + (level - 1) * ability.perLevelPct;
}

// +1 к собственному урону героя за каждый уровень выше первого
export function heroDamage(level: number, def: { damage: number }): number {
  return def.damage + (level - 1);
}

// На максимальном уровне герой получает +1 к радиусу атаки
export function heroRange(level: number, def: { range: number }): number {
  return def.range + (level >= HERO_MAX_LEVEL ? 1 : 0);
}
