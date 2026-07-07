import type { TowerType, TowerAbility } from "../../data/towers";
import type { HeroType } from "../../data/heroes";
import { TOWN_LEVELS, STARTING_TOWN_LEVEL, STARTING_WOOD, BASE_FOOD_CAPACITY, FARM_FOOD_PER_LEVEL, SAWMILL_TICK_INTERVAL } from "../../data/buildings";

export type Phase = "idle" | "prep" | "wave" | "defeat" | "victory";

export type CreepKind =
  // Волны 1-9 (T1-T3)
  | "imp" | "goblin" | "pikeman"
  | "wolf_rider" | "zombie"
  | "orc" | "wight" | "minotaur" | "golem"
  // Волна 10 (T6)
  | "angel"
  // Волны 11-20 (T4-T7)
  | "ogr" | "crusader" | "vampire_lord" | "pit_lord" | "roc"
  | "lich" | "devil" | "titan" | "black_dragon" | "archangel";

export type AbilityKind = "block" | "dodge" | "slow_resist" | "self_heal" | "root_resist";

export interface SpawnEntry {
  kind: CreepKind;
  delay: number;
}

export interface Point { x: number; y: number; }

export interface Creep {
  id: string;
  kind: CreepKind;
  hp: number;
  maxHp: number;
  speed: number;
  regenPerSec: number;
  reward: number;
  livesLost: number;
  pathProgress: number;
  position: Point;
  slowFactor: number;
  slowTimer: number;
  vulnPct: number;
  vulnTimer: number;
  rootTimer: number;
  abilities: AbilityKind[];
  selfHealUsed: boolean;
  healTimer: number;
}

export interface Tower {
  id: string;
  type: TowerType;
  col: number;
  row: number;
  gradeIndex: number;
  damage: number;
  range: number;
  attackSpeed: number;
  ability?: TowerAbility;
  slow: number;
  totalInvested: number;
  foodSpent: number;
  lastAttackTime: number;
  attackCount: number;
  buildTimeRemaining: number; // > 0 = строится, атаковать нельзя
}

export interface Farm {
  level: number;              // 1, 2, 3... (0 = ещё не построена)
  foodProduced: number;       // суммарный вклад в макс. еду = level * FARM_FOOD_PER_LEVEL
  totalInvested: number;
  buildTimeRemaining: number; // > 0 = строится
}

export interface Sawmill {
  level: number;              // 1..SAWMILL_MAX_LEVEL (0 = ещё не построена)
  totalInvested: number;
  buildTimeRemaining: number; // > 0 = строится
  tickTimer: number;          // секунд до следующего тика дохода
}

// Герои хранятся отдельно от башен — это принципиально другая сущность
// (не продаётся, не грейдится обычным способом, растёт уровнем от волн).
export interface Hero {
  id: string;
  type: HeroType;
  col: number;
  row: number;
  level: number;              // 1..HERO_MAX_LEVEL, растёт по волнам
  foodSpent: number;
  lastAttackTime: number;
  buildTimeRemaining: number; // > 0 = только что поставлен, ещё не атакует
}

export interface HeroOffer {
  type: HeroType;
}

export interface Tavern {
  buildTimeRemaining: number; // > 0 = строится
  offers: HeroOffer[];        // сейчас всегда максимум 1 — задел под будущий список из 3
}

export interface PendingDamage {
  targetId: string;
  damage: number;
  slow: number;
  explosionAoe?: number;
  explosionDmgPct?: number;
  vulnApply?: { pct: number; duration: number };
  rootApply?: { duration: number };
}

export interface Projectile {
  id: string;
  towerType: TowerType | HeroType;
  fromCol: number;
  fromRow: number;
  toX: number;
  toY: number;
  kind: "arrow" | "axe" | "fireball";
  spawnTime: number;
  duration: number;
  pendingDamage: PendingDamage;
}

export interface SplashEffect {
  id: string;
  x: number;
  y: number;
  radius: number;
  spawnTime: number;
  duration: number;
}

// Анимация смерти крипа (пока используется только для Беса — см. impFrames.ts).
export interface DeathEffect {
  id: string;
  kind: CreepKind;
  x: number;
  y: number;
  pathProgress: number;
  spawnTime: number;
  duration: number;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number; // тайловые координаты
  y: number;
  color: string;
  spawnTime: number;
  duration: number;
  large?: boolean;
}

