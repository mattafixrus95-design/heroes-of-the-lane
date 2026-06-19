export type TowerType = "elf" | "dwarf" | "dragon";

export interface TowerGrade {
  gradeName: string;
  emoji: string;
  cssFilter?: string;  // optional CSS filter for visual tinting (gold, silver, etc.)
  damage: number;
  range: number;
  attackSpeed: number;
  aoe: number;
  aoeDmgPct: number;
  slow: number;
  upgradeCost: number;
}

export interface TowerDef {
  type: TowerType;
  name: string;
  purchaseCost: number;
  grades: [TowerGrade, TowerGrade];
}

export const TOWER_DEFS: Record<TowerType, TowerDef> = {
  dwarf: {
    type: "dwarf", name: "Гном",
    purchaseCost: 20,
    grades: [
      {
        gradeName: "Лесной", emoji: "🧌",
        damage: 3, range: 2, attackSpeed: 1.00, aoe: 0, aoeDmgPct: 1, slow: 0, upgradeCost: 0,
      },
      {
        gradeName: "Боевой", emoji: "🥷",
        cssFilter: "grayscale(0.2) brightness(1.5) contrast(1.1)",
        damage: 6, range: 2, attackSpeed: 1.20, aoe: 0, aoeDmgPct: 1, slow: 0.25, upgradeCost: 40,
      },
    ],
  },
  elf: {
    type: "elf", name: "Эльф",
    purchaseCost: 50,
    grades: [
      {
        gradeName: "Лесной", emoji: "🧝",
        damage: 5, range: 3, attackSpeed: 0.75, aoe: 0, aoeDmgPct: 1, slow: 0, upgradeCost: 0,
      },
      {
        gradeName: "Благородный", emoji: "🧝",
        cssFilter: "sepia(0.6) saturate(3) hue-rotate(10deg) brightness(1.2)",
        damage: 8, range: 4, attackSpeed: 1.00, aoe: 1, aoeDmgPct: 0.5, slow: 0, upgradeCost: 100,
      },
    ],
  },
  dragon: {
    type: "dragon", name: "Дракон",
    purchaseCost: 150,
    grades: [
      {
        gradeName: "Зеленый", emoji: "🐲",
        damage: 20, range: 4, attackSpeed: 0.50, aoe: 1, aoeDmgPct: 0.5, slow: 0, upgradeCost: 0,
      },
      {
        gradeName: "Золотой", emoji: "🐉",
        cssFilter: "sepia(1) saturate(8) hue-rotate(5deg) brightness(1.15)",
        damage: 30, range: 5, attackSpeed: 0.75, aoe: 2, aoeDmgPct: 0.5, slow: 0, upgradeCost: 300,
      },
    ],
  },
};

// Helper: get the emoji + filter for a placed tower's current grade
export function gradeEmoji(type: TowerType, gradeIndex: number) {
  const g = TOWER_DEFS[type].grades[gradeIndex];
  return { emoji: g.emoji, filter: g.cssFilter };
}
