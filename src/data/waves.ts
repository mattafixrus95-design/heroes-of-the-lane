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
  imp:          { kind: "imp",          name: "Бесёнок",       hp:   10, speed: 1.3, regenPerSec:  0, reward:   3, livesLost: 1, abilities: [],                       emoji: "😈" },
  goblin:       { kind: "goblin",       name: "Гоблин",        hp:   12, speed: 1.4, regenPerSec:  0, reward:   3, livesLost: 1, abilities: [],                       emoji: "👺" },
  pikeman:      { kind: "pikeman",      name: "Копейщик",      hp:   12, speed: 1.2, regenPerSec:  0, reward:   3, livesLost: 1, abilities: [],                       emoji: "🛡" },
  wolf_rider:   { kind: "wolf_rider",   name: "Волч. Всадник", hp:   13, speed: 2.0, regenPerSec:  0, reward:   3, livesLost: 1, abilities: [],                       emoji: "🐺" },
  zombie:       { kind: "zombie",       name: "Зомби",         hp:   20, speed: 0.7, regenPerSec:  0, reward:   4, livesLost: 1, abilities: [],                       emoji: "💀" },
  // ── Волны 6–9: T3 ───────────────────────────────────────────────────────
  orc:          { kind: "orc",          name: "Орк",           hp:   15, speed: 1.0, regenPerSec:  0, reward:   4, livesLost: 1, abilities: ["block"],                emoji: "🐗" },
  wight:        { kind: "wight",        name: "Призрак",       hp:   18, speed: 1.3, regenPerSec:  0, reward:   6, livesLost: 1, abilities: ["dodge"],                emoji: "👻" },
  minotaur:     { kind: "minotaur",     name: "Минотавр",      hp:   22, speed: 0.9, regenPerSec:  0, reward:   6, livesLost: 1, abilities: ["block"],                emoji: "🐂" },
  golem:        { kind: "golem",        name: "Голем",         hp:   30, speed: 0.7, regenPerSec:  0, reward:   7, livesLost: 1, abilities: ["slow_resist"],          emoji: "🗿" },
  // ── Волна 10: T6 ────────────────────────────────────────────────────────
  angel:        { kind: "angel",        name: "Ангел",         hp: 1000, speed: 0.5, regenPerSec: 10, reward: 100, livesLost: 7, abilities: [],                       emoji: "😇" },
  // ── Волны 11–20: T4–T7 ──────────────────────────────────────────────────
  ogr:          { kind: "ogr",          name: "Огр",           hp:   20, speed: 0.6, regenPerSec:  0, reward:   5, livesLost: 1, abilities: [],                       emoji: "👊" },
  crusader:     { kind: "crusader",     name: "Крестоносец",   hp:   36, speed: 1.0, regenPerSec:  0, reward:   8, livesLost: 1, abilities: [],                       emoji: "🐎" },
  vampire_lord: { kind: "vampire_lord", name: "Вампир Лорд",  hp:   40, speed: 1.2, regenPerSec:  0, reward:   9, livesLost: 1, abilities: [],                       emoji: "🌙" },
  pit_lord:     { kind: "pit_lord",     name: "Властелин Ям", hp:   50, speed: 0.9, regenPerSec:  0, reward:  11, livesLost: 1, abilities: [],                       emoji: "👿" },
  roc:          { kind: "roc",          name: "Рок",           hp:   45, speed: 1.0, regenPerSec:  0, reward:  10, livesLost: 1, abilities: [],                       emoji: "🐦" },
  lich:         { kind: "lich",         name: "Лич",           hp:   60, speed: 0.6, regenPerSec:  5, reward:  15, livesLost: 1, abilities: ["block"],                emoji: "☠" },
  devil:        { kind: "devil",        name: "Дьявол",        hp:  120, speed: 1.0, regenPerSec:  0, reward:  30, livesLost: 1, abilities: ["dodge"],                emoji: "🔥" },
  titan:        { kind: "titan",        name: "Титан",         hp:  200, speed: 0.7, regenPerSec:  0, reward:  40, livesLost: 1, abilities: ["slow_resist", "block"], emoji: "⚡" },
  black_dragon: { kind: "black_dragon", name: "Чёрный Дракон",hp:  170, speed: 1.3, regenPerSec:  0, reward:  35, livesLost: 1, abilities: [],                       emoji: "🐉" },
  archangel:    { kind: "archangel",    name: "Архангел",      hp: 2500, speed: 0.5, regenPerSec: 20, reward: 150, livesLost:10, abilities: ["self_heal"],            emoji: "🌟" },
};

export interface WaveDef {
  entries: SpawnEntry[];
}

function group(kind: CreepKind, count: number, interval: number): SpawnEntry[] {
  return Array.from({ length: count }, (_, i) => ({ kind, delay: i === 0 ? 0 : interval }));
}

export const WAVE_DEFS: WaveDef[] = [
  // W1  — 30 Бесёнков      HP=300   gold=90
  { entries: group("imp",          30, 0.25) },
  // W2  — 33 Гоблина       HP=396   gold=99
  { entries: group("goblin",       33, 0.25) },
  // W3  — 35 Копейщиков    HP=420   gold=105
  { entries: group("pikeman",      35, 0.40) },
  // W4  — 35 Волч. Всадн.  HP=455   gold=105
  { entries: group("wolf_rider",   35, 0.30) },
  // W5  — 30 Зомби         HP=600   gold=120
  { entries: group("zombie",       30, 0.60) },
  // W6  — 35 Орков         HP=525   gold=140  [block 20%]
  { entries: group("orc",          35, 0.50) },
  // W7  — 30 Призраков     HP=540   gold=180  [dodge 20%]
  { entries: group("wight",        30, 0.55) },
  // W8  — 30 Минотавров    HP=660   gold=180  [block 20%]
  { entries: group("minotaur",     30, 0.60) },
  // W9  — 30 Големов       HP=900   gold=210  [slow resist]
  { entries: group("golem",        30, 1.00) },
  // W10 —  3 Ангела        HP=3000  gold=300  [regen 10/s, -7 жизней]
  { entries: group("angel",         3, 3.00) },
  // W11 — 50 Огров         HP=1000  gold=250
  { entries: group("ogr",          50, 0.40) },
  // W12 — 30 Крестоносцев  HP=1080  gold=240
  { entries: group("crusader",     30, 0.80) },
  // W13 — 30 Вампир Лордов HP=1200  gold=270
  { entries: group("vampire_lord", 30, 0.85) },
  // W14 — 25 Властелинов   HP=1250  gold=275
  { entries: group("pit_lord",     25, 0.90) },
  // W15 — 30 Роков         HP=1350  gold=300
  { entries: group("roc",          30, 0.90) },
  // W16 — 25 Личей         HP=1500  gold=375  [block, regen 5/s]
  { entries: group("lich",         25, 1.00) },
  // W17 — 15 Дьяволов      HP=1800  gold=450  [dodge 20%]
  { entries: group("devil",        15, 1.20) },
  // W18 — 15 Титанов       HP=3000  gold=600  [slow resist, block]
  { entries: group("titan",        15, 1.50) },
  // W19 — 20 Чёрных Драконов HP=3400 gold=700
  { entries: group("black_dragon", 20, 1.80) },
  // W20 —  5 Архангелов    HP=12500 gold=750  [regen 20/s, self_heal, -10 жизней]
  { entries: group("archangel",     5, 3.00) },
];
