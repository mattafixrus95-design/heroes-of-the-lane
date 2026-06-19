import type { TowerType } from "../../data/towers";

export type Phase = "idle" | "wave" | "defeat";

export interface Point { x: number; y: number; }

export interface Creep {
  id: string;
  hp: number;
  maxHp: number;
  pathProgress: number;
  position: Point;
  slowFactor: number; // 0 = not slowed, 0.25 = 25% slower
  slowTimer: number;  // seconds remaining on slow effect
}

export interface Tower {
  id: string;
  type: TowerType;
  col: number;
  row: number;
  gradeIndex: number;    // 0 = base, 1 = upgraded
  damage: number;
  range: number;
  attackSpeed: number;
  aoe: number;
  aoeDmgPct: number;
  slow: number;
  totalInvested: number; // gold spent (purchase + upgrades), used for sell calculation
  lastAttackTime: number;
}

export interface GameState {
  phase: Phase;
  wave: number;
  gold: number;
  lives: number;
  creeps: Creep[];
  towers: Tower[];
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
export const SLOW_DURATION  = 1.5; // seconds a slow effect lasts
export const SELL_RATE      = 0.7; // 70% refund

export function createInitialState(): GameState {
  return {
    phase: "idle",
    wave: 0,
    gold: STARTING_GOLD,
    lives: STARTING_LIVES,
    creeps: [],
    towers: [],
    isPaused: false,
    gameTime: 0,
    toSpawn: 0,
    spawnTimer: 0,
  };
}
