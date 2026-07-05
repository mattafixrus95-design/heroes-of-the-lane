import { useRef, useEffect } from "react";
import type { GameState } from "../game/engine/gameState";
import { CREEP_DEFS } from "../data/waves";
import { pathFacing } from "../data/map";
import impImage from "../assets/impSprite";
import type { Selection } from "./selection";

type ArrowStyle = "default" | "elf" | "ivor";

function drawArrow(ctx: CanvasRenderingContext2D, x: number, y: number, angleDeg: number, style: ArrowStyle) {
  if (style === "ivor") {
    drawIvorArrow(ctx, x, y, angleDeg);
    return;
  }
  const isElf = style === "elf";
  const shaft = isElf ? "#8B6914" : "#5C3A1E";
  const feather = isElf ? "#2a9d2a" : "#9d5a2a";
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((angleDeg * Math.PI) / 180);
  ctx.strokeStyle = shaft;
  ctx.lineWidth = isElf ? 1.5 : 2;
  ctx.beginPath();
  ctx.moveTo(-12, 0);
  ctx.lineTo(8, 0);
  ctx.stroke();
  ctx.fillStyle = shaft;
  ctx.beginPath();
  ctx.moveTo(6, -3);
  ctx.lineTo(14, 0);
  ctx.lineTo(6, 3);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = feather;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-10, 0); ctx.lineTo(-13, -3);
  ctx.moveTo(-10, 0); ctx.lineTo(-13, 3);
  if (isElf) {
    ctx.moveTo(-7, 0); ctx.lineTo(-10, -3);
    ctx.moveTo(-7, 0); ctx.lineTo(-10, 3);
  }
  ctx.stroke();
  ctx.restore();
}

// Стрела Ивора — тонкое серебряное древко со светящимся синим наконечником,
// заметно отличается от обычных лучников (у тех — коричневое дерево).
function drawIvorArrow(ctx: CanvasRenderingContext2D, x: number, y: number, angleDeg: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((angleDeg * Math.PI) / 180);

  // Голубой шлейф света вдоль древка
  ctx.strokeStyle = "rgba(120,200,255,0.35)";
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(-13, 0);
  ctx.lineTo(6, 0);
  ctx.stroke();

  // Серебряное древко
  ctx.strokeStyle = "#d8dfe6";
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(-12, 0);
  ctx.lineTo(9, 0);
  ctx.stroke();

  // Светящийся наконечник
  ctx.save();
  ctx.shadowColor = "#7fd6ff";
  ctx.shadowBlur = 6;
  ctx.fillStyle = "#eaf6ff";
  ctx.beginPath();
  ctx.moveTo(7, -2.6);
  ctx.lineTo(15, 0);
  ctx.lineTo(7, 2.6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Серебряное оперение
  ctx.strokeStyle = "#b9c4cc";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-10, 0); ctx.lineTo(-13, -3.5);
  ctx.moveTo(-10, 0); ctx.lineTo(-13, 3.5);
  ctx.moveTo(-7, 0);  ctx.lineTo(-9.5, -2.5);
  ctx.moveTo(-7, 0);  ctx.lineTo(-9.5, 2.5);
  ctx.stroke();

  ctx.restore();
}

