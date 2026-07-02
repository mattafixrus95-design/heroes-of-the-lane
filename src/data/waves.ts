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
  imp:          { kind: "imp",          name: "Бес",            hp:   13, speed: 1.2, regenPerSec:  0, reward:   2, livesLost: 1, abilities: [],                       emoji: "😈" },
  goblin:       { kind: "goblin",       name: "Гоблин",         hp:   15, speed: 1.3, regenPerSec:  0, reward:   2, livesLost: 1, abilities: [],                       emoji: "👺" },
  pikeman:      { kind: "pikeman",      name: "Копейщик",       hp:   20, speed: 1.1, regenPerSec:  0, reward:   2, livesLost: 1, abilities: [],                       emoji: "🛡" },
  wolf_rider:   { kind: "wolf_rider",   name: "Волч. Всадник",  hp:   23, speed: 1.8, regenPerSec:  0, reward:   2, livesLost: 1, abilities: [],                       emoji: "🐺" },
  zombie:       { kind: "zombie",       name: "Зомби",          hp:   40, speed: 0.7, regenPerSec:  0, reward:   3, livesLost: 1, abilities: [],                       emoji: "💀" },
  // ── Волны 6–9: T3 ────────────────────────────────────────────────────────
  orc:          { kind: "orc",          name: "Орк",            hp:   35, speed: 1.0, regenPerSec:  0, reward:   3, livesLost: 1, abilities: ["block"],                emoji: "🐗" },
  wight:        { kind: "wight",        name: "Призрак",        hp:   35, speed: 1.2, regenPerSec:  0, reward:   3, livesLost: 1, abilities: ["dodge"],                emoji: "👻" },
  minotaur:     { kind: "minotaur",     name: "Минотавр",       hp:   45, speed: 0.8, regenPerSec:  0, reward:   3, livesLost: 1, abilities: ["block"],                emoji: "🐂" },
  golem:        { kind: "golem",        name: "Голем",          hp:   47, speed: 0.7, regenPerSec:  0, reward:   4, livesLost: 1, abilities: ["slow_resist"],          emoji: "🗿" },
  // ── Волна 10: Босс ───────────────────────────────────────────────────────
  angel:        { kind: "angel",        name: "Ангел",          hp:  750, speed: 0.5, regenPerSec:  3, reward: 100, livesLost: 7, abilities: [],                       emoji: "😇" },
  // ── Волны 11–19: T4-T7 ───────────────────────────────────────────────────
  ogr:          { kind: "ogr",          name: "Огр",            hp:   50, speed: 0.6, regenPerSec:  0, reward:   4, livesLost: 1, abilities: [],                       emoji: "👊" },
  crusader:     { kind: "crusader",     name: "Крестоносец",    hp:   60, speed: 1.0, regenPerSec:  0, reward:   5, livesLost: 1, abilities: [],                       emoji: "🐎" },
  vampire_lord: { kind: "vampire_lord", name: "Вампир Лорд",    hp:   70, speed: 1.2, regenPerSec:  0, reward:   5, livesLost: 1, abilities: [],                       emoji: "🌙" },
  pit_lord:     { kind: "pit_lord",     name: "Властелин Ям",   hp:   95, speed: 0.9, regenPerSec:  0, reward:   9, livesLost: 1, abilities: [],                       emoji: "👿" },
  roc:          { kind: "roc",          name: "Рок",            hp:   80, speed: 1.0, regenPerSec:  0, reward:   8, livesLost: 1, abilities: [],                       emoji: "🐦" },
  lich:         { kind: "lich",         name: "Лич",            hp:  100, speed: 0.6, regenPerSec:  5, reward:  10, livesLost: 1, abilities: ["block"],                emoji: "☠" },
  devil:        { kind: "devil",        name: "Дьявол",         hp:  150, speed: 1.0, regenPerSec:  0, reward:  13, livesLost: 1, abilities: ["dodge"],                emoji: "🔥" },
  titan:        { kind: "titan",        name: "Титан",          hp:  230, speed: 0.7, regenPerSec:  0, reward:  20, livesLost: 1, abilities: ["slow_resist", "block"], emoji: "⚡" },
  black_dragon: { kind: "black_dragon", name: "Чёрный Дракон",  hp:  200, speed: 1.3, regenPerSec:  0, reward:  22, livesLost: 1, abilities: [],                       emoji: "🐉" },
  // ── Волна 20: Финальный босс ─────────────────────────────────────────────
  archangel:    { kind: "archangel",    name: "Архангел",       hp: 2500, speed: 0.5, regenPerSec: 10, reward: 150, livesLost:10, abilities: ["self_heal"],            emoji: "🌟" },
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
  { entries: group("imp",           50, 0.22), recommended: 150,  name: "Бесы" },
  { entries: group("goblin",        50, 0.22), recommended: 200,  name: "Гоблины" },
  { entries: group("pikeman",       50, 0.30), recommended: 250,  name: "Копейщики" },
  { entries: group("wolf_rider",    50, 0.25), recommended: 350,  name: "Волчьи Всадники" },
  { entries: group("zombie",        40, 0.55), recommended: 400,  name: "Зомби" },
  { entries: group("orc",           40, 0.45), recommended: 450,  name: "Орки" },
  { entries: group("wight",         40, 0.45), recommended: 500,  name: "Призраки" },
  { entries: group("minotaur",      40, 0.55), recommended: 550,  name: "Минотавры" },
  { entries: group("golem",         40, 0.90), recommended: 650,  name: "Голем" },
  { entries: group("angel",          3, 3.00), recommended: 750,  name: "Ангелы" },
  { entries: group("ogr",           50, 0.40), recommended: 750,  name: "Огры" },
  { entries: group("crusader",      40, 0.70), recommended: 800,  name: "Крестоносцы" },
  { entries: group("vampire_lord",  40, 0.75), recommended: 850,  name: "Вампиры" },
  { entries: group("pit_lord",      25, 0.90), recommended: 900,  name: "Властелины" },
  { entries: group("roc",           30, 0.85), recommended: 950,  name: "Роки" },
  { entries: group("lich",          25, 1.00), recommended: 1000, name: "Личи" },
  { entries: group("devil",         20, 1.20), recommended: 1050, name: "Дьяволы" },
  { entries: group("titan",         15, 1.50), recommended: 1100, name: "Титаны" },
  { entries: group("black_dragon",  20, 1.60), recommended: 1150, name: "Чёрные Драконы" },
  { entries: group("archangel",      5, 3.00), recommended: 1200, name: "Архангелы" },
];
