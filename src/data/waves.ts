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
  pikeman:      { kind: "pikeman",      name: "Копейщик",      hp:   16, speed: 1.2, regenPerSec:  0, reward:   3, livesLost: 1, abilities: [],                       emoji: "🛡" },
  wolf_rider:   { kind: "wolf_rider",   name: "Волч. Всадник", hp:   18, speed: 2.0, regenPerSec:  0, reward:   3, livesLost: 1, abilities: [],                       emoji: "🐺" },
  zombie:       { kind: "zombie",       name: "Зомби",         hp:   26, speed: 0.7, regenPerSec:  0, reward:   4, livesLost: 1, abilities: [],                       emoji: "💀" },
  // ── Волны 6–9: T3 ───────────────────────────────────────────────────────
  orc:          { kind: "orc",          name: "Орк",           hp:   20, speed: 1.0, regenPerSec:  0, reward:   4, livesLost: 1, abilities: ["block"],                emoji: "🐗" },
  wight:        { kind: "wight",        name: "Призрак",       hp:   23, speed: 1.3, regenPerSec:  0, reward:   5, livesLost: 1, abilities: ["dodge"],                emoji: "👻" },
  minotaur:     { kind: "minotaur",     name: "Минотавр",      hp:   26, speed: 0.9, regenPerSec:  0, reward:   4, livesLost: 1, abilities: ["block"],                emoji: "🐂" },
  golem:        { kind: "golem",        name: "Голем",         hp:   37, speed: 0.7, regenPerSec:  0, reward:   5, livesLost: 1, abilities: ["slow_resist"],          emoji: "🗿" },
  // ── Волна 10: T6 ────────────────────────────────────────────────────────
  angel:        { kind: "angel",        name: "Ангел",         hp:  750, speed: 0.5, regenPerSec:  5, reward: 100, livesLost: 7, abilities: [],                       emoji: "😇" },
  // ── Волны 11–20: T4–T7 ──────────────────────────────────────────────────
  ogr:          { kind: "ogr",          name: "Огр",           hp:   30, speed: 0.6, regenPerSec:  0, reward:   4, livesLost: 1, abilities: [],                       emoji: "👊" },
  crusader:     { kind: "crusader",     name: "Крестоносец",   hp:   45, speed: 1.0, regenPerSec:  0, reward:   5, livesLost: 1, abilities: [],                       emoji: "🐎" },
  vampire_lord: { kind: "vampire_lord", name: "Вампир Лорд",  hp:   50, speed: 1.2, regenPerSec:  0, reward:   6, livesLost: 1, abilities: [],                       emoji: "🌙" },
  pit_lord:     { kind: "pit_lord",     name: "Властелин Ям", hp:   60, speed: 0.9, regenPerSec:  0, reward:   7, livesLost: 1, abilities: [],                       emoji: "👿" },
  roc:          { kind: "roc",          name: "Рок",           hp:   60, speed: 1.0, regenPerSec:  0, reward:   6, livesLost: 1, abilities: [],                       emoji: "🐦" },
  lich:         { kind: "lich",         name: "Лич",           hp:   70, speed: 0.6, regenPerSec:  5, reward:   7, livesLost: 1, abilities: ["block"],                emoji: "☠" },
  devil:        { kind: "devil",        name: "Дьявол",        hp:  150, speed: 1.0, regenPerSec:  0, reward:  10, livesLost: 1, abilities: ["dodge"],                emoji: "🔥" },
  titan:        { kind: "titan",        name: "Титан",         hp:  230, speed: 0.7, regenPerSec:  0, reward:  10, livesLost: 1, abilities: ["slow_resist", "block"], emoji: "⚡" },
  black_dragon: { kind: "black_dragon", name: "Чёрный Дракон",hp:  200, speed: 1.3, regenPerSec:  0, reward:  12, livesLost: 1, abilities: [],                       emoji: "🐉" },
  archangel:    { kind: "archangel",    name: "Архангел",      hp: 2500, speed: 0.5, regenPerSec: 10, reward: 150, livesLost:10, abilities: ["self_heal"],            emoji: "🌟" },
};

