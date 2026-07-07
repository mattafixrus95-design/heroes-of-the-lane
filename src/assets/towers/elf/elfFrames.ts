import g0Idle from "./elf-g0-idle.png";
import g0Attack1 from "./elf-g0-attack-1.png";
import g0Attack2 from "./elf-g0-attack-2.png";
import g0Attack3 from "./elf-g0-attack-3.png";
import g1Idle from "./elf-g1-idle.png";
import g1Attack1 from "./elf-g1-attack-1.png";
import g1Attack2 from "./elf-g1-attack-2.png";

function loadImage(src: string): HTMLImageElement {
  const img = new Image();
  img.src = src;
  return img;
}

// Грейд 0 (Лесной) — idle + 3-кадровый цикл натягивания лука.
export const elfGrade0Idle = loadImage(g0Idle);
export const elfGrade0AttackFrames = [g0Attack1, g0Attack2, g0Attack3].map(loadImage);

// Грейд 1 (Благородный) — серебряная броня, idle + 2-кадровый цикл.
export const elfGrade1Idle = loadImage(g1Idle);
export const elfGrade1AttackFrames = [g1Attack1, g1Attack2].map(loadImage);
