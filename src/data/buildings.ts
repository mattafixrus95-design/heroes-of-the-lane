export interface ResourceCost {
  gold: number;
  wood: number;
}

export const STARTING_WOOD = 100;

// ── Ферма ─────────────────────────────────────────────────────────────────────
// Один и тот же коэффициент для постройки и каждого следующего улучшения.
// Количество уровней не ограничено.
export const FARM_COST: ResourceCost = { gold: 20, wood: 50 };
export const FARM_BUILD_TIME = 2; // секунд на каждый грейд
export const FARM_FOOD_PER_LEVEL = 15;

// ── Лесопилка ─────────────────────────────────────────────────────────────────
export const SAWMILL_COST: ResourceCost = { gold: 30, wood: 75 };
export const SAWMILL_BUILD_TIME = 5; // секунд, всегда одинаково
export const SAWMILL_TICK_INTERVAL = 5; // секунд между тиками дохода
export const SAWMILL_WOOD_PER_LEVEL = 5; // дерева за тик на уровень
export const SAWMILL_MAX_LEVEL = 7;

// ── Город ─────────────────────────────────────────────────────────────────────
export interface TownLevelDef {
  level: 1 | 2 | 3;
  name: string;
  maxHp: number;
  upgradeCost: ResourceCost | null; // null = стартовый уровень, апгрейд недоступен
  maxBuildTier: number;             // максимальный tier башен, доступных к постройке
  maxUpgradeTier: number;           // максимальный tier башен, доступных к улучшению
}

export const TOWN_LEVELS: TownLevelDef[] = [
  { level: 1, name: "Деревня",  maxHp: 30, upgradeCost: null,                     maxBuildTier: 5, maxUpgradeTier: 3 },
  { level: 2, name: "Цитадель", maxHp: 45, upgradeCost: { gold: 50,  wood: 200 }, maxBuildTier: 7, maxUpgradeTier: 5 },
  { level: 3, name: "Замок",    maxHp: 65, upgradeCost: { gold: 100, wood: 500 }, maxBuildTier: 7, maxUpgradeTier: 7 },
];

export const STARTING_TOWN_LEVEL = 1;
export const BASE_FOOD_CAPACITY = 0; // без фермы еды нет вообще
