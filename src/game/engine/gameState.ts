import type { TowerType } from "../../data/towers";

export type Phase = "idle" | "prep" | "wave" | "defeat" | "victory";

export type CreepKind =
  | "imp" | "pikeman" | "wolf_rider"
  | "zombie" | "minotaur" | "minotaur_king"
  | "cavalier" | "pit_lord" | "titan" | "behemoth" | "black_dragon";

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
  pathProgress: number;
  position: Point;
  slowFactor: number;
  slowTimer: number;
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
  aoe: number;
  aoeDmgPct: number;
  slow: number;
  totalInvested: number;
  foodSpent: number;
  lastAttackTime: number;
  buildTimeRemaining: number; // > 0 = строится, атаковать нельзя
}

export interface Farm {
  id: string;
  col: number;
  row: number;
  foodProduced: number;  // суммарно еды выдано
  totalInvested: number; // суммарно потрачено золота
}

export interface PendingDamage {
  targetId: string;
  damage: number;
  slow: number;
  explosionAoe?: number;
  explosionDmgPct?: number;
}

export interface Projectile {
  id: string;
  towerType: TowerType;
  fromCol: number;
  fromRow: number;
  toX: number;
  toY: number;
  kind: "arrow" | "fireball";
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
  lives: number;
  food: number;
  creeps: Creep[];
  towers: Tower[];
  farms: Farm[];
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

export const STARTING_GOLD        = 200;
export const STARTING_LIVES       = 20;
export const STARTING_FOOD        = 15;
export const SLOW_DURATION        = 1.5;
export const SELL_RATE            = 0.7;
export const PREP_DURATION        = 15;
export const FARM_COST            = 50;
export const FARM_FOOD_PER_LEVEL  = 15;
export const FARM_UPGRADE_COST    = 50;

export function createInitialState(): GameState {
  return {
    phase: "idle",
    wave: 0,
    gold: STARTING_GOLD,
    lives: STARTING_LIVES,
    food: STARTING_FOOD,
    creeps: [],
    towers: [],
    farms: [],
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
