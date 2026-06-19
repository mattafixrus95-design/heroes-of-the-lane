import type { TowerType } from "../../data/towers";

export type Phase = "idle" | "wave" | "defeat";

export interface Point { x: number; y: number; }

export interface Creep {
  id: string;
  hp: number;
  maxHp: number;
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

// Damage that will be applied when the projectile arrives
export interface PendingDamage {
  targetId: string;    // main creep ID (may be dead on arrival — OK for splash)
  damage: number;      // damage to main target
  slow: number;        // slow factor for main target
  // Fireball only: apply explosion to all creeps near impact point
  explosionAoe?: number;
  explosionDmgPct?: number;
}

export interface Projectile {
  id: string;
  towerType: TowerType;
  fromCol: number;
  fromRow: number;
  toX: number;          // target tile-space x (creep position at fire time)
  toY: number;
  kind: "arrow" | "fireball";
  spawnTime: number;
  duration: number;
  pendingDamage: PendingDamage;
}

// Short-lived visual splash ring shown on fireball impact
export interface SplashEffect {
  id: string;
  x: number;          // tile-space centre
  y: number;
  radius: number;     // tile-space radius (for sizing the ring)
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
  toSpawn: number;
  spawnTimer: number;
}

export const STARTING_GOLD  = 200;
export const STARTING_LIVES = 20;
export const TOTAL_CREEPS   = 30;
export const SPAWN_INTERVAL = 0.5;
export const CREEP_REWARD   = 5;
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
    toSpawn: 0,
    spawnTimer: 0,
  };
}
