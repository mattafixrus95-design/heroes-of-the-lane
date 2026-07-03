import type { GameState, WaveStat, FloatingText } from "../engine/gameState";
import { PREP_DURATION } from "../engine/gameState";
import { WAVE_DEFS } from "../../data/waves";
import { HERO_MAX_LEVEL } from "../../data/buildings";

function saveWaveStat(state: GameState): WaveStat[] {
  return [...state.waveStats, {
    wave: state.wave,
    killed: state.currentWaveKilled,
    goldEarned: state.currentWaveGold,
  }];
}

function waveBonus(wave: number): number {
  return 25 + (wave - 1) * 5;
}

function bonusText(bonus: number, gameTime: number): FloatingText {
  return {
    id: `ft-wavebonus-${Date.now()}`,
    text: `+${bonus}`,
    x: 4.5, y: 3.5,
    color: "#f0c040",
    spawnTime: gameTime,
    duration: 2.5,
    large: true,
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

  // Герои на поле получают уровень за каждую пройденную волну
  const heroes = state.heroes.map(h => ({ ...h, level: Math.min(HERO_MAX_LEVEL, h.level + 1) }));

  // Все волны пройдены — победа
  if (state.wave >= WAVE_DEFS.length) {
    return {
      ...state,
      phase: "victory",
      gold: state.gold + bonus,
      heroes,
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
    heroes,
    projectiles: [], splashEffects: [],
    waveStats,
    floatingTexts: [...state.floatingTexts, ft],
    currentWaveKilled: 0,
    currentWaveGold: 0,
  };
}
