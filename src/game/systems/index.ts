import type { GameState } from "../engine/gameState";
import { tickCreepSpawn } from "./creepSpawn";
import { tickEnemyMovement } from "./enemyMovement";
import { tickTowerAttack } from "./towerAttack";
import { tickHeroAttack } from "./heroAttack";
import { tickProjectiles } from "./projectiles";
import { tickWaveEnd } from "./waveEnd";
import { tickBuildTimer } from "./buildTimer";
import { tickFloatingTexts } from "./floatingTexts";
import { tickPrepCountdown } from "./prepCountdown";

export function tickSystems(state: GameState, dt: number): GameState {
  let s = { ...state, gameTime: state.gameTime + dt };
  s = tickBuildTimer(s, dt);
  s = tickCreepSpawn(s, dt);
  s = tickEnemyMovement(s, dt);
  s = tickTowerAttack(s);
  s = tickHeroAttack(s);
  s = tickProjectiles(s);
  s = tickWaveEnd(s);
  s = tickFloatingTexts(s);
  return s;
}

export function tickPrepSystems(state: GameState, dt: number): GameState {
  let s = { ...state, gameTime: state.gameTime + dt };
  s = tickBuildTimer(s, dt);
  s = tickPrepCountdown(s, dt);
  s = tickFloatingTexts(s);
  return s;
}

// Стройка/добыча дерева намеренно не тикают в idle — экономика игры
// стартует только по кнопке "Начать" (первый переход в prep).
export function tickIdleSystems(state: GameState, dt: number): GameState {
  return tickFloatingTexts({ ...state, gameTime: state.gameTime + dt });
}
