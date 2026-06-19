export type Phase = "idle" | "wave" | "victory" | "defeat";

export interface GameState {
  phase: Phase;
  wave: number;
  gold: number;
  lives: number;
  tick: number;        // incremented every frame
  enemies: Enemy[];
  towers: Tower[];
}

export interface Enemy {
  id: string;
  pathIndex: number;   // index into PATH array
  hp: number;
  maxHp: number;
  speed: number;       // path tiles per second
  progress: number;    // 0..1 between current and next tile
}

export interface Tower {
  id: string;
  col: number;
  row: number;
  damage: number;
  range: number;       // in grid cells
  attackSpeed: number; // attacks per second
  cooldown: number;    // ticks remaining until next attack
}

export function createInitialState(): GameState {
  return {
    phase: "idle",
    wave: 0,
    gold: 100,
    lives: 20,
    tick: 0,
    enemies: [],
    towers: [],
  };
}
