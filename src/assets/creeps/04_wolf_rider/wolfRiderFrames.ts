import walk1 from "./wolf_rider-walk-1.png";
import walk2 from "./wolf_rider-walk-2.png";
import walk3 from "./wolf_rider-walk-3.png";
import walk4 from "./wolf_rider-walk-4.png";
import death1 from "./wolf_rider-death-1.png";
import death2 from "./wolf_rider-death-2.png";

function loadImage(src: string): HTMLImageElement {
  const img = new Image();
  img.src = src;
  return img;
}

// Цикл ходьбы Волчьего Всадника — 4 кадра. См. impFrames.ts для паттерна.
export const wolfRiderWalkFrames = [walk1, walk2, walk3, walk4].map(loadImage);

// Смерть — 2 кадра (падение → лежит на земле).
export const wolfRiderDeathFrames = [death1, death2].map(loadImage);
