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
  // Волны 1-5
  imp:           { kind: "imp",           name: "Бесёнок",         hp:   8, speed: 1.3, regenPerSec: 0, reward:   2, emoji: "😈" },
  pikeman:       { kind: "pikeman",       name: "Копейщик",        hp:  30, speed: 1.0, regenPerSec: 0, reward:   4, emoji: "🛡️" },
  wolf_rider:    { kind: "wolf_rider",    name: "Волч. Всадник",   hp:  22, speed: 2.0, regenPerSec: 0, reward:   5, emoji: "🐺" },
  zombie:        { kind: "zombie",        name: "Зомби",           hp:  70, speed: 0.6, regenPerSec: 2, reward:   8, emoji: "💀" },
  minotaur:      { kind: "minotaur",      name: "Минотавр",        hp:  55, speed: 1.1, regenPerSec: 0, reward:  10, emoji: "🐂" },
  minotaur_king: { kind: "minotaur_king", name: "Кор. Минотавров", hp: 250, speed: 0.9, regenPerSec: 0, reward:  50, emoji: "👑" },
  // Волны 6-10
  cavalier:      { kind: "cavalier",      name: "Кавалерист",      hp:  40, speed: 1.6, regenPerSec: 0, reward:   7, emoji: "🐴" },
  pit_lord:      { kind: "pit_lord",      name: "Повелитель Ям",   hp:  90, speed: 1.0, regenPerSec: 0, reward:  12, emoji: "👹" },
  titan:         { kind: "titan",         name: "Титан",           hp: 160, speed: 0.7, regenPerSec: 0, reward:  18, emoji: "⚡" },
  behemoth:      { kind: "behemoth",      name: "Исконный Бегемот",hp: 200, speed: 0.5, regenPerSec: 4, reward:  22, emoji: "🐃" },
  black_dragon:  { kind: "black_dragon",  name: "Чёрный Дракон",   hp: 500, speed: 0.8, regenPerSec: 5, reward: 150, emoji: "🐲" },
};

export interface WaveDef {
  entries: SpawnEntry[];
}

function group(kind: CreepKind, count: number, interval: number): SpawnEntry[] {
  return Array.from({ length: count }, (_, i) => ({ kind, delay: i === 0 ? 0 : interval }));
}

export const WAVE_DEFS: WaveDef[] = [
  // Волна 1 — 40 Бесёнков (Inferno T1): быстрый рой
  { entries: group("imp", 40, 0.3) },
  // Волна 2 — 25 Копейщиков (Castle T1): стандартная пехота
  { entries: group("pikeman", 25, 0.5) },
  // Волна 3 — 20 Волчьих Всадников (Stronghold T2): быстрая конница
  { entries: group("wolf_rider", 20, 0.4) },
  // Волна 4 — 15 Зомби (Necropolis T2): медленные танки с реген
  { entries: group("zombie", 15, 0.8) },
  // Волна 5 — 10 Минотавров + Король (Dungeon T3/T4)
  { entries: [...group("minotaur", 10, 0.6), { kind: "minotaur_king", delay: 2.0 }] },
  // Волна 6 — 18 Кавалеристов (Castle T5): быстрая тяжёлая конница
  { entries: group("cavalier", 18, 0.4) },
  // Волна 7 — 12 Повелителей Ям (Inferno T5): сильные демоны
  { entries: group("pit_lord", 12, 0.6) },
  // Волна 8 — 8 Титанов (Tower T7): магические великаны
  { entries: group("titan", 8, 1.0) },
  // Волна 9 — 8 Исконных Бегемотов (Stronghold T7): сверхтанки с реген
  { entries: group("behemoth", 8, 1.2) },
  // Волна 10 — 3 Чёрных Дракона (Dungeon T7): финальные боссы
  { entries: [
    { kind: "black_dragon", delay: 0 },
    { kind: "black_dragon", delay: 3.0 },
    { kind: "black_dragon", delay: 3.0 },
  ]},
];
