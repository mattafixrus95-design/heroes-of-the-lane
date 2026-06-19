import type { CreepKind, SpawnEntry } from "../game/engine/gameState";

export interface CreepDef {
  kind: CreepKind;
  name: string;
  hp: number;
  speed: number;
  regenPerSec: number;
  reward: number;
  emoji: string;
}

export const CREEP_DEFS: Record<CreepKind, CreepDef> = {
  imp:           { kind: "imp",           name: "Бесёнок",         hp:  8,  speed: 1.3, regenPerSec: 0, reward:  2, emoji: "😈" },
  pikeman:       { kind: "pikeman",       name: "Копейщик",        hp: 30,  speed: 1.0, regenPerSec: 0, reward:  4, emoji: "🛡️" },
  wolf_rider:    { kind: "wolf_rider",    name: "Волч. Всадник",   hp: 22,  speed: 2.0, regenPerSec: 0, reward:  5, emoji: "🐺" },
  zombie:        { kind: "zombie",        name: "Зомби",           hp: 70,  speed: 0.6, regenPerSec: 2, reward:  8, emoji: "💀" },
  minotaur:      { kind: "minotaur",      name: "Минотавр",        hp: 55,  speed: 1.1, regenPerSec: 0, reward: 10, emoji: "🐂" },
  minotaur_king: { kind: "minotaur_king", name: "Кор. Минотавров", hp: 250, speed: 0.9, regenPerSec: 0, reward: 50, emoji: "👑" },
};

export interface WaveDef {
  entries: SpawnEntry[];
}

function group(kind: CreepKind, count: number, interval: number): SpawnEntry[] {
  return Array.from({ length: count }, (_, i) => ({ kind, delay: i === 0 ? 0 : interval }));
}

export const WAVE_DEFS: WaveDef[] = [
  // Wave 1 — 40 Imps (Inferno T1): fast swarm
  { entries: group("imp", 40, 0.3) },
  // Wave 2 — 25 Pikemen (Castle T1): standard infantry
  { entries: group("pikeman", 25, 0.5) },
  // Wave 3 — 20 Wolf Riders (Stronghold T2): fast cavalry
  { entries: group("wolf_rider", 20, 0.4) },
  // Wave 4 — 15 Walking Dead (Necropolis T2): slow tanks with regeneration
  { entries: group("zombie", 15, 0.8) },
  // Wave 5 — 10 Minotaurs + Minotaur King boss (Dungeon T3/T4)
  {
    entries: [
      ...group("minotaur", 10, 0.6),
      { kind: "minotaur_king", delay: 2.0 },
    ],
  },
];
