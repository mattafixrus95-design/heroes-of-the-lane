import type { RoadSegment } from "../data/road";

// Полотно тропы для каждого типа сегмента. Точки на границах (23/77) фиксированы,
// чтобы соседние плитки стыковались без видимых швов на прямых и поворотах.
const SEGMENT_PATH: Record<RoadSegment, string> = {
  h:  "M0,23 C25,18 75,28 100,23 L100,77 C75,82 25,72 0,77 Z",
  v:  "M23,0 C18,25 28,75 23,100 L77,100 C82,75 72,25 77,0 Z",
  ne: "M23,0 A77,77 0 0 0 100,77 L100,23 A23,23 0 0 1 77,0 Z",
  nw: "M77,0 A77,77 0 0 1 0,77 L0,23 A23,23 0 0 0 23,0 Z",
  se: "M23,100 A77,77 0 0 1 100,23 L100,77 A23,23 0 0 0 77,100 Z",
  sw: "M77,100 A77,77 0 0 0 0,23 L0,77 A23,23 0 0 1 23,100 Z",
};

// Пара мелких камешков — положение чуть отличается для прямых/поворотов,
// чтобы дорога не выглядела как один и тот же повторяющийся штамп.
const PEBBLES: Record<RoadSegment, [number, number][]> = {
  h:  [[30, 40], [68, 60]],
  v:  [[40, 30], [60, 68]],
  ne: [[70, 30], [55, 55]],
  nw: [[30, 30], [45, 55]],
  se: [[70, 70], [55, 45]],
  sw: [[30, 70], [45, 45]],
};

export default function RoadTile({ segment, size = 56 }: { segment: RoadSegment; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`road-grad-${segment}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a89066"/>
          <stop offset="50%" stopColor="#9c8259"/>
          <stop offset="100%" stopColor="#8a7050"/>
        </linearGradient>
      </defs>
      <path d={SEGMENT_PATH[segment]} fill={`url(#road-grad-${segment})`} stroke="#6a5038" strokeWidth="1.5" strokeOpacity="0.5"/>
      {PEBBLES[segment].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 0 ? 3.2 : 2.2} fill="#6f5a3e" opacity="0.55"/>
      ))}
    </svg>
  );
}
