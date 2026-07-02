export type TowerType = "elf" | "dwarf" | "dragon";

export interface TowerGrade {
  gradeName: string;
  damage: number;
  range: number;
  attackSpeed: number;
  aoe: number;
  aoeDmgPct: number;
  slow: number;
  upgradeCost: number;
  upgradeTime: number;
  foodUpgradeCost: number;
}

export interface TowerDef {
  type: TowerType;
  name: string;
  purchaseCost: number;
  buildTime: number;
  foodCost: number;
  grades: [TowerGrade, TowerGrade];
}

export const TOWER_DEFS: Record<TowerType, TowerDef> = {
  dwarf: {
    type: "dwarf", name: "Гном",
    purchaseCost: 15,
    buildTime: 1,
    foodCost: 1,
    grades: [
      {
        gradeName: "Лесной",
        damage: 2, range: 2, attackSpeed: 1.20, aoe: 0, aoeDmgPct: 1, slow: 0,
        upgradeCost: 0, upgradeTime: 0, foodUpgradeCost: 0,
      },
      {
        gradeName: "Боевой",
        damage: 5, range: 2, attackSpeed: 1.50, aoe: 0, aoeDmgPct: 1, slow: 0.25,
        upgradeCost: 35, upgradeTime: 1, foodUpgradeCost: 0,
      },
    ],
  },
  elf: {
    type: "elf", name: "Эльф",
    purchaseCost: 45,
    buildTime: 1,
    foodCost: 1,
    grades: [
      {
        gradeName: "Лесной",
        damage: 3, range: 3, attackSpeed: 1.00, aoe: 0, aoeDmgPct: 1, slow: 0,
        upgradeCost: 0, upgradeTime: 0, foodUpgradeCost: 0,
      },
      {
        gradeName: "Благородный",
        damage: 5, range: 4, attackSpeed: 1.40, aoe: 2, aoeDmgPct: 0.35, slow: 0,
        upgradeCost: 105, upgradeTime: 2, foodUpgradeCost: 2,
      },
    ],
  },
  dragon: {
    type: "dragon", name: "Дракон",
    purchaseCost: 195,
    buildTime: 2,
    foodCost: 3,
    grades: [
      {
        gradeName: "Зелёный",
        damage: 12, range: 4, attackSpeed: 0.75, aoe: 1, aoeDmgPct: 0.5, slow: 0,
        upgradeCost: 0, upgradeTime: 0, foodUpgradeCost: 0,
      },
      {
        gradeName: "Золотой",
        damage: 22, range: 5, attackSpeed: 1.00, aoe: 2, aoeDmgPct: 0.5, slow: 0,
        upgradeCost: 300, upgradeTime: 3, foodUpgradeCost: 4,
      },
    ],
  },
};
