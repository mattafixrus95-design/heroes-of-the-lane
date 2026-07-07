import g0Idle from "./pegasus-g0-idle.png";
import g0Attack1 from "./pegasus-g0-attack-1.png";
import g0Attack2 from "./pegasus-g0-attack-2.png";
import g1Idle from "./pegasus-g1-idle.png";
import g1Attack1 from "./pegasus-g1-attack-1.png";
import g1Attack2 from "./pegasus-g1-attack-2.png";

function loadImage(src: string): HTMLImageElement {
  const img = new Image();
  img.src = src;
  return img;
}

// Грейд 0 (Лесной) — idle + 2-кадровый цикл удара мечом.
export const pegasusGrade0Idle = loadImage(g0Idle);
export const pegasusGrade0AttackFrames = [g0Attack1, g0Attack2].map(loadImage);

// Грейд 1 (Серебряный) — серебряная броня, тот же 2-кадровый цикл.
export const pegasusGrade1Idle = loadImage(g1Idle);
export const pegasusGrade1AttackFrames = [g1Attack1, g1Attack2].map(loadImage);
