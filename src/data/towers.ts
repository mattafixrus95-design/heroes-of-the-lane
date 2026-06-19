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
  upgradeTime: number;     // секунд на апгрейд до этого грейда (0 = первый грейд)
  foodUpgradeCost: number; // еда на апгрейд до этого грейда (0 = первый грейд)
}

export interface TowerDef {
  type: TowerType;
  name: string;
  purchaseCost: number;
  buildTime: number; // секунд на постройку
  foodCost: number;  // еда на размещение
  grades: [TowerGrade, TowerGrade];
}

export const TOWER_DEFS: Record<TowerType, TowerDef> = {
  dwarf: {
    type: "dwarf", name: "Гном",
    purchaseCost: 20,
    buildTime: 1,
    foodCost: 1,
    grades: [
      {
        gradeName: "Лесной",
        damage: 3, range: 2, attackSpeed: 1.00, aoe: 0, aoeDmgPct: 1, slow: 0,
        upgradeCost: 0, upgradeTime: 0, foodUpgradeCost: 0,
      },
      {
        gradeName: "Боевой",
        damage: 6, range: 2, attackSpeed: 1.20, aoe: 0, aoeDmgPct: 1, slow: 0.25,
        upgradeCost: 40, upgradeTime: 2, foodUpgradeCost: 0,
      },
    ],
  },
  elf: {
    type: "elf", name: "Эльф",
    purchaseCost: 50,
    buildTime: 3,
    foodCost: 1,
    grades: [
      {
        gradeName: "Лесной",
        damage: 5, range: 3, attackSpeed: 0.75, aoe: 0, aoeDmgPct: 1, slow: 0,
        upgradeCost: 0, upgradeTime: 0, foodUpgradeCost: 0,
      },
      {
        gradeName: "Благородный",
        damage: 8, range: 4, attackSpeed: 1.00, aoe: 1, aoeDmgPct: 0.5, slow: 0,
        upgradeCost: 100, upgradeTime: 5, foodUpgradeCost: 2,
      },
    ],
  },
  dragon: {
    type: "dragon", name: "Дракон",
    purchaseCost: 180,
    buildTime: 7,
    foodCost: 3,
    grades: [
      {
        gradeName: "Зелёный",
        damage: 20, range: 4, attackSpeed: 0.50, aoe: 1, aoeDmgPct: 0.5, slow: 0,
        upgradeCost: 0, upgradeTime: 0, foodUpgradeCost: 0,
      },
      {
        gradeName: "Золотой",
        damage: 30, range: 5, attackSpeed: 0.75, aoe: 2, aoeDmgPct: 0.5, slow: 0,
        upgradeCost: 300, upgradeTime: 9, foodUpgradeCost: 3,
      },
    ],
  },
};
