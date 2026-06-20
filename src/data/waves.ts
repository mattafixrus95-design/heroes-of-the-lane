import type { CreepKind, AbilityKind, SpawnEntry } from "../game/engine/gameState";

export interface CreepDef {
  kind: CreepKind;
  name: string;
  hp: number;
  speed: number;
  regenPerSec: number;
  reward: number;
  livesLost: number;
  abilities: AbilityKind[];
  emoji: string;
}

export const CREEP_DEFS: Record<CreepKind, CreepDef> = {
  // ── Волны 1–5: T1-T2 ────────────────────────────────────────────────────
  imp:          { kind: "imp",          name: "Бесёнок",       hp:   13, speed: 1.3, regenPerSec:  0, reward:   3, livesLost: 1, abilities: [],                       emoji: "😈" },
  goblin:       { kind: "goblin",       name: "Гоблин",        hp:   15, speed: 1.4, regenPerSec:  0, reward:   3, livesLost: 1, abilities: [],                       emoji: "👺" },
  pikeman:      { kind: "pikeman",      name: "Копейщик",      hp:   15, speed: 1.2, regenPerSec:  0, reward:   3, livesLost: 1, abilities: [],                       emoji: "🛡" },
  wolf_rider:   { kind: "wolf_rider",   name: "Волч. Всадник", hp:   16, speed: 2.0, regenPerSec:  0, reward:   3, livesLost: 1, abilities: [],                       emoji: "🐺" },
  zombie:       { kind: "zombie",       name: "Зомби",         hp:   25, speed: 0.7, regenPerSec:  0, reward:   4, livesLost: 1, abilities: [],                       emoji: "💀" },
  // ── Волны 6–9: T3 ───────────────────────────────────────────────────────
  orc:          { kind: "orc",          name: "Орк",           hp:   19, speed: 1.0, regenPerSec:  0, reward:   4, livesLost: 1, abilities: ["block"],                emoji: "🐗" },
  wight:        { kind: "wight",        name: "Призрак",       hp:   22, speed: 1.3, regenPerSec:  0, reward:   6, livesLost: 1, abilities: ["dodge"],                emoji: "👻" },
  minotaur:     { kind: "minotaur",     name: "Минотавр",      hp:   25, speed: 0.9, regenPerSec:  0, reward:   6, livesLost: 1, abilities: ["block"],                emoji: "🐂" },
  golem:        { kind: "golem",        name: "Голем",         hp:   35, speed: 0.7, regenPerSec:  0, reward:   7, livesLost: 1, abilities: ["slow_resist"],          emoji: "🗿" },
  // ── Волна 10: T6 ────────────────────────────────────────────────────────
  angel:        { kind: "angel",        name: "Ангел",         hp:  500, speed: 0.5, regenPerSec:  5, reward: 100, livesLost: 7, abilities: [],                       emoji: "😇" },
  // ── Волны 11–20: T4–T7 ──────────────────────────────────────────────────
  ogr:          { kind: "ogr",          name: "Огр",           hp:   25, speed: 0.6, regenPerSec:  0, reward:   5, livesLost: 1, abilities: [],                       emoji: "👊" },
  crusader:     { kind: "crusader",     name: "Крестоносец",   hp:   40, speed: 1.0, regenPerSec:  0, reward:   8, livesLost: 1, abilities: [],                       emoji: "🐎" },
  vampire_lord: { kind: "vampire_lord", name: "Вампир Лорд",  hp:   45, speed: 1.2, regenPerSec:  0, reward:   9, livesLost: 1, abilities: [],                       emoji: "🌙" },
  pit_lord:     { kind: "pit_lord",     name: "Властелин Ям", hp:   55, speed: 0.9, regenPerSec:  0, reward:  11, livesLost: 1, abilities: [],                       emoji: "👿" },
  roc:          { kind: "roc",          name: "Рок",           hp:   50, speed: 1.0, regenPerSec:  0, reward:  10, livesLost: 1, abilities: [],                       emoji: "🐦" },
  lich:         { kind: "lich",         name: "Лич",           hp:   65, speed: 0.6, regenPerSec:  5, reward:  15, livesLost: 1, abilities: ["block"],                emoji: "☠" },
  devil:        { kind: "devil",        name: "Дьявол",        hp:  130, speed: 1.0, regenPerSec:  0, reward:  30, livesLost: 1, abilities: ["dodge"],                emoji: "🔥" },
  titan:        { kind: "titan",        name: "Титан",         hp:  220, speed: 0.7, regenPerSec:  0, reward:  40, livesLost: 1, abilities: ["slow_resist", "block"], emoji: "⚡" },
  black_dragon: { kind: "black_dragon", name: "Чёрный Дракон",hp:  185, speed: 1.3, regenPerSec:  0, reward:  35, livesLost: 1, abilities: [],                       emoji: "🐉" },
  archangel:    { kind: "archangel",    name: "Архангел",      hp: 2500, speed: 0.5, regenPerSec: 10, reward: 150, livesLost:10, abilities: ["self_heal"],            emoji: "🌟" },
};

