import g0Idle from "./dendroid-g0-idle.png";
import g0Attack1 from "./dendroid-g0-attack-1.png";
import g0Attack2 from "./dendroid-g0-attack-2.png";
import g1Idle from "./dendroid-g1-idle.png";
import g1Attack1 from "./dendroid-g1-attack-1.png";
import g1Attack2 from "./dendroid-g1-attack-2.png";

function loadImage(src: string): HTMLImageElement {
  const img = new Image();
  img.src = src;
  return img;
}

// Грейд 0 (Страж) — idle + 2-кадровый цикл удара.
export const dendroidGrade0Idle = loadImage(g0Idle);
export const dendroidGrade0AttackFrames = [g0Attack1, g0Attack2].map(loadImage);

// Грейд 1 (Солдат) — доспех и щит, тот же 2-кадровый цикл.
export const dendroidGrade1Idle = loadImage(g1Idle);
export const dendroidGrade1AttackFrames = [g1Attack1, g1Attack2].map(loadImage);
