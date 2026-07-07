import village from "./village.png";
import fort from "./fort.png";
import citadel from "./citadel.png";
import castle from "./castle.png";

// [ширина, высота] исходных обработанных PNG — для сохранения пропорций.
const SIZES: Record<1 | 2 | 3 | 4, [string, number, number]> = {
  1: [village, 240, 182],
  2: [fort, 240, 162],
  3: [citadel, 240, 171],
  4: [castle, 240, 217],
};

interface Props {
  level: 1 | 2 | 3 | 4;
  size?: number;
}

export default function TownImage({ level, size = 52 }: Props) {
  const [src, w, h] = SIZES[level];
  return (
    <img
      src={src}
      alt=""
      style={{ width: size, height: size * (h / w), objectFit: "contain", display: "block" }}
    />
  );
}