export interface WaveDef {
  entries: SpawnEntry[];
  recommended: number;
  name: string;
}

function group(kind: CreepKind, count: number, interval: number): SpawnEntry[] {
  return Array.from({ length: count }, (_, i) => ({ kind, delay: i === 0 ? 0 : interval }));
}

export const WAVE_DEFS: WaveDef[] = [
  // W1  — 30 Бесёнков      HP=390   gold=90   rec=150
  { entries: group("imp",           30, 0.25), recommended: 150,  name: "Бесёнки" },
  // W2  — 33 Гоблина       HP=495   gold=99   rec=200
  { entries: group("goblin",        33, 0.25), recommended: 200,  name: "Гоблины" },
  // W3  — 35 Копейщиков    HP=560   gold=105  rec=250
  { entries: group("pikeman",       35, 0.40), recommended: 250,  name: "Копейщики" },
  // W4  — 35 Волч. Всадн.  HP=630   gold=105  rec=350
  { entries: group("wolf_rider",    35, 0.30), recommended: 350,  name: "Волчьи Всадники" },
  // W5  — 30 Зомби         HP=780   gold=120  rec=400
  { entries: group("zombie",        30, 0.60), recommended: 400,  name: "Зомби" },
  // W6  — 35 Орков         HP=700   gold=140  rec=450   [block]
  { entries: group("orc",           35, 0.50), recommended: 450,  name: "Орки" },
  // W7  — 30 Призраков     HP=690   gold=150  rec=500   [dodge]
  { entries: group("wight",         30, 0.55), recommended: 500,  name: "Призраки" },
  // W8  — 30 Минотавров    HP=780   gold=120  rec=550   [block]
  { entries: group("minotaur",      30, 0.60), recommended: 550,  name: "Минотавры" },
  // W9  — 30 Големов       HP=1110  gold=150  rec=600   [slow resist]
  { entries: group("golem",         30, 1.00), recommended: 600,  name: "Голем" },
  // W10 —  3 Ангела        HP=2250  gold=300  rec=700   [regen 5/s, -7 жизней]
  { entries: group("angel",          3, 3.00), recommended: 700,  name: "Ангелы" },
  // W11 — 50 Огров         HP=1500  gold=200  rec=700
  { entries: group("ogr",           50, 0.40), recommended: 700,  name: "Огры" },
  // W12 — 30 Крестоносцев  HP=1350  gold=150  rec=750
  { entries: group("crusader",      30, 0.80), recommended: 750,  name: "Крестоносцы" },
  // W13 — 30 Вампир Лордов HP=1500  gold=180  rec=800
  { entries: group("vampire_lord",  30, 0.85), recommended: 800,  name: "Вампиры" },
  // W14 — 25 Властелинов   HP=1500  gold=175  rec=850
  { entries: group("pit_lord",      25, 0.90), recommended: 850,  name: "Властелины" },
  // W15 — 30 Роков         HP=1800  gold=180  rec=900
  { entries: group("roc",           30, 0.90), recommended: 900,  name: "Роки" },
  // W16 — 25 Личей         HP=1750  gold=175  rec=950   [block, regen 5/s]
  { entries: group("lich",          25, 1.00), recommended: 950,  name: "Личи" },
  // W17 — 15 Дьяволов      HP=2250  gold=150  rec=1000  [dodge]
  { entries: group("devil",         15, 1.20), recommended: 1000, name: "Дьяволы" },
  // W18 — 15 Титанов       HP=3450  gold=150  rec=1050  [slow resist, block]
  { entries: group("titan",         15, 1.50), recommended: 1050, name: "Титаны" },
  // W19 — 20 Чёрных Драконов HP=4000 gold=240 rec=1100
  { entries: group("black_dragon",  20, 1.80), recommended: 1100, name: "Чёрные Драконы" },
  // W20 —  5 Архангелов    HP=12500 gold=750  rec=1150  [regen 10/s, self_heal, -10 жизней]
  { entries: group("archangel",      5, 3.00), recommended: 1150, name: "Архангелы" },
];
