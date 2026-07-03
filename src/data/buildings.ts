export interface ResourceCost {
  gold: number;
  wood: number;
}

export const STARTING_WOOD = 100;

// ── Ферма ─────────────────────────────────────────────────────────────────────
// Количество уровней не ограничено. После последнего значения в таблице
// цена дерева больше не растёт — держится на последнем уровне вечно.
export const FARM_GOLD_COST = 20; // золото — одинаково на каждом грейде
export const FARM_WOOD_COST_BY_LEVEL = [50, 65, 90, 120, 150]; // дерево — растёт с уровнем, дальше держится на 150
export const FARM_BUILD_TIME = 2; // секунд на каждый грейд
export const FARM_FOOD_PER_LEVEL = 15;

// Стоимость постройки/апгрейда фермы ДО указанного уровня (1-based)
export function farmCost(targetLevel: number): ResourceCost {
  const idx = Math.min(targetLevel - 1, FARM_WOOD_COST_BY_LEVEL.length - 1);
  return { gold: FARM_GOLD_COST, wood: FARM_WOOD_COST_BY_LEVEL[idx] };
}

// ── Лесопилка ─────────────────────────────────────────────────────────────────
export const SAWMILL_GOLD_COST = 30; // золото — одинаково на каждом грейде
export const SAWMILL_WOOD_COST_BY_LEVEL = [75, 100, 130, 160, 200, 250, 300]; // дерево — растёт с уровнем
export const SAWMILL_BUILD_TIME = 5; // секунд, всегда одинаково
export const SAWMILL_TICK_INTERVAL = 5; // секунд между тиками дохода
export const SAWMILL_WOOD_PER_LEVEL = 5; // дерева за тик на уровень
export const SAWMILL_MAX_LEVEL = SAWMILL_WOOD_COST_BY_LEVEL.length;

// Стоимость постройки/апгрейда лесопилки ДО указанного уровня (1-based)
export function sawmillCost(targetLevel: number): ResourceCost {
  return { gold: SAWMILL_GOLD_COST, wood: SAWMILL_WOOD_COST_BY_LEVEL[targetLevel - 1] };
}

// ── Город ─────────────────────────────────────────────────────────────────────
export interface TownLevelDef {
  level: 1 | 2 | 3 | 4;
  name: string;
  maxHp: number;
  upgradeCost: ResourceCost | null; // null = стартовый уровень, апгрейд недоступен
  buildTime: number;                // секунд на постройку (0 = стартовый уровень, мгновенно)
  maxBuildTier: number;             // максимальный tier башен, доступных к постройке
  maxUpgradeTier: number;           // максимальный tier башен, доступных к улучшению
}

// HP форта/цитадели/замка не были явно заданы в ТЗ — выбраны как
// разумная прогрессия между Деревней (20) и старым значением Замка (65)
export const TOWN_LEVELS: TownLevelDef[] = [
  { level: 1, name: "Деревня",  maxHp: 20, upgradeCost: null,                     buildTime: 0, maxBuildTier: 4, maxUpgradeTier: 2 },
  { level: 2, name: "Форт",     maxHp: 35, upgradeCost: { gold: 50,  wood: 100 }, buildTime: 4, maxBuildTier: 6, maxUpgradeTier: 4 },
  { level: 3, name: "Цитадель", maxHp: 50, upgradeCost: { gold: 100, wood: 200 }, buildTime: 5, maxBuildTier: 7, maxUpgradeTier: 5 },
  { level: 4, name: "Замок",    maxHp: 70, upgradeCost: { gold: 150, wood: 350 }, buildTime: 6, maxBuildTier: 7, maxUpgradeTier: 7 },
];

export const STARTING_TOWN_LEVEL = 1;
export const BASE_FOOD_CAPACITY = 0; // без фермы еды нет вообще

// ── Таверна ───────────────────────────────────────────────────────────────────
export const TAVERN_COST: ResourceCost = { gold: 50, wood: 50 };
export const TAVERN_BUILD_TIME = 3;

// ── Герои ─────────────────────────────────────────────────────────────────────
export const HERO_HIRE_COST = 150; // золото, фикс. цена найма
export const HERO_MAX_LEVEL = 10;
