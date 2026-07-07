import walk1 from "./pikeman-walk-1.png";
import walk2 from "./pikeman-walk-2.png";
import death1 from "./pikeman-death-1.png";
import death2 from "./pikeman-death-2.png";

function loadImage(src: string): HTMLImageElement {
  const img = new Image();
  img.src = src;
  return img;
}

// Цикл ходьбы Копейщика — 2 кадра. См. impFrames.ts для паттерна.
export const pikemanWalkFrames = [walk1, walk2].map(loadImage);

// Смерть — 2 кадра (падение → лежит на земле).
export const pikemanDeathFrames = [death1, death2].map(loadImage);
