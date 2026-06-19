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
  // ── Волны 1–10: T1 ──────────────────────────────────────────────────────
  imp:          { kind: "imp",          name: "Бесёнок",        hp:   8, speed: 1.4, regenPerSec: 0, reward:   2, emoji: "😈" }, // Inferno T1
  goblin:       { kind: "goblin",       name: "Гоблин",         hp:  12, speed: 1.6, regenPerSec: 0, reward:   2, emoji: "👺" }, // Stronghold T1
  pikeman:      { kind: "pikeman",      name: "Копейщик",       hp:  30, speed: 1.1, regenPerSec: 0, reward:   4, emoji: "🛡️" }, // Castle T1
  // ── Волны 1–10: T2 ──────────────────────────────────────────────────────
  wolf_rider:   { kind: "wolf_rider",   name: "Волч. Всадник",  hp:  50, speed: 2.1, regenPerSec: 0, reward:   6, emoji: "🐺" }, // Stronghold T2
  zombie:       { kind: "zombie",       name: "Зомби",          hp:  90, speed: 0.7, regenPerSec: 3, reward:   9, emoji: "💀" }, // Necropolis T2
  // ── Волны 1–10: T3 ──────────────────────────────────────────────────────
  orc:          { kind: "orc",          name: "Орк",            hp: 130, speed: 0.95,regenPerSec: 0, reward:  11, emoji: "🐗" }, // Stronghold T3
  wight:        { kind: "wight",        name: "Призрак",        hp: 185, speed: 1.05,regenPerSec: 3, reward:  14, emoji: "👻" }, // Necropolis T3
  minotaur:     { kind: "minotaur",     name: "Минотавр",       hp: 230, speed: 1.2, regenPerSec: 0, reward:  15, emoji: "🐂" }, // Dungeon T3
  golem:        { kind: "golem",        name: "Голем",          hp: 420, speed: 0.5, regenPerSec: 4, reward:  24, emoji: "🗿" }, // Tower T3
  // ── Волны 11+: T4–T7 (зарезервировано) ─────────────────────────────────
  minotaur_king:{ kind: "minotaur_king",name: "Кор. Минотавров",hp: 250, speed: 1.0, regenPerSec: 0, reward:  50, emoji: "👑" }, // Dungeon T4
  cavalier:     { kind: "cavalier",     name: "Кавалерист",     hp: 180, speed: 1.7, regenPerSec: 0, reward:  20, emoji: "🐴" }, // Castle T5
  pit_lord:     { kind: "pit_lord",     name: "Повелитель Ям",  hp: 300, speed: 1.1, regenPerSec: 0, reward:  30, emoji: "👹" }, // Inferno T5
  titan:        { kind: "titan",        name: "Титан",          hp: 500, speed: 0.8, regenPerSec: 0, reward:  50, emoji: "⚡" }, // Tower T7
  behemoth:     { kind: "behemoth",     name: "Исконный Бегемот",hp:700, speed: 0.6, regenPerSec: 6, reward:  70, emoji: "🐃" }, // Stronghold T7
  black_dragon: { kind: "black_dragon", name: "Чёрный Дракон",  hp:1200, speed: 0.9, regenPerSec: 8, reward: 200, emoji: "🐲" }, // Dungeon T7
};

export interface WaveDef {
  entries: SpawnEntry[];
}

function group(kind: CreepKind, count: number, interval: number): SpawnEntry[] {
  return Array.from({ length: count }, (_, i) => ({ kind, delay: i === 0 ? 0 : interval }));
}

export const WAVE_DEFS: WaveDef[] = [
  // Волна 1 — 40 Бесёнков (Inferno T1): быстрый рой   HP=320  gold=80
  { entries: group("imp", 40, 0.25) },
  // Волна 2 — 50 Гоблинов (Stronghold T1): мелкий рой  HP=600  gold=100
  { entries: group("goblin", 50, 0.25) },
  // Волна 3 — 30 Копейщиков (Castle T1): пехота         HP=900  gold=120
  { entries: group("pikeman", 30, 0.45) },
  // Волна 4 — 26 Волч. Всадников (Stronghold T2): быстрая конница  HP=1300  gold=156
  { entries: group("wolf_rider", 26, 0.35) },
  // Волна 5 — 22 Зомби (Necropolis T2): медленные танки с реген    HP=1980  gold=198
  { entries: group("zombie", 22, 0.7) },
  // Волна 6 — 21 Орк (Stronghold T3): крепкие бойцы               HP=2730  gold=231
  { entries: group("orc", 21, 0.55) },
  // Волна 7 — 19 Призраков (Necropolis T3): реген, средняя скорость HP=3515  gold=266
  { entries: group("wight", 19, 0.6) },
  // Волна 8 — 20 Минотавров (Dungeon T3): быстрые и мощные         HP=4600  gold=300
  { entries: group("minotaur", 20, 0.65) },
  // Волна 9 — 14 Големов (Tower T3): сверхтанки с реген            HP=5880  gold=336
  { entries: group("golem", 14, 1.2) },
  // Волна 10 — 14 Минотавров + 12 Големов: финальная смешанная     HP=8260  gold=498
  { entries: [
    ...group("minotaur", 14, 0.65),
    ...group("golem", 12, 1.2).map((e, i) => i === 0 ? { ...e, delay: 2.0 } : e),
  ]},
];
