import { memo, useMemo } from "react";
import { GRID_COLS, GRID_ROWS } from "../data/map";
import { roadSegmentAt } from "../data/road";
import grass1 from "../assets/terrain/grass/grass-1.png";
import grass2 from "../assets/terrain/grass/grass-2.png";
import roadStraight from "../assets/terrain/road/road-straight.png";
import roadCorner2 from "../assets/terrain/road/road-corner-2.png";
import roadCorner3 from "../assets/terrain/road/road-corner-3.png";

interface Props {
  cell: number;
  terrainSeed: number;
}

const GRASS_TILES = [grass1, grass2];

// Угол дороги обработан в ориентации "N+E" (вход сверху, выход справа) — для
// остальных трёх поворотов просто крутим тот же файл на 90°/180°/270° (CSS
// rotate по часовой стрелке). road-straight — горизонтальная полоса ("h"),
// для "v" крутим на 90° (полоса центрирована, направление поворота значения
// не имеет).
const ROAD_ROTATION: Record<string, number> = {
  h: 0, v: 90,
  ne: 0, se: 90, sw: 180, nw: 270,
};

// Каждый вариант травы/угла дороги — случайный отпечаток от terrainSeed + координат
// клетки (+соль под конкретный выбор, чтобы трава и угол на одной клетке не были
// скоррелированы), не завязан на Math.random() напрямую, чтобы не перетасовывался
// при ресайзе (TerrainLayer пересчитывается по cell, terrainSeed же фиксирован на
// всю игру).
function hash2(seed: number, col: number, row: number, salt = 0): number {
  let h = (seed + salt) * 668265263 + col * 374761393 + row * 2246822519;
  h = (h ^ (h >>> 13)) * 1274126177;
  h = h ^ (h >>> 16);
  return Math.abs(h);
}

function TerrainLayer({ cell, terrainSeed }: Props) {
  const tiles = useMemo(() => {
    const items: React.ReactNode[] = [];
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        const segment = roadSegmentAt(c, r);
        const grassSrc = GRASS_TILES[hash2(terrainSeed, c, r) % GRASS_TILES.length];
        const roadCorner = hash2(terrainSeed, c, r, 1) % 2 === 0 ? roadCorner2 : roadCorner3;
        items.push(
          <div key={`${c}-${r}`} style={{ position: "absolute", left: c * cell, top: r * cell, width: cell, height: cell }}>
            <img src={grassSrc} alt="" style={{ width: cell, height: cell, display: "block" }} />
            {segment && (
              <img
                src={segment === "h" || segment === "v" ? roadStraight : roadCorner}
                alt=""
                style={{
                  position: "absolute", inset: 0, width: cell, height: cell,
                  transform: `rotate(${ROAD_ROTATION[segment]}deg)`,
                }}
              />
            )}
          </div>,
        );
      }
    }
    return items;
  }, [cell, terrainSeed]);

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      {tiles}
    </div>
  );
}

export default memo(TerrainLayer);
