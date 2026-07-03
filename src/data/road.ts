import { PATH } from "./map";

export type RoadSegment = "h" | "v" | "ne" | "nw" | "se" | "sw";
type Side = "N" | "S" | "E" | "W";

function dirToSide(dx: number, dy: number): Side {
  if (dx === 1) return "E";
  if (dx === -1) return "W";
  if (dy === 1) return "S";
  return "N";
}

function opposite(side: Side): Side {
  return side === "N" ? "S" : side === "S" ? "N" : side === "E" ? "W" : "E";
}

function segmentKey(a: Side, b: Side): RoadSegment {
  const set = new Set([a, b]);
  if (set.has("N") && set.has("S")) return "v";
  if (set.has("E") && set.has("W")) return "h";
  if (set.has("N") && set.has("E")) return "ne";
  if (set.has("N") && set.has("W")) return "nw";
  if (set.has("S") && set.has("E")) return "se";
  return "sw";
}

function computeRoadSegments(): Map<string, RoadSegment> {
  const map = new Map<string, RoadSegment>();
  for (let i = 0; i < PATH.length; i++) {
    const [c, r] = PATH[i];
    const prev = PATH[i - 1];
    const next = PATH[i + 1];

    let inSide: Side;
    let outSide: Side;
    if (prev && next) {
      inSide = opposite(dirToSide(c - prev[0], r - prev[1]));
      outSide = dirToSide(next[0] - c, next[1] - r);
    } else if (next) {
      outSide = dirToSide(next[0] - c, next[1] - r);
      inSide = opposite(outSide);
    } else if (prev) {
      inSide = opposite(dirToSide(c - prev[0], r - prev[1]));
      outSide = opposite(inSide);
    } else {
      inSide = "W";
      outSide = "E";
    }

    map.set(`${c},${r}`, segmentKey(inSide, outSide));
  }
  return map;
}

export const ROAD_SEGMENTS = computeRoadSegments();

export function roadSegmentAt(col: number, row: number): RoadSegment | null {
  return ROAD_SEGMENTS.get(`${col},${row}`) ?? null;
}
