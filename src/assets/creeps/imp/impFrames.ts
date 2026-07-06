import walk1 from "./imp-walk-1.png";
import walk2 from "./imp-walk-2.png";
import walk3 from "./imp-walk-3.png";
import walk4 from "./imp-walk-4.png";
import death1 from "./imp-death-1.png";
import death2 from "./imp-death-2.png";

function loadImage(src: string): HTMLImageElement {
  const img = new Image();
  img.src = src;
  return img;
}

// Цикл ходьбы Беса — 4 кадра одной художественной ориентации (зеркалим по
// pathFacing, как раньше с одиночным спрайтом). Кадры не рисовались как
// строгий rig-цикл, поэтому просто листаем их с фиксированной частотой,
// а не привязываем к конкретной фазе шага.
export const impWalkFrames = [walk1, walk2, walk3, walk4].map(loadImage);

// Смерть — 2 кадра (падение → лежит на земле), проигрываются один раз
// при гибели крипа (см. DeathEffect в gameState.ts).
export const impDeathFrames = [death1, death2].map(loadImage);
