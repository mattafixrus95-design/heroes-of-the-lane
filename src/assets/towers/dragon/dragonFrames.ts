import g0Idle from "./dragon-g0-idle.png";
import g0Attack1 from "./dragon-g0-attack-1.png";
import g0Attack2 from "./dragon-g0-attack-2.png";
import g0Attack3 from "./dragon-g0-attack-3.png";
import g1Idle from "./dragon-g1-idle.png";
import g1Attack1 from "./dragon-g1-attack-1.png";
import g1Attack2 from "./dragon-g1-attack-2.png";
import g1Attack3 from "./dragon-g1-attack-3.png";

function loadImage(src: string): HTMLImageElement {
  const img = new Image();
  img.src = src;
  return img;
}

// Грейд 0 (Зелёный) — idle + 3-кадровый цикл огненного дыхания.
export const dragonGrade0Idle = loadImage(g0Idle);
export const dragonGrade0AttackFrames = [g0Attack1, g0Attack2, g0Attack3].map(loadImage);

// Грейд 1 (Золотой) — золотая чешуя, тот же 3-кадровый цикл.
export const dragonGrade1Idle = loadImage(g1Idle);
export const dragonGrade1AttackFrames = [g1Attack1, g1Attack2, g1Attack3].map(loadImage);