function drawAxe(ctx: CanvasRenderingContext2D, x: number, y: number, angleDeg: number, progress: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(((angleDeg + progress * 540) * Math.PI) / 180);
  ctx.strokeStyle = "#7a4520";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, 6); ctx.lineTo(0, -2);
  ctx.stroke();
  ctx.fillStyle = "#b8b8c8";
  ctx.beginPath();
  ctx.moveTo(0, -2); ctx.lineTo(-5, -7); ctx.lineTo(-5, 0); ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#d0d0e0";
  ctx.beginPath();
  ctx.moveTo(0, -2); ctx.lineTo(5, -7); ctx.lineTo(5, 0); ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawFireball(ctx: CanvasRenderingContext2D, x: number, y: number, progress: number) {
  const size = 20 + progress * 6;
  const r = size / 2;
  const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
  grad.addColorStop(0, "#fff");
  grad.addColorStop(0.2, "#FFD700");
  grad.addColorStop(0.55, "#FF6000");
  grad.addColorStop(1, "#CC0000");
  ctx.save();
  ctx.shadowColor = "rgba(255,100,0,0.8)";
  ctx.shadowBlur = 10 + progress * 8;
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawSplash(ctx: CanvasRenderingContext2D, x: number, y: number, maxR: number, t: number) {
  const r = maxR * (0.3 + t * 0.7);
  const opacity = 1 - t;
  ctx.save();
  ctx.strokeStyle = `rgba(255,140,0,${opacity})`;
  ctx.lineWidth = Math.max(0.5, 3 - t * 2);
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

// Мягкая эллиптическая тень со смещением вниз-вправо — та же логика,
// что и для DOM-объектов (ObjectShadow.tsx), но на canvas для крипов.
function drawShadow(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number) {
  ctx.save();
  const grad = ctx.createRadialGradient(x + 2, y + 2, 0, x + 2, y + 2, rx);
  grad.addColorStop(0, "rgba(0,0,0,0.4)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(x + 2, y + 2, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function fillRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  if (w <= 0) return;
  if (typeof ctx.roundRect === "function") {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, Math.min(r, h / 2));
    ctx.fill();
  } else {
    ctx.fillRect(x, y, w, h);
  }
}

function setupCanvas(canvas: HTMLCanvasElement, width: number, height: number): CanvasRenderingContext2D | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const dpr = window.devicePixelRatio || 1;
  const targetW = Math.round(width * dpr);
  const targetH = Math.round(height * dpr);
  if (canvas.width !== targetW || canvas.height !== targetH) {
    canvas.width = targetW;
    canvas.height = targetH;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  return ctx;
}

interface EffectsProps {
  state: GameState;
  cell: number;
  selection: Selection | null;
  width: number;
  height: number;
}

// Крипы, снаряды и splash-эффекты — рисуются НИЖЕ построек (слой "эффекты/крипы"
// в порядке земля → дорога → эффекты → крипы → башни → здания → UI).
export function EffectsCanvas({ state, cell, selection, width, height }: EffectsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width <= 0 || height <= 0) return;
    const ctx = setupCanvas(canvas, width, height);
    if (!ctx) return;

    // Крипы: тень + HP-бар + эмодзи
    const baseCreepSize = Math.max(16, Math.round(cell * 0.5));
    for (const c of state.creeps) {
      const x = c.position.x * cell + cell / 2;
      const y = c.position.y * cell + cell / 2;
      const hpPct = Math.max(0, Math.min(1, c.hp / c.maxHp));
      const isBoss = c.kind === "angel" || c.kind === "black_dragon" || c.kind === "archangel";
      const size = isBoss ? Math.round(baseCreepSize * 1.6) : baseCreepSize;
      const def = CREEP_DEFS[c.kind];
      const isSlowed = c.slowTimer > 0;
      const hpBarColor = c.regenPerSec > 0 ? "#8bc34a" : hpPct > 0.5 ? "#4caf50" : "#f44336";
      const isSelected = selection?.kind === "creep" && selection.id === c.id;

      const barW = size;
      const barH = isBoss ? 4 : 3;
      const barX = x - barW / 2;
      const barY = y - size * 0.65;

      drawShadow(ctx, x, y + size * 0.28, size * 0.3, size * 0.12);

      if (isSelected) {
        ctx.save();
        ctx.strokeStyle = "rgba(80,220,255,0.9)";
        ctx.lineWidth = 2;
        ctx.strokeRect(barX - 3, barY - 3, barW + 6, size * 0.65 + barH + 10);
        ctx.restore();
      }

      ctx.fillStyle = "#333";
      fillRoundRect(ctx, barX, barY, barW, barH, 2);
      ctx.fillStyle = hpBarColor;
      fillRoundRect(ctx, barX, barY, barW * hpPct, barH, 2);

      const fontPx = Math.max(0.6, (isBoss ? cell * 1.3 : cell) / 56) * 16;

      if (c.kind === "imp" && impImage.complete && impImage.naturalWidth > 0) {
        // Спрайт Беса: единственная художественная ориентация (смотрит
        // влево) — зеркалим по горизонтали, когда крип идёт вправо.
        // Вверх/вниз — тот же спрайт без поворота, только лёгкое
        // покачивание корпуса, имитирующее шаг.
        const aspect = impImage.naturalHeight / impImage.naturalWidth;
        const drawH = fontPx * 1.9;
        const drawW = drawH / aspect;
        const bob = Math.abs(Math.sin(state.gameTime * 8 + c.pathProgress * 3)) * drawH * 0.05;
        const mirror = pathFacing(c.pathProgress) === 1;
        const topY = barY + barH + 1 + drawH * 0.08 - bob;

        ctx.save();
        ctx.filter = isSlowed ? "hue-rotate(180deg)" : "none";
        ctx.translate(x, topY);
        if (mirror) ctx.scale(-1, 1);
        ctx.drawImage(impImage, -drawW / 2, 0, drawW, drawH);
        ctx.restore();
      } else {
        ctx.save();
        ctx.filter = isSlowed ? "hue-rotate(180deg)" : "none";
        ctx.font = `${fontPx}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(def.emoji, x, barY + barH + 1);
        ctx.restore();
      }
    }

    // Splash-эффекты
    for (const e of state.splashEffects) {
      const t = Math.min(1, (state.gameTime - e.spawnTime) / e.duration);
      const cx = e.x * cell + cell / 2;
      const cy = e.y * cell + cell / 2;
      drawSplash(ctx, cx, cy, e.radius * cell, t);
    }

    // Снаряды
    for (const p of state.projectiles) {
      const progress = Math.min(1, (state.gameTime - p.spawnTime) / p.duration);
      const x = (p.fromCol + (p.toX - p.fromCol) * progress) * cell + cell / 2;
      const y = (p.fromRow + (p.toY - p.fromRow) * progress) * cell + cell / 2;
      const angle = Math.atan2(p.toY - p.fromRow, p.toX - p.fromCol) * (180 / Math.PI);
      if (p.kind === "fireball") drawFireball(ctx, x, y, progress);
      else if (p.kind === "axe") drawAxe(ctx, x, y, angle, progress);
      else drawArrow(ctx, x, y, angle, p.towerType === "ivor" ? "ivor" : p.towerType === "elf" ? "elf" : "default");
    }
  });

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, zIndex: 1, width, height, pointerEvents: "none" }}
    />
  );
}

interface TextsProps {
  state: GameState;
  cell: number;
  width: number;
  height: number;
}

// Всплывающий текст (урон/золото/левелап) — самый верхний слой, поверх
// построек и UI-подсветки, чтобы всегда оставаться читаемым.
export function TextsCanvas({ state, cell, width, height }: TextsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width <= 0 || height <= 0) return;
    const ctx = setupCanvas(canvas, width, height);
    if (!ctx) return;

    for (const ft of state.floatingTexts) {
      const age = state.gameTime - ft.spawnTime;
      const t = Math.min(1, age / ft.duration);
      const opacity = Math.max(0, ft.large ? (t < 0.6 ? 1 : 1 - (t - 0.6) / 0.4) : 1 - t);
      const yOff = -t * cell * (ft.large ? 1.8 : 1.2);
      const x = ft.x * cell + cell / 2;
      const y = ft.y * cell + cell / 2 + yOff;
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.font = `800 ${(ft.large ? 1.6 : 0.8) * 16}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = ft.large ? "rgba(240,192,64,0.7)" : "rgba(0,0,0,0.8)";
      ctx.shadowBlur = ft.large ? 12 : 3;
      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, x, y);
      ctx.restore();
    }
  });

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, zIndex: 4, width, height, pointerEvents: "none" }}
    />
  );
}
