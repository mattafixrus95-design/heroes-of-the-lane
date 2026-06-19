import type { GameState, Tower, Enemy } from "../engine/gameState";
import { PATH } from "../../data/map";

function dist(col: number, row: number, e: Enemy): number {
  const [ec, er] = PATH[Math.min(e.pathIndex, PATH.length - 1)];
  return Math.hypot(col - ec, row - er);
}

function attackTower(tower: Tower, enemies: Enemy[], dt: number): { tower: Tower; enemies: Enemy[] } {
  if (tower.cooldown > 0) {
    return { tower: { ...tower, cooldown: tower.cooldown - dt }, enemies };
  }

  // Find closest enemy in range
  const inRange = enemies.filter(e => dist(tower.col, tower.row, e) <= tower.range);
  if (inRange.length === 0) return { tower, enemies };

  const target = inRange.reduce((a, b) => (a.pathIndex > b.pathIndex ? a : b));

  const newEnemies = enemies.map(e => {
    if (e.id !== target.id) return e;
    return { ...e, hp: e.hp - tower.damage };
  }).filter(e => e.hp > 0);

  const cooldown = 1 / tower.attackSpeed;
  return { tower: { ...tower, cooldown }, enemies: newEnemies };
}

export function tickTowerAttack(state: GameState, dt: number): GameState {
  let enemies = [...state.enemies];
  const towers = state.towers.map(tower => {
    const result = attackTower(tower, enemies, dt);
    enemies = result.enemies;
    return result.tower;
  });
  return { ...state, towers, enemies };
}
