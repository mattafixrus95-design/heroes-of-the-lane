import type { TowerType } from "../../data/towers";
import { elfGrade0Idle, elfGrade0AttackFrames, elfGrade1Idle, elfGrade1AttackFrames } from "./elf/elfFrames";
import { dwarfGrade0Idle, dwarfGrade0AttackFrames, dwarfGrade1Idle, dwarfGrade1AttackFrames } from "./dwarf/dwarfFrames";
import { centaurGrade0Idle, centaurGrade0AttackFrames, centaurGrade1Idle, centaurGrade1AttackFrames } from "./centaur/centaurFrames";
import { pegasusGrade0Idle, pegasusGrade0AttackFrames, pegasusGrade1Idle, pegasusGrade1AttackFrames } from "./pegasus/pegasusFrames";
import { dendroidGrade0Idle, dendroidGrade0AttackFrames, dendroidGrade1Idle, dendroidGrade1AttackFrames } from "./dendroid/dendroidFrames";
import { unicornGrade0Idle, unicornGrade0AttackFrames, unicornGrade1Idle, unicornGrade1AttackFrames } from "./unicorn/unicornFrames";
import { dragonGrade0Idle, dragonGrade0AttackFrames, dragonGrade1Idle, dragonGrade1AttackFrames } from "./dragon/dragonFrames";

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
  pegasus: {
    grades: [
      { idle: pegasusGrade0Idle, attackFrames: pegasusGrade0AttackFrames, attackFps: 5, aspect: 394 / 360 },
      { idle: pegasusGrade1Idle, attackFrames: pegasusGrade1AttackFrames, attackFps: 5, aspect: 416 / 360 },
    ],
  },
  dendroid: {
    grades: [
      { idle: dendroidGrade0Idle, attackFrames: dendroidGrade0AttackFrames, attackFps: 4, aspect: 397 / 360 },
      { idle: dendroidGrade1Idle, attackFrames: dendroidGrade1AttackFrames, attackFps: 4, aspect: 434 / 360 },
    ],
  },
  unicorn: {
    grades: [
      { idle: unicornGrade0Idle, attackFrames: unicornGrade0AttackFrames, attackFps: 6, aspect: 346 / 360 },
      { idle: unicornGrade1Idle, attackFrames: unicornGrade1AttackFrames, attackFps: 6, aspect: 319 / 360 },
    ],
  },
  dragon: {
    grades: [
      { idle: dragonGrade0Idle, attackFrames: dragonGrade0AttackFrames, attackFps: 5, aspect: 304 / 360 },
      { idle: dragonGrade1Idle, attackFrames: dragonGrade1AttackFrames, attackFps: 5, aspect: 342 / 360 },
    ],
  },
};
