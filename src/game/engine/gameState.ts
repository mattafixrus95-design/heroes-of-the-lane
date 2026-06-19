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

export interface Projectile {
  id: string;
  fromCol: number;   // tower tile col
  fromRow: number;   // tower tile row
  toX: number;       // target tile-space x (creep position at fire time)
  toY: number;       // target tile-space y
  kind: "arrow" | "fireball";
  spawnTime: number; // gameTime when fired
  duration: number;  // seconds to reach target
}

export interface GameState {
  phase: Phase;
  wave: number;
  gold: number;
  lives: number;
  creeps: Creep[];
  towers: Tower[];
  projectiles: Projectile[];
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
    isPaused: false,
    gameTime: 0,
    toSpawn: 0,
    spawnTimer: 0,
  };
}
