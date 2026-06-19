import type { Enemy, GameState } from "../engine/gameState";

let eidCounter = 0;

function makeEnemy(wave: number): Enemy {
  return {
    id: `e-${++eidCounter}`,
    pathIndex: 0,
    hp: 30 + wave * 20,
    maxHp: 30 + wave * 20,
    speed: 1.5 + wave * 0.1, // tiles/sec
    progress: 0,
  };
}

export function spawnWave(state: GameState): GameState {
  const count = 5 + state.wave * 2;
  const enemies: Enemy[] = Array.from({ length: count }, () => makeEnemy(state.wave + 1));
  return {
    ...state,
    phase: "wave",
    wave: state.wave + 1,
    enemies,
  };
}
