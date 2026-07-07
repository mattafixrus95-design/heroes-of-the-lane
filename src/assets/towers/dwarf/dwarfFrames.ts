import g0Idle from "./dwarf-g0-idle.png";
import g0Attack1 from "./dwarf-g0-attack-1.png";
import g0Attack2 from "./dwarf-g0-attack-2.png";
import g0Reload from "./dwarf-g0-reload.png";
import g1Idle from "./dwarf-g1-idle.png";
import g1Attack1 from "./dwarf-g1-attack-1.png";
import g1Attack2 from "./dwarf-g1-attack-2.png";
import g1Reload from "./dwarf-g1-reload.png";

function loadImage(src: string): HTMLImageElement {
  const img = new Image();
  img.src = src;
  return img;
}

// Грейд 0 (Лесной) — idle + замах/удар/восстановление (3 кадра).
export const dwarfGrade0Idle = loadImage(g0Idle);
export const dwarfGrade0AttackFrames = [g0Attack1, g0Attack2, g0Reload].map(loadImage);

// Грейд 1 (Боевой) — серебряная броня, idle + тот же 3-кадровый цикл.
export const dwarfGrade1Idle = loadImage(g1Idle);
export const dwarfGrade1AttackFrames = [g1Attack1, g1Attack2, g1Reload].map(loadImage);
