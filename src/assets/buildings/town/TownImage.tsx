import village from "./village.png";
import fort from "./fort.png";
import citadel from "./citadel.png";
import castle from "./castle.png";

// [ширина, высота] исходных обработанных PNG — для сохранения пропорций.
const SIZES: Record<1 | 2 | 3 | 4, [string, number, number]> = {
  1: [village, 240, 182],
  2: [fort, 240, 175],
  3: [citadel, 240, 206],
  4: [castle, 240, 225],
};

// Форт (ур.2) и Цитадель (ур.3) на исходных рендерах смотрят воротами в другую
// сторону от дороги — отзеркалены по горизонтали, чтобы вход был обращён к пути.
const MIRRORED: Record<1 | 2 | 3 | 4, boolean> = {
  1: false, 2: true, 3: true, 4: false,
};

// Замок (ур.4) чуть довёрнут по часовой стрелке для более живой композиции.
const ROTATE_DEG: Record<1 | 2 | 3 | 4, number> = {
  1: 0, 2: 0, 3: 0, 4: 30,
};

interface Props {
  level: 1 | 2 | 3 | 4;
  size?: number;
}

export default function TownImage({ level, size = 52 }: Props) {
  const [src, w, h] = SIZES[level];
  const transforms = [
    MIRRORED[level] ? "scaleX(-1)" : null,
    ROTATE_DEG[level] ? `rotate(${ROTATE_DEG[level]}deg)` : null,
  ].filter(Boolean).join(" ");
  return (
    <img
      src={src}
      alt=""
      style={{
        width: size, height: size * (h / w), objectFit: "contain", display: "block",
        transform: transforms || undefined,
      }}
    />
  );
}