export interface WaveDef {
  entries: SpawnEntry[];
  recommended: number;
}

function group(kind: CreepKind, count: number, interval: number): SpawnEntry[] {
  return Array.from({ length: count }, (_, i) => ({ kind, delay: i === 0 ? 0 : interval }));
}

export const WAVE_DEFS: WaveDef[] = [
  // W1  — 30 Бесёнков      HP=390   gold=90   rec=150
  { entries: group("imp",           30, 0.25), recommended: 150 },
  // W2  — 33 Гоблина       HP=495   gold=99   rec=300
  { entries: group("goblin",        33, 0.25), recommended: 300 },
  // W3  — 35 Копейщиков    HP=525   gold=105  rec=450
  { entries: group("pikeman",       35, 0.40), recommended: 450 },
  // W4  — 35 Волч. Всадн.  HP=560   gold=105  rec=600
  { entries: group("wolf_rider",    35, 0.30), recommended: 600 },
  // W5  — 30 Зомби         HP=750   gold=120  rec=750
  { entries: group("zombie",        30, 0.60), recommended: 750 },
  // W6  — 35 Орков         HP=665   gold=140  rec=900   [block]
  { entries: group("orc",           35, 0.50), recommended: 900 },
  // W7  — 30 Призраков     HP=660   gold=180  rec=1000  [dodge]
  { entries: group("wight",         30, 0.55), recommended: 1000 },
  // W8  — 30 Минотавров    HP=750   gold=180  rec=1100  [block]
  { entries: group("minotaur",      30, 0.60), recommended: 1100 },
  // W9  — 30 Големов       HP=1050  gold=210  rec=1300  [slow resist]
  { entries: group("golem",         30, 1.00), recommended: 1300 },
  // W10 —  3 Ангела        HP=1500  gold=300  rec=1500  [regen 5/s, -7 жизней]
  { entries: group("angel",          3, 3.00), recommended: 1500 },
  // W11 — 50 Огров         HP=1250  gold=250  rec=1700
  { entries: group("ogr",           50, 0.40), recommended: 1700 },
  // W12 — 30 Крестоносцев  HP=1200  gold=240  rec=1900
  { entries: group("crusader",      30, 0.80), recommended: 1900 },
  // W13 — 30 Вампир Лордов HP=1350  gold=270  rec=2100
  { entries: group("vampire_lord",  30, 0.85), recommended: 2100 },
  // W14 — 25 Властелинов   HP=1375  gold=275  rec=2300
  { entries: group("pit_lord",      25, 0.90), recommended: 2300 },
  // W15 — 30 Роков         HP=1500  gold=300  rec=2500
  { entries: group("roc",           30, 0.90), recommended: 2500 },
  // W16 — 25 Личей         HP=1625  gold=375  rec=2700  [block, regen 5/s]
  { entries: group("lich",          25, 1.00), recommended: 2700 },
  // W17 — 15 Дьяволов      HP=1950  gold=450  rec=2900  [dodge]
  { entries: group("devil",         15, 1.20), recommended: 2900 },
  // W18 — 15 Титанов       HP=3300  gold=600  rec=3100  [slow resist, block]
  { entries: group("titan",         15, 1.50), recommended: 3100 },
  // W19 — 20 Чёрных Драконов HP=3700 gold=700 rec=3300
  { entries: group("black_dragon",  20, 1.80), recommended: 3300 },
  // W20 —  5 Архангелов    HP=12500 gold=750  rec=3500  [regen 10/s, self_heal, -10 жизней]
  { entries: group("archangel",      5, 3.00), recommended: 3500 },
];
