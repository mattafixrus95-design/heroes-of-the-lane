import walk1 from "./goblin-walk-1.png";
import walk3 from "./goblin-walk-3.png";
import death1 from "./goblin-death-1.png";
import death2 from "./goblin-death-2.png";

function loadImage(src: string): HTMLImageElement {
  const img = new Image();
  img.src = src;
  return img;
}

// Цикл ходьбы Гоблина — 2 кадра (walk-2 убран: поза почти не отличалась от
// walk-3, из-за чего цикл выглядел статично). См. impFrames.ts для паттерна.
export const goblinWalkFrames = [walk1, walk3].map(loadImage);

// Смерть — 2 кадра (падение → лежит на земле).
export const goblinDeathFrames = [death1, death2].map(loadImage);
