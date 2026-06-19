import type { GameState, SpawnEntry } from "../engine/gameState";
import { WAVE_DEFS } from "../../data/waves";

export function startWave(state: GameState): GameState {
  const waveIdx = state.wave; // 0-indexed: wave 0 = first wave
  let entries: SpawnEntry[];

  if (waveIdx < WAVE_DEFS.length) {
    entries = WAVE_DEFS[waveIdx].entries;
  } else {
    // Beyond wave 5: repeat wave 5
    entries = WAVE_DEFS[WAVE_DEFS.length - 1].entries;
  }

  return {
    ...state,
    phase: "wave",
    wave: state.wave + 1,
    creeps: [],
    spawnQueue: entries,
    spawnTimer: 0,
  };
}
