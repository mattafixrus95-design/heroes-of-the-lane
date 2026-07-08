import g0Idle from "./unicorn-g0-idle.png";
import g0Attack1 from "./unicorn-g0-attack-1.png";
import g0Attack2 from "./unicorn-g0-attack-2.png";
import g0Attack3 from "./unicorn-g0-attack-3.png";
import g1Idle from "./unicorn-g1-idle.png";
import g1Attack1 from "./unicorn-g1-attack-1.png";
import g1Attack2 from "./unicorn-g1-attack-2.png";
import g1Attack3 from "./unicorn-g1-attack-3.png";

function loadImage(src: string): HTMLImageElement {
  const img = new Image();
  img.src = src;
  return img;
}

// Грейд 0 (Лесной) — idle + 3-кадровый цикл удара рогом.
export const unicornGrade0Idle = loadImage(g0Idle);
export const unicornGrade0AttackFrames = [g0Attack1, g0Attack2, g0Attack3].map(loadImage);

// Грейд 1 (Боевой) — серебряная сбруя, тот же 3-кадровый цикл.
export const unicornGrade1Idle = loadImage(g1Idle);
export const unicornGrade1AttackFrames = [g1Attack1, g1Attack2, g1Attack3].map(loadImage);
