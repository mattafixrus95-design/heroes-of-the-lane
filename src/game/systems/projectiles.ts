import type { GameState, Projectile, SplashEffect, DeathEffect, FloatingText, Creep } from "../engine/gameState";
import { SLOW_DURATION } from "../engine/gameState";
import { CREEP_ART } from "../../assets/creeps/creepArt";

let effectCounter = 0;
let ftCounter = 0;

function makeFt(c: Creep, gameTime: number): FloatingText {
  return {
    id: `ft-${++ftCounter}`,
    text: `+${c.reward}`,
    x: c.position.x,
    y: c.position.y,
    color: "#f0c040",
    spawnTime: gameTime,
    duration: 1.4,
  };
}

// Крипы с художественным спрайтом смерти — выводится прямо из CREEP_ART, чтобы
// не дублировать список вручную (раньше был отдельный set, из-за которого
// у новых крипов с зарегистрированным артом смерть "исчезала", а не игралась
// анимация падения, пока их забывали добавить сюда же). Остальные виды
// остаются просто эмодзи без анимации смерти.
const DEATH_ANIM_KINDS = new Set<Creep["kind"]>(
  (Object.keys(CREEP_ART) as Creep["kind"][]).filter(k => CREEP_ART[k]?.deathFrames),
);
const DEATH_ANIM_DURATION = 0.6;

function sweepDead(
  creeps: Creep[],
  gold: number,
  killed: number,
  waveGold: number,
  texts: FloatingText[],
  deaths: DeathEffect[],
  gameTime: number,
): { creeps: Creep[]; gold: number; killed: number; waveGold: number; texts: FloatingText[]; deaths: DeathEffect[] } {
  const alive: Creep[] = [];
  for (const c of creeps) {
    if (c.hp <= 0) {
      gold += c.reward;
      killed++;
      waveGold += c.reward;
      texts.push(makeFt(c, gameTime));
      if (DEATH_ANIM_KINDS.has(c.kind)) {
        deaths.push({
          id: `de-${++effectCounter}`,
          kind: c.kind,
          x: c.position.x,
          y: c.position.y,
          pathProgress: c.pathProgress,
          spawnTime: gameTime,
          duration: DEATH_ANIM_DURATION,
        });
      }
    } else {
      alive.push(c);
    }
  }
  return { creeps: alive, gold, killed, waveGold, texts, deaths };
}

function vulnMult(c: Creep): number {
  return c.vulnTimer > 0 ? 1 + c.vulnPct : 1;
}

function applyDebuffs(c: Creep, pd: Projectile["pendingDamage"]): Creep {
  if (!pd.vulnApply && !pd.rootApply) return c;
  const rootResist = c.abilities.includes("root_resist");
  return {
    ...c,
    ...(pd.vulnApply ? { vulnPct: pd.vulnApply.pct, vulnTimer: pd.vulnApply.duration } : {}),
    ...(pd.rootApply && !rootResist ? { rootTimer: pd.rootApply.duration } : {}),
  };
}

function applyExpired(state: GameState, expired: Projectile[]): GameState {
  if (expired.length === 0) return state;

  let creeps = [...state.creeps];
  let gold = state.gold;
  let killed = state.currentWaveKilled;
  let waveGold = state.currentWaveGold;
  let texts: FloatingText[] = [];
  let deaths: DeathEffect[] = [];
  const newSplash: SplashEffect[] = [];

  for (const p of expired) {
    const pd = p.pendingDamage;

    if (p.kind === "fireball" && pd.explosionAoe) {
      const hasTarget = creeps.some(c => c.id === pd.targetId);
      if (hasTarget) {
        creeps = creeps.map(c => c.id === pd.targetId
          ? applyDebuffs({ ...c, hp: c.hp - pd.damage * vulnMult(c), ...(pd.slow > 0 ? { slowFactor: pd.slow, slowTimer: SLOW_DURATION } : {}) }, pd)
          : c,
        );
      }
      creeps = creeps.map(c => {
        if (c.id === pd.targetId) return c;
        const d = Math.hypot(p.toX - c.position.x, p.toY - c.position.y);
        return d <= pd.explosionAoe! ? { ...c, hp: c.hp - pd.damage * pd.explosionDmgPct! * vulnMult(c) } : c;
      });
      const swept = sweepDead(creeps, gold, killed, waveGold, texts, deaths, state.gameTime);
      creeps = swept.creeps; gold = swept.gold; killed = swept.killed;
      waveGold = swept.waveGold; texts = swept.texts; deaths = swept.deaths;
      newSplash.push({
        id: `sx-${++effectCounter}`,
        x: p.toX, y: p.toY,
        radius: pd.explosionAoe,
        spawnTime: state.gameTime,
        duration: 0.38,
      });
    } else {
      const target = creeps.find(c => c.id === pd.targetId);
      if (!target) continue;

      // Dodge: 20% chance — skip damage AND slow
      if (target.abilities.includes("dodge") && Math.random() < 0.20) continue;

      // Block: 20% chance — skip damage only (slow still applies)
      const blocked = target.abilities.includes("block") && Math.random() < 0.20;
      const actualDamage = blocked ? 0 : pd.damage * vulnMult(target);

      creeps = creeps.map(c => c.id === pd.targetId
        ? applyDebuffs({ ...c, hp: c.hp - actualDamage, ...(pd.slow > 0 ? { slowFactor: pd.slow, slowTimer: SLOW_DURATION } : {}) }, pd)
        : c,
      );
      const swept = sweepDead(creeps, gold, killed, waveGold, texts, deaths, state.gameTime);
      creeps = swept.creeps; gold = swept.gold; killed = swept.killed;
      waveGold = swept.waveGold; texts = swept.texts; deaths = swept.deaths;
    }
  }

  const splashEffects = [
    ...state.splashEffects.filter(e => state.gameTime - e.spawnTime < e.duration),
    ...newSplash,
  ];

  const deathEffects = [
    ...state.deathEffects.filter(e => state.gameTime - e.spawnTime < e.duration),
    ...deaths,
  ];

  return {
    ...state,
    creeps, gold, splashEffects, deathEffects,
    currentWaveKilled: killed,
    currentWaveGold: waveGold,
    floatingTexts: [...state.floatingTexts, ...texts],
  };
}

export function tickProjectiles(state: GameState): GameState {
  const now = state.gameTime;
  const active: Projectile[] = [];
  const expired: Projectile[] = [];
  for (const p of state.projectiles) {
    (now - p.spawnTime >= p.duration ? expired : active).push(p);
  }
  return applyExpired({ ...state, projectiles: active }, expired);
}
