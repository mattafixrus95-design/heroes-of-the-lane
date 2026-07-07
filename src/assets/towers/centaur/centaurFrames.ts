import g0Idle from "./centaur-g0-idle.png";
import g0Attack1 from "./centaur-g0-attack-1.png";
import g0Attack2 from "./centaur-g0-attack-2.png";
import g1Idle from "./centaur-g1-idle.png";
import g1Attack1 from "./centaur-g1-attack-1.png";
import g1Attack2 from "./centaur-g1-attack-2.png";

function loadImage(src: string): HTMLImageElement {
  const img = new Image();
  img.src = src;
  return img;
}

// Грейд 0 (Лесной) — idle + 2-кадровый цикл удара копьём-топором.
export const centaurGrade0Idle = loadImage(g0Idle);
export const centaurGrade0AttackFrames = [g0Attack1, g0Attack2].map(loadImage);

// Грейд 1 (Капитан) — серебряная броня и белый конь, тот же 2-кадровый цикл.
export const centaurGrade1Idle = loadImage(g1Idle);
export const centaurGrade1AttackFrames = [g1Attack1, g1Attack2].map(loadImage);
