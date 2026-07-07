export type TowerType = "centaur" | "dwarf" | "elf" | "pegasus" | "dendroid" | "unicorn" | "dragon";

export type TowerAbility =
  | { kind: "crit";          chance: number; multiplier: number }
  | { kind: "multishot";     extraTargets: number; extraDmgPct: number }
  | { kind: "vulnerability"; pct: number; duration: number }
  | { kind: "root";          everyNth: number; duration: number }
  | { kind: "aura_haste";    radius: number; pct: number }
  | { kind: "aoe";           radius: number; dmgPct: number };

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
  tier: number; // 1-7, определяет доступность по уровню города
  purchaseCost: number;
  buildTime: number;
  foodCost: number;
  grades: [TowerGrade, TowerGrade];
}

export const TOWER_DEFS: Record<TowerType, TowerDef> = {
  centaur: {
    type: "centaur", name: "Кентавр",
    tier: 1,
    purchaseCost: 10,
    buildTime: 1,
    foodCost: 1,
    grades: [
      {
        gradeName: "Лесной",
        damage: 3, range: 3, attackSpeed: 1.30, slow: 0,
        upgradeCost: 0, upgradeTime: 0, foodUpgradeCost: 0,
      },
      {
        gradeName: "Капитан",
        damage: 6, range: 3, attackSpeed: 1.70, slow: 0,
        ability: { kind: "crit", chance: 0.20, multiplier: 2 },
        upgradeCost: 30, upgradeTime: 1, foodUpgradeCost: 0,
      },
    ],
  },
  dwarf: {
    type: "dwarf", name: "Гном",
    tier: 2,
    purchaseCost: 20,
    buildTime: 1,
    foodCost: 1,
    grades: [
      {
        gradeName: "Лесной",
        damage: 4, range: 2, attackSpeed: 1.50, slow: 0,
        upgradeCost: 0, upgradeTime: 0, foodUpgradeCost: 0,
      },
      {
        gradeName: "Боевой",
        damage: 6, range: 3, attackSpeed: 1.80, slow: 0.25,
        upgradeCost: 45, upgradeTime: 1, foodUpgradeCost: 0,
      },
    ],
  },
  elf: {
    type: "elf", name: "Эльф",
    tier: 3,
    purchaseCost: 45,
    buildTime: 1,
    foodCost: 1,
    grades: [
      {
        gradeName: "Лесной",
        damage: 5, range: 3, attackSpeed: 1.20, slow: 0,
        upgradeCost: 0, upgradeTime: 0, foodUpgradeCost: 0,
      },
      {
        gradeName: "Благородный",
        damage: 6, range: 3.5, attackSpeed: 1.50, slow: 0,
        ability: { kind: "multishot", extraTargets: 2, extraDmgPct: 0.40 },
        upgradeCost: 105, upgradeTime: 2, foodUpgradeCost: 2,
      },
    ],
  },
  pegasus: {
    type: "pegasus", name: "Пегас",
    tier: 4,
    purchaseCost: 80,
    buildTime: 2,
    foodCost: 2,
    grades: [
      {
        gradeName: "Лесной",
        damage: 7, range: 3, attackSpeed: 2.00, slow: 0,
        ability: { kind: "vulnerability", pct: 0.15, duration: 2 },
        upgradeCost: 0, upgradeTime: 0, foodUpgradeCost: 0,
      },
      {
        gradeName: "Серебряный",
        damage: 10, range: 4, attackSpeed: 2.30, slow: 0,
        ability: { kind: "vulnerability", pct: 0.30, duration: 3 },
        upgradeCost: 155, upgradeTime: 2, foodUpgradeCost: 3,
      },
    ],
  },
  dendroid: {
    type: "dendroid", name: "Дендроид",
    tier: 5,
    purchaseCost: 100,
    buildTime: 2,
    foodCost: 2,
    grades: [
      {
        gradeName: "Страж",
        damage: 8, range: 2, attackSpeed: 0.80, slow: 0,
        ability: { kind: "root", everyNth: 3, duration: 0.5 },
        upgradeCost: 0, upgradeTime: 0, foodUpgradeCost: 0,
      },
      {
        gradeName: "Солдат",
        damage: 13, range: 3, attackSpeed: 1.00, slow: 0,
        ability: { kind: "root", everyNth: 2, duration: 0.75 },
        upgradeCost: 165, upgradeTime: 2, foodUpgradeCost: 3,
      },
    ],
  },
  unicorn: {
    type: "unicorn", name: "Единорог",
    tier: 6,
    purchaseCost: 195,
    buildTime: 2,
    foodCost: 3,
    grades: [
      {
        gradeName: "Лесной",
        damage: 9, range: 3, attackSpeed: 1.50, slow: 0,
        ability: { kind: "aura_haste", radius: 2.5, pct: 0.15 },
        upgradeCost: 0, upgradeTime: 0, foodUpgradeCost: 0,
      },
      {
        gradeName: "Боевой",
        damage: 15, range: 3.5, attackSpeed: 1.70, slow: 0,
        ability: { kind: "aura_haste", radius: 3.5, pct: 0.20 },
        upgradeCost: 265, upgradeTime: 3, foodUpgradeCost: 3,
      },
    ],
  },
  dragon: {
    type: "dragon", name: "Дракон",
    tier: 7,
    purchaseCost: 215,
    buildTime: 2,
    foodCost: 3,
    grades: [
      {
        gradeName: "Зелёный",
        damage: 11, range: 4, attackSpeed: 1.00, slow: 0,
        ability: { kind: "aoe", radius: 1, dmgPct: 0.5 },
        upgradeCost: 0, upgradeTime: 0, foodUpgradeCost: 0,
      },
      {
        gradeName: "Золотой",
        damage: 18, range: 4.5, attackSpeed: 1.20, slow: 0,
        ability: { kind: "aoe", radius: 2, dmgPct: 0.5 },
        upgradeCost: 340, upgradeTime: 3, foodUpgradeCost: 4,
      },
    ],
  },
};
