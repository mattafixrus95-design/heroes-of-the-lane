import type { CreepKind } from "../../game/engine/gameState";
import { impWalkFrames, impDeathFrames } from "./01_imp/impFrames";
import { goblinWalkFrames, goblinDeathFrames } from "./02_goblin/goblinFrames";
import { pikemanWalkFrames, pikemanDeathFrames } from "./03_pikeman/pikemanFrames";
import { wolfRiderWalkFrames, wolfRiderDeathFrames } from "./04_wolf_rider/wolfRiderFrames";

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
  pikeman: { walkFrames: pikemanWalkFrames, deathFrames: pikemanDeathFrames as [HTMLImageElement, HTMLImageElement], walkFps: 6 },
  wolf_rider: { walkFrames: wolfRiderWalkFrames, deathFrames: wolfRiderDeathFrames as [HTMLImageElement, HTMLImageElement], walkFps: 6 },
};
