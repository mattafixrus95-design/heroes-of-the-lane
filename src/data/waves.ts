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
  // ── Волны 1–3: T1 ───────────────────────────────────────────────────────
  imp:          { kind: "imp",          name: "Бесёнок",        hp:   8, speed: 1.4, regenPerSec:  0, reward:   2, emoji: "😈" }, // Inferno T1
  goblin:       { kind: "goblin",       name: "Гоблин",         hp:  12, speed: 1.6, regenPerSec:  0, reward:   2, emoji: "👺" }, // Stronghold T1
  pikeman:      { kind: "pikeman",      name: "Копейщик",       hp:  21, speed: 1.1, regenPerSec:  0, reward:   5, emoji: "🛡" }, // Castle T1
  // ── Волны 4–5: T2 ───────────────────────────────────────────────────────
  wolf_rider:   { kind: "wolf_rider",   name: "Волч. Всадник",  hp:  33, speed: 2.1, regenPerSec:  0, reward:   8, emoji: "🐺" }, // Stronghold T2
  zombie:       { kind: "zombie",       name: "Зомби",          hp:  50, speed: 0.7, regenPerSec:  3, reward:  12, emoji: "💀" }, // Necropolis T2
  // ── Волны 6–9: T3 ───────────────────────────────────────────────────────
  orc:          { kind: "orc",          name: "Орк",            hp:  72, speed: 0.95,regenPerSec:  0, reward:  18, emoji: "🐗" }, // Stronghold T3
  wight:        { kind: "wight",        name: "Призрак",        hp:  86, speed: 1.05,regenPerSec:  3, reward:  22, emoji: "👻" }, // Necropolis T3
  minotaur:     { kind: "minotaur",     name: "Минотавр",       hp: 130, speed: 1.2, regenPerSec:  0, reward:  33, emoji: "🐂" }, // Dungeon T3
  golem:        { kind: "golem",        name: "Голем",          hp: 155, speed: 0.5, regenPerSec:  4, reward:  39, emoji: "🗿" }, // Tower T3
  // ── Волна 10: T6 ────────────────────────────────────────────────────────
  angel:        { kind: "angel",        name: "Ангел",          hp: 600, speed: 1.5, regenPerSec: 15, reward: 100, emoji: "😇" }, // Castle T6
  // ── Волны 11–20: T4–T7 ──────────────────────────────────────────────────
  ogr:          { kind: "ogr",          name: "Огр",            hp: 330, speed: 1.0, regenPerSec:  0, reward:  65, emoji: "👊" }, // Stronghold T4
  crusader:     { kind: "crusader",     name: "Крестоносец",    hp: 360, speed: 1.2, regenPerSec:  0, reward:  70, emoji: "🐎" }, // Castle T4
  vampire_lord: { kind: "vampire_lord", name: "Вампир Лорд",   hp: 445, speed: 1.3, regenPerSec:  5, reward:  90, emoji: "🌙" }, // Necropolis T5
  pit_lord:     { kind: "pit_lord",     name: "Властелин Ям",  hp: 550, speed: 1.1, regenPerSec:  0, reward: 110, emoji: "👿" }, // Inferno T5
  roc:          { kind: "roc",          name: "Рок",            hp: 690, speed: 1.5, regenPerSec:  0, reward: 140, emoji: "🐦" }, // Stronghold T5
  lich:         { kind: "lich",         name: "Лич",            hp: 760, speed: 0.9, regenPerSec:  8, reward: 150, emoji: "☠" }, // Necropolis T6
  devil:        { kind: "devil",        name: "Дьявол",         hp: 975, speed: 1.4, regenPerSec:  0, reward: 200, emoji: "🔥" }, // Inferno T6
  titan:        { kind: "titan",        name: "Титан",          hp:1285, speed: 0.9, regenPerSec:  0, reward: 260, emoji: "⚡" }, // Tower T7
  black_dragon: { kind: "black_dragon", name: "Чёрный Дракон", hp:1770, speed: 1.1, regenPerSec: 12, reward: 350, emoji: "🐉" }, // Dungeon T7
  archangel:    { kind: "archangel",    name: "Архангел",       hp:2500, speed: 2.0, regenPerSec: 30, reward: 300, emoji: "🌟" }, // Castle T7
};

export interface WaveDef {
  entries: SpawnEntry[];
}

function group(kind: CreepKind, count: number, interval: number): SpawnEntry[] {
  return Array.from({ length: count }, (_, i) => ({ kind, delay: i === 0 ? 0 : interval }));
}

export const WAVE_DEFS: WaveDef[] = [
  // W1  — 36 Бесёнков      HP=288   gold=72
  { entries: group("imp",          36, 0.25) },
  // W2  — 30 Гоблинов      HP=360   gold=60
  { entries: group("goblin",       30, 0.25) },
  // W3  — 20 Копейщиков    HP=420   gold=100
  { entries: group("pikeman",      20, 0.45) },
  // W4  — 15 Волч. Всадн.  HP=495   gold=120
  { entries: group("wolf_rider",   15, 0.35) },
  // W5  — 12 Зомби         HP=600   gold=144
  { entries: group("zombie",       12, 0.70) },
  // W6  — 10 Орков         HP=720   gold=180
  { entries: group("orc",          10, 0.55) },
  // W7  — 10 Призраков     HP=860   gold=220
  { entries: group("wight",        10, 0.60) },
  // W8  —  8 Минотавров    HP=1040  gold=264
  { entries: group("minotaur",      8, 0.65) },
  // W9  —  8 Големов       HP=1240  gold=312
  { entries: group("golem",         8, 1.20) },
  // W10 —  5 Ангелов       HP=3000  gold=500
  { entries: group("angel",         5, 2.50) },
  // W11 — 10 Огров         HP=3300  gold=650
  { entries: group("ogr",          10, 0.80) },
  // W12 — 10 Крестоносцев  HP=3600  gold=700
  { entries: group("crusader",     10, 0.70) },
  // W13 —  9 Вампир Лордов HP=4005  gold=810
  { entries: group("vampire_lord",  9, 0.90) },
  // W14 —  8 Властелинов   HP=4400  gold=880
  { entries: group("pit_lord",      8, 0.90) },
  // W15 —  7 Роков         HP=4830  gold=980
  { entries: group("roc",           7, 1.00) },
  // W16 —  7 Личей         HP=5320  gold=1050
  { entries: group("lich",          7, 1.10) },
  // W17 —  6 Дьяволов      HP=5850  gold=1200
  { entries: group("devil",         6, 1.20) },
  // W18 —  5 Титанов       HP=6425  gold=1300
  { entries: group("titan",         5, 1.50) },
  // W19 —  4 Чёрных Дракона HP=7080 gold=1400
  { entries: group("black_dragon",  4, 2.00) },
  // W20 —  5 Архангелов    HP=12500 gold=1500
  { entries: group("archangel",     5, 2.50) },
];
