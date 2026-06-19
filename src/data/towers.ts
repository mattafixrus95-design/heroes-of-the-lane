export type TowerType = "elf" | "dwarf" | "dragon";

export interface TowerGrade {
  gradeName: string;
  damage: number;
  range: number;
  attackSpeed: number; // attacks per second
  aoe: number;         // splash radius in tiles (0 = none)
  aoeDmgPct: number;   // fraction of damage for AoE targets (1 = full, 0.5 = 50%)
  slow: number;        // speed reduction fraction for main target (0 = none, 0.25 = 25%)
  upgradeCost: number; // 0 for base grade
}

export interface TowerDef {
  type: TowerType;
  name: string;
  emoji: string;
  purchaseCost: number;
  grades: [TowerGrade, TowerGrade]; // [base, upgraded]
}

export const TOWER_DEFS: Record<TowerType, TowerDef> = {
  dwarf: {
    type: "dwarf", name: "Гном", emoji: "🪓",
    purchaseCost: 20,
    grades: [
      { gradeName: "Лесной", damage: 3, range: 2, attackSpeed: 1.00, aoe: 0, aoeDmgPct: 1,   slow: 0,    upgradeCost: 0  },
      { gradeName: "Боевой", damage: 6, range: 2, attackSpeed: 1.20, aoe: 0, aoeDmgPct: 1,   slow: 0.25, upgradeCost: 40 },
    ],
  },
  elf: {
    type: "elf", name: "Эльф", emoji: "🧝",
    purchaseCost: 50,
    grades: [
      { gradeName: "Лесной",      damage: 5, range: 3, attackSpeed: 0.75, aoe: 0, aoeDmgPct: 1,   slow: 0, upgradeCost: 0   },
      { gradeName: "Благородный", damage: 8, range: 4, attackSpeed: 1.00, aoe: 1, aoeDmgPct: 0.5, slow: 0, upgradeCost: 100 },
    ],
  },
  dragon: {
    type: "dragon", name: "Дракон", emoji: "🐉",
    purchaseCost: 150,
    grades: [
      { gradeName: "Зеленый", damage: 20, range: 4, attackSpeed: 0.50, aoe: 1, aoeDmgPct: 0.5, slow: 0, upgradeCost: 0   },
      { gradeName: "Золотой", damage: 30, range: 5, attackSpeed: 0.75, aoe: 2, aoeDmgPct: 0.5, slow: 0, upgradeCost: 300 },
    ],
  },
};
