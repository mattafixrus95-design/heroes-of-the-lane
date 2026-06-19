import type { GameState, WaveStat, FloatingText } from "../engine/gameState";
import { PREP_DURATION } from "../engine/gameState";
import { WAVE_DEFS } from "../../data/waves";

function saveWaveStat(state: GameState): WaveStat[] {
  return [...state.waveStats, {
    wave: state.wave,
    killed: state.currentWaveKilled,
    goldEarned: state.currentWaveGold,
  }];
}

function waveBonus(wave: number): number {
  return 50 + (wave - 1) * 5;
}

function bonusText(bonus: number, gameTime: number): FloatingText {
  return {
    id: `ft-wavebonus-${Date.now()}`,
    text: `+${bonus}💰`,
    x: 9, y: 8,
    color: "#f0c040",
    spawnTime: gameTime,
    duration: 2.5,
  };
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
  const bonus = waveBonus(state.wave);
  const ft = bonusText(bonus, state.gameTime);

  // Все волны пройдены — победа
  if (state.wave >= WAVE_DEFS.length) {
    return {
      ...state,
      phase: "victory",
      gold: state.gold + bonus,
      projectiles: [], splashEffects: [],
      waveStats,
      floatingTexts: [...state.floatingTexts, ft],
    };
  }

  // Переход к следующей волне через 15 сек
  return {
    ...state,
    phase: "prep",
    prepTimer: PREP_DURATION,
    gold: state.gold + bonus,
    projectiles: [], splashEffects: [],
    waveStats,
    floatingTexts: [...state.floatingTexts, ft],
    currentWaveKilled: 0,
    currentWaveGold: 0,
  };
}
