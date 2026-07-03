import { memo, useMemo } from "react";
import { GRID_COLS, GRID_ROWS } from "../data/map";
import { roadSegmentAt } from "../data/road";
import RoadTile from "../assets/RoadTile";
import GrassTile, { type GrassVariant } from "../assets/GrassTile";

interface Props {
  cell: number;
}

// Простой перемешивающий хэш (не линейная комбинация координат) — исключает
// видимые диагональные полосы/повторяющиеся паттерны при небольшой сетке.
function hash2(col: number, row: number): number {
  let h = col * 374761393 + row * 668265263;
  h = (h ^ (h >>> 13)) * 1274126177;
  h = h ^ (h >>> 16);
  return Math.abs(h);
}

function grassVariant(col: number, row: number): GrassVariant {
  return (hash2(col, row) % 6) as GrassVariant;
}

// Статичный фон карты (дорога + трава) — не зависит от игрового state,
// поэтому пересчитывается только при изменении размера клетки (ресайз окна).
function TerrainLayer({ cell }: Props) {
  const tiles = useMemo(() => {
    const items: React.ReactNode[] = [];
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        const segment = roadSegmentAt(c, r);
        items.push(
          <div key={`${c}-${r}`} style={{ position: "absolute", left: c * cell, top: r * cell, width: cell, height: cell }}>
            {/* Трава всегда есть под дорогой — её мягкие размытые края просвечивают траву снизу */}
            <GrassTile variant={grassVariant(c, r)} size={cell} />
            {segment && (
              <div style={{ position: "absolute", inset: 0 }}>
                <RoadTile segment={segment} size={cell} />
              </div>
            )}
          </div>,
        );
      }
    }
    return items;
  }, [cell]);

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      {tiles}
    </div>
  );
}

export default memo(TerrainLayer);
