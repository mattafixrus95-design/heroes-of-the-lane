import type { TowerType, TowerAbility } from "../../data/towers";
import { TOWN_LEVELS, STARTING_TOWN_LEVEL, STARTING_WOOD, BASE_FOOD_CAPACITY, FARM_FOOD_PER_LEVEL } from "../../data/buildings";

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

export type AbilityKind = "block" | "dodge" | "slow_resist" | "self_heal";

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
  towerType: TowerType;
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
  townLevel: 1 | 2 | 3;
  food: number;
  creeps: Creep[];
  towers: Tower[];
  farm: Farm | null;
  sawmill: Sawmill | null;
  projectiles: Projectile[];
  splashEffects: SplashEffect[];
  floatingTexts: FloatingText[];
  isPaused: boolean;
  gameTime: number;
  spawnQueue: SpawnEntry[];
  spawnTimer: number;
  prepTimer: number;
  waveStats: WaveStat[];
  currentWaveKilled: number;
  currentWaveGold: number;
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
    food: BASE_FOOD_CAPACITY + FARM_FOOD_PER_LEVEL,
    creeps: [],
    towers: [],
    farm: { level: 1, foodProduced: FARM_FOOD_PER_LEVEL, totalInvested: 0, buildTimeRemaining: 0 },
    sawmill: null,
    projectiles: [],
    splashEffects: [],
    floatingTexts: [],
    isPaused: false,
    gameTime: 0,
    spawnQueue: [],
    spawnTimer: 0,
    prepTimer: 0,
    waveStats: [],
    currentWaveKilled: 0,
    currentWaveGold: 0,
  };
}
