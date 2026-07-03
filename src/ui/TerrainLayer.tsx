import { memo, useMemo } from "react";
import { GRID_COLS, GRID_ROWS } from "../data/map";
import { roadSegmentAt } from "../data/road";
import RoadTile from "../assets/RoadTile";
import GrassTile, { type GrassVariant } from "../assets/GrassTile";

interface Props {
  cell: number;
}

function grassVariant(col: number, row: number): GrassVariant {
  return (Math.abs(col * 31 + row * 17 + col * row * 7) % 5) as GrassVariant;
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
            {segment
              ? <RoadTile segment={segment} size={cell} />
              : <GrassTile variant={grassVariant(c, r)} size={cell} />}
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
