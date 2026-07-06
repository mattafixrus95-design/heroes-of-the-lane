import type { GameState, SpawnEntry } from "../engine/gameState";
import { PREP_DURATION } from "../engine/gameState";
import { WAVE_DEFS } from "../../data/waves";
import { GATE_OPEN_SECONDS } from "../../data/map";

// Вызывается нажатием кнопки — уходит в фазу ожидания
export function startWave(state: GameState): GameState {
  return { ...state, phase: "prep", prepTimer: PREP_DURATION };
}

// Вызывается автоматически когда prepTimer достигает 0
export function startWaveInternal(state: GameState): GameState {
  const waveIdx = state.wave; // 0-based
  let entries: SpawnEntry[];
  if (waveIdx < WAVE_DEFS.length) {
    entries = WAVE_DEFS[waveIdx].entries;
  } else {
    entries = WAVE_DEFS[WAVE_DEFS.length - 1].entries;
  }
  return {
    ...state,
    phase: "wave",
    wave: state.wave + 1,
    creeps: [],
    spawnQueue: entries,
    // Первый крип ждёт, пока ворота полностью откроются (см. GateImage.tsx)
    spawnTimer: GATE_OPEN_SECONDS,
    currentWaveKilled: 0,
    currentWaveGold: 0,
  };
}
