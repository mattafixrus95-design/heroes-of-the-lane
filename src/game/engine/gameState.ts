import type { TowerType } from "../../data/towers";

export type Phase = "idle" | "wave" | "defeat";

export type CreepKind =
  | "imp" | "pikeman" | "wolf_rider"
  | "zombie" | "minotaur" | "minotaur_king";

export interface SpawnEntry {
  kind: CreepKind;
  delay: number; // seconds to wait after previous spawn before this one
}

export interface Point { x: number; y: number; }

export interface Creep {
  id: string;
  kind: CreepKind;
  hp: number;
  maxHp: number;
  speed: number;       // tiles per second
  regenPerSec: number; // HP per second
  reward: number;      // gold on kill
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
  lastAttackTime: number;
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

export interface GameState {
  phase: Phase;
  wave: number;
  gold: number;
  lives: number;
  creeps: Creep[];
  towers: Tower[];
  projectiles: Projectile[];
  splashEffects: SplashEffect[];
  isPaused: boolean;
  gameTime: number;
  spawnQueue: SpawnEntry[];
  spawnTimer: number;
}

export const STARTING_GOLD  = 200;
export const STARTING_LIVES = 20;
export const SLOW_DURATION  = 1.5;
export const SELL_RATE      = 0.7;

export function createInitialState(): GameState {
  return {
    phase: "idle",
    wave: 0,
    gold: STARTING_GOLD,
    lives: STARTING_LIVES,
    creeps: [],
    towers: [],
    projectiles: [],
    splashEffects: [],
    isPaused: false,
    gameTime: 0,
    spawnQueue: [],
    spawnTimer: 0,
  };
}
