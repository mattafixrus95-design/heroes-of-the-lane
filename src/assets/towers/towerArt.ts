import type { TowerType } from "../../data/towers";
import { elfGrade0Idle, elfGrade0AttackFrames, elfGrade1Idle, elfGrade1AttackFrames } from "./elf/elfFrames";
import { dwarfGrade0Idle, dwarfGrade0AttackFrames, dwarfGrade1Idle, dwarfGrade1AttackFrames } from "./dwarf/dwarfFrames";
import { centaurGrade0Idle, centaurGrade0AttackFrames, centaurGrade1Idle, centaurGrade1AttackFrames } from "./centaur/centaurFrames";

export interface TowerGradeArt {
  idle: HTMLImageElement;
  attackFrames: HTMLImageElement[];
  attackFps: number;
  aspect: number; // height/width исходных обработанных PNG — все кадры грейда одного размера
  sizeMult?: number; // визуальный множитель размера относительно обычной башни (по умолчанию 1)
}

export interface TowerArt {
  grades: [TowerGradeArt, TowerGradeArt];
}

// Реестр художественных спрайтов по типу башни — остальные типы (без записи
// здесь) остаются инлайн-SVG (см. фолбэк в TowerIcon.tsx). По аналогии
// с CREEP_ART в assets/creeps/creepArt.ts.
export const TOWER_ART: Partial<Record<TowerType, TowerArt>> = {
  centaur: {
    grades: [
      { idle: centaurGrade0Idle, attackFrames: centaurGrade0AttackFrames, attackFps: 5, aspect: 320 / 360 },
      { idle: centaurGrade1Idle, attackFrames: centaurGrade1AttackFrames, attackFps: 5, aspect: 322 / 360 },
    ],
  },
  dwarf: {
    grades: [
      { idle: dwarfGrade0Idle, attackFrames: dwarfGrade0AttackFrames, attackFps: 5, aspect: 345 / 360 },
      { idle: dwarfGrade1Idle, attackFrames: dwarfGrade1AttackFrames, attackFps: 5, aspect: 343 / 360 },
    ],
  },
  elf: {
    grades: [
      { idle: elfGrade0Idle, attackFrames: elfGrade0AttackFrames, attackFps: 5, aspect: 492 / 360 },
      { idle: elfGrade1Idle, attackFrames: elfGrade1AttackFrames, attackFps: 5, aspect: 400 / 360, sizeMult: 1.25 },
    ],
  },
};
