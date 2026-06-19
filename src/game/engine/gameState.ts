import type { TowerType } from "../../data/towers";

export type Phase = "idle" | "wave" | "defeat";

export interface Point { x: number; y: number; }

export interface Creep {
  id: string;
  hp: number;
  maxHp: number;
  pathProgress: number; // continuous 0..PATH.length-1
  position: Point;      // tile-space for rendering
}

export interface Tower {
  id: string;
  type: TowerType;
  col: number;
  row: number;
  damage: number;
  range: number;
  attackSpeed: number;
  cost: number;
  sellValue: number;
  aoe: number;
  lastAttackTime: number; // gameTime (seconds) of last attack
}

export interface GameState {
  phase: Phase;
  wave: number;
  gold: number;
  lives: number;
  creeps: Creep[];
  towers: Tower[];
  isPaused: boolean;
  gameTime: number;   // seconds elapsed (cumulative)
  toSpawn: number;    // creeps remaining to spawn this wave
  spawnTimer: number; // seconds until next spawn
}

export const STARTING_GOLD   = 200;
export const STARTING_LIVES  = 20;
export const TOTAL_CREEPS    = 30;
export const SPAWN_INTERVAL  = 0.5; // one creep every 500 ms
export const CREEP_REWARD    = 5;

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
