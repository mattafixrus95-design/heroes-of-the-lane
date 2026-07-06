import type { CreepKind } from "../../game/engine/gameState";
import { impWalkFrames, impDeathFrames } from "./imp/impFrames";
import { goblinWalkFrames, goblinDeathFrames } from "./goblin/goblinFrames";

export interface CreepArt {
  walkFrames: HTMLImageElement[];
  deathFrames: [HTMLImageElement, HTMLImageElement];
  walkFps: number;
}

// Реестр художественных спрайтов по типу крипа — остальные типы (без записи
// здесь) остаются обычными эмодзи (см. фолбэк в HotCanvas.tsx).
export const CREEP_ART: Partial<Record<CreepKind, CreepArt>> = {
  imp: { walkFrames: impWalkFrames, deathFrames: impDeathFrames as [HTMLImageElement, HTMLImageElement], walkFps: 6 },
  goblin: { walkFrames: goblinWalkFrames, deathFrames: goblinDeathFrames as [HTMLImageElement, HTMLImageElement], walkFps: 6 },
};
