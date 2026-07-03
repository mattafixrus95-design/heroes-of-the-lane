export type GrassVariant = 0 | 1 | 2 | 3 | 4 | 5;

// Каждый вариант — едва заметный оттенок зелёного + мелкая деталь. Разница
// между вариантами специально небольшая (иначе плитки читаются как шахматная
// доска) — единство поверхности достигается близостью тонов, а не контрастом.
const BASE_COLORS: [string, string][] = [
  ["#4c8956", "#488553"],
  ["#4e8b58", "#4a8755"],
  ["#4a8654", "#468251"],
  ["#4f8c59", "#4b8856"],
  ["#488452", "#44804f"],
  ["#4b8855", "#478452"],
];

// Несколько разбросанных полупрозрачных пятен разного оттенка поверх заливки —
// ломает ощущение однородного плоского квадрата без создания резких границ.
const NOISE_SPOTS: [number, number, number, string][] = [
  [15, 20, 14, "#5a9862"],
  [82, 15, 12, "#3f7549"],
  [25, 78, 16, "#437c4c"],
  [70, 85, 13, "#559060"],
  [50, 45, 18, "#4a8552"],
];

function Blades({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6">
      <path d={`M${x},${y} q-2,-8 -1,-13`}/>
      <path d={`M${x + 4},${y} q1,-9 4,-14`}/>
      <path d={`M${x + 8},${y} q3,-7 6,-11`}/>
    </g>
  );
}

function Flower({ x, y }: { x: number; y: number }) {
  return (
    <g opacity="0.85">
      {[0, 72, 144, 216, 288].map(a => {
        const rad = (a * Math.PI) / 180;
        return <circle key={a} cx={x + Math.cos(rad) * 3} cy={y + Math.sin(rad) * 3} r="2.2" fill="#f2e6a8"/>;
      })}
      <circle cx={x} cy={y} r="2" fill="#e0a83c"/>
    </g>
  );
}

function Bush({ x, y }: { x: number; y: number }) {
  return (
    <g opacity="0.8">
      <ellipse cx={x} cy={y} rx="9" ry="6.5" fill="#2f5e38"/>
      <ellipse cx={x - 6} cy={y + 2} rx="6" ry="4.5" fill="#356b3f"/>
      <ellipse cx={x + 6} cy={y + 1.5} rx="6.5" ry="4.8" fill="#356b3f"/>
      <ellipse cx={x} cy={y - 3} rx="6" ry="4.5" fill="#3d7846"/>
    </g>
  );
}

export default function GrassTile({ variant, size = 56 }: { variant: GrassVariant; size?: number }) {
  const [c1, c2] = BASE_COLORS[variant];
  const gradId = `grass-grad-${variant}`;
  // Смещаем набор шумовых пятен по кругу в зависимости от варианта, чтобы
  // соседние плитки не показывали одинаковый узор пятен.
  const spots = [...NOISE_SPOTS.slice(variant % NOISE_SPOTS.length), ...NOISE_SPOTS.slice(0, variant % NOISE_SPOTS.length)];

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={gradId} cx="50%" cy="50%" r="75%">
          <stop offset="0%" stopColor={c1}/>
          <stop offset="100%" stopColor={c2}/>
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill={`url(#${gradId})`}/>
      {spots.map(([x, y, r, color], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={color} opacity="0.22"/>
      ))}

      {variant === 0 && (
        <circle cx="70" cy="65" r="10" fill={c1} opacity="0.25"/>
      )}

      {variant === 1 && (
        <>
          <circle cx="28" cy="68" r="3.4" fill="#6b6255" opacity="0.5"/>
          <circle cx="35" cy="72" r="2.2" fill="#7a7062" opacity="0.5"/>
        </>
      )}

      {variant === 2 && <Blades x={62} y={40} color="#2f6a3a"/>}

      {variant === 3 && <Flower x={40} y={60}/>}

      {variant === 4 && (
        <>
          <ellipse cx="60" cy="30" rx="12" ry="7" fill="#5c4a34" opacity="0.35"/>
          <circle cx="58" cy="30" r="2" fill="#6f5a3e" opacity="0.5"/>
        </>
      )}

      {variant === 5 && <Bush x={45} y={45}/>}
    </svg>
  );
}
