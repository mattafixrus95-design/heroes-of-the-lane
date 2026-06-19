import type { GameState, WaveStat } from "../engine/gameState";
import { PREP_DURATION } from "../engine/gameState";
import { WAVE_DEFS } from "../../data/waves";

function saveWaveStat(state: GameState): WaveStat[] {
  return [...state.waveStats, {
    wave: state.wave,
    killed: state.currentWaveKilled,
    goldEarned: state.currentWaveGold,
  }];
}

export function tickWaveEnd(state: GameState): GameState {
  if (state.lives <= 0) {
    return {
      ...state,
      phase: "defeat",
      projectiles: [], splashEffects: [],
      waveStats: saveWaveStat(state),
    };
  }
  if (state.spawnQueue.length > 0 || state.creeps.length > 0) return state;

  const waveStats = saveWaveStat(state);

  // Все 10 волн пройдены — победа
  if (state.wave >= WAVE_DEFS.length) {
    return { ...state, phase: "victory", projectiles: [], splashEffects: [], waveStats };
  }

  // Переход к следующей волне через 15 сек
  return {
    ...state,
    phase: "prep",
    prepTimer: PREP_DURATION,
    projectiles: [], splashEffects: [],
    waveStats,
    currentWaveKilled: 0,
    currentWaveGold: 0,
  };
}