export interface WaveStat {
  wave: number;
  killed: number;
  goldEarned: number;
}

export interface GameState {
  phase: Phase;
  wave: number;
  gold: number;
  wood: number;
  lives: number;
  maxLives: number;
  townLevel: 1 | 2 | 3 | 4;
  townBuildTimeRemaining: number; // > 0 = город строится (апгрейд ещё не завершён)
  food: number;
  creeps: Creep[];
  towers: Tower[];
  heroes: Hero[];
  farm: Farm | null;
  sawmill: Sawmill | null;
  tavern: Tavern | null;
  projectiles: Projectile[];
  splashEffects: SplashEffect[];
  deathEffects: DeathEffect[];
  floatingTexts: FloatingText[];
  isPaused: boolean;
  gameTime: number;
  spawnQueue: SpawnEntry[];
  spawnTimer: number;
  prepTimer: number;
  waveStats: WaveStat[];
  currentWaveKilled: number;
  currentWaveGold: number;
  terrainSeed: number;         // фикс. при старте игры — по нему выбирается вариант травы и угла дороги на клетку
}

export const STARTING_GOLD  = 200;
export const STARTING_LIVES = TOWN_LEVELS[0].maxHp;
export const SLOW_DURATION  = 1.5;
export const SELL_RATE      = 0.7;
export const PREP_DURATION  = 15;

// Максимальный запас еды: база (без фермы) + вклад фермы
export function maxFood(state: GameState): number {
  return BASE_FOOD_CAPACITY + (state.farm?.foodProduced ?? 0);
}

export function usedFood(state: GameState): number {
  return maxFood(state) - state.food;
}

export function createInitialState(): GameState {
  return {
    phase: "idle",
    wave: 0,
    gold: STARTING_GOLD,
    wood: STARTING_WOOD,
    lives: STARTING_LIVES,
    maxLives: STARTING_LIVES,
    townLevel: STARTING_TOWN_LEVEL,
    townBuildTimeRemaining: 0,
    food: BASE_FOOD_CAPACITY + FARM_FOOD_PER_LEVEL,
    creeps: [],
    towers: [],
    heroes: [],
    farm: { level: 1, foodProduced: FARM_FOOD_PER_LEVEL, totalInvested: 0, buildTimeRemaining: 0 },
    sawmill: { level: 1, totalInvested: 0, buildTimeRemaining: 0, tickTimer: SAWMILL_TICK_INTERVAL },
    tavern: { buildTimeRemaining: 0, offers: [{ type: "ivor" }] },
    projectiles: [],
    splashEffects: [],
    deathEffects: [],
    floatingTexts: [],
    isPaused: false,
    gameTime: 0,
    spawnQueue: [],
    spawnTimer: 0,
    prepTimer: 0,
    waveStats: [],
    currentWaveKilled: 0,
    currentWaveGold: 0,
    terrainSeed: Math.floor(Math.random() * 1_000_000),
  };
}

// Режим разработчика: безлимитные ресурсы/жизни для ручного тестирования
// фич — не влияет на обычную игру, включается отдельной кнопкой в главном
// меню (см. MainMenu.tsx).
export const DEV_RESOURCE_AMOUNT = 9999;

export function createDevInitialState(): GameState {
  const state = createInitialState();
  return {
    ...state,
    gold: DEV_RESOURCE_AMOUNT,
    wood: DEV_RESOURCE_AMOUNT,
    lives: DEV_RESOURCE_AMOUNT,
    maxLives: DEV_RESOURCE_AMOUNT,
    food: DEV_RESOURCE_AMOUNT,
    farm: state.farm && { ...state.farm, foodProduced: DEV_RESOURCE_AMOUNT },
  };
}

// Прыжок на волну N (1-based) для ручного тестирования: возвращает игру
// в idle с нужным номером волны — дальше игрок жмёт "Начать" как обычно.
export function jumpToWave(state: GameState, waveNumber: number): GameState {
  return {
    ...state,
    phase: "idle",
    wave: waveNumber - 1,
    creeps: [],
    spawnQueue: [],
    spawnTimer: 0,
    prepTimer: 0,
    isPaused: false,
  };
}
