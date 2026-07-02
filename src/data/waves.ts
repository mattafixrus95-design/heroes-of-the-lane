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
  // ── Волны 1–5: T1-T2 ─────────────────────────────────────────────────────
  imp:          { kind: "imp",          name: "Бес",            hp:   11, speed: 1.2, regenPerSec:  0, reward:   2, livesLost: 1, abilities: [],                       emoji: "😈" },
  goblin:       { kind: "goblin",       name: "Гоблин",         hp:   16, speed: 1.3, regenPerSec:  0, reward:   2, livesLost: 1, abilities: [],                       emoji: "👺" },
  pikeman:      { kind: "pikeman",      name: "Копейщик",       hp:   22, speed: 1.1, regenPerSec:  0, reward:   2, livesLost: 1, abilities: [],                       emoji: "🛡" },
  wolf_rider:   { kind: "wolf_rider",   name: "Волч. Всадник",  hp:   25, speed: 1.8, regenPerSec:  0, reward:   2, livesLost: 1, abilities: [],                       emoji: "🐺" },
  zombie:       { kind: "zombie",       name: "Зомби",          hp:   45, speed: 0.7, regenPerSec:  0, reward:   3, livesLost: 1, abilities: [],                       emoji: "💀" },
  // ── Волны 6–9: T3 ────────────────────────────────────────────────────────
  orc:          { kind: "orc",          name: "Орк",            hp:   37, speed: 1.0, regenPerSec:  0, reward:   3, livesLost: 1, abilities: ["block"],                emoji: "🐗" },
  wight:        { kind: "wight",        name: "Призрак",        hp:   37, speed: 1.2, regenPerSec:  0, reward:   3, livesLost: 1, abilities: ["dodge"],                emoji: "👻" },
  minotaur:     { kind: "minotaur",     name: "Минотавр",       hp:   50, speed: 0.8, regenPerSec:  0, reward:   3, livesLost: 1, abilities: ["block"],                emoji: "🐂" },
  golem:        { kind: "golem",        name: "Голем",          hp:   50, speed: 0.7, regenPerSec:  0, reward:   4, livesLost: 1, abilities: ["slow_resist"],          emoji: "🗿" },
  // ── Волна 10: Босс ───────────────────────────────────────────────────────
  angel:        { kind: "angel",        name: "Ангел",          hp: 1000, speed: 0.5, regenPerSec:  3, reward: 100, livesLost: 7, abilities: [],                       emoji: "😇" },
  // ── Волны 11–19: T4-T7 ───────────────────────────────────────────────────
  ogr:          { kind: "ogr",          name: "Огр",            hp:   55, speed: 0.6, regenPerSec:  0, reward:   4, livesLost: 1, abilities: [],                       emoji: "👊" },
  crusader:     { kind: "crusader",     name: "Крестоносец",    hp:   65, speed: 1.0, regenPerSec:  0, reward:   5, livesLost: 1, abilities: [],                       emoji: "🐎" },
  vampire_lord: { kind: "vampire_lord", name: "Вампир Лорд",    hp:   75, speed: 1.2, regenPerSec:  0, reward:   5, livesLost: 1, abilities: [],                       emoji: "🌙" },
  pit_lord:     { kind: "pit_lord",     name: "Властелин Ям",   hp:  100, speed: 0.9, regenPerSec:  0, reward:   9, livesLost: 1, abilities: [],                       emoji: "👿" },
  roc:          { kind: "roc",          name: "Рок",            hp:   90, speed: 1.0, regenPerSec:  0, reward:   8, livesLost: 1, abilities: [],                       emoji: "🐦" },
  lich:         { kind: "lich",         name: "Лич",            hp:  120, speed: 0.6, regenPerSec:  5, reward:  10, livesLost: 1, abilities: ["block"],                emoji: "☠" },
  devil:        { kind: "devil",        name: "Дьявол",         hp:  170, speed: 1.0, regenPerSec:  0, reward:  13, livesLost: 1, abilities: ["dodge"],                emoji: "🔥" },
  titan:        { kind: "titan",        name: "Титан",          hp:  250, speed: 0.7, regenPerSec:  0, reward:  20, livesLost: 1, abilities: ["slow_resist", "block"], emoji: "⚡" },
  black_dragon: { kind: "black_dragon", name: "Чёрный Дракон",  hp:  300, speed: 1.3, regenPerSec:  0, reward:  22, livesLost: 1, abilities: [],                       emoji: "🐉" },
  // ── Волна 20: Финальный босс ─────────────────────────────────────────────
  archangel:    { kind: "archangel",    name: "Архангел",       hp: 3000, speed: 0.5, regenPerSec: 10, reward: 150, livesLost:10, abilities: ["self_heal"],            emoji: "🌟" },
};

export interface WaveDef {
  entries: SpawnEntry[];
  recommended: number;
  name: string;
}

function group(kind: CreepKind, count: number, interval: number): SpawnEntry[] {
  return Array.from({ length: count }, (_, i) => ({ kind, delay: i === 0 ? 0 : interval }));
}

// Все крипы выходят за первые 10 секунд волны
function wave(kind: CreepKind, count: number): SpawnEntry[] {
  const interval = count > 1 ? +(10 / (count - 1)).toFixed(3) : 0;
  return group(kind, count, interval);
}

export const WAVE_DEFS: WaveDef[] = [
  { entries: wave("imp",           50), recommended:  200, name: "Бесы" },
  { entries: wave("goblin",        50), recommended:  300, name: "Гоблины" },
  { entries: wave("pikeman",       50), recommended:  400, name: "Копейщики" },
  { entries: wave("wolf_rider",    50), recommended:  500, name: "Волчьи Всадники" },
  { entries: wave("zombie",        40), recommended:  600, name: "Зомби" },
  { entries: wave("orc",           40), recommended:  720, name: "Орки" },
  { entries: wave("wight",         40), recommended:  840, name: "Призраки" },
  { entries: wave("minotaur",      40), recommended:  960, name: "Минотавры" },
  { entries: wave("golem",         40), recommended: 1080, name: "Голем" },
  { entries: group("angel",         3, 3.00), recommended: 1240, name: "Ангелы" },
  { entries: wave("ogr",           50), recommended: 1540, name: "Огры" },
  { entries: wave("crusader",      40), recommended: 1740, name: "Крестоносцы" },
  { entries: wave("vampire_lord",  40), recommended: 1940, name: "Вампиры" },
  { entries: wave("pit_lord",      25), recommended: 2140, name: "Властелины" },
  { entries: wave("roc",           30), recommended: 2365, name: "Роки" },
  { entries: wave("lich",          25), recommended: 2605, name: "Личи" },
  { entries: wave("devil",         20), recommended: 2855, name: "Дьяволы" },
  { entries: wave("titan",         15), recommended: 3115, name: "Титаны" },
  { entries: wave("black_dragon",  20), recommended: 3415, name: "Чёрные Драконы" },
  { entries: group("archangel",     5, 3.00), recommended: 3855, name: "Архангелы" },
];
