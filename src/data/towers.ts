export type TowerType = "elf" | "dwarf" | "dragon";

export interface TowerDef {
  type: TowerType;
  name: string;
  emoji: string;
  damage: number;
  range: number;
  cost: number;
  attackSpeed: number; // attacks per second; timeBetweenAttacks = 1/attackSpeed
  sellValue: number;
  aoe: number;         // 0 = single target; >0 = radius in tiles
}

export const TOWER_DEFS: Record<TowerType, TowerDef> = {
  elf: {
    type: "elf", name: "Эльф", emoji: "🧝",
    damage: 5, range: 4, cost: 50, attackSpeed: 0.75, sellValue: 35, aoe: 0,
  },
  dwarf: {
    type: "dwarf", name: "Гном", emoji: "🪓",
    damage: 3, range: 2, cost: 20, attackSpeed: 1, sellValue: 14, aoe: 0,
  },
  dragon: {
    type: "dragon", name: "Дракон", emoji: "🐉",
    damage: 20, range: 6, cost: 150, attackSpeed: 1.5, sellValue: 105, aoe: 1,
  },
};
