export type TowerType = "elf" | "dwarf" | "dragon";

export type TowerAbility =
  | { kind: "multishot"; arrows: number; dmgPct: number }
  | { kind: "aoe";       radius: number; dmgPct: number };

export interface TowerGrade {
  gradeName: string;
  damage: number;
  range: number;
  attackSpeed: number;
  ability?: TowerAbility;
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
        damage: 2, range: 2, attackSpeed: 1.20, slow: 0,
        upgradeCost: 0, upgradeTime: 0, foodUpgradeCost: 0,
      },
      {
        gradeName: "Боевой",
        damage: 4, range: 2, attackSpeed: 1.50, slow: 0.25,
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
        damage: 3, range: 3, attackSpeed: 1.00, slow: 0,
        upgradeCost: 0, upgradeTime: 0, foodUpgradeCost: 0,
      },
      {
        gradeName: "Благородный",
        damage: 5, range: 4, attackSpeed: 1.40, slow: 0,
        ability: { kind: "multishot", arrows: 5, dmgPct: 0.40 },
        upgradeCost: 105, upgradeTime: 2, foodUpgradeCost: 2,
      },
    ],
  },
  dragon: {
    type: "dragon", name: "Дракон",
    purchaseCost: 205,
    buildTime: 2,
    foodCost: 3,
    grades: [
      {
        gradeName: "Зелёный",
        damage: 11, range: 4, attackSpeed: 0.75, slow: 0,
        ability: { kind: "aoe", radius: 1, dmgPct: 0.5 },
        upgradeCost: 0, upgradeTime: 0, foodUpgradeCost: 0,
      },
      {
        gradeName: "Золотой",
        damage: 19, range: 5, attackSpeed: 1.00, slow: 0,
        ability: { kind: "aoe", radius: 2, dmgPct: 0.5 },
        upgradeCost: 300, upgradeTime: 3, foodUpgradeCost: 4,
      },
    ],
  },
};
